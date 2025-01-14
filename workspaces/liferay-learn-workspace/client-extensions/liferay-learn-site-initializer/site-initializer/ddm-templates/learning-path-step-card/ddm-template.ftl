<#if ObjectField_type.getData()=="Video">
  <#assign stepTypeParam="externalMedia" />
</#if>
<#if ObjectField_type.getData()=="Course">
  <#assign stepTypeParam="stepCourses" />
</#if>
<#if (ObjectEntry_objectEntryId.getData())??>
  <#assign learningPathStepId=ObjectEntry_objectEntryId.getData() />
    <#assign learningPathStepInfo=restClient.get("/c/learningpathsteps/${learningPathStepId}?nestedFields=${stepTypeParam!}") />
      <#if learningPathStepInfo?? && stepTypeParam??>
        <#assign learningPathStepContentId=learningPathStepInfo[stepTypeParam]
          [0].id />
      </#if>
</#if>
<#if ObjectField_type.getData()=="Course" || ObjectField_type.getData()=="Video">
  <a href="/l/${learningPathStepContentId!}" id="step-${learningPathStepContentId!}-link">
    <div class="learn-education__card step-card">
      <h3 class="mt-3">
        ${ObjectField_title.getData()}
      </h3>
      <p class="mb-3">
        ${ObjectField_description.getData()}
      </p>
      <div class="card-tags d-flex mr-2">
        <#if (ObjectEntry_objectEntryId.getData())??>
          <div class="duration step-info-tag">
            <p>
              <liferay-lms-duration asset-id="${ObjectEntry_objectEntryId.getData()}" format="hours" asset-type="learningPathStep"></liferay-lms-duration> hours
            </p>
          </div>
          <div class="progress-tag-${learningPathStepContentId!}"></div>
        </#if>
        <#if (.data_model["ObjectRelationship#C_LearningPath#learningPathSteps_accessType"].getData())??>
          <div class="access-type step-info-tag">
            <p>
              ${.data_model["ObjectRelationship#C_LearningPath#learningPathSteps_accessType"].getData()}
            </p>
          </div>
        </#if>
      </div>
    </div>
  </a>
  <#else>
    <div class="warning-message">
      <div class="alert alert-dismissible alert-warning">
        <span class="alert-indicator"> </span>
        <strong class="lead">Warning:</strong> There is no content.
        <button aria-label="Close" class="close" data-dismiss="alert" type="button">
        </button>
      </div>
    </div>
</#if>
<#if ObjectField_type.getData()=="Course">
  <script type="module">
  //import "lms";
  let firstLesson = await LiferayLMS.getCourseFirstLessonAsync(${learningPathStepContentId});
  const courseLink = document.getElementById(
    `step-${learningPathStepContentId}-link`
  );
  courseLink.href = "/l/" + firstLesson.id;
  let userEnrollments = await LiferayLMS.getUserEnrollmentsAsync();
  let courseId = ${learningPathStepContentId}
  let currentStepEnrollment = userEnrollments.filter((item) => {
    return item.id == courseId;
  })
  const paragraph = document.createElement("p");
  if (currentStepEnrollment) {
    if (currentStepEnrollment[0].finalQuizzesCompleted === true) {
      paragraph.innerText = "Completed";
      paragraph.classList.add("completed-tag");
      document.querySelector(".progress-tag-${learningPathStepContentId}").appendChild(paragraph);
    }
  }
  </script>
