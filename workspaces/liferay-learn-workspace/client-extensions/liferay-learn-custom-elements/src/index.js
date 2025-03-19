/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */
/* global Liferay */

import { ClayIconSpriteContext } from "@clayui/icon";
import Fragment from "react";
import React, { createElement } from "react";
import { createRoot } from "react-dom/client";

import ArticleNavigation from "./components/ArticleNavigation";
import CertificationList from './components/Certification/CertificationList';
import CertificationsDetails from "./components/Certification/CertificationsDetails";
import CourseBanner from "./components/Course/CourseBanner";
import CourseFirstLesson from "./components/Course/CourseFirstLesson";
import CourseView from "./components/Course/CourseView";
import CoursesList from "./components/Course/CoursesList";
import Duration from "./components/Duration";
import Enroll from "./components/Enroll";
import ExerciseView from "./components/Quiz/ExerciseView";
import LandingPageView from "./components/LandingPageView";
import LearningPathSteps from "./components/LearningPath/LearningPathSteps";
import LearningPathsList from "./components/LearningPath/LearningPathsList";
import LessonNavigation from "./components/Lesson/LessonNavigation";
import LessonView from "./components/Lesson/LessonView";
import NavigationMenu from "./components/NavigationMenu";
import UserDashboardView from "./components/UserDashboard/UserDashboardView";
import UserProgressReport from "./components/UserProgressReport";
import VerifyAssessmentsView from "./components/Assessments/VerifyAssessmentsView";
import { getChildByAttribute } from "./utils/util";
import "./index.scss";

const COURSE_ENROLL_WATCH_ATTRIBUTES = ["course-id", "learning-path-id"];
const COURSE_VIEW_WATCH_ATTRIBUTES = ["course-id"];
const DASHBOARD_VIEW_WATCH_ATTRIBUTES = ["dashboard-id"];
const DURATION_VIEW_WATCH_ATTRIBUTES = ["asset-id", "asset-type"];
const ELEMENT_ID_ARTICLE_NAVIGATION_MENU =
  "liferay-lms-article-navigation-menu";
const ELEMENT_ID_CERTIFICATION_LIST = "liferay-lms-certification-list";
const ELEMENT_ID_CERTIFICATIONS_DETAILS = "liferay-lms-certifications-details";
const ELEMENT_ID_COURSE_ENROLL = "liferay-lms-course-enroll";
const ELEMENT_ID_COURSE_VIEW = "liferay-lms-course-view";
const ELEMENT_ID_COURSES_LIST = "liferay-lms-courses-list";
const ELEMENT_ID_DASHBOARD_VIEW = "liferay-lms-dashboard-view";
const ELEMENT_ID_DURATION = "liferay-lms-duration";
const ELEMENT_ID_EXERCISE_VIEW = "liferay-lms-exercise-view";
const ELEMENT_ID_LANDINGPAGE_VIEW =
  "liferay-lms-landingpage-view";
const ELEMENT_ID_LEARN_PATHS_LIST = "liferay-lms-learn-paths-list";
const ELEMENT_ID_LEARNING_PATH_ENROLL = "liferay-lms-learning-path-enroll";
const ELEMENT_ID_LEARNING_PATH_STEPS = "liferay-lms-learning-path-steps";
const ELEMENT_ID_LESSON_NAVIGATION = "liferay-lms-lesson-navigation";
const ELEMENT_ID_LESSON_ONE = "liferay-lms-course-lesson-one-link";
const ELEMENT_ID_LESSON_VIEW = "liferay-lms-lesson-view";
const ELEMENT_ID_LMS_COURSE_BANNER = "liferay-lms-course-banner";
const ELEMENT_ID_NAVIGATION_MENU = "liferay-lms-navigation-menu";
const ELEMENT_ID_PROGRESS_REPORT = "liferay-lms-user-progress-report";
const ELEMENT_ID_VERIFY_ASSESSMENTS_VIEW = "liferay-lms-verify-assessments-view";
const EXERCISE_VIEW_WATCH_ATTRIBUTES = ["exercise-id"];
const LESSON_NAVIGATION_WATCH_ATTRIBUTES = [];
const LESSON_VIEW_WATCH_ATTRIBUTES = ["lesson-id"];
const MODULE_VIEW_WATCH_ATTRIBUTES = ["module-id"];

