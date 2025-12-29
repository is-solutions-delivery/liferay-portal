<style>
.app-count {
	height: 20px;
	font-size: 13px;
}
</style>

<#assign
	url = themeDisplay.getURLCurrent()?string

	commerceContext = restClient.get("/headless-commerce-delivery-catalog/v1.0/channels")
	channelId = commerceContext.items[0].id

	urlParts = url?split("/")
	lastSegment = urlParts[urlParts?size - 1]?split(" \\?")[0]
	publisePage = restClient.get("/c/publisherdetailses/" + lastSegment)
/>

<#if (ObjectField_catalogId.getData())??>
	<#assign publisherAccountId = ObjectField_catalogId.getData() />
</#if>

<#assign
	requestUrl = "/headless-commerce-delivery-catalog/v1.0/channels/" + channelId + "/products?accountId=-1&nestedFields=categories,productSpecifications&filter=catalogId eq " + publisherAccountId

	catalogApps = restClient.get(requestUrl)

	totalCount = 0
/>

<#if catalogApps?has_content>
	<#assign totalCount = catalogApps.totalCount />
</#if>

<span class="app-count subtext">
	${totalCount} ${languageUtil.get(locale, 'apps')}
</span>