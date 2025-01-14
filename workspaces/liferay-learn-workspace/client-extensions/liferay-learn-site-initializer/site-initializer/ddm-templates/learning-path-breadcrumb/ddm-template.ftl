<script type="module">
  import "lms";
  document.addEventListener("DOMContentLoaded", function() {
    const title = document.querySelector(".title");
    var h1Text = document.getElementsByTagName('title')[0].textContent;
    title.innerHTML = h1Text;
  });
</script>
<#if (ObjectField_name.getData())??>
  <#assign
    learningPathStepContentName=ObjectField_name.getData() />
  <#if (ObjectEntry_objectEntryId.getData())??>
    <#assign
      learningPathStepContentId=restClient.get("/c/learningpaths/${ObjectEntry_objectEntryId.getData()}?fields=name") />
    <h1>
      ${ObjectEntry_objectEntryId.getData()}
    </h1>
    <#if template_id?has_content>
      ${template_id}
    </#if>
    <div class="breadcrumb breadcrumb-lp">
      <a class="breadcrumb-home" href="/education-lms/index">Education&nbsp/</a>&nbsp
      <a href="/education-lms/learning-paths">Learning Path&nbsp/</a>&nbsp
      <a href="/l/${ObjectEntry_objectEntryId.getData()}"> &nbsp/</a>&nbsp
      <span class="breadcrumb-text-truncate title"> </span>
    </div>
  </#if>
</#if>
<style>
  .breadcrumb {
    align-items: baseline;
  }

  .breadcrumb-home {
    align-items: baseline;
    display: flex;
  }

  .breadcrumb-home::before {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' class='lexicon-icon lexicon-icon-home-full' role='presentation' viewBox='0 0 512 512' fill='%23999AA3'%3E%3Cpath class='lexicon-icon-outline' d='M233.6,22.4c12.5-12.5,32.3-12.5,44.8,0l182.9,182.8c12,12,18.7,28.3,18.7,45.3V512H320V384c0-35.3-28.7-64-64-64s-64,28.7-64,64v128H32V250.5c0-17,6.7-33.3,18.7-45.3L233.6,22.4z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover;
    color: #6C6C75;
    content: '';
    display: inline-block;
    height: 16px;
    margin-right: 4px;
    vertical-align: middle;
    width: 16px;
  }

  .breadcrumb-lp {
    color: #6C6C75 !important;
    font-family: Source Sans 3 !important;

    span {
      font-weight: 600;
    }
  }
</style>