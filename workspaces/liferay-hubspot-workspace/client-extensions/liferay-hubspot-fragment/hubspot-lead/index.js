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
		type: 'success',
		message: 'Thanks for submitting the contact form',
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
			type: 'danger',
			message: 'An error occurred while submitting the form. Please try again.',
		});
	}
	finally {
		submitLeadForm.disabled = false;
	}
});

initializeFormData();
