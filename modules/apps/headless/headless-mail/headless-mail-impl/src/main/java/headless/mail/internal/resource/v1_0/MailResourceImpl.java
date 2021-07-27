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

package headless.mail.internal.resource.v1_0;

import headless.mail.dto.v1_0.Mail;
import headless.mail.resource.v1_0.MailResource;

import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.ServiceScope;

/**
 * @author José Abelenda
 */
@Component(
	properties = "OSGI-INF/liferay/rest/v1_0/mail.properties",
	scope = ServiceScope.PROTOTYPE, service = MailResource.class
)
public class MailResourceImpl extends BaseMailResourceImpl {

	@Override
	public Mail sendMail(Mail mail) {
		System.out.println("Sending Mail...");

		return new Mail();
	}
}