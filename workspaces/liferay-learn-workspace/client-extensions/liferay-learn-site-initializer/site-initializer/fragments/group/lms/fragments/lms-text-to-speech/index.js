/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const audioPlayer = document.querySelector(".audio-player");
const audioPlayerContainer = document.querySelector(".audio-player-container");
const audioSource = document.querySelector(".audio-source");
const audioSpeedSelect = document.querySelector('.audio-speed-select');

const audioSpeedSelectItems = audioSpeedSelect.querySelectorAll('.audio-speed-select li');
const currentTime = document.querySelector(".current-time");
const duration = document.querySelector(".duration");
const lessonId = new URL(window.location.href).pathname.split('/').pop();
const lessonTitle = document.querySelector('.component-html h1').textContent;
const listenToLesson = document.querySelector(".listen-to-lesson");
const loadingSpinner = document.getElementById('loadingSpinner');
const playPauseButton = document.querySelectorAll(".play-pause-button");
const playPauseCaret = document.querySelector('.play-pause-caret');
const progressBarRange = document.querySelector(".progress-bar-range");
const speechVoice = document.querySelector('.speech-voice');

const speechVoiceItems = speechVoice.querySelectorAll('.speech-voice li');
const textToSpeechPlayerContent = document.querySelector('.text-to-speech-player-content');
const toggleSpeedSelect = document.querySelector('.toggle-speed-select');
const toggleSpeechVoiceSelect = document.querySelector('.toggle-speech-voice-select');
const url = Liferay.OAuth2._userAgentApplications["liferay-learn-etc-spring-boot-oauth-application-user-agent"].homePageURL;

let voiceType = document.querySelector('.speech-voice li.selected')?.getAttribute('value') || 'B';

const fetchAndPlayAudio = async (voiceType) => {
	try {
		textToSpeechPlayerContent.classList.add('hide');
				loadingSpinner.classList.remove('hide');

		const response = await Liferay.Util.fetch(
			`${url}/learn/lesson/${lessonId}/audio/base64?languageCode=en-US&voiceName=en-US-Standard-${voiceType}`
		);
		const data = await response.json();

		const base64Audio = data.audioContent;

		if (base64Audio) {
			audioSource.src =  "data:audio/mp3;base64," + base64Audio;
			audioPlayer.load();
		} else {
			console.error("No audio content returned.");
		}
	} catch (error) {
		console.error("Erro to fetch audio:", error);
	} finally {
		loadingSpinner.classList.add('hide');
		textToSpeechPlayerContent.classList.remove('hide');
	}
}

const formatZero = (n) => (n < 10 ? "0" + n : n);

const toggleSelect = (toggleElement, dropdownElement) => {
    toggleElement.addEventListener('click', (event) => {
        event.preventDefault();
        dropdownElement.classList.toggle('hide');
        document.addEventListener('click', (event) => {
            if (!toggleElement.contains(event.target) && !dropdownElement.contains(event.target)) {
                dropdownElement.classList.add('hide');
            }
        });
    });
}

audioPlayer.addEventListener('loadedmetadata', () => {
    duration.textContent = `${Math.floor(audioPlayer.duration / 60)}:${Math.floor(audioPlayer.duration % 60).toString().padStart(2, '0')}`
});

audioPlayer.addEventListener('timeupdate', () => {
    const durationFormatted = isNaN(audioPlayer.duration) ? 0 : audioPlayer.duration;

    currentTime.textContent = `${Math.floor(audioPlayer.currentTime / 60)}:${formatZero(Math.floor(audioPlayer.currentTime % 60))}`;

    progressBarRange.style.setProperty('--progress',
        (audioPlayer.currentTime / durationFormatted) * 100 + '%');

    if (!isNaN(durationFormatted)) {
        progressBarRange.max = Math.floor(durationFormatted);
        progressBarRange.value = Math.floor(audioPlayer.currentTime);
    }
});

audioSpeedSelectItems.forEach(item => {
    item.addEventListener('click', () => {
        audioPlayer.playbackRate = parseFloat(item.getAttribute('value'));
        audioSpeedSelectItems.forEach(li => li.classList.remove('selected'));
        item.classList.add('selected');
    });
});

speechVoiceItems.forEach(item => {
	item.addEventListener('click', () => {
		voiceType = item.getAttribute('value');
		speechVoiceItems.forEach(li => li.classList.remove('selected'));
		item.classList.add('selected');

		fetchAndPlayAudio(voiceType);
		audioPlayer.pause();
        playPauseCaret.classList.remove('caret-pause');
        playPauseCaret.classList.add('caret-right');
	});
});

playPauseButton.forEach((item) => {
    item.onclick = () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            // eslint-disable-next-line no-undef
            Analytics.track('TextToSpeechClicked', {
                lesson_title: lessonTitle
            });
            listenToLesson.classList.add('hide');
            audioPlayerContainer.classList.remove('hide');
            playPauseCaret.classList.remove('caret-right');
            playPauseCaret.classList.add('caret-pause');
        } else {
            audioPlayer.pause();
            playPauseCaret.classList.remove('caret-pause');
            playPauseCaret.classList.add('caret-right');
        }
    }
});

progressBarRange.addEventListener('input', () => {
    audioPlayer.currentTime = progressBarRange.value;
});

progressBarRange.onclick = (event) => {
    audioPlayer.currentTime = (event.offsetX / progressBarRange.offsetWidth) * audioPlayer.duration;
};

fetchAndPlayAudio(voiceType);
toggleSelect(toggleSpeedSelect, audioSpeedSelect, 'closeRateSelectOutside');
toggleSelect(toggleSpeechVoiceSelect, speechVoice, 'closeSpeechVoicetOutside');