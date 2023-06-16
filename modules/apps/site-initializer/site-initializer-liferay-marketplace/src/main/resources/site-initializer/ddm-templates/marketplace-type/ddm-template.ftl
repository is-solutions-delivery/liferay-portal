<#assign
	channels = restClient.get("/headless-commerce-delivery-catalog/v1.0/channels")
	channelId = ""
/>

<#list channels.items as channel>
	<#if channel.name == "Marketplace Channel">
		<#assign channelId = channel.id />
	</#if>
</#list>

<#if (CPDefinition_cProductId.getData())??>
	<#assign specifications = restClient.get("/headless-commerce-delivery-catalog/v1.0/channels/" + channelId + "/products/" + CPDefinition_cProductId.getData() + "/product-specifications") />
</#if>

<#if specifications?has_content && specifications.items?has_content>
	<#list specifications.items as specification>
		<#if specification.specificationKey?has_content && stringUtil.equals(specification.specificationKey, "type")>
			<div class="bg-white border-radius-small mb-2 specification-container" style="padding: var(--spacer-3);">
				<div class="font-weight-semi-bold specification-title" style="color: var(--black); font-size: 14.4px; line-height: 1.389; letter-spacing: 1px;">
					${specification.specificationTitle?upper_case}
				</div>

				<div class="mt-2 specification-value">
					${specification.value}
				</div>
			</div>
		</#if>
	</#list>
</#if>