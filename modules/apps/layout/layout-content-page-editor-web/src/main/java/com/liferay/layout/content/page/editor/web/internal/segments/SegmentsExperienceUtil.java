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

package com.liferay.layout.content.page.editor.web.internal.segments;

import com.liferay.portal.kernel.json.JSONObject;
import com.liferay.portal.kernel.json.JSONUtil;
import com.liferay.portal.kernel.language.LanguageUtil;
import com.liferay.portal.kernel.model.Layout;
import com.liferay.portal.kernel.service.LayoutLocalServiceUtil;
import com.liferay.portal.kernel.theme.ThemeDisplay;
import com.liferay.portal.kernel.util.HashMapBuilder;
import com.liferay.portal.kernel.util.HttpComponentsUtil;
import com.liferay.portal.kernel.util.PortalUtil;
import com.liferay.portal.kernel.util.WebKeys;
import com.liferay.segments.constants.SegmentsExperimentConstants;
import com.liferay.segments.model.SegmentsExperience;
import com.liferay.segments.model.SegmentsExperiment;
import com.liferay.segments.service.SegmentsExperienceServiceUtil;
import com.liferay.segments.service.SegmentsExperimentLocalServiceUtil;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Eduardo García
 * @author David Arques
 */
public class SegmentsExperienceUtil {

	public static Map<String, Object> getAvailableSegmentsExperiences(
			HttpServletRequest httpServletRequest)
		throws Exception {

		ThemeDisplay themeDisplay =
			(ThemeDisplay)httpServletRequest.getAttribute(
				WebKeys.THEME_DISPLAY);

		Map<String, Object> availableSegmentsExperiences = new HashMap<>();

		Layout draftLayout = themeDisplay.getLayout();

		String layoutFullURL = PortalUtil.getLayoutFullURL(
			LayoutLocalServiceUtil.getLayout(draftLayout.getClassPK()),
			themeDisplay);

		List<SegmentsExperience> segmentsExperiences =
			SegmentsExperienceServiceUtil.getSegmentsExperiences(
				themeDisplay.getScopeGroupId(),
				PortalUtil.getClassNameId(Layout.class.getName()),
				themeDisplay.getPlid(), true);

		for (SegmentsExperience segmentsExperience : segmentsExperiences) {
			availableSegmentsExperiences.put(
				String.valueOf(segmentsExperience.getSegmentsExperienceId()),
				HashMapBuilder.<String, Object>put(
					"hasLockedSegmentsExperiment",
					segmentsExperience.hasSegmentsExperiment()
				).put(
					"name", segmentsExperience.getName(themeDisplay.getLocale())
				).put(
					"priority", segmentsExperience.getPriority()
				).put(
					"segmentsEntryId",
					String.valueOf(segmentsExperience.getSegmentsEntryId())
				).put(
					"segmentsExperienceId",
					String.valueOf(segmentsExperience.getSegmentsExperienceId())
				).put(
					"segmentsExperimentStatus",
					getSegmentsExperimentStatus(
						themeDisplay,
						segmentsExperience.getSegmentsExperienceId())
				).put(
					"segmentsExperimentURL",
					_getSegmentsExperimentURL(
						themeDisplay, layoutFullURL,
						segmentsExperience.getSegmentsExperienceId())
				).build());
		}

		return availableSegmentsExperiences;
	}

	public static JSONObject getSegmentsExperienceJSONObject(
		SegmentsExperience segmentsExperience) {

		return JSONUtil.put(
			"active", segmentsExperience.isActive()
		).put(
			"name", segmentsExperience.getNameCurrentValue()
		).put(
			"priority", segmentsExperience.getPriority()
		).put(
			"segmentsEntryId", segmentsExperience.getSegmentsEntryId()
		).put(
			"segmentsExperienceId", segmentsExperience.getSegmentsExperienceId()
		);
	}

	public static Map<String, Object> getSegmentsExperimentStatus(
			ThemeDisplay themeDisplay, long segmentsExperienceId)
		throws Exception {

		Optional<SegmentsExperiment> segmentsExperimentOptional =
			_getSegmentsExperimentOptional(themeDisplay, segmentsExperienceId);

		if (!segmentsExperimentOptional.isPresent()) {
			return null;
		}

		SegmentsExperiment segmentsExperiment =
			segmentsExperimentOptional.get();

		SegmentsExperimentConstants.Status status =
			SegmentsExperimentConstants.Status.valueOf(
				segmentsExperiment.getStatus());

		return HashMapBuilder.<String, Object>put(
			"label",
			LanguageUtil.get(themeDisplay.getLocale(), status.getLabel())
		).put(
			"value", status.getValue()
		).build();
	}

	private static Optional<SegmentsExperiment> _getSegmentsExperimentOptional(
			ThemeDisplay themeDisplay, long segmentsExperienceId)
		throws Exception {

		Layout draftLayout = themeDisplay.getLayout();

		Layout layout = LayoutLocalServiceUtil.getLayout(
			draftLayout.getClassPK());

		return Optional.ofNullable(
			SegmentsExperimentLocalServiceUtil.fetchSegmentsExperiment(
				segmentsExperienceId, PortalUtil.getClassNameId(Layout.class),
				layout.getPlid(),
				SegmentsExperimentConstants.Status.getExclusiveStatusValues()));
	}

	private static String _getSegmentsExperimentURL(
		ThemeDisplay themeDisplay, String layoutFullURL,
		long segmentsExperienceId) {

		HttpComponentsUtil.addParameter(
			layoutFullURL, "p_l_back_url", themeDisplay.getURLCurrent());

		return HttpComponentsUtil.addParameter(
			layoutFullURL, "segmentsExperienceId", segmentsExperienceId);
	}

}