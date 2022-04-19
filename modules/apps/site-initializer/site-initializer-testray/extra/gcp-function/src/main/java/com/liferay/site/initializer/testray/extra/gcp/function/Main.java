/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.site.initializer.testray.extra.gcp.function;

import com.google.api.gax.paging.Page;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import com.liferay.petra.http.invoker.HttpInvoker;
import com.liferay.petra.string.StringBundler;
import com.liferay.petra.string.StringPool;
import com.liferay.petra.string.StringUtil;

import java.io.File;
import java.io.InputStream;

import java.nio.file.Files;
import java.nio.file.Path;

import java.time.LocalDateTime;
import java.time.ZoneOffset;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.logging.FileHandler;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.logging.SimpleFormatter;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.json.JSONArray;
import org.json.JSONObject;

import org.rauschig.jarchivelib.Archiver;
import org.rauschig.jarchivelib.ArchiverFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

/**
 * @author Brian Wing Shun Chan
 */
public class Main {

	public static void main(String[] arguments) throws Exception {
		Properties properties = new Properties();

		try (InputStream inputStream = Main.class.getResourceAsStream(
				"/application.properties")) {

			properties.load(inputStream);
		}

		Main main = new Main(
			properties.getProperty("liferay.login"),
			properties.getProperty("liferay.password"),
			properties.getProperty("liferay.url"),
			properties.getProperty("s3.api.key.path"),
			properties.getProperty("s3.bucket.name"),
			properties.getProperty("s3.errored.folder.name"),
			properties.getProperty("s3.inbox.folder.name"),
			properties.getProperty("s3.processed.folder.name"));

		main.prepareCache();
		main.uploadToTestray();
	}

	public Main(
		String liferayLogin, String liferayPassword, String liferayURL,
		String s3APIKeyPath, String s3BucketName, String s3ErroredFolderName,
		String s3InboxFolderName, String s3ProcessedFolderName) {

		_liferayLogin = liferayLogin;
		_liferayPassword = liferayPassword;
		_liferayURL = liferayURL;
		_s3APIKeyPath = s3APIKeyPath;
		_s3BucketName = s3BucketName;
		_s3ErroredFolderName = s3ErroredFolderName;
		_s3InboxFolderName = s3InboxFolderName;
		_s3ProcessedFolderName = s3ProcessedFolderName;

		_logger = Logger.getLogger(Main.class.getName());

		try {
			LocalDateTime localDateTime = LocalDateTime.now(ZoneOffset.UTC);

			FileHandler fileHandler = new FileHandler(
				StringBundler.concat(
					localDateTime.getYear(), "-", localDateTime.getMonthValue(),
					"-", localDateTime.getDayOfMonth(), ".log"),
				true);

			fileHandler.setFormatter(new SimpleFormatter());

			_logger.addHandler(fileHandler);
		}
		catch (Exception exception) {
			_logger.log(Level.SEVERE, exception.getMessage(), exception);
		}
	}

	public void prepareCache() throws Exception {
		_loadTestrayCaseTypes();
		_loadTestrayComponents();
		_loadTestrayFactorCategories();
		_loadTestrayFactorOptions();
		_loadTestrayProjects();
		_loadTestrayTeams();
	}

	public void uploadToTestray() throws Exception {
		Storage storage = StorageOptions.newBuilder(
		).setCredentials(
			GoogleCredentials.fromStream(
				Main.class.getResourceAsStream("/" + _s3APIKeyPath))
		).build(
		).getService();

		Page<Blob> page = storage.list(
			_s3BucketName,
			Storage.BlobListOption.prefix(_s3InboxFolderName + "/"));

		int totalFiles = 0;

		for (Blob blob : page.iterateAll()) {
			totalFiles++;
		}

		int processedFiles = 0;

		for (Blob blob : page.iterateAll()) {
			String name = blob.getName();
			long blobSize = blob.getSize();
			String blobSizeString = blob.getSize() + " B";

			if (blobSize > 1024) {
				blobSize = blobSize / 1000;
				blobSizeString = blobSize + " KB";
			}

			if (blobSize > 1024) {
				blobSize = blobSize / 1024;
				blobSizeString = blobSize + " MB";
			}

			if (name.equals(_s3InboxFolderName + "/")) {
				continue;
			}

			try {
				long initialTime = System.currentTimeMillis();

				_logger.info(
					"Processing archive " + name + " - " + blobSizeString +
						" (" + ++processedFiles + "/" + totalFiles + ")");

				_processArchive(blob.getContent());

				long spentTime = System.currentTimeMillis() - initialTime;

				String spentTimeString = spentTime + " ms";

				if (spentTime > 1000) {
					spentTime = spentTime / 1000;
					spentTimeString = spentTime + " s";
				}

				if (spentTime > 60) {
					spentTime = spentTime / 60;
					spentTimeString = spentTime + " m";
				}

				if (spentTime > 60) {
					spentTime = spentTime / 60;
					spentTimeString = spentTime + " h";
				}

				_logger.info(
					"File processed in " + spentTimeString + " - " +
						blobSizeString + " (" + processedFiles + "/" +
							totalFiles + ")");

				blob.copyTo(
					_s3BucketName,
					name.replaceFirst(
						_s3InboxFolderName, _s3ProcessedFolderName));
			}
			catch (Exception exception) {
				_logger.log(Level.SEVERE, exception.getMessage(), exception);

				blob.copyTo(
					_s3BucketName,
					name.replaceFirst(
						_s3InboxFolderName, _s3ErroredFolderName));
			}

			blob.delete();
		}
	}

