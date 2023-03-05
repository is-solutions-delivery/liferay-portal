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

package com.liferay.portal.company.log.web.internal.servlet;

import com.liferay.petra.string.CharPool;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONArray;
import com.liferay.portal.kernel.json.JSONFactory;
import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.language.Language;
import com.liferay.portal.kernel.log.Log;
import com.liferay.portal.kernel.log.LogFactoryUtil;
import com.liferay.portal.kernel.model.Company;
import com.liferay.portal.kernel.model.User;
import com.liferay.portal.kernel.security.auth.PrincipalException;
import com.liferay.portal.kernel.security.permission.PermissionChecker;
import com.liferay.portal.kernel.security.permission.PermissionCheckerFactory;
import com.liferay.portal.kernel.service.CompanyLocalService;
import com.liferay.portal.kernel.servlet.HttpHeaders;
import com.liferay.portal.kernel.servlet.ServletResponseUtil;
import com.liferay.portal.kernel.util.GetterUtil;
import com.liferay.portal.kernel.util.HttpComponentsUtil;
import com.liferay.portal.kernel.util.MimeTypes;
import com.liferay.portal.kernel.util.ParamUtil;
import com.liferay.portal.kernel.util.Portal;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.kernel.util.Validator;
import com.liferay.portal.log4j.Log4JUtil;
import com.liferay.portal.vulcan.pagination.Page;
import com.liferay.portal.vulcan.pagination.Pagination;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.Arrays;
import java.util.Collections;
import java.util.Locale;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.input.ReversedLinesFileReader;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

/**
 * @author Hai Yu
 */
@Component(
	enabled = false,
	property = {
		"osgi.http.whiteboard.servlet.name=com.liferay.portal.company.log.web.internal.servlet.CompanyLogServlet",
		"osgi.http.whiteboard.servlet.pattern=/company-log/*",
		"servlet.init.httpMethods=GET"
	},
	service = Servlet.class
)
public class CompanyLogServlet extends HttpServlet {

