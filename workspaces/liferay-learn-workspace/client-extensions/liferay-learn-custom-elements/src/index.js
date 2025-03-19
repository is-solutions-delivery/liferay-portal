/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

/* global Liferay */

import {ClayIconSpriteContext} from '@clayui/icon';
import React from 'react';
import {createRoot} from 'react-dom/client';

import ArticleNavigation from './components/ArticleNavigation';
import CertificationList from './components/Certification/CertificationList';
import CertificationsDetails from './components/Certification/CertificationsDetails';
import CourseBanner from './components/Course/CourseBanner';
import CoursesList from './components/Course/CoursesList';
import Duration from './components/Duration';
import ExerciseView from './components/Quiz/ExerciseView';
import LandingPageView from './components/LandingPageView';
import LearningPathSteps from './components/LearningPath/LearningPathSteps';
import LearningPathsList from './components/LearningPath/LearningPathsList';
import LessonNavigation from './components/Lesson/LessonNavigation';
import NavigationMenu from './components/NavigationMenu';
import UserDashboardView from './components/UserDashboard/UserDashboardView';
import VerifyAssessmentsView from './components/Assessments/VerifyAssessmentsView';
import './index.scss';

const COURSE_ENROLL_WATCH_ATTRIBUTES = ['course-id', 'learning-path-id'];
const COURSE_VIEW_WATCH_ATTRIBUTES = ['course-id'];
const DASHBOARD_VIEW_WATCH_ATTRIBUTES = ['dashboard-id'];
const DURATION_VIEW_WATCH_ATTRIBUTES = ['asset-id', 'asset-type'];
const ELEMENT_ID_ARTICLE_NAVIGATION_MENU =
	'liferay-lms-article-navigation-menu';
const ELEMENT_ID_CERTIFICATION_LIST = 'liferay-lms-certification-list';
const ELEMENT_ID_CERTIFICATIONS_DETAILS = 'liferay-lms-certifications-details';
const ELEMENT_ID_COURSES_LIST = 'liferay-lms-courses-list';
const ELEMENT_ID_DASHBOARD_VIEW = 'liferay-lms-dashboard-view';
const ELEMENT_ID_DURATION = 'liferay-lms-duration';
const ELEMENT_ID_EXERCISE_VIEW = 'liferay-lms-exercise-view';
const ELEMENT_ID_LANDINGPAGE_VIEW = 'liferay-lms-landingpage-view';
const ELEMENT_ID_LEARN_PATHS_LIST = 'liferay-lms-learn-paths-list';
const ELEMENT_ID_LEARNING_PATH_STEPS = 'liferay-lms-learning-path-steps';
const ELEMENT_ID_LESSON_NAVIGATION = 'liferay-lms-lesson-navigation';
const ELEMENT_ID_LMS_COURSE_BANNER = 'liferay-lms-course-banner';
const ELEMENT_ID_NAVIGATION_MENU = 'liferay-lms-navigation-menu';
const ELEMENT_ID_VERIFY_ASSESSMENTS_VIEW =
	'liferay-lms-verify-assessments-view';
const EXERCISE_VIEW_WATCH_ATTRIBUTES = ['exercise-id'];
const LESSON_NAVIGATION_WATCH_ATTRIBUTES = [];
const MODULE_VIEW_WATCH_ATTRIBUTES = ['module-id'];

class ArticleNavigationComponent extends HTMLElement {
	static get observedAttributes() {
		return COURSE_ENROLL_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (
			COURSE_ENROLL_WATCH_ATTRIBUTES.includes(name) &&
			oldValue !== newValue
		) {
			this.renderComponent(newValue);
		}
	}

	renderComponent(
		selector = this.getAttribute('selector'),
		containerId = this.getAttribute('container-id')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<ArticleNavigation
						containerId={containerId}
						selector={selector}
					/>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
class CertificationDetailsComponent extends HTMLElement {
	static get observedAttributes() {}
	constructor() {
		super();
		this.root = null;
	}
	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}
	attributeChangedCallback(name, oldValue, newValue) {}
	renderComponent(
		page = this.getAttribute('page') || 1,
		pageSize = this.getAttribute('page-size') || 3,
		paging = this.getAttribute('paging') || false,
		durationFormat = this.getAttribute('duration-format')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<CertificationsDetails></CertificationsDetails>
				</ClayIconSpriteContext.Provider>
			);
		}
	}
	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
class CertificationListComponent extends HTMLElement {
	static get observedAttributes() {}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {}

	renderComponent(
		page = this.getAttribute('page') || 1,
		pageSize = this.getAttribute('page-size') || 3,
		paging = this.getAttribute('paging') || false,
		durationFormat = this.getAttribute('duration-format')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<CertificationList
						durationFormat={durationFormat}
						page={page}
						pageSize={pageSize}
						paging={paging}
					></CertificationList>
				</ClayIconSpriteContext.Provider>
			);
		}
	}
}