	private void _addTestrayAttachments(
			Node testcaseNode, long testrayCaseResultId)
		throws Exception {

		JSONArray jsonArray = new JSONArray();

		Element testcaseElement = (Element)testcaseNode;

		NodeList attachmentsNodeList = testcaseElement.getElementsByTagName(
			"attachments");

		for (int i = 0; i < attachmentsNodeList.getLength(); i++) {
			Node attachmentsNode = attachmentsNodeList.item(i);

			if (attachmentsNode.getNodeType() != Node.ELEMENT_NODE) {
				continue;
			}

			Element attachmentsElement = (Element)attachmentsNode;

			NodeList fileNodeList = attachmentsElement.getElementsByTagName(
				"file");

			for (int j = 0; j < fileNodeList.getLength(); j++) {
				Node fileNode = fileNodeList.item(j);

				if (fileNode.getNodeType() != Node.ELEMENT_NODE) {
					continue;
				}

				Element fileElement = (Element)fileNode;

				jsonArray.put(
					HashMapBuilder.<String, Object>put(
						"name", fileElement.getAttribute("name")
					).put(
						"r_caseResultToAttachments_c_caseResultId",
						testrayCaseResultId
					).put(
						"url", fileElement.getAttribute("url")
					).put(
						"value", fileElement.getAttribute("value")
					).build());
			}
		}

		_postObjectEntries(jsonArray, "attachments");
	}

	private void _addTestrayCase(
			Node testcaseNode, long testrayBuildId, String testrayBuildTime,
			Map<String, Object> testrayCasePropertiesMap, long testrayProjectId,
			long testrayRunId)
		throws Exception {

		String testrayCaseName = (String)testrayCasePropertiesMap.get(
			"testray.testcase.name");

		String objectEntryMapKey = StringBundler.concat(
			"Case#", testrayCaseName, "#testrayProjectId#", testrayProjectId);

		long testrayCaseId = _getObjectEntryId(
			StringBundler.concat(
				"projectId eq ", testrayProjectId, " and name eq '",
				testrayCaseName, "'"),
			"cases", objectEntryMapKey);

		long testrayTeamId = _getTestrayTeamId(
			testrayProjectId,
			(String)testrayCasePropertiesMap.get("testray.team.name"));

		long testrayComponentId = _getTestrayComponentId(
			(String)testrayCasePropertiesMap.get("testray.main.component.name"),
			testrayProjectId, testrayTeamId);

		if (testrayCaseId == 0) {
			testrayCaseId = _postObjectEntry(
				HashMapBuilder.<String, Object>put(
					"caseNumber",
					_increment(
						"projectId eq " + testrayProjectId, "cases",
						"caseNumber")
				).put(
					"description",
					testrayCasePropertiesMap.get("testray.testcase.description")
				).put(
					"priority",
					testrayCasePropertiesMap.get("testray.testcase.priority")
				).put(
					"r_caseTypeToCases_c_caseTypeId",
					_getTestrayCaseTypeId(
						(String)testrayCasePropertiesMap.get(
							"testray.case.type.name"))
				).put(
					"r_componentToCases_c_componentId", testrayComponentId
				).put(
					"r_projectToCases_c_projectId", testrayProjectId
				).build(),
				(String)testrayCasePropertiesMap.get("testray.testcase.name"),
				"cases");
		}

		long testrayCaseResultId = _getTestrayCaseResultId(
			testcaseNode, testrayBuildId, testrayBuildTime, testrayCaseId,
			testrayCasePropertiesMap, testrayComponentId, testrayRunId);

		_addTestrayAttachments(testcaseNode, testrayCaseResultId);

		_addTestrayCaseResultIssue(
			testrayCaseResultId,
			(String)testrayCasePropertiesMap.get("testray.case.issue"));
		_addTestrayCaseResultIssue(
			testrayCaseResultId,
			(String)testrayCasePropertiesMap.get("testray.case.defect"));
		_addTestrayWarnings(testrayCasePropertiesMap, testrayCaseResultId);
	}

