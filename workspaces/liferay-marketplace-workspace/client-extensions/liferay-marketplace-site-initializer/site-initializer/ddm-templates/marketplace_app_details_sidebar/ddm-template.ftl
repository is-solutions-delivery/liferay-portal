<#assign
	channel = restClient.get("/headless-commerce-delivery-catalog/v1.0/channels?accountId=-1&filter=name eq 'Marketplace Channel' and siteGroupId eq '${themeDisplay.getScopeGroupId()}'")

	product = restClient.get(
		"/headless-commerce-delivery-catalog/v1.0/channels/" + channel.items[0].id +
		"/products/" + CPDefinition_cProductId.getData() +
		"?accountId=-1&nestedFields=categories,productSpecifications,skus&skus.accountId=-1&skus.currencyCode=USD"
	)

	categories = product.categories![]
	catalogName = (product.catalogName)!""
	productImage = product.images![]
	productSpecifications = product.productSpecifications![]
>

<#function getSpecificationValue key default="">
    <#local spec = productSpecifications?filter(it -> stringUtil.equals(it.specificationKey, key)) />
   
    <#return (spec?first.value)!default />
</#function>

<#assign
	developerNames = productSpecifications?filter(item -> stringUtil.equals(item.specificationKey, "developer-name"))
	liferayVersions = productSpecifications?filter(item -> stringUtil.equals(item.specificationKey, "liferay-version"))
	platformOffering = categories?filter(item -> stringUtil.equals(item.vocabulary, "marketplace liferay platform offering"))
	publisherUrlFiltered = productSpecifications?filter(spec -> stringUtil.equals(spec.specificationKey, "publisherwebsiteurl"))
	ramSpec = productSpecifications?filter(item -> stringUtil.equals(item.specificationKey, "ram"))
	solutionHeaderImages = productImage?filter(image -> image.tags?seq_contains("app icon"))
	supportPhoneFiltered = productSpecifications?filter(spec -> stringUtil.equals(spec.specificationKey, "supportphone"))
>

<#assign
	cpuValue = getSpecificationValue("cpu")
	developerName = getSpecificationValue("developer-name", catalogName)
	ramValue = getSpecificationValue("ram")
	supportEmail = getSpecificationValue("supportemailaddress")

	publisherUrl = (publisherUrlFiltered[0].value?trim?replace(" ", ""))!""
	sanitizedUrl = (publisherUrl?starts_with("http") || publisherUrl?starts_with("https"))?then(publisherUrl, "https://" + publisherUrl)
	supportPhone = (supportPhoneFiltered[0].value)!""
>

<#macro section title>
    <p>
		<strong>${title}</strong>
	</p>
    
	<div><#nested></div>

    <hr />
</#macro>

<@section title=languageUtil.get(locale, "developer")>
	<div>
		<a class="bg-neutral-8" href = "/?developer-name=${developerName}">
			${developerName}
		</a>
	</div>
</@section>

<@section title=languageUtil.get(locale, "publisher-date", "Publisher Date")>

	<#setting date_format="MMMM d, yyyy">

	<#if CPDefinition_displayDate.getData()?has_content>

		<p>${CPDefinition_displayDate.getData()}</p>
	</#if>

</@section>

<@section title=languageUtil.get(locale, "deployment-method", "Deployment Method")>
	<#list platformOffering as offering>
		<p>${offering.name}</p>
	</#list>
</@section>

<@section title=languageUtil.get(locale, "app-type", "App Type")>
	${getSpecificationValue("type")?upper_case}
</@section>

<@section title=languageUtil.get(locale, "version")>
	<#if (CPDefinition_version.getData())??>
		${CPDefinition_version.getData()}
	</#if>
</@section>

<@section title=languageUtil.get(locale, "supported-versions", "Supported Versions")>
	<#if liferayVersions?has_content>
		<#list liferayVersions as version>
			${version.value}<#if version?has_next>, </#if>
		</#list>
	</#if>
</@section>

<#if cpuValue?has_content>
	<@section title=languageUtil.get(locale, "resource-requirements", "Resource Requirements")>
		<p>
			<#if cpuValue?has_content>
				${cpuValue}
				<#assign cpuNumber = cpuValue?number?default(0) />
				<#if cpuValue?eval gt 1>
					CPUS
				</#if>
				<#if cpuValue?eval lt 2>
					CPU
				</#if>
			</#if>, <#if ramValue?has_content>${ramValue} GB RAM</#if>
		</p>
	</@section>
</#if>

<@section title=languageUtil.get(locale, "standard-price", "Standard Price")>
	<div>
		<#assign purchasableSkus = [] />

		<#list product.skus as sku>
			<#if sku.purchasable?? && sku.purchasable>
				<#assign purchasableSkus = purchasableSkus + [sku] />
			</#if>
		</#list>

		<#assign standardSku = {} />

		<#list purchasableSkus as sku>
			<#assign matched = false />

			<#list sku.skuOptions as opt>
				<#if stringUtil.equals(opt.skuOptionValueKey, "standard")>
					<#assign
						matched = true
						standardSku = sku
					/>

					<#break>
				</#if>
			</#list>
			<#if matched><#break></#if>
		</#list>

		<#if standardSku.price.price?eval gt 0>
			<div class="bg-neutral-8">${standardSku.price.priceFormatted!""}</div>
		<#else>
			${languageUtil.get(locale, "free", "Free")?upper_case}
		</#if>
	</div>
</@section>

