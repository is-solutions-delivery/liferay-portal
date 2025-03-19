/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* global Liferay */

export const config = {
	agentOauthAppId: 'liferay-lms-etc-node-oauth-application-user-agent',

	agentOauthSpringAppId:
		'liferay-learn-etc-spring-boot-oauth-application-user-agent',

	modulesViewComponent: 'liferay-lms-modules-view',

	lessonsViewComponent: 'liferay-lms-lessons-view',

	lessonsCompactViewComponent: 'liferay-lms-lessons-compact-view',

	courseEndpoint: '/o/c/courses/',

	moduleEndpoint: '/o/c/modules/',

	lessonEndpoint: '/o/c/lessons/',

	enrollmentEndpoint: '/o/c/enrollments/',

	menuEndPoint: '/menu/items',

	navigationMenuEndPoint: '/menu/',

	examResultEndPoint: '/o/c/p2s3examresults/',

	exerciseEndPoint: '/quizes/',

	progressEndPoint: '/progress/',

	durationEndPoint: '/duration/',

	utilsEndPoint: '/utils/',

	userUtilsEndpoint: '/user/',

	userBadgeEndpoint: '/o/c/userbadges/',

	badgeEndpoint: '/o/c/badges/',

	quizEndpoint: '/o/c/quizes/',

	certificationEndpoint: '/o/c/p2s3certifications/',

	assessmentsEndpoint: '/o/c/p2s3assessments/',

	learningPathsEndpoint: '/o/c/learningpaths/',

	faqTopicsEndpoint: '/o/c/p2s3faqtopics',
};

export const ViewSelectedType = Object.freeze({
	Lesson: 'lesson',
	Exercise: 'exercise',
});