class CertificationDetailsComponent extends HTMLElement {
  static get observedAttributes() {
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
  }
  renderComponent(
      page = this.getAttribute('page') || 1,
      pageSize=this.getAttribute('page-size') || 3,
      paging = this.getAttribute('paging') || false,
      durationFormat = this.getAttribute("duration-format")) {
      if ( this.root) {
          this.root.render(
              <ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
                  <CertificationsDetails></CertificationsDetails>
              </ClayIconSpriteContext.Provider>);
      }
  }
  disconnectedCallback() {
      if (this.root) {
          this.root.unmount();
          this.root = null;
      }
  }
}

class CourseViewComponent extends HTMLElement {
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
    if (COURSE_VIEW_WATCH_ATTRIBUTES.includes(name) && oldValue !== newValue) {
      this.renderComponent(newValue);
    }
  }

  renderComponent(moduleId = this.getAttribute("module-id")) {
    if (this.root) {
      const height = this.getAttribute("height") || "100vh";
      const videoHeight = this.getAttribute("video-height") || "500px";
      const videoWidth = this.getAttribute("video-width") || "100%";
      const courseId = this.getAttribute("course-id");
      this.root.render(
        <ClayIconSpriteContext.Provider
          key={courseId}
          value={Liferay.Icons.spritemap}
        >
          <CourseView
            courseId={courseId}
            height={height}
            key={courseId}
            videoHeight={videoHeight}
            videoWidth={videoWidth}
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
class LessonViewComponent extends HTMLElement {
  static get observedAttributes() {
    return LESSON_VIEW_WATCH_ATTRIBUTES;
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
    if (LESSON_VIEW_WATCH_ATTRIBUTES.includes(name) && oldValue !== newValue) {
      this.renderComponent(newValue);
    }
  }

  renderComponent(lessonId = this.getAttribute("lesson-id")) {
    if (this.root) {
      const height = this.getAttribute("height") || "100vh";
      const videoHeight = this.getAttribute("video-height") || "500px";
      const videoWidth = this.getAttribute("video-width") || "100%";
      this.root.render(
        <ClayIconSpriteContext.Provider
          key={lessonId}
          value={Liferay.Icons.spritemap}
        >
          <LessonView
            height={height}
            key={lessonId}
            lessonId={lessonId}
            videoHeight={videoHeight}
            videoWidth={videoWidth}
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
    exerciseId = this.getAttribute("exercise-id"),
    height = this.getAttribute("height"),
    enableBackButton = this.getAttribute("enable-back-button") || false,
    educationPageUrl = this.getAttribute("education-page-url"),
    badgePageUrl = this.getAttribute("badge-page-url")
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
    page = this.getAttribute("page") || 1,
    pageSize = this.getAttribute("page-size") || 3,
    paging = this.getAttribute("paging") || false,
    durationFormat = this.getAttribute("duration-format")
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
      )
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
    page = this.getAttribute("page") || 1,
    pageSize = this.getAttribute("page-size") || 3,
    paging = this.getAttribute("paging") || false,
    durationFormat = this.getAttribute("duration-format")
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
    page = this.getAttribute("page") || 1,
    pageSize = this.getAttribute("page-size") || 3,
    paging = this.getAttribute("paging") || false,
    durationFormat = this.getAttribute("duration-format")
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

class LearningPathEnrollComponent extends HTMLElement {
  static get observedAttributes() {
    return COURSE_ENROLL_WATCH_ATTRIBUTES;
  }

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.root = null;
  }

  connectedCallback() {
    if (!this.root) {
      this.root = createRoot(this.shadow);
      this.renderComponent();
    }
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
    learningPathId = this.getAttribute("asset-id"),
    viewMode = this.getAttribute("view-mode")
  ) {
    if (this.root) {
      const childrenArray = Array.from(this.childNodes);

      const children = childrenArray.map((child, index) => {
        return (
          <Fragment key={index}>
            {createElement("div", {
              dangerouslySetInnerHTML: { __html: child.outerHTML },
            })}
          </Fragment>
        );
      });

      const slottedAssetId = getChildByAttribute(
        this,
        "data-slot-name",
        "asset-id"
      );

      learningPathId =
        slottedAssetId === null ||
        slottedAssetId.textContent === null ||
        !slottedAssetId.textContent.length
          ? learningPathId
          : slottedAssetId.textContent;

      this.root.render(
        <ClayIconSpriteContext.Provider
          key={learningPathId}
          value={Liferay.Icons.spritemap}
        >
          <Enroll
            children={viewMode != "view" ? children : null}
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

class CourseEnrollComponent extends HTMLElement {
  static get observedAttributes() {
    return COURSE_ENROLL_WATCH_ATTRIBUTES;
  }

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.root = null;
  }

  connectedCallback() {
    if (!this.root) {
      this.root = createRoot(this.shadow);
      this.renderComponent();
    }
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
    courseId = this.getAttribute("asset-id"),
    viewMode = this.getAttribute("view-mode")
  ) {
    if (this.root) {
      const childrenArray = Array.from(this.childNodes);

      const children = childrenArray.map((child, index) => {
        return (
          <Fragment key={index}>
            {createElement("div", {
              dangerouslySetInnerHTML: { __html: child.outerHTML },
            })}
          </Fragment>
        );
      });

      const slottedAssetId = getChildByAttribute(
        this,
        "data-slot-name",
        "asset-id"
      );

      courseId =
        slottedAssetId === null ||
        slottedAssetId.textContent === null ||
        !slottedAssetId.textContent.length
          ? courseId
          : slottedAssetId.textContent;

      this.root.render(
        <ClayIconSpriteContext.Provider
          key={courseId}
          value={Liferay.Icons.spritemap}
        >
          <Enroll
            children={viewMode != "view" ? children : null}
            courseId={courseId}
            key={courseId}
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

class UserProgressReportComponent extends HTMLElement {
  static get observedAttributes() {
    return COURSE_ENROLL_WATCH_ATTRIBUTES;
  }

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });

    this.root = null;
  }

  connectedCallback() {
    if (!this.root) {
      this.root = createRoot(this.shadow);

      this.renderComponent();
    }
  }

  updateShadowDOM(styles) {
    // Create a new CSSStyleSheet

    const styleSheet = new CSSStyleSheet();
    styleSheet.replaceSync(styles);

    // Apply styles to Shadow DOM

    this.shadow.adoptedStyleSheets = [styleSheet];
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
    assetId = this.getAttribute("asset-id"),
    assetProgress = this.getAttribute("asset-progress"),
    assetType = this.getAttribute("asset-type"),
    viewMode = this.getAttribute("view-mode")
  ) {
    if (this.root) {
      const childrenArray = Array.from(this.childNodes);

      const children = childrenArray.map((child, index) => {
        return (
          <Fragment key={index}>
            {createElement("div", {
              dangerouslySetInnerHTML: { __html: child.outerHTML },
            })}
          </Fragment>
        );
      });

      const slottedAssetId = getChildByAttribute(
        this,
        "data-slot-name",
        "asset-id"
      );
      const slottedAssetType = getChildByAttribute(
        this,
        "data-slot-name",
        "asset-type"
      );
      const slottedProgress = getChildByAttribute(
        this,
        "data-slot-name",
        "asset-progress"
      );

      assetId =
        slottedAssetId === null ||
        slottedAssetId.textContent === null ||
        !slottedAssetId.textContent.length
          ? assetId
          : slottedAssetId.textContent;
      assetProgress =
        slottedProgress === null ||
        slottedProgress.textContent === null ||
        !slottedProgress.textContent.length
          ? assetProgress
          : slottedProgress.textContent;
      assetType =
        slottedAssetType === null ||
        slottedAssetType.textContent === null ||
        !slottedAssetType.textContent.length
          ? assetType
          : slottedAssetType.textContent;

      this.root.render(
        <ClayIconSpriteContext.Provider
          key={assetId}
          value={Liferay.Icons.spritemap}
        >
          <UserProgressReport
            assetId={assetId}
            assetProgress={assetProgress}
            assetType={assetType}
            children={children}
            key={assetId}
            viewMode={viewMode}
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
    assetId = this.getAttribute("asset-id"),
    assetType = this.getAttribute("asset-type"),
    format = this.getAttribute("format")
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

class CourseLessonOneLinkComponent extends HTMLElement {
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
    assetId = this.getAttribute("asset-id"),
    linkTitle = this.getAttribute("link-title")
  ) {
    if (this.root) {
      this.root.render(
        <ClayIconSpriteContext.Provider
          key={assetId}
          value={Liferay.Icons.spritemap}
        >
          <CourseFirstLesson
            assetId={assetId}
            key={assetId}
            linkTitle={linkTitle}
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
    assetId = this.getAttribute("asset-id"),
    assetType = this.getAttribute("asset-type"),
    navigationMenuType = this.getAttribute("navigation-menu-type"),
    moduleTextLabel = this.getAttribute("module-label")
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
    selector = this.getAttribute("selector"),
    containerId = this.getAttribute("container-id")
  ) {
    if (this.root) {
      this.root.render(
        <ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
          <ArticleNavigation containerId={containerId} selector={selector} />
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
    upNextLabel = this.getAttribute("up-next-label"),
    linkPrefix = this.getAttribute("link-prefix")
  ) {
    if (this.root) {
      this.root.render(
        <ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
          <LessonNavigation linkPrefix={linkPrefix} upNextLabel={upNextLabel} />
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
    if (COURSE_VIEW_WATCH_ATTRIBUTES.includes(name) && oldValue !== newValue) {
      this.renderComponent(newValue);
    }
  }

  renderComponent(
    assetId = this.getAttribute("assetId"),
    assetType = this.getAttribute("assetType")
  ) {
    if (this.root) {
      this.root.render(
        <ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
          <CourseBanner assetId={assetId} assetType={assetType}></CourseBanner>
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

class LearningPathStepsComponentListComponent extends HTMLElement {
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

  renderComponent(learningPathId = this.getAttribute("asset-id")) {
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
    const moduleId = this.getAttribute("module-id");

    if (
      DASHBOARD_VIEW_WATCH_ATTRIBUTES.includes(name) &&
      oldValue !== newValue
    ) {
      if (name === "module-id") {
        this.renderComponent(newValue, moduleId);
      }
    }
  }
  renderComponent(dashboardId = this.getAttribute("module-id")) {
    if (this.root) {
      this.root.render(
        <ClayIconSpriteContext.Provider
          key={dashboardId}
          value={Liferay.Icons.spritemap}
        >
          <UserDashboardView key={`${dashboardId}`} moduleId={dashboardId} />
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
  renderComponent(type = this.getAttribute("type")) {
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

class VerifyAssessmentsViewComponent extends HTMLElement {
  static get observedAttributes() {
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
  }
  renderComponent() {
      if ( this.root) {
          this.root.render(
              <ClayIconSpriteContext.Provider value={Liferay.Icons.spritemap}>
                  <VerifyAssessmentsView />
              </ClayIconSpriteContext.Provider>);
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

if (!customElements.get(ELEMENT_ID_COURSE_VIEW)) {
  customElements.define(ELEMENT_ID_COURSE_VIEW, CourseViewComponent);
}

if (!customElements.get(ELEMENT_ID_LESSON_VIEW)) {
  customElements.define(ELEMENT_ID_LESSON_VIEW, LessonViewComponent);
}

if (!customElements.get(ELEMENT_ID_COURSE_ENROLL)) {
  customElements.define(ELEMENT_ID_COURSE_ENROLL, CourseEnrollComponent);
}

if (!customElements.get(ELEMENT_ID_LEARNING_PATH_ENROLL)) {
  customElements.define(
    ELEMENT_ID_LEARNING_PATH_ENROLL,
    LearningPathEnrollComponent
  );
}

if (!customElements.get(ELEMENT_ID_EXERCISE_VIEW)) {
  customElements.define(ELEMENT_ID_EXERCISE_VIEW, ExerciseViewComponent);
}

if (!customElements.get(ELEMENT_ID_PROGRESS_REPORT)) {
  customElements.define(
    ELEMENT_ID_PROGRESS_REPORT,
    UserProgressReportComponent
  );
}

if (!customElements.get(ELEMENT_ID_DURATION)) {
  customElements.define(ELEMENT_ID_DURATION, DurationComponent);
}

if (!customElements.get(ELEMENT_ID_LESSON_ONE)) {
  customElements.define(ELEMENT_ID_LESSON_ONE, CourseLessonOneLinkComponent);
}

if (!customElements.get(ELEMENT_ID_NAVIGATION_MENU)) {
  customElements.define(ELEMENT_ID_NAVIGATION_MENU, NavigationMenuComponent);
}

if (!customElements.get(ELEMENT_ID_ARTICLE_NAVIGATION_MENU)) {
  customElements.define(
    ELEMENT_ID_ARTICLE_NAVIGATION_MENU,
    ArticleNavigationComponent
  );
}

if (!customElements.get(ELEMENT_ID_LESSON_NAVIGATION)) {
  customElements.define(
    ELEMENT_ID_LESSON_NAVIGATION,
    LessonNavigationComponent
  );
}

if (!customElements.get(ELEMENT_ID_LEARNING_PATH_STEPS)) {
  customElements.define(
    ELEMENT_ID_LEARNING_PATH_STEPS,
    LearningPathStepsComponentListComponent
  );
}

if (!customElements.get(ELEMENT_ID_CERTIFICATIONS_DETAILS)) {
  customElements.define(ELEMENT_ID_CERTIFICATIONS_DETAILS, CertificationDetailsComponent);
}

if (!customElements.get(ELEMENT_ID_COURSES_LIST)) {
  customElements.define(ELEMENT_ID_COURSES_LIST, CoursesListComponent);
}

if (!customElements.get(ELEMENT_ID_LEARN_PATHS_LIST)) {
  customElements.define(
    ELEMENT_ID_LEARN_PATHS_LIST,
    LearningPathsListComponent
  );
}

if (!customElements.get(ELEMENT_ID_LMS_COURSE_BANNER)) {
  customElements.define(ELEMENT_ID_LMS_COURSE_BANNER, CourseBannerComponent);
}

if (!customElements.get(ELEMENT_ID_DASHBOARD_VIEW)) {
  customElements.define(ELEMENT_ID_DASHBOARD_VIEW, UserDashboardViewComponent);
}

if (!customElements.get(ELEMENT_ID_LANDINGPAGE_VIEW)) {
  customElements.define(
    ELEMENT_ID_LANDINGPAGE_VIEW,
    LandingPageViewComponent
  );
}

if (!customElements.get(ELEMENT_ID_CERTIFICATION_LIST)) {
  customElements.define(
    ELEMENT_ID_CERTIFICATION_LIST,
    CertificationListComponent);
}

if (!customElements.get(ELEMENT_ID_VERIFY_ASSESSMENTS_VIEW)) {
  customElements.define(
    ELEMENT_ID_VERIFY_ASSESSMENTS_VIEW,
    VerifyAssessmentsViewComponent);
}