<@section title=languageUtil.get(locale, "help-and-support", "Help and Support")>
	<div class="d-flex flex-column mt-4">
		<div class="d-flex">
			<span class="help-and-support-link-icon">
				<@clay["icon"] symbol="document" />
			</span>

			<a class="d-flex w-100 justify-content-between help-and-support-link" href="https://www.liferay.com/en/legal/marketplace-terms-of-service" target="_blank">
				<span class="copy-text ml-1 help-and-support-link">
					${languageUtil.get(locale, "terms-and-conditions", "Terms & Conditions")}
				</span>

				<@clay["icon"] className="link-arrow help-and-support-link-arrow ml-auto" height="12" symbol="angle-right" />
			</a>
		</div>

		<div class="d-flex">
			<span class="help-and-support-link-icon">
				<@clay["icon"] symbol="document" />
			</span>

			<a class="d-flex w-100 justify-content-between help-and-support-link" href="javascript:void(0)" onClick="openModal()">
				<span class="copy-text ml-1 help-and-support-link">
					${languageUtil.get(locale, "publisher-contact-info", "Publisher Contact Info")}
				</span>

				<@clay["icon"] className="link-arrow help-and-support-link-arrow ml-auto" height="12" symbol="angle-right" />
			</a>
		</div>
	</div>
</@section>

<@section title=languageUtil.get(locale, "share-link")>
	<a class="align-items-center copy-text d-flex font-weight-bold ml-1 text-decoration-none text-primary" href="#copy-share-link" onclick="copyToClipboard(Liferay.ThemeDisplay.getCanonicalURL())">
		<span class="help-and-support-link-icon mr-1">
			<@clay["icon"] symbol="link" />
		</span>
		Copy & Share
	</a>
</@section>

<script>
	function modalBody() {
		return `
			<div class="align-items-center d-flex flex-row mb-3">
				<span class="align-items-center bg-light d-flex justify-content-center mr-3 overflow-hidden p-3 rounded-circle">
					<#if solutionHeaderImages?has_content>
						<#list solutionHeaderImages as image>
							<#assign imageSourceSplitedUrl = image.src?split("/o") />

							<#if imageSourceSplitedUrl?has_content>
								<#assign productThumbnail = "/o/${imageSourceSplitedUrl[1]}" />

								<img alt="Slide ${image?index}" class="catalog-icon" src="${productThumbnail}" style="height: 40px; object-fit: contain; width: 40px;">
							</#if>
						</#list>
					<#else>
						<@clay["icon"]
							style="fill:#6B6C7E;"
							symbol="picture"
						/>
					</#if>
				</span>

				<div class="d-flex flex-column">
					<h3 class="font-weight-bold mb-0">
						${catalogName}
					</h3>
				</div>
			</div>

			<#if sanitizedUrl?has_content && publisherUrl?has_content>
				<div class="align-items-center d-flex flex-row mb-3">
					<span class="align-items-center bg-light d-flex justify-content-center mr-3 p-3 rounded-circle">
						<@clay["icon"]
							style="fill:#6B6C7E;"
							symbol="globe"
						/>
					</span>

					<div class="d-flex flex-column">
						<span class="text-black-50">${languageUtil.get(locale, "publisher-website", "Publisher Website")}</span>

						<a href="${sanitizedUrl}" target="_blank" class="font-weight-bold">
							${publisherUrl}
						</a>
					</div>
				</div>
			</#if>

			<#if supportEmail?has_content>
				<div class="align-items-center d-flex flex-row mb-3">
					<span class="align-items-center bg-light d-flex justify-content-center mr-3 p-3 rounded-circle">
						<@clay["icon"] style="fill:#6B6C7E;"symbol="envelope-closed" />
					</span>

					<div class="d-flex flex-column">
						<span class="text-black-50">${languageUtil.get(locale, "support-email", "Support Email")}</span>

						<a class="font-weight-bold" href="mailto:${supportEmail}" target="_blank">
							${supportEmail}
						</a>
					</div>
				</div>
			</#if>
		
			<#if supportPhone?has_content>
				<div class="d-flex flex-row align-items-center mb-3">
					<span class="align-items-center bg-light d-flex justify-content-center mr-3 p-3 rounded-circle">
						<@clay["icon"]
							style="fill:#6B6C7E;"
							symbol="phone"
						/>
					</span>

					<div class="d-flex flex-column">
						<span class="text-black-50">${languageUtil.get(locale, "phone")}</span>

						<a class="font-weight-bold" href="tel:${supportPhone}" target="_blank">
							${supportPhone}
						</a>
					</div>
				</div>
			</#if>
		`;
	}

	function openModal() {
		Liferay.Util.openModal({
			bodyHTML: modalBody(),
			center: true,
			headerHTML: "<h2>Publisher Support Contact Info</h2>",
			size: "md"
		});
	}
</script>

<script>
	function copyToClipboard(text) {
		if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(text);

			Liferay.Util.openToast({ message: "Copied link to the clipboard" });
		}
	}
</script>

<style>
	.copy-text {
		color: #282934;
		font-size: 16px;
	}

	.help-and-support-link {
		color: inherit;
		text-decoration: none;
	}

	.help-and-support-link-arrow {
		fill: rgb(133, 140, 148);
	}

	.help-and-support-link:hover {
		color: inherit;
		text-decoration: none;
	}

	.help-and-support-link-icon {
		color: rgb(133, 140, 148);
	}

	.help-and-support-svg mask,
	.link-arrow mask {
		mask-type: alpha;
	}
</style>