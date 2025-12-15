package com.liferay.hubspot;



import com.liferay.client.extension.util.spring.boot3.client.LiferayOAuth2AccessTokenManager;
import com.liferay.hubspot.service.HubSpotService;

import com.liferay.client.extension.util.spring.boot3.BaseRestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import org.json.JSONObject;

import reactor.core.publisher.Mono;

@RequestMapping("/")
@RestController
public class HubSpotRestController extends BaseRestController {

    @PostMapping("/lead")
    public void createContact(@RequestBody String json) throws Exception {
        
        JSONObject jsonObject = new JSONObject(json);

		JSONObject objectEntryJSONObject = jsonObject.getJSONObject(
			"objectEntry");

        JSONObject objectValuesJSONObject = objectEntryJSONObject.getJSONObject(
			"values");
            
		String firstName = objectValuesJSONObject.getString(
			"firstName");

        String lastName = objectValuesJSONObject.getString(
			"lastName");

        String email = objectValuesJSONObject.getString(
			"email");

        String phone = objectValuesJSONObject.getString(
			"phone");

        String companyName = objectValuesJSONObject.getString(
                "companyName");

        String numberOfEmployees = String.valueOf(objectValuesJSONObject.getInt(
                "numberOfEmployees"));

        String websiteURL = String.valueOf(objectValuesJSONObject.getString("websiteURL"));

        _hubSpotService.createLead(email, firstName, lastName, phone, companyName, numberOfEmployees, websiteURL);
    }


    @Autowired
    private HubSpotService _hubSpotService;
}


