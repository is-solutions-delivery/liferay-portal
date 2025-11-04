<#assign
	assetEntryId = ObjectEntry_objectEntryId.getData()

	response = restClient.get("/c/p2s3quizes/${assetEntryId}?nestedFields=p2s3CourseToP2S3Modules,p2s3ModuleToP2S3Quizzes&nestedFieldsDepth=2&fields=p2s3ModuleToP2S3Quizzes.p2s3CourseToP2S3Modules.title")

	pageTitle = response.p2s3ModuleToP2S3Quizzes.p2s3CourseToP2S3Modules.title + " - " + .data_model["ObjectRelationship#C_P2S3Module#p2s3ModuleToP2S3Quizzes_title"].getData() + " - " + ObjectField_title.getData()
/>
<#if pageTitle?has_content>
    <#assign void = portalUtil.setPageTitle(pageTitle, request)>
</#if>