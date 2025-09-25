/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const audioPlayer = document.querySelector('.audio-player');
const audioPlayerContainer = document.querySelector('.audio-player-container');
const audioSource = document.querySelector('.audio-source');
const audioSpeedSelect = document.querySelector('.audio-speed-select');
const audioSpeedSelectItems = audioSpeedSelect.querySelectorAll(
	'.audio-speed-select li'
);
const companyId = Liferay.ThemeDisplay.getCompanyId();
const currentTime = document.querySelector('.current-time');
const defaultAudioSpeedItem = document.querySelector('li[value="1"]');
const duration = document.querySelector('.duration');
const lessonId = new URL(window.location.href).pathname.split('/').pop();
const lessonTitle = document.querySelector('.component-html h1').textContent;
const listenToLesson = document.querySelector('.listen-to-lesson');
const loadingSpinner = document.getElementById('loadingSpinner');
const playPauseButton = document.querySelectorAll('.play-pause-button');
const playPauseCaret = document.querySelector('.play-pause-caret');
const progressBarRange = document.querySelector('.progress-bar-range');
const speechVoice = document.querySelector('.speech-voice');
const speechVoiceItems = speechVoice.querySelectorAll('.speech-voice li');
const textToSpeechPlayerContent = document.querySelector(
	'.text-to-speech-player-content'
);
const toggleSpeedSelect = document.querySelector('.toggle-speed-select');
const toggleSpeechVoiceSelect = document.querySelector(
	'.toggle-speech-voice-select'
);

const url =
	Liferay.OAuth2._userAgentApplications[
		'liferay-learn-etc-spring-boot-oauth-application-user-agent'
	].homePageURL;

let folderIdResponse = null;

const base64ToBlob = (base64, mimeType = 'audio/mpeg') => {
	const byteCharacters = atob(base64);

	const byteNumbers = new Array(byteCharacters.length);

	for (let i = 0; i < byteCharacters.length; i++) {
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	}

	return new Blob([new Uint8Array(byteNumbers)], {type: mimeType});
};

const fetchAndPlayAudio = async (voiceType) => {
	try {
		textToSpeechPlayerContent.classList.add('hide');
		loadingSpinner.classList.remove('hide');

		const fileName = `lesson-${lessonId}-${voiceType}.mp3`;

		const folderId = await getFolderId();

		const searchResponse = await fetch(
			`/o/headless-delivery/v1.0/document-folders/${folderId.id}/documents?pageSize=-1&search=${fileName}`
		).then((response) => response.json());

		if (searchResponse.totalCount > 0 && !!searchResponse.items.length) {
			const existingAudio = searchResponse.items.find(
				(item) => item.title === fileName
			);

			if (existingAudio && existingAudio.contentUrl) {
				audioSource.src = existingAudio.contentUrl;
				audioPlayer.load();

				return;
			}
		}

		const response = await Liferay.Util.fetch(
			`${url}/learn/lesson/${lessonId}/audio/base64?languageCode=en-US&voiceName=en-US-Chirp3-HD-${voiceType}`
		);

		const base64Audio = await response.text();

		if (base64Audio) {
			audioSource.src = 'data:audio/mp3;base64,' + base64Audio;
			await saveAudioToTTSCache({
				base64Audio,
				languageCode: 'en-US',
				lessonId,
				voiceName: voiceType,
			});
			audioPlayer.load();
		}
	}
	catch (error) {
		console.error(error);
	}
	finally {
		loadingSpinner.classList.add('hide');
		textToSpeechPlayerContent.classList.remove('hide');
	}
};

const formatZero = (n) => (n < 10 ? '0' + n : n);

const getFolderId = () => {
	if (!folderIdResponse) {
		folderIdResponse = Liferay.Util.fetch(
			`/o/headless-delivery/v1.0/sites/${companyId}/documents-folder/by-external-reference-code/AUDIO-LESSONS`
		).then((response) => response.json());
	}

	return folderIdResponse;
};

const saveAudioToTTSCache = async ({base64Audio, lessonId, voiceName}) => {
	try {
		const blob = base64ToBlob(base64Audio);
		const formData = new FormData();
		const fileName = `lesson-${lessonId}-${voiceName}.mp3`;
		const folderId = await getFolderId();

		formData.append('file', blob, fileName);
		const uploadResponse = await fetch(
			`/o/headless-delivery/v1.0/document-folders/${folderId.id}/documents`,
			{
				body: formData,
				headers: {
					'Accept': 'application/json',
					'x-csrf-token': Liferay.authToken,
				},
				method: 'POST',
			}
		);

		if (!uploadResponse.ok) {
			const errorText = await uploadResponse.text();

			if (uploadResponse.status === 409) {
				return;
			}
			throw new Error(errorText);
		}

		const uploadData = await uploadResponse.json();

		const fileEntryId = uploadData.id;

		await setGuestPermissions(fileEntryId);
	}
	catch (error) {
		console.error(error);
	}
};