	private void _addTestrayCaseResultIssue(
			long testrayCaseResultId, String testrayIssueName)
		throws Exception {

		if (_isEmpty(testrayIssueName)) {
			return;
		}

		_postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"r_caseResultToCaseResultsIssues_c_caseResultId",
				testrayCaseResultId
			).put(
				"r_issueToCaseResultsIssues_c_issueId",
				_getTestrayIssueId(testrayIssueName)
			).build(),
			null, "caseresultsissueses");
	}

	private void _addTestrayCases(
			Element element, long testrayBuildId, String testrayBuildTime,
			long testrayProjectId, long testrayRunId)
		throws Exception {

		NodeList testCaseNodeList = element.getElementsByTagName("testcase");

		for (int i = 0; i < testCaseNodeList.getLength(); i++) {
			Node testcaseNode = testCaseNodeList.item(i);

			Map<String, Object> testrayCasePropertiesMap =
				_getTestrayCaseProperties((Element)testcaseNode);

			_addTestrayCase(
				testcaseNode, testrayBuildId, testrayBuildTime,
				testrayCasePropertiesMap, testrayProjectId, testrayRunId);
		}
	}

	private void _addTestrayFactor(
			long testrayFactorCategoryId, String testrayFactorCategoryName,
			long testrayFactorOptionId, String testrayFactorOptionName,
			long testrayRunId)
		throws Exception {

		_postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"classNameId", testrayRunId
			).put(
				"classPK", testrayRunId
			).put(
				"r_factorCategoryToFactors_c_factorCategoryId",
				testrayFactorCategoryId
			).put(
				"r_factorOptionToFactors_c_factorOptionId",
				testrayFactorOptionId
			).put(
				"testrayFactorCategoryName", testrayFactorCategoryName
			).put(
				"testrayFactorOptionName", testrayFactorOptionName
			).build(),
			null, "factors");
	}

	private void _addTestrayWarnings(
			Map<String, Object> testrayCasePropertiesMap,
			long testrayCaseResultId)
		throws Exception {

		List<String> warningsList = (List<String>)testrayCasePropertiesMap.get(
			"testray.testcase.warnings");

		if (warningsList == null) {
			return;
		}

		JSONArray jsonArray = new JSONArray();

		for (String warning : warningsList) {
			jsonArray.put(
				HashMapBuilder.<String, Object>put(
					"content", warning
				).put(
					"r_caseResultToWarnings_c_caseResultId", testrayCaseResultId
				).build());
		}

		_postObjectEntries(jsonArray, "warnings");
	}

	private long _fetchLatestMachingTestrayRun(
			long testrayRoutineId, long testrayRunId)
		throws Exception {

		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "builds",
			HashMapBuilder.put(
				"fields", "id, buildId"
			).put(
				"filter", "routineId eq " + testrayRoutineId
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray buildsJSONArray = responseJSONObject.getJSONArray("items");

		httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "runs",
			HashMapBuilder.put(
				"fields", "id"
			).put(
				"filter",
				StringBundler.concat(
					"environmentHash eq '",
					new JSONObject(
						_invoke(
							null, null, HttpInvoker.HttpMethod.GET,
							"runs/" + testrayRunId, null
						).getContent()
					).getString(
						"environmentHash"
					),
					"' and id ne '", testrayRunId, "'")
			).build());

		responseJSONObject = new JSONObject(httpResponse.getContent());

		JSONArray runsJSONArray = responseJSONObject.getJSONArray("items");

		List<Long> runs = _getBuildInRun(
			buildsJSONArray, runsJSONArray, testrayRunId);

		if (runs != null) {
			return runs.get(0);
		}

		return 0;
	}

	private String _getAttributeValue(String attributeName, Node node) {
		NamedNodeMap namedNodeMap = node.getAttributes();

		if (namedNodeMap == null) {
			return null;
		}

		Node attributeNode = namedNodeMap.getNamedItem(attributeName);

		if (attributeNode == null) {
			return null;
		}

		return attributeNode.getTextContent();
	}

	private List<Long> _getBuildInRun(
		JSONArray buildsJSONArray, JSONArray runsJSONArray, long currentRun) {

		List<Object> test = buildsJSONArray.toList();

		List<Long> matchList = new ArrayList<>();

		for (int i = 0; i < runsJSONArray.length(); i++) {
			JSONObject jsonObject = runsJSONArray.getJSONObject(i);

			long buildId = jsonObject.getLong("buildId");

			if (test.contains(buildId) &&
				(jsonObject.getLong("id") != currentRun)) {

				matchList.add(jsonObject.getLong("runId"));
			}
		}

		return matchList;
	}

	private long _getObjectEntryId(
			String filterString, String objectDefinitionShortName,
			String objectEntryMapKey)
		throws Exception {

		Long objectEntryId = _objectEntryIds.get(objectEntryMapKey);

		if (objectEntryId != null) {
			return objectEntryId;
		}

		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, objectDefinitionShortName,
			HashMapBuilder.put(
				"fields", "id"
			).put(
				"filter", filterString
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (jsonArray.isEmpty()) {
			return 0;
		}

		JSONObject jsonObject = jsonArray.getJSONObject(0);

		return jsonObject.getLong("id");
	}

	private Map<String, String> _getPropertiesMap(Element element) {
		Map<String, String> map = new HashMap<>();

		NodeList propertiesNodeList = element.getElementsByTagName(
			"properties");

		Node propertiesNode = propertiesNodeList.item(0);

		Element propertiesElement = (Element)propertiesNode;

		NodeList propertyNodeList = propertiesElement.getElementsByTagName(
			"property");

		for (int i = 0; i < propertyNodeList.getLength(); i++) {
			Node propertyNode = propertyNodeList.item(i);

			if (!propertyNode.hasAttributes()) {
				continue;
			}

			map.put(
				_getAttributeValue("name", propertyNode),
				_getAttributeValue("value", propertyNode));
		}

		return map;
	}

	private String _getTestrayBuildDescription(
		Map<String, String> propertiesMap) {

		StringBundler sb = new StringBundler(15);

		if (propertiesMap.get("liferay.portal.bundle") != null) {
			sb.append("Bundle: ");
			sb.append(propertiesMap.get("liferay.portal.bundle"));
			sb.append(StringPool.SEMICOLON);
			sb.append(StringPool.NEW_LINE);
		}

		if (propertiesMap.get("liferay.plugins.git.id") != null) {
			sb.append("Plugins hash: ");
			sb.append(propertiesMap.get("liferay.plugins.git.id"));
			sb.append(StringPool.SEMICOLON);
			sb.append(StringPool.NEW_LINE);
		}

		if (propertiesMap.get("liferay.portal.branch") != null) {
			sb.append("Portal branch: ");
			sb.append(propertiesMap.get("liferay.portal.branch"));
			sb.append(StringPool.SEMICOLON);
			sb.append(StringPool.NEW_LINE);
		}

		if (propertiesMap.get("liferay.portal.git.id") != null) {
			sb.append("Portal hash: ");
			sb.append(propertiesMap.get("liferay.portal.git.id"));
			sb.append(StringPool.SEMICOLON);
		}

		return sb.toString();
	}

	private long _getTestrayBuildId(
			Map<String, String> propertiesMap, String testrayBuildName,
			long testrayProjectId, long testrayRoutineId)
		throws Exception {

		String objectEntryMapKey = StringBundler.concat(
			"Build#", testrayBuildName, "#testrayProjectId#", testrayProjectId);

		long testrayBuildId = _getObjectEntryId(
			StringBundler.concat(
				"projectId eq ", testrayProjectId, " and name eq '",
				testrayBuildName, "'"),
			"builds", objectEntryMapKey);

		if (testrayBuildId != 0) {
			return testrayBuildId;
		}

		long testrayProductVersionId = _getTestrayProductVersionId(
			testrayProjectId, propertiesMap.get("testray.product.version"));

		testrayBuildId = _postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"description", _getTestrayBuildDescription(propertiesMap)
			).put(
				"dueDate", propertiesMap.get("testray.build.time")
			).put(
				"gitHash", propertiesMap.get("git.id")
			).put(
				"githubCompareURLs", propertiesMap.get("liferay.compare.urls")
			).put(
				"r_productVersionToBuilds_c_productVersionId",
				testrayProductVersionId
			).put(
				"r_projectToBuilds_c_projectId", testrayProjectId
			).put(
				"r_routineToBuilds_c_routineId", testrayRoutineId
			).build(),
			testrayBuildName, "builds");

		_objectEntryIds.put(objectEntryMapKey, testrayBuildId);

		return testrayBuildId;
	}

	private Map<String, Object> _getTestrayCaseProperties(Element element) {
		Map<String, Object> map = new HashMap<>();

		NodeList propertiesNodeList = element.getElementsByTagName(
			"properties");

		Node propertiesNode = propertiesNodeList.item(0);

		Element propertiesElement = (Element)propertiesNode;

		NodeList propertyNodeList = propertiesElement.getElementsByTagName(
			"property");

		for (int i = 0; i < propertyNodeList.getLength(); i++) {
			Node propertyNode = propertyNodeList.item(i);

			if (!propertyNode.hasAttributes()) {
				continue;
			}

			String propertyName = _getAttributeValue("name", propertyNode);

			if (StringUtil.equalsIgnoreCase(
					propertyName, "testray.testcase.warnings")) {

				List<String> warningsList = new ArrayList<>();

				NodeList warningsNodeList = propertyNode.getChildNodes();

				for (int j = 0; j < warningsNodeList.getLength(); j++) {
					Node warningNode = warningsNodeList.item(j);

					String warning = warningNode.getTextContent();

					if (!_isEmpty(warning)) {
						warningsList.add(warningNode.getTextContent());
					}
				}

				map.put(propertyName, warningsList);
			}
			else {
				map.put(
					propertyName, _getAttributeValue("value", propertyNode));
			}
		}

		return map;
	}

	private long _getTestrayCaseResultId(
			Node testcaseNode, long testrayBuildId, String testrayBuildTime,
			long testrayCaseId, Map<String, Object> testrayCasePropertiesMap,
			long testrayComponentId, long testrayRunId)
		throws Exception {

		long testrayCaseResultId = _getObjectEntryId(
			StringBundler.concat(
				"caseId eq ", testrayCaseId, " and runId eq ", testrayRunId),
			"caseresults", null);

		Map<String, Object> map = HashMapBuilder.<String, Object>put(
			"closedDate", testrayBuildTime
		).put(
			"dueStatus",
			() -> {
				String testrayTestcaseStatus =
					(String)testrayCasePropertiesMap.get(
						"testray.testcase.status");

				if (testrayTestcaseStatus.equals("blocked")) {
					return _TESTRAY_CASE_RESULT_STATUS_BLOCKED;
				}
				else if (testrayTestcaseStatus.equals("dnr")) {
					return _TESTRAY_CASE_RESULT_STATUS_DID_NOT_RUN;
				}
				else if (testrayTestcaseStatus.equals("failed")) {
					return _TESTRAY_CASE_RESULT_STATUS_FAILED;
				}
				else if (testrayTestcaseStatus.equals("in-progress")) {
					return _TESTRAY_CASE_RESULT_STATUS_IN_PROGRESS;
				}
				else if (testrayTestcaseStatus.equals("passed")) {
					return _TESTRAY_CASE_RESULT_STATUS_PASSED;
				}
				else if (testrayTestcaseStatus.equals("test-fix")) {
					return _TESTRAY_CASE_RESULT_STATUS_TEST_FIX;
				}

				return _TESTRAY_CASE_RESULT_STATUS_UNTESTED;
			}
		).put(
			"r_buildToCaseResult_c_buildId", testrayBuildId
		).put(
			"r_caseToCaseResult_c_caseId", testrayCaseId
		).put(
			"r_componentToCaseResult_c_componentId", testrayComponentId
		).put(
			"r_runToCaseResult_c_runId", testrayRunId
		).put(
			"startDate", testrayBuildTime
		).build();

		Element element = (Element)testcaseNode;

		NodeList nodeList = element.getElementsByTagName("failure");

		Node failureNode = nodeList.item(0);

		if (failureNode != null) {
			String message = _getAttributeValue("message", failureNode);

			if (!message.isEmpty()) {
				map.put("errors", message);
			}
		}

		if (testrayCaseResultId != 0) {
			_invoke(
				new JSONObject(
					map
				).toString(),
				null, HttpInvoker.HttpMethod.PATCH,
				"caseresults/" + testrayCaseResultId, null);

			return testrayCaseResultId;
		}

		return _postObjectEntry(map, null, "caseresults");
	}

	private long _getTestrayCaseTypeId(String testrayCaseTypeName)
		throws Exception {

		String objectEntryMapKey = "CaseType#" + testrayCaseTypeName;

		long testrayCaseTypeId = _getObjectEntryId(
			"name eq '" + testrayCaseTypeName + "'", "casetypes",
			objectEntryMapKey);

		if (testrayCaseTypeId != 0) {
			return testrayCaseTypeId;
		}

		testrayCaseTypeId = _postObjectEntry(
			null, testrayCaseTypeName, "casetypes");

		_objectEntryIds.put(objectEntryMapKey, testrayCaseTypeId);

		return testrayCaseTypeId;
	}

	private long _getTestrayComponentId(
			String testrayComponentName, long testrayProjectId,
			long testrayTeamId)
		throws Exception {

		String objectEntryMapKey = StringBundler.concat(
			"Component#", testrayComponentName, "#testrayProjectId#",
			testrayProjectId);

		long testrayComponentId = _getObjectEntryId(
			StringBundler.concat(
				"projectId eq ", testrayProjectId, " and name eq '",
				testrayComponentName, "'"),
			"components", objectEntryMapKey);

		if (testrayComponentId != 0) {
			return testrayComponentId;
		}

		testrayComponentId = _postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"r_projectToComponents_c_projectId", testrayProjectId
			).put(
				"r_teamToComponents_c_teamId", testrayTeamId
			).build(),
			testrayComponentName, "components");

		_objectEntryIds.put(objectEntryMapKey, testrayComponentId);

		return testrayComponentId;
	}

	private long _getTestrayFactorCategoryId(String testrayFactorCategoryName)
		throws Exception {

		String objectEntryMapKey =
			"FactorCategory#" + testrayFactorCategoryName;

		long testrayFactorCategoryId = _getObjectEntryId(
			"name eq '" + testrayFactorCategoryName + "'", "factorcategories",
			objectEntryMapKey);

		if (testrayFactorCategoryId != 0) {
			return testrayFactorCategoryId;
		}

		testrayFactorCategoryId = _postObjectEntry(
			null, testrayFactorCategoryName, "factorcategories");

		_objectEntryIds.put(objectEntryMapKey, testrayFactorCategoryId);

		return testrayFactorCategoryId;
	}

	private long _getTestrayFactorOptionId(
			long testrayFactorCategoryId, String testrayFactorOptionName)
		throws Exception {

		String objectEntryMapKey = StringBundler.concat(
			"FactorOption#", testrayFactorOptionName,
			"#testrayFactorCategoryId#", testrayFactorCategoryId);

		long testrayFactorOptionId = _getObjectEntryId(
			StringBundler.concat(
				"factorCategoryId eq ", testrayFactorCategoryId,
				" and name eq '", testrayFactorOptionName, "'"),
			"factoroptions", objectEntryMapKey);

		if (testrayFactorOptionId != 0) {
			return testrayFactorOptionId;
		}

		testrayFactorOptionId = _postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"r_factorCategoryToOptions_c_factorCategoryId",
				testrayFactorCategoryId
			).build(),
			testrayFactorOptionName, "factoroptions");

		_objectEntryIds.put(objectEntryMapKey, testrayFactorOptionId);

		return testrayFactorOptionId;
	}

	private long _getTestrayIssueId(String testrayIssueName) throws Exception {
		String objectEntryMapKey = "Issue#" + testrayIssueName;

		long testrayIssueId = _getObjectEntryId(
			"name eq '" + testrayIssueName + "'", "issues", objectEntryMapKey);

		if (testrayIssueId > 0) {
			return testrayIssueId;
		}

		testrayIssueId = _postObjectEntry(null, testrayIssueName, "issues");

		_objectEntryIds.put(objectEntryMapKey, testrayIssueId);

		return testrayIssueId;
	}

	private long _getTestrayProductVersionId(
			long testrayProjectId, String testrayProductVersionName)
		throws Exception {

		String objectEntryMapKey =
			"ProductVersion#" + testrayProductVersionName;

		long testrayProductVersionId = _getObjectEntryId(
			"name eq '" + testrayProductVersionName + "'", "productversions",
			objectEntryMapKey);

		if (testrayProductVersionId != 0) {
			return testrayProductVersionId;
		}

		testrayProductVersionId = _postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"r_projectToProductVersions_c_projectId", testrayProjectId
			).build(),
			testrayProductVersionName, "productversions");

		_objectEntryIds.put(objectEntryMapKey, testrayProductVersionId);

		return testrayProductVersionId;
	}

	private long _getTestrayProjectId(String testrayProjectName)
		throws Exception {

		String objectEntryMapKey = "Project#" + testrayProjectName;

		long testrayProjectId = _getObjectEntryId(
			"name eq '" + testrayProjectName + "'", "projects",
			objectEntryMapKey);

		if (testrayProjectId != 0) {
			return testrayProjectId;
		}

		testrayProjectId = _postObjectEntry(
			null, testrayProjectName, "projects");

		_objectEntryIds.put(objectEntryMapKey, testrayProjectId);

		return testrayProjectId;
	}

	private long _getTestrayRoutineId(
			long testrayProjectId, String testrayRoutineName)
		throws Exception {

		String objectEntryMapKey = StringBundler.concat(
			"Routine#", testrayRoutineName, "#testrayProjectId#",
			testrayProjectId);

		long testrayRoutineId = _getObjectEntryId(
			StringBundler.concat(
				"projectId eq ", testrayProjectId, " and name eq '",
				testrayRoutineName, "'"),
			"routines", objectEntryMapKey);

		if (testrayRoutineId != 0) {
			return testrayRoutineId;
		}

		testrayRoutineId = _postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"r_routineToProjects_c_projectId", testrayProjectId
			).build(),
			testrayRoutineName, "routines");

		_objectEntryIds.put(objectEntryMapKey, testrayRoutineId);

		return testrayRoutineId;
	}

	private String _getTestrayRunEnvironmentHash(
			Element element, long testrayRunId)
		throws Exception {

		StringBundler sb = new StringBundler();

		NodeList environmentNodeList = element.getElementsByTagName(
			"environment");

		for (int i = 0; i < environmentNodeList.getLength(); i++) {
			Node node = environmentNodeList.item(i);

			if (!node.hasAttributes()) {
				continue;
			}

			String testrayFactorCategoryName = _getAttributeValue("type", node);

			long testrayFactorCategoryId = _getTestrayFactorCategoryId(
				testrayFactorCategoryName);

			String testrayFactorOptionName = _getAttributeValue("option", node);

			long testrayFactorOptionId = _getTestrayFactorOptionId(
				testrayFactorCategoryId, testrayFactorOptionName);

			_addTestrayFactor(
				testrayFactorCategoryId, testrayFactorCategoryName,
				testrayFactorOptionId, testrayFactorOptionName, testrayRunId);

			sb.append(testrayFactorCategoryId);
			sb.append(testrayFactorOptionId);
		}

		String testrayFactorsString = sb.toString();

		return String.valueOf(testrayFactorsString.hashCode());
	}

	private long _getTestrayRunId(
			Element element, Map<String, String> propertiesMap,
			long testrayBuildId, String testrayRunName)
		throws Exception {

		String objectEntryMapKey = StringBundler.concat(
			"Run#", testrayRunName, "#testrayBuildId#", testrayBuildId);

		long testrayRunId = _getObjectEntryId(
			StringBundler.concat(
				"buildId eq ", testrayBuildId, " and name eq '", testrayRunName,
				"'"),
			"runs", objectEntryMapKey);

		if (testrayRunId != 0) {
			return testrayRunId;
		}

		testrayRunId = _postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"externalReferencePK", propertiesMap.get("testray.run.id")
			).put(
				"externalReferenceType",
				_TESTRAY_RUN_EXTERNAL_REFERENCE_TYPE_POSHI
			).put(
				"jenkinsJobKey", propertiesMap.get("jenkins.job.id")
			).put(
				"name", testrayRunName
			).put(
				"number",
				_increment("buildId eq " + testrayBuildId, "runs", "number")
			).put(
				"r_buildToRuns_c_buildId", testrayBuildId
			).build(),
			testrayRunName, "runs");

		_objectEntryIds.put(objectEntryMapKey, testrayRunId);

		JSONObject jsonObject = new JSONObject();

		jsonObject.put(
			"environmentHash",
			_getTestrayRunEnvironmentHash(element, testrayRunId));

		_invoke(
			jsonObject.toString(), null, HttpInvoker.HttpMethod.PATCH,
			"runs/" + testrayRunId, null);

		return testrayRunId;
	}

	private long _getTestrayTeamId(
			long testrayProjectId, String testrayTeamName)
		throws Exception {

		String objectEntryMapKey = StringBundler.concat(
			"Team#", testrayTeamName, "#testrayProjectId#", testrayProjectId);

		long testrayTeamId = _getObjectEntryId(
			StringBundler.concat(
				"projectId eq ", testrayProjectId, " and name eq '",
				testrayTeamName, "'"),
			"teams", objectEntryMapKey);

		if (testrayTeamId != 0) {
			return testrayTeamId;
		}

		testrayTeamId = _postObjectEntry(
			HashMapBuilder.<String, Object>put(
				"r_projectToTeams_c_projectId", testrayProjectId
			).build(),
			testrayTeamName, "teams");

		_objectEntryIds.put(objectEntryMapKey, testrayTeamId);

		return testrayTeamId;
	}

	private long _increment(
			String filterString, String objectDefinitionShortName,
			String sortField)
		throws Exception {

		// TODO Make this a feature in objects

		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, objectDefinitionShortName,
			HashMapBuilder.put(
				"fields", sortField
			).put(
				"filter", () -> filterString
			).put(
				"sort", sortField + ":desc"
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (jsonArray.isEmpty()) {
			return 1;
		}

		JSONObject jsonObject = jsonArray.getJSONObject(0);

		return jsonObject.getLong(sortField) + 1;
	}

	private HttpInvoker.HttpResponse _invoke(
			String body, Map<String, String> headers,
			HttpInvoker.HttpMethod httpMethod, String objectDefinitionShortName,
			Map<String, String> parameters)
		throws Exception {

		HttpInvoker httpInvoker = HttpInvoker.newHttpInvoker();

		httpInvoker.body(body, "application/json");

		if (headers != null) {
			for (Map.Entry<String, String> entry : headers.entrySet()) {
				httpInvoker.header(entry.getKey(), entry.getValue());
			}
		}

		httpInvoker.httpMethod(httpMethod);

		if (parameters != null) {
			for (Map.Entry<String, String> entry : parameters.entrySet()) {
				httpInvoker.parameter(entry.getKey(), entry.getValue());
			}
		}

		String path = _liferayURL + "/o/c/" + objectDefinitionShortName;

		httpInvoker.path(path);

		httpInvoker.userNameAndPassword(_liferayLogin + ":" + _liferayPassword);

		HttpInvoker.HttpResponse httpResponse = httpInvoker.invoke();

		if ((httpResponse.getStatusCode() / 100) != 2) {
			String content = httpResponse.getContent();

			_logger.warning("Unable to process: " + path);
			_logger.warning("HTTP response content: " + content);
			_logger.warning(
				"HTTP response message: " + httpResponse.getMessage());
			_logger.warning(
				"HTTP response status code: " + httpResponse.getStatusCode());

			throw new Exception("Unable to process: " + path);
		}

		return httpResponse;
	}

	private boolean _isEmpty(String value) {
		if (value == null) {
			return true;
		}

		String trimmedValue = value.trim();

		return trimmedValue.isEmpty();
	}

	private void _loadTestrayCaseTypes() throws Exception {
		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "casetypes",
			HashMapBuilder.put(
				"fields", "id,name"
			).put(
				"page", "0"
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (!jsonArray.isEmpty()) {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);

				_objectEntryIds.put(
					"CaseType#" + jsonObject.getString("name"),
					jsonObject.getLong("id"));
			}
		}
	}

	private void _loadTestrayComponents() throws Exception {
		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "components",
			HashMapBuilder.put(
				"fields",
				"id,name,r_projectToComponents_c_projectId," +
					"r_teamToComponents_c_teamId"
			).put(
				"page", "0"
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (!jsonArray.isEmpty()) {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);

				_objectEntryIds.put(
					StringBundler.concat(
						"Component#", jsonObject.getString("name"),
						"#testrayTeamId#",
						jsonObject.getLong("r_teamToComponents_c_teamId")),
					jsonObject.getLong("id"));
			}
		}
	}

	private void _loadTestrayFactorCategories() throws Exception {
		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "factorcategories",
			HashMapBuilder.put(
				"fields", "id,name"
			).put(
				"page", "0"
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (!jsonArray.isEmpty()) {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);

				_objectEntryIds.put(
					"FactorCategory#" + jsonObject.getString("name"),
					jsonObject.getLong("id"));
			}
		}
	}

	private void _loadTestrayFactorOptions() throws Exception {
		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "factoroptions",
			HashMapBuilder.put(
				"fields", "id,name,r_factorCategoryToOptions_c_factorCategoryId"
			).put(
				"page", "0"
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (!jsonArray.isEmpty()) {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);

				_objectEntryIds.put(
					StringBundler.concat(
						"FactorOption#", jsonObject.getString("name"),
						"#testrayFactorCategoryId#",
						jsonObject.getLong(
							"r_factorCategoryToOptions_c_factorCategoryId")),
					jsonObject.getLong("id"));
			}
		}
	}

	private void _loadTestrayProjects() throws Exception {
		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "projects",
			HashMapBuilder.put(
				"fields", "id,name"
			).put(
				"page", "0"
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (!jsonArray.isEmpty()) {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);

				_objectEntryIds.put(
					"Project#" + jsonObject.getString("name"),
					jsonObject.getLong("id"));
			}
		}
	}

	private void _loadTestrayTeams() throws Exception {
		HttpInvoker.HttpResponse httpResponse = _invoke(
			null, null, HttpInvoker.HttpMethod.GET, "teams",
			HashMapBuilder.put(
				"fields", "id,name,r_projectToTeams_c_projectId"
			).put(
				"page", "0"
			).build());

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		JSONArray jsonArray = responseJSONObject.getJSONArray("items");

		if (!jsonArray.isEmpty()) {
			for (int i = 0; i < jsonArray.length(); i++) {
				JSONObject jsonObject = jsonArray.getJSONObject(i);

				_objectEntryIds.put(
					StringBundler.concat(
						"Team#", jsonObject.getString("name"),
						"#testrayProjectId#",
						jsonObject.getLong("r_projectToTeams_c_projectId")),
					jsonObject.getLong("id"));
			}
		}
	}

	private void _postObjectEntries(
			JSONArray jsonArray, String objectDefinitionShortName)
		throws Exception {

		_invoke(
			jsonArray.toString(), null, HttpInvoker.HttpMethod.POST,
			objectDefinitionShortName + "/batch", null);
	}

	private long _postObjectEntry(
			Map<String, ?> headers, String name,
			String objectDefinitionShortName)
		throws Exception {

		JSONObject headersJSONObject = new JSONObject(
			(headers != null) ? headers : Collections.emptyMap());

		headersJSONObject.put("name", name);

		HttpInvoker.HttpResponse httpResponse = _invoke(
			headersJSONObject.toString(), null, HttpInvoker.HttpMethod.POST,
			objectDefinitionShortName, null);

		JSONObject responseJSONObject = new JSONObject(
			httpResponse.getContent());

		return responseJSONObject.getLong("id");
	}

	private void _processArchive(byte[] bytes) throws Exception {
		Path tempDirectoryPath = null;
		Path tempFilePath = null;

		try {
			tempDirectoryPath = Files.createTempDirectory(null);

			tempFilePath = Files.createTempFile(null, null);

			Files.write(tempFilePath, bytes);

			Archiver archiver = ArchiverFactory.createArchiver("tar");

			File tempDirectoryFile = tempDirectoryPath.toFile();

			archiver.extract(tempFilePath.toFile(), tempDirectoryFile);

			DocumentBuilderFactory documentBuilderFactory =
				DocumentBuilderFactory.newInstance();

			DocumentBuilder documentBuilder =
				documentBuilderFactory.newDocumentBuilder();

			int totalDocuments = tempDirectoryFile.listFiles().length;

			int processedDocuments = 0;

			for (File file : tempDirectoryFile.listFiles()) {
				try {
					long fileSize = file.length();
					String fileSizeString = fileSize + " B";

					if (fileSize > 1024) {
						fileSize = fileSize / 1000;
						fileSizeString = fileSize + " KB";
					}

					if (fileSize > 1024) {
						fileSize = fileSize / 1024;
						fileSizeString = fileSize + " MB";
					}

					long initialTime = System.currentTimeMillis();

					_logger.info(
						"Parsing document " + file.getName() + " - " +
							fileSizeString + " (" + ++processedDocuments + "/" +
								totalDocuments + ")");

					Document document = documentBuilder.parse(file);

					_processDocument(document);

					long spentTime = System.currentTimeMillis() - initialTime;

					String spentTimeString = spentTime + " ms";

					if (spentTime > 1000) {
						spentTime = spentTime / 1000;
						spentTimeString = spentTime + " s";
					}

					if (spentTime > 60) {
						spentTime = spentTime / 60;
						spentTimeString = spentTime + " m";
					}

					if (spentTime > 60) {
						spentTime = spentTime / 60;
						spentTimeString = spentTime + " h";
					}

					_logger.info(
						"Document processed in " + spentTimeString + " - " +
							fileSizeString + " (" + processedDocuments + "/" +
								totalDocuments + ")");
				}
				catch (Exception exception) {
					_logger.log(
						Level.SEVERE, exception.getMessage(), exception);
				}
				finally {
					file.delete();
				}
			}
		}
		finally {
			if (tempDirectoryPath != null) {
				Files.deleteIfExists(tempDirectoryPath);
			}

			if (tempFilePath != null) {
				Files.deleteIfExists(tempFilePath);
			}
		}
	}

	private void _processDocument(Document document) throws Exception {
		Element element = document.getDocumentElement();

		Map<String, String> propertiesMap = _getPropertiesMap(element);

		long testrayProjectId = _getTestrayProjectId(
			propertiesMap.get("testray.project.name"));

		long testrayRoutineId = _getTestrayRoutineId(
			testrayProjectId, propertiesMap.get("testray.build.type"));

		long testrayBuildId = _getTestrayBuildId(
			propertiesMap, propertiesMap.get("testray.build.name"),
			testrayProjectId, testrayRoutineId);

		long testrayRunId = _getTestrayRunId(
			element, propertiesMap, testrayBuildId,
			propertiesMap.get("testray.run.id"));

		_addTestrayCases(
			element, testrayBuildId, propertiesMap.get("testray.build.time"),
			testrayProjectId, testrayRunId);

		JSONObject jsonObject = new JSONObject(
			_invoke(
				null, null, HttpInvoker.HttpMethod.GET,
				"routines/" + testrayRoutineId, null
			).getContent());

		if (jsonObject.getBoolean("autoanalyze")) {
			long testrayTestRunId = _fetchLatestMachingTestrayRun(
				testrayRoutineId, testrayRunId);

			if (testrayTestRunId != 0) {

				// TODO

			}
		}
	}

	private static final int _TESTRAY_CASE_RESULT_STATUS_BLOCKED = 4;

	private static final int _TESTRAY_CASE_RESULT_STATUS_DID_NOT_RUN = 6;

	private static final int _TESTRAY_CASE_RESULT_STATUS_FAILED = 3;

	private static final int _TESTRAY_CASE_RESULT_STATUS_IN_PROGRESS = 1;

	private static final int _TESTRAY_CASE_RESULT_STATUS_PASSED = 2;

	private static final int _TESTRAY_CASE_RESULT_STATUS_TEST_FIX = 7;

	private static final int _TESTRAY_CASE_RESULT_STATUS_UNTESTED = 0;

	private static final int _TESTRAY_RUN_EXTERNAL_REFERENCE_TYPE_POSHI = 1;

	private final String _liferayLogin;
	private final String _liferayPassword;
	private final String _liferayURL;
	private final Logger _logger;
	private final Map<String, Long> _objectEntryIds = new HashMap<>();
	private final String _s3APIKeyPath;
	private final String _s3BucketName;
	private final String _s3ErroredFolderName;
	private final String _s3InboxFolderName;
	private final String _s3ProcessedFolderName;

}