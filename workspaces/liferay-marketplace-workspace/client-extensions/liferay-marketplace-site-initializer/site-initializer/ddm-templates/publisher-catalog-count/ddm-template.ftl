<style>
.app-count {
	height: 20px;
	font-size: 13px;
}
</style>

<#assign url=themeDisplay.getURLCurrent()?string>
	
<#assign commerceContext=restClient.get("/headless-commerce-delivery-catalog/v1.0/channels") />
<#assign channelId=commerceContext.items[0].id />
	
<#assign urlParts=url?split("/")>
<#assign lastSegment=urlParts[urlParts?size - 1]?split(" \\?")[0]>
<#assign publisePage=restClient.get("/c/publisherdetailses/" + lastSegment ) />
		
<#if (ObjectField_catalogId.getData())??>
	<#assign publisherAccountId=ObjectField_catalogId.getData()/>
</#if>
	
<#assign requestUrl = "/headless-commerce-delivery-catalog/v1.0/channels/" + channelId + "/products?accountId=-1&nestedFields=categories,productSpecifications&filter=catalogId eq " + publisherAccountId>

<#assign catalogApps=restClient.get(requestUrl) />

<#assign totalCount = 0 />
<#if catalogApps?has_content>
	<#assign totalCount = catalogApps.totalCount />
</#if>
	
<span class="app-count subtext">
    ${totalCount} Apps
</span>