const setGuestPermissions = async (documentId) => {
	try {
		const response = await fetch(
			`/o/headless-delivery/v1.0/documents/${documentId}/permissions`,
			{
				body: JSON.stringify([
					{
						actionIds: ['VIEW', 'DOWNLOAD'],
						roleName: 'Guest',
					},
				]),
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-csrf-token': Liferay.authToken,
				},
				method: 'PUT',
			}
		);

		if (!response.ok) {
			const errorText = await response.text();

			throw new Error(`Erro ${response.status}: ${errorText}`);
		}
	}
	catch (error) {
		console.error(error);
	}
};

const toggleSelect = (toggleElement, dropdownElement) => {
	toggleElement.addEventListener('click', (event) => {
		event.preventDefault();
		dropdownElement.classList.toggle('hide');
		document.addEventListener('click', (event) => {
			if (
				!toggleElement.contains(event.target) &&
				!dropdownElement.contains(event.target)
			) {
				dropdownElement.classList.add('hide');
			}
		});
	});
};
audioPlayer.addEventListener('loadedmetadata', () => {
	duration.textContent = `${Math.floor(audioPlayer.duration / 60)}:${Math.floor(
		audioPlayer.duration % 60
	)
		.toString()
		.padStart(2, '0')}`;
});
audioPlayer.addEventListener('timeupdate', () => {
	const durationFormatted = isNaN(audioPlayer.duration)
		? 0
		: audioPlayer.duration;
	currentTime.textContent = `${Math.floor(audioPlayer.currentTime / 60)}:${formatZero(Math.floor(audioPlayer.currentTime % 60))}`;
	progressBarRange.style.setProperty(
		'--progress',
		(audioPlayer.currentTime / durationFormatted) * 100 + '%'
	);
	if (!isNaN(durationFormatted)) {
		progressBarRange.max = Math.floor(durationFormatted);
		progressBarRange.value = Math.floor(audioPlayer.currentTime);
	}
});
audioSpeedSelectItems.forEach((item) => {
	item.addEventListener('click', () => {
		audioPlayer.playbackRate = parseFloat(item.getAttribute('value'));
		audioSpeedSelectItems.forEach((li) => li.removeAttribute('selected'));
		item.setAttribute('selected', '');
		audioSpeedSelect.classList.add('hide');
	});
});
speechVoiceItems.forEach((item) => {
	item.addEventListener('click', () => {
		const speechVoiceValue = item.getAttribute('value');
		speechVoiceItems.forEach((li) => li.removeAttribute('selected'));
		item.setAttribute('selected', '');
		audioPlayer.playbackRate = parseFloat(
			defaultAudioSpeedItem.getAttribute('value')
		);
		audioSpeedSelectItems.forEach((li) => li.removeAttribute('selected'));
		defaultAudioSpeedItem.setAttribute('selected', '');
		fetchAndPlayAudio(speechVoiceValue);
		audioPlayer.pause();
		playPauseCaret.classList.remove('caret-pause');
		playPauseCaret.classList.add('caret-right');
		speechVoice.classList.add('hide');
	});
});
playPauseButton.forEach((item) => {
	item.onclick = () => {
		if (audioPlayer.paused) {
			audioPlayer.play();

			// eslint-disable-next-line no-undef
			Analytics.track('TextToSpeechClicked', {
				lesson_title: lessonTitle,
				user_name: Liferay.ThemeDisplay.getUserName(),
			});

			listenToLesson.classList.add('hide');
			audioPlayerContainer.classList.remove('hide');
			playPauseCaret.classList.remove('caret-right');
			playPauseCaret.classList.add('caret-pause');
		}
		else {
			audioPlayer.pause();
			playPauseCaret.classList.remove('caret-pause');
			playPauseCaret.classList.add('caret-right');
		}
	};
});
progressBarRange.addEventListener('input', () => {
	audioPlayer.currentTime = progressBarRange.value;
});
progressBarRange.onclick = (event) => {
	audioPlayer.currentTime =
		(event.offsetX / progressBarRange.offsetWidth) * audioPlayer.duration;
};

fetchAndPlayAudio(
	document
		.querySelector('.speech-voice li.selected')
		?.getAttribute('value') || 'Charon'
);
toggleSelect(toggleSpeedSelect, audioSpeedSelect);
toggleSelect(toggleSpeechVoiceSelect, speechVoice);
