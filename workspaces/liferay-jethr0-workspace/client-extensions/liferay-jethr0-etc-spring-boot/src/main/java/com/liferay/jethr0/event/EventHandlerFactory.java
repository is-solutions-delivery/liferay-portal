/**
 * SPDX-FileCopyrightText: (c) 2023 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

package com.liferay.jethr0.event;

import org.json.JSONObject;

/**
 * @author Michael Hashimoto
 */
public interface EventHandlerFactory {

	public EventHandler newEventHandler(JSONObject messageJSONObject)
		throws IllegalArgumentException;

}