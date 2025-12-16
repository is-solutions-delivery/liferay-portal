/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const form = document.getElementById('lead-form');
const formContainer = document.getElementById('hubspot-lead-form');
const submitLeadForm = document.getElementById('submit-lead-form');

async function createLead(formData) {
	await Liferay.Util.fetch('/o/c/leads', {
		body: JSON.stringify({
			...formData,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
		method: 'POST',
	});

	Liferay.Util.openToast({
		message: 'Thanks for submitting the contact form',
		type: 'success',
	});

	formContainer.innerHTML = `
		<div class="thank-card text-center p-5 bg-white rounded shadow">
			<div class="thank-icon display-3 text-success">✅</div>
			<h2 class="mt-3">Thank You!</h2>

			<p class="text-muted">
				Your information has been received. Our team will get in touch with you soon.
			</p>
		</div>
	`;
}

function initializeFormData() {
	if (!Liferay.ThemeDisplay.isSignedIn()) {
		return;
	}

	form.querySelector("input[name='email']").value =
		Liferay.ThemeDisplay.getUserEmailAddress();

	const [firstName, ...lastName] =
		Liferay.ThemeDisplay.getUserName().split(' ');

	form.querySelector("input[name='firstName']").value = firstName;
	form.querySelector("input[name='lastName']").value = lastName.join(' ');
}

form.addEventListener('submit', async (event) => {
	event.preventDefault();

	const formData = Object.fromEntries(new FormData(form).entries());

	submitLeadForm.disabled = true;

	try {
		await createLead(formData);
	}
	catch (error) {
		console.error('Failed to create lead:', error);
		Liferay.Util.openToast({
			message:
				'An error occurred while submitting the form. Please try again.',
			type: 'danger',
		});
	}
	finally {
		submitLeadForm.disabled = false;
	}
});

initializeFormData();
