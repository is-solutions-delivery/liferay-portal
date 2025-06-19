/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

document
	.getElementById('dateForm')
	.addEventListener('submit', async (event) => {
		event.preventDefault();

		let startDate = document.getElementById('startDate').value;
		let endDate = document.getElementById('endDate').value;

		endDate = String(endDate);
		startDate = String(startDate);

		try {
			const token = Liferay.OAuth2Client.FromUserAgentApplication(
				'liferay-learn-etc-spring-boot-oauth-application-user-agent'
			);

			// eslint-disable-next-line no-unused-vars
			const response = await token
				.fetch(
					`/course-progress/download?endDate=${endDate}&startDate=${startDate}`
				)
				.then((response) => response.blob())
				.then((response) => {
					const downloadElement = document.createElement('a');

					downloadElement.download = 'user_course_progress.csv';
					downloadElement.href = URL.createObjectURL(response);
					document.body.appendChild(downloadElement);
					downloadElement.click();
				});
		}
		catch (error) {
			console.error('Error:', error);
			alert('Failed to fetch data from the API');
		}
	});
