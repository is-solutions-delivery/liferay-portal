package com.liferay.hubspot.service;

import com.liferay.client.extension.util.spring.boot3.service.BaseService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;


@Component
public class HubSpotService extends BaseService {

    public String createContact(String email, String firstName, String lastName, String phone) throws Exception {

        JSONObject properties = new JSONObject()
                .put("email", email)
                .put("firstname", firstName)
                .put("lastname", lastName)
                .put("phone", phone);

        JSONObject body = new JSONObject()
                .put("properties", properties);


        String contact = post(
                _getAuthorization(),
                body.toString(),
                UriComponentsBuilder.fromUriString(
                        _hubspotAuthURL
                ).path(
                        "/crm/v3/objects/contacts"
                ).build(
                ).toUri());

        if (_log.isInfoEnabled()) {
            _log.info("Contact created: " + contact);
        }
        return contact;
    }

    public String createCompany(String name, String numberOfEmployees, String phone, String websiteURL) throws Exception {

        JSONObject properties = new JSONObject()
                .put("name", name)
                .put("domain", websiteURL)
                .put("numberofemployees", numberOfEmployees)
                .put("phone", phone);

        JSONObject body = new JSONObject()
                .put("properties", properties);

        return post(
                _getAuthorization(),
                body.toString(),
                UriComponentsBuilder.fromUriString(
                                _hubspotAuthURL
                        ).path(
                                "/crm/v3/objects/companies"
                        )
                        .build()
                        .toUri()
        );
    }

    public JSONObject findContactByName(String firstName) throws Exception {

        JSONObject filter = new JSONObject()
                .put("propertyName", "firstname")
                .put("operator", "EQ")
                .put("value", firstName);

        JSONObject filterGroup = new JSONObject()
                .put("filters", new JSONArray().put(filter));

        JSONObject body = new JSONObject()
                .put("filterGroups", new JSONArray().put(filterGroup))
                .put("limit", 10);

        String response = post(
                _getAuthorization(),
                body.toString(),
                UriComponentsBuilder.fromUriString(_hubspotAuthURL)
                        .path("/crm/v3/objects/contacts/search")
                        .build()
                        .toUri()
        );

        JSONObject json = new JSONObject(response);

        JSONArray results = json.optJSONArray("results");

        return (results != null && !results.isEmpty())
                ? results.getJSONObject(0)
                : null;
    }

    public JSONObject findCompanyByName(String name) throws Exception {

        JSONObject filter = new JSONObject()
                .put("propertyName", "name")
                .put("operator", "EQ")
                .put("value", name);

        JSONObject filterGroup = new JSONObject()
                .put("filters", new JSONArray().put(filter));

        JSONObject body = new JSONObject()
                .put("filterGroups", new JSONArray().put(filterGroup))
                .put("limit", 10);

        String response = post(
                _getAuthorization(),
                body.toString(),
                UriComponentsBuilder.fromUriString(_hubspotAuthURL)
                        .path("/crm/v3/objects/companies/search")
                        .build()
                        .toUri()
        );

        JSONObject json = new JSONObject(response);

        JSONArray results = json.optJSONArray("results");

        return (results != null && !results.isEmpty())
                ? results.getJSONObject(0)
                : null;
    }

    public JSONObject getOrCreateContact(String email, String firstName, String lastName, String phone) throws Exception {

        JSONObject existing = findContactByName(firstName);

        if (existing != null) {
            if (_log.isInfoEnabled()) _log.info("Existing contact returned: " + existing);
            return existing;
        }

        JSONObject created = new JSONObject(createContact(email, firstName, lastName, phone));

        if (_log.isInfoEnabled()) _log.info("New contact created: " + created);

        return created;
    }

    public JSONObject getOrCreateCompany(String name, String numberOfEmployees, String phone, String websiteURL) throws Exception {

        JSONObject existing = findCompanyByName(name);

        if (existing != null) {
            if (_log.isInfoEnabled()) _log.info("Existing company returned: " + existing);
            return existing;
        }

        JSONObject created = new JSONObject(createCompany(name, numberOfEmployees, phone, websiteURL));

        if (_log.isInfoEnabled()) _log.info("New company created: " + created);

        return created;
    }

    public JSONObject createLeadWithContactAssociation(
            String contactId,
            String leadLabel,
            String leadName,
            String leadType
    ) throws Exception {

        // Lead properties
        JSONObject properties = new JSONObject()
                .put("hs_lead_label", leadLabel)
                .put("hs_lead_name", leadName)
                .put("hs_lead_type", leadType);

        // Association block
        JSONObject associationType = new JSONObject()
                .put("associationCategory", "HUBSPOT_DEFINED")
                .put("associationTypeId", 578); // Equivalent to Node example

        JSONObject association = new JSONObject()
                .put("to", new JSONObject().put("id", contactId))
                .put("types", new JSONArray().put(associationType));

        // Full Lead body with association
        JSONObject body = new JSONObject()
                .put("properties", properties)
                .put("associations", new JSONArray().put(association));

        String result = post(
                _getAuthorization(),
                body.toString(),
                UriComponentsBuilder.fromUriString(_hubspotAuthURL)
                        .path("/crm/v3/objects/leads")
                        .build()
                        .toUri()
        );

        return new JSONObject(result);
    }

    public void createLead(
            String email,
            String firstName,
            String lastName,
            String phone,
            String companyName,
            String numberOfEmployees,
            String websiteURL
    ) throws Exception {

        // 1. Ensure Contact Exists
        JSONObject contact = getOrCreateContact(email, firstName, lastName, phone);
        String contactId = contact.getString("id");

        // 2. Ensure Company Exists
        getOrCreateCompany(companyName, numberOfEmployees, phone, websiteURL);
//        String companyId = company.getString("id");

        // 3. Create Lead with association to Contact already included
        String leadTitle = "Lead Capture for " + companyName;

        JSONObject lead = createLeadWithContactAssociation(
                contactId,
                "WARM",
                leadTitle,
                "NEW_BUSINESS"
        );
    }

    public String _getAuthorization() throws Exception {
        if (authToken == null) {
            throw new Exception("Unable to get token authorization");
        }
        return "Bearer " + authToken;
    }

    private static final Log _log = LogFactory.getLog(HubSpotService.class);

    @Value("${liferay.hubspot.auth.url}")
    private String _hubspotAuthURL;

    @Value("${liferay.hubspot.auth.token}")
    private String authToken;
}