class CourseBannerComponent extends HTMLElement {
	static get observedAttributes() {
		return COURSE_VIEW_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (
			COURSE_VIEW_WATCH_ATTRIBUTES.includes(name) &&
			oldValue !== newValue
		) {
			this.renderComponent(newValue);
		}
	}

	renderComponent(
		assetId = this.getAttribute('assetId'),
		assetType = this.getAttribute('assetType')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<CourseBanner
						assetId={assetId}
						assetType={assetType}
					></CourseBanner>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
class CoursesListComponent extends HTMLElement {
	static get observedAttributes() {}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {}

	renderComponent(
		page = this.getAttribute('page') || 1,
		pageSize = this.getAttribute('page-size') || 3,
		paging = this.getAttribute('paging') || false,
		durationFormat = this.getAttribute('duration-format')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<CoursesList
						durationFormat={durationFormat}
						page={page}
						pageSize={pageSize}
						paging={paging}
					></CoursesList>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

class DurationComponent extends HTMLElement {
	static get observedAttributes() {
		return DURATION_VIEW_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (
			COURSE_ENROLL_WATCH_ATTRIBUTES.includes(name) &&
			oldValue !== newValue
		) {
			this.renderComponent(newValue);
		}
	}

	renderComponent(
		assetId = this.getAttribute('asset-id'),
		assetType = this.getAttribute('asset-type'),
		format = this.getAttribute('format')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider
					key={assetId}
					value={Liferay.Icons.spritemap}
				>
					<Duration
						assetId={assetId}
						assetType={assetType}
						format={format}
						key={assetId}
					/>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

class ExerciseViewComponent extends HTMLElement {
	static get observedAttributes() {
		return COURSE_ENROLL_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (
			EXERCISE_VIEW_WATCH_ATTRIBUTES.includes(name) &&
			oldValue !== newValue
		) {
			this.renderComponent(newValue);
		}
	}

	renderComponent(
		exerciseId = this.getAttribute('exercise-id'),
		height = this.getAttribute('height'),
		enableBackButton = this.getAttribute('enable-back-button') || false,
		educationPageUrl = this.getAttribute('education-page-url'),
		badgePageUrl = this.getAttribute('badge-page-url')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider
					key={exerciseId}
					value={Liferay.Icons.spritemap}
				>
					<ExerciseView
						badgePageUrl={badgePageUrl}
						educationPageUrl={educationPageUrl}
						enableBackButton={enableBackButton}
						exerciseId={exerciseId}
						height={height}
						key={exerciseId}
					/>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

class LandingPageViewComponent extends HTMLElement {
	constructor() {
		super();
		this.root = null;
	}
	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}
	renderComponent(type = this.getAttribute('type')) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<LandingPageView type={type} />
				</ClayIconSpriteContext.Provider>
			);
		}
	}
	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
class LearningPathsListComponent extends HTMLElement {
	static get observedAttributes() {}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {}

	renderComponent(
		page = this.getAttribute('page') || 1,
		pageSize = this.getAttribute('page-size') || 3,
		paging = this.getAttribute('paging') || false,
		durationFormat = this.getAttribute('duration-format')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<LearningPathsList
						durationFormat={durationFormat}
						page={page}
						pageSize={pageSize}
						paging={paging}
					></LearningPathsList>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

class LearningPathStepsListComponent extends HTMLElement {
	static get observedAttributes() {
		return MODULE_VIEW_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	renderComponent(learningPathId = this.getAttribute('asset-id')) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider
					key={learningPathId}
					value={Liferay.Icons.spritemap}
				>
					<LearningPathSteps
						key={learningPathId}
						learningPathId={learningPathId}
					/>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

class LessonNavigationComponent extends HTMLElement {
	static get observedAttributes() {
		return LESSON_NAVIGATION_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (
			LESSON_NAVIGATION_WATCH_ATTRIBUTES.includes(name) &&
			oldValue !== newValue
		) {
			this.renderComponent(newValue);
		}
	}

	renderComponent(
		upNextLabel = this.getAttribute('up-next-label'),
		linkPrefix = this.getAttribute('link-prefix')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<LessonNavigation
						linkPrefix={linkPrefix}
						upNextLabel={upNextLabel}
					/>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

class NavigationMenuComponent extends HTMLElement {
	static get observedAttributes() {
		return COURSE_ENROLL_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (
			COURSE_ENROLL_WATCH_ATTRIBUTES.includes(name) &&
			oldValue !== newValue
		) {
			this.renderComponent(newValue);
		}
	}

	renderComponent(
		assetId = this.getAttribute('asset-id'),
		assetType = this.getAttribute('asset-type'),
		navigationMenuType = this.getAttribute('navigation-menu-type'),
		moduleTextLabel = this.getAttribute('module-label')
	) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider
					key={assetId}
					value={Liferay.Icons.spritemap}
				>
					<NavigationMenu
						assetId={assetId}
						assetType={assetType}
						key={assetId}
						moduleTextLabel={moduleTextLabel}
						navigationMenuType={navigationMenuType}
					/>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

class UserDashboardViewComponent extends HTMLElement {
	static get observedAttributes() {
		return DASHBOARD_VIEW_WATCH_ATTRIBUTES;
	}

	constructor() {
		super();
		this.root = null;
	}

	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		const moduleId = this.getAttribute('module-id');

		if (
			DASHBOARD_VIEW_WATCH_ATTRIBUTES.includes(name) &&
			oldValue !== newValue
		) {
			if (name === 'module-id') {
				this.renderComponent(newValue, moduleId);
			}
		}
	}
	renderComponent(dashboardId = this.getAttribute('module-id')) {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider
					key={dashboardId}
					value={Liferay.Icons.spritemap}
				>
					<UserDashboardView
						key={`${dashboardId}`}
						moduleId={dashboardId}
					/>
				</ClayIconSpriteContext.Provider>
			);
		}
	}

	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
class VerifyAssessmentsViewComponent extends HTMLElement {
	static get observedAttributes() {}
	constructor() {
		super();
		this.root = null;
	}
	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);
		}
		this.renderComponent();
	}
	attributeChangedCallback(name, oldValue, newValue) {}
	renderComponent() {
		if (this.root) {
			this.root.render(
				<ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
					<VerifyAssessmentsView />
				</ClayIconSpriteContext.Provider>
			);
		}
	}
	disconnectedCallback() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}

if (!customElements.get(ELEMENT_ID_ARTICLE_NAVIGATION_MENU)) {
	customElements.define(
		ELEMENT_ID_ARTICLE_NAVIGATION_MENU,
		ArticleNavigationComponent
	);
}

if (!customElements.get(ELEMENT_ID_CERTIFICATIONS_DETAILS)) {
	customElements.define(
		ELEMENT_ID_CERTIFICATIONS_DETAILS,
		CertificationDetailsComponent
	);
}

if (!customElements.get(ELEMENT_ID_CERTIFICATION_LIST)) {
	customElements.define(
		ELEMENT_ID_CERTIFICATION_LIST,
		CertificationListComponent
	);
}

if (!customElements.get(ELEMENT_ID_LMS_COURSE_BANNER)) {
	customElements.define(ELEMENT_ID_LMS_COURSE_BANNER, CourseBannerComponent);
}

if (!customElements.get(ELEMENT_ID_COURSES_LIST)) {
	customElements.define(ELEMENT_ID_COURSES_LIST, CoursesListComponent);
}

if (!customElements.get(ELEMENT_ID_DURATION)) {
	customElements.define(ELEMENT_ID_DURATION, DurationComponent);
}

if (!customElements.get(ELEMENT_ID_EXERCISE_VIEW)) {
	customElements.define(ELEMENT_ID_EXERCISE_VIEW, ExerciseViewComponent);
}

if (!customElements.get(ELEMENT_ID_LANDINGPAGE_VIEW)) {
	customElements.define(
		ELEMENT_ID_LANDINGPAGE_VIEW,
		LandingPageViewComponent
	);
}

if (!customElements.get(ELEMENT_ID_LEARN_PATHS_LIST)) {
	customElements.define(
		ELEMENT_ID_LEARN_PATHS_LIST,
		LearningPathsListComponent
	);
}

if (!customElements.get(ELEMENT_ID_LEARNING_PATH_STEPS)) {
	customElements.define(
		ELEMENT_ID_LEARNING_PATH_STEPS,
		LearningPathStepsListComponent
	);
}

if (!customElements.get(ELEMENT_ID_LESSON_NAVIGATION)) {
	customElements.define(
		ELEMENT_ID_LESSON_NAVIGATION,
		LessonNavigationComponent
	);
}

if (!customElements.get(ELEMENT_ID_NAVIGATION_MENU)) {
	customElements.define(ELEMENT_ID_NAVIGATION_MENU, NavigationMenuComponent);
}

if (!customElements.get(ELEMENT_ID_DASHBOARD_VIEW)) {
	customElements.define(
		ELEMENT_ID_DASHBOARD_VIEW,
		UserDashboardViewComponent
	);
}

if (!customElements.get(ELEMENT_ID_VERIFY_ASSESSMENTS_VIEW)) {
	customElements.define(
		ELEMENT_ID_VERIFY_ASSESSMENTS_VIEW,
		VerifyAssessmentsViewComponent
	);
}
