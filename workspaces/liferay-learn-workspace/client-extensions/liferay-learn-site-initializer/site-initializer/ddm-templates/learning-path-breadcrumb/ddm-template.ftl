<script type="module">
	import "lms";
	document.addEventListener("DOMContentLoaded", function() {
		const title = document.querySelector(".title");
		var h1Text = document.getElementsByTagName('title')[0].textContent;
		
		title.innerHTML = h1Text;
	});
</script>

<#if (ObjectEntry_objectEntryId.getData())??>
	<#assign learningPathId=restClient
		.get("/c/externalmedias/${ObjectEntry_objectEntryId.getData()}?fields=r_externalMedia_c_learningPathStep&nestedFields=learningPath%2C%20learningPathStep")
		.r_externalMedia_c_learningPathStep
		.r_learningPathSteps_c_learningPathId
		
		learningPathName=restClient.get("/c/learningpaths/${learningPathId}?fields=name").name />

	<div class="breadcrumb breadcrumb-lp">
		<a class="breadcrumb-home" href="/education-lms/index">Education&nbsp/</a>&nbsp
		<a href="/education-lms/learning-paths">Learning Path&nbsp/</a>&nbsp
		<a href="/l/${learningPathId}">${learningPathName} &nbsp/</a>&nbsp
		<span class="title breadcrumb-text-truncate"> </span>
	</div>
</#if>