</#if>
<style>
  .access-type {
    background-color: #E1E1E4;
  }

  .alert-indicator::before {
    content: '';
    display: inline-block;
    width: 14px;
    height: 14px;
    background-size: contain;
    background-repeat: no-repeat;
    align-items: center;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='lexicon-icon lexicon-icon-warning-full' role='presentation' viewBox='0 0 512 512' fill='%23b95000'%3E%3Cpath class='lexicon-icon-outline' d='M506.3,409.3l-214-353.7c-16.8-30.6-55.8-32.6-72.6,0L5.7,409.3C-8,436.5,5,480,42,480h428C506,480,522.5,436.5,506.3,409.3z M224,392c0-42.5,64-42,64,0C288,433.5,224,434.5,224,392z M288,288c0,42.5-64,40.5-64,0c0-20.4,0-83.6,0-104c0-43,64-43.5,64,0C288,204.4,288,267.6,288,288z'%3E%3C/path%3E%3C/svg%3E");
  }

  .card-tags {
    gap: 0.5rem;
  }

  .completed-tag {
    background-color: #4AAB3B;
    border-radius: 4px;
    color: white;
    display: flex;
    font-size: 13px;
    padding: 6px;
  }

  .completed-tag::after {
    align-items: center;
    background-image: url('data:image/svg+xml;utf8,<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><mask id="mask0_4331_2544" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="1" y="2" width="14" height="12"><path d="M6.02855 13.4238C5.76918 13.4238 5.51605 13.3207 5.33168 13.1363L1.39105 9.19254C0.469179 8.22692 1.9598 6.93942 2.7848 7.79879L5.9848 11.0019L13.1723 2.91129C14.0223 1.95817 15.4942 3.27067 14.6442 4.22067L6.76293 13.0925C6.58168 13.2957 6.32543 13.4144 6.05668 13.4238C6.0473 13.4238 6.03793 13.4238 6.02855 13.4238Z" fill="%236B6C7E"/></mask><g mask="url(%23mask0_4331_2544)"><rect width="16" height="16" fill="white"/></g></svg>');
    background-repeat: no-repeat;
    background-size: contain;
    content: '';
    display: inline-block;
    height: 14px;
    margin-left: 2px;
    width: 14px;
  }

  .duration {
    background-color: #E6EBF5 !important;
  }

  .duration p::before {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg opacity='0.7'%3E%3Cmask id='mask0_2278_5196' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='0' y='0' width='16' height='16'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M13.6562 2.34375C12.1465 0.831299 10.1377 0 8 0C5.8623 0 3.85352 0.831299 2.34375 2.34375C0.831055 3.85315 0 5.86255 0 8C0 10.1375 0.831055 12.1469 2.34375 13.6562C3.85645 15.1687 5.8623 16 8 16C10.1377 16 12.1465 15.1687 13.6562 13.6562C15.1689 12.1438 16 10.1375 16 8C16 5.86255 15.1689 3.85315 13.6562 2.34375ZM8 14C4.69043 14 2 11.3093 2 8C2 4.69067 4.69043 2 8 2C11.3096 2 14 4.69067 14 8C14 11.3093 11.3096 14 8 14ZM6 11C5.87207 11 5.74316 10.95 5.64648 10.8531C5.4502 10.6594 5.4502 10.3406 5.64648 10.1469L7.14648 8.64685C7.05273 8.44995 7 8.2312 7 8C7 7.34692 7.41895 6.79065 8 6.58435V3.5C8 3.22498 8.22461 3 8.5 3C8.77441 3 9 3.22498 9 3.5V6.58435C9.58105 6.79065 10 7.34692 10 8C10 8.82812 9.32812 9.5 8.5 9.5C8.26855 9.5 8.0498 9.4469 7.85254 9.35315L6.35254 10.8531C6.25586 10.95 6.12793 11 6 11Z' fill='%236B6C7E'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_2278_5196)'%3E%3Crect width='16' height='16' fill='%231C3667'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    background-size: cover;
    content: '';
    display: inline-block;
    height: 14px;
    margin-bottom: 2px;
    margin-right: 4px;
    vertical-align: middle;
    width: 14px;
  }

  .inprogress-tag {
    background-color: #E6EBF5;
    border-radius: 4px;
    color: #1C3667;
    font-size: 13px;
    padding: 6px;
  }

  .step-card {
    background-color: #FBFCFE !important;
    border-color: #E7EFFF !important;
    border-radius: 1rem !important;
    border-style: solid;
    border-width: 1px !important;
    margin-bottom: var(--spacer-4, 1.5rem) !important;
    padding: var(--spacer-4, 1.5rem) !important;
    position: relative;
  }

  .step-info-tag {
    border-radius: var(--border-radius-sm) !important;
    color: var(--color-state-info-darken-2, #1C3667);
    height: 28px;
    padding: 4px 8px;
  }

  .step-info-tag p {
    font-size: var(--text-paragraph-sm-font-size);
    line-height: var(--text-paragraph-sm-line-height);
  }

  .warning-message {
    padding-top: 50px;

    .alert-warning {
      display: flex;
    }
  }
</style>