	@Override
	protected void doGet(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws IOException, ServletException {

		try {
			String path = HttpComponentsUtil.fixPath(
				httpServletRequest.getPathInfo());

			String[] pathArray = StringUtil.split(path, CharPool.SLASH);

			if (pathArray.length == 0) {
				_list(httpServletRequest, httpServletResponse);

				return;
			}

			long companyId = GetterUtil.getLongStrict(pathArray[0]);

			Company company = _companyLocalService.getCompany(companyId);

			PermissionChecker permissionChecker = _getPermissionChecker(
				httpServletRequest);

			if (!permissionChecker.isCompanyAdmin(companyId)) {
				throw new PrincipalException.MustBeCompanyAdmin(
					permissionChecker.getUserId());
			}

			if (pathArray.length == 1) {
				_listCompanyLogs(
					company, httpServletRequest, httpServletResponse);

				return;
			}

			String action = ParamUtil.getString(httpServletRequest, "action");

			String fileName = pathArray[1];

			File file = _getFile(companyId, fileName);

			if (Validator.isNotNull(action) && action.equals("read")) {
				_read(httpServletRequest, httpServletResponse, file);

				return;
			}

			_download(httpServletRequest, httpServletResponse, file);
		}
		catch (FileNotFoundException fileNotFoundException) {
			if (_log.isWarnEnabled()) {
				_log.warn(fileNotFoundException);
			}

			_portal.sendError(
				HttpServletResponse.SC_NOT_FOUND, fileNotFoundException,
				httpServletRequest, httpServletResponse);
		}
		catch (Exception exception) {
			if (_log.isWarnEnabled()) {
				_log.warn(exception);
			}

			_portal.sendError(
				HttpServletResponse.SC_NOT_FOUND, exception, httpServletRequest,
				httpServletResponse);
		}
	}

	private void _download(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, File file)
		throws Exception {

		String fileName = file.getName();

		String startString = ParamUtil.getString(httpServletRequest, "start");
		String endString = ParamUtil.getString(httpServletRequest, "end");

		if (Validator.isNull(startString) && Validator.isNull(endString)) {
			ServletResponseUtil.sendFile(
				httpServletRequest, httpServletResponse, fileName,
				Files.newInputStream(file.toPath()), file.length(),
				_mimeTypes.getContentType(fileName),
				HttpHeaders.CONTENT_DISPOSITION_ATTACHMENT);
		}
		else {
			long start = 0;

			if (Validator.isNotNull(startString)) {
				start = GetterUtil.getLongStrict(startString);
			}

			long end = file.length();

			if (Validator.isNotNull(endString) &&
				(GetterUtil.getLongStrict(endString) < end)) {

				end = GetterUtil.getLongStrict(endString);
			}

			if ((start < 0) || (end < 0) || (start >= end)) {
				throw new IllegalArgumentException(
					"Start and end cannot be less than 0. Start cannot be " +
						"greater than or equal to end.");
			}

			if (start != 0) {
				--start;
			}

			try (FileChannel fileChannel = FileChannel.open(file.toPath())) {
				fileChannel.position(start);

				ServletResponseUtil.sendFile(
					httpServletRequest, httpServletResponse, fileName,
					Channels.newInputStream(fileChannel), end - start,
					_mimeTypes.getContentType(fileName),
					HttpHeaders.CONTENT_DISPOSITION_ATTACHMENT);
			}
		}
	}

	private JSONArray _getCompanyLogsJSONArray(Company company, Locale locale)
		throws Exception {

		File companyLogDirectory = Log4JUtil.getCompanyLogDirectory(
			company.getCompanyId());

		File[] files = companyLogDirectory.listFiles();

		Arrays.sort(files, Collections.reverseOrder());

		return JSONUtil.toJSONArray(
			files,
			file -> JSONUtil.put(
				"fileName", file.getName()
			).put(
				"fileSize", _language.formatStorageSize(file.length(), locale)
			));
	}

	private File _getFile(long companyId, String fileName) throws Exception {
		File companyLogDirectory = Log4JUtil.getCompanyLogDirectory(companyId);

		Path path = Paths.get(companyLogDirectory.getPath(), fileName);

		path = path.normalize();

		if (!path.startsWith(companyLogDirectory.getPath())) {
			throw new PrincipalException("Invalid path " + path);
		}

		File file = path.toFile();

		if (!file.exists()) {
			throw new FileNotFoundException(
				StringBundler.concat(
					"Unable to get file ", fileName, " for company ",
					companyId));
		}

		return file;
	}

	private PermissionChecker _getPermissionChecker(
			HttpServletRequest httpServletRequest)
		throws Exception {

		User user = _portal.getUser(httpServletRequest);

		if (user == null) {
			throw new PrincipalException.MustBeAuthenticated(0);
		}

		return _permissionCheckerFactory.create(user);
	}

	private void _list(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		PermissionChecker permissionChecker = _getPermissionChecker(
			httpServletRequest);

		JSONArray jsonArray = _jsonFactory.createJSONArray();
		JSONObject jsonObject = _jsonFactory.createJSONObject();

		int page = 1;
		int pageSize = 10;
		int totalCount = 1;

		if (permissionChecker.isOmniadmin()) {
			pageSize = ParamUtil.getInteger(httpServletRequest, "pageSize", 10);
			page = ParamUtil.getInteger(httpServletRequest, "page", 1);

			Pagination pagination = Pagination.of(page, pageSize);

			Page<Company> companyPage = Page.of(
				_companyLocalService.getCompanies(
					pagination.getStartPosition(), pagination.getEndPosition()),
				pagination, _companyLocalService.getCompaniesCount());

			for (Company company : companyPage.getItems()) {
				jsonArray.put(
					JSONUtil.put(
						"id", company.getCompanyId()
					).put(
						"name", company.getName()
					).put(
						"webId", company.getWebId()
					));
			}

			totalCount = _companyLocalService.getCompaniesCount();
		}
		else if (permissionChecker.isCompanyAdmin()) {
			User user = permissionChecker.getUser();

			Company company = _companyLocalService.getCompany(
				user.getCompanyId());

			jsonArray.put(
				JSONUtil.put(
					"id", company.getCompanyId()
				).put(
					"name", company.getName()
				).put(
					"webId", company.getWebId()
				));
		}
		else {
			throw new PrincipalException.MustBeCompanyAdmin(
				permissionChecker.getUserId());
		}

		ServletResponseUtil.write(
			httpServletResponse,
			jsonObject.put(
				"items", jsonArray
			).put(
				"page", page
			).put(
				"pageSize", pageSize
			).put(
				"totalCount", totalCount
			).toString());
	}

	private void _listCompanyLogs(
			Company company, HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse)
		throws Exception {

		JSONArray jsonArray = _getCompanyLogsJSONArray(
			company, httpServletRequest.getLocale());

		JSONObject jsonObject = _jsonFactory.createJSONObject();

		ServletResponseUtil.write(
			httpServletResponse,
			jsonObject.put(
				"id", company.getCompanyId()
			).put(
				"logs", jsonArray
			).put(
				"name", company.getName()
			).put(
				"webId", company.getWebId()
			).toString());
	}

	private void _read(
			HttpServletRequest httpServletRequest,
			HttpServletResponse httpServletResponse, File file)
		throws IOException {

		String format = ParamUtil.getString(
			httpServletRequest, "format", "compact");

		boolean compactFormat = format.equals("compact");

		JSONObject jsonObject = _jsonFactory.createJSONObject();
		StringBuilder sb = new StringBuilder();

		String line = "";
		String output = "";
		int totalLineCount = 0;
		long maxLinesToRead = 300;

		try (ReversedLinesFileReader reversedLinesFileReader =
				new ReversedLinesFileReader(file)) {

			line = reversedLinesFileReader.readLine();

			while (line != null) {
				line += "\n";

				if (compactFormat && (totalLineCount < maxLinesToRead)) {
					sb.append(line);
				}
				else if (!compactFormat) {
					sb.append(line);
				}

				line = reversedLinesFileReader.readLine();

				totalLineCount++;
			}
		}
		catch (Exception exception) {
			if (_log.isWarnEnabled()) {
				_log.warn(exception);
			}
		}

		if (compactFormat) {
			output = jsonObject.put(
				"log", sb.toString()
			).put(
				"totalLineCount", totalLineCount
			).toString();
		}
		else {
			output = sb.toString();
		}

		ServletResponseUtil.write(httpServletResponse, output);
	}

	private static final Log _log = LogFactoryUtil.getLog(
		CompanyLogServlet.class);

	@Reference
	private CompanyLocalService _companyLocalService;

	@Reference
	private JSONFactory _jsonFactory;

	@Reference
	private Language _language;

	@Reference
	private MimeTypes _mimeTypes;

	@Reference
	private PermissionCheckerFactory _permissionCheckerFactory;

	@Reference
	private Portal _portal;

}