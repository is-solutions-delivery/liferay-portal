<#include "${templatesPath}/SVG">
<script>
	let href = window.location.href;
	if (href.endsWith("/")) {
		href = href.substring(0, href.length - 1);
		window.location.assign(href);
	}
</script>
<#assign
	journalArticleId = .vars["reserved-article-id"].data
	taxonomyCategoryBriefs = restClient.get("/headless-delivery/v1.0/sites/${groupId}/structured-contents/by-key/${journalArticleId}?nestedFields=embeddedTaxonomyCategory").taxonomyCategoryBriefs
	taxonomyVocabularies = []
	taxonomyCategoriesMap = {}
/>
<#list taxonomyCategoryBriefs as taxonomyCategoryBrief>
	<#assign taxonomyVocabularyName = taxonomyCategoryBrief.embeddedTaxonomyCategory.parentTaxonomyVocabulary.name />
	<#if !taxonomyVocabularies?seq_contains(taxonomyVocabularyName)>
		<#assign taxonomyVocabularies = taxonomyVocabularies + [taxonomyVocabularyName] />
	</#if>
	
	<#if taxonomyCategoriesMap[taxonomyVocabularyName]?has_content>
		<#assign taxonomyCategoriesMap = taxonomyCategoriesMap +
			{
			taxonomyVocabularyName:
			taxonomyCategoriesMap[taxonomyVocabularyName] + [{
				"categoryId": taxonomyCategoryBrief.taxonomyCategoryId,
				"categoryName": taxonomyCategoryBrief.taxonomyCategoryName
				}]
			}
		/>
	<#else>
		<#assign taxonomyCategoriesMap = taxonomyCategoriesMap +
			{
			taxonomyVocabularyName:
				[{
					"categoryId": taxonomyCategoryBrief.taxonomyCategoryId,
					"categoryName": taxonomyCategoryBrief.taxonomyCategoryName
				}]
			}
		/>
	</#if>
</#list>
<#assign
	groupFriendlyURL = "/web" + themeDisplay.getScopeGroup().getFriendlyURL()
	isLandingPage = false
	topLevelArticle = true
/>
<#if (breadcrumbLinks.getData())??>
	<#assign breadcrumbLinksJSONArray = jsonFactoryUtil.createJSONArray(breadcrumbLinks.getData()) />
	<#if breadcrumbLinksJSONArray.length() gt 0>
		<#assign topLevelArticle = false />
	</#if>
</#if>
<#if (landingPage.getData())?? && (landingPage.getData() == "true")>
	<#assign isLandingPage = true />
</#if>
<div class="container-fluid documentations main-content" role="main">
	<div class="row">
    	<div class="col-12 col-md-2 mobile-nav-hide mt-5">
			<div class="doc-nav-wrapper-inner">
				<div class="d-md-none mobile-doc-nav-toggler" id="mobileDocNavToggler">${languageUtil.get(locale, "documentation-menu", "Documentation Menu")}
					<button
						aria-label="Expand Documentation Menu" class="btn expand-btn" onclick="javascript:;"
						title="Expand Documentation Menu" type="button">
							<@clay["icon"] symbol="angle-down-small" />
					</button>
					<button
						aria-label="Close Documentation Menu" class="btn collapse-btn" onclick="javascript:;"
						title="Close Documentation Menu" type="button">
							<@clay["icon"] symbol="angle-up-small" />
					</button>
				</div>
				
			<#if breadcrumbLinksJSONArray.length() gt 0>
				<#assign productTitle = breadcrumbLinksJSONArray.getJSONObject(breadcrumbLinksJSONArray.length()-1).title />
				<#assign productUrl = breadcrumbLinksJSONArray.getJSONObject(breadcrumbLinksJSONArray.length()-1).url />
			<#else>
				<#assign productTitle = .vars["reserved-article-title"].data />
			</#if>
			<#assign productList =
				{
					"analytics-cloud": {
						"title": "Analytics Cloud",
						"url": "analytics-cloud",
						"image": "/documents/d/guest/analytics_c-svg"
					},
					"commerce": {
						"title": "Commerce",
						"url": "commerce",
						"image": "/documents/d/guest/commerce_product-svg"
					},
					"dxp": {
						"title": "DXP / Portal",
						"url": "dxp",
						"image": "/documents/d/guest/dxp_p-svg"
						
					},
					"liferay-cloud": {
						"title": "DXP Cloud",
						"url": "liferay-cloud",
						"image": "/documents/d/guest/dxp_c-svg"
					},
					"reference": {
						"title": "Reference",
						"url": "reference",
						"image": "/documents/d/guest/reference-svg"
					}
				}
			/>
				
			<#assign currentProduct = {} />
			<#assign product = product.getData() />
			<#if productList[product].title?has_content>
				<div class="dropdown">
					<div
						class="adt-nav-item w-100 ml-0"
						data-toggle="liferay-dropdown"
						style="background-color: #F4F6F9; border-radius: 0.5rem;"
					>
						<div class="adt-nav-text d-flex p-3 justify-content-between" style="border-radius: 0.5rem; align-items: center;">
							<div>
								<span
									aria-expanded="false"
									aria-haspopup="true"
									class="adt-nav-title text-truncate d-flex"
									style="color: #282934; font-weight: 700; align-items: center"
								>
								<div class="d-flex mr-1" style="background-color: #E7EFFF; width: 3.25rem; height: 3.25rem; border-radius: 2rem; align-items: center; border: 1px solid; border-color: #FFFFFF;">
									<img
										class="lexicon-icon lexicon-icon-caret-bottom product-icon p-2 mt-0"
										role="presentation"
										src="${productList[product].image}"
										viewBox="0 0 512 512"
										style="width: 3.5rem; height: 3.5rem; max-width: none; margin-left: -0.125rem;"
									/>
								</div>
								<div>${productList[product].title}</div>
							</span>
								
							</div>
							<div>
								<svg class="lexicon-icon lexicon-icon-caret-bottom" role="presentation" viewBox="0 0 512 512">
									<use xlink:href="/o/admin-theme/images/clay/icons.svg#caret-bottom"></use>
								</svg>
							</div>
						</div>
					</div>
					<div
						class="br-13 dropdown-menu m-0 p-0"
						style="overflow-x:hidden; will-change: transform;"
					>
						<div class="row" style="margin: 0; padding: 15px;">
							<#list productList as key, value>
								<div class="br-13 dropdown-item col-sm-12 d-flex justify-content-between" style="align-items: center; margin-left: 0; margin-right: 0; border-radius: 0.5rem;">
								  <div>
									  <a class="adt-submenu-item-link color-black text-decoration-none" href="/w/${productList[key].url}/index" tabindex="4" style="color: #282934;">
											<div>
												<img
													class="lexicon-icon lexicon-icon-caret-bottom product-icon mr-2"
													role="presentation"
													src="${value.image}"
													viewBox="0 0 512 512"
													style="width: 25px; height: 25px;"
									      />
												<b>${value.title}</b>
											</div>
										</a>
									</div>
									<#if productList[product].url == value.url>
									<div>
							      <@clay["icon"] symbol="check" />
							    </div>
									</#if>
								</div>
							</#list>
						</div>
					</div>
				</div>
			</#if>
			<#assign navigationLinksJSONArray = jsonFactoryUtil.createJSONArray(navigationLinks.getData()) />
			<#if navigationLinksJSONArray.length() gt 0>
				<div class="doc-nav mt-3" style="border-radius: 0.5rem; padding: 0 0">
					<#if !topLevelArticle>
						<div class="d-flex" style="border-bottom: solid; border-color: #EAECEE; align-items: center;">
							<div class="m-2">
								<a href="${breadcrumbLinksJSONArray.getJSONObject(0).url}" id="backLink" style="color: #34465B; padding: 0.5rem; border-left-width: 0px;">
									<svg class="lexicon-icon lexicon-icon-angle-left" role="presentation" viewBox="0 0 512 512">
										<use xlink:href="#angle-left" />
									</svg>
								</a>
							</div>
							<div class="align-self-center">
								<a class="pl-0 pr-0" style="color: #282934; font-weight: 700;">${breadcrumbLinksJSONArray.getJSONObject(0).title}</a>
							</div>
						</div>
					</#if>
					<#if (navigationLinks.getData())??>
						<#assign urlTitleLastDirectory =.vars['reserved-article-url-title'].getData()?split("/")?last />
						<ul class="current">
							<#assign navigationLinksJSONArray = jsonFactoryUtil.createJSONArray(navigationLinks.getData()) />
							<#if navigationLinksJSONArray.length() gt 0>
								<#list 0..navigationLinksJSONArray.length()-1 as i>
									<li class="${topLevelArticle?then("toctree-test", "")} sideNav d-flex ${(urlTitleLastDirectory == navigationLinksJSONArray.getJSONObject(i).url)?then("currentLevel", "")}" style="justify-content: space-between; align-items: center; margin: 0.3rem 1rem; border-radius: 0.5rem;">
										<a class="reference internal ${(urlTitleLastDirectory == navigationLinksJSONArray.getJSONObject(i).url)?then("currentLevel", "")}" href="${navigationLinksJSONArray.getJSONObject(i).url}" style="font-size: 1rem; color: #282934; font-weight:600; width: fit-content;">${navigationLinksJSONArray.getJSONObject(i).title}</a>
										<#if breadcrumbLinksJSONArray.length() lt 1>
											<svg class="lexicon-icon lexicon-icon-angle-left" role="presentation" viewBox="0 0 512 512" style="width: 0.6rem; height: 0.6rem; display: block; margin-right: 10px; transform: rotate(180deg)">
												<use xlink:href="#angle-left" />
											</svg>
										</#if>
									</li>
								</#list>
							</#if>
						</ul>
					</#if>
				</div>
			</#if>
		</div>
	</div>
	<div class="col-12 col-md-10 doc-body">
		<div class="border-bottom-0 h-auto p-0">
			<div class="mt-3 offset-md-1">
				<#if breadcrumbLinksJSONArray??>
					<div class="d-flex" style="align-items: baseline; justify-content: space-between;">
						<ul aria-label="breadcrumb navigation" class="article-breadcrumb" role="navigation">
							<li>
								<a href="${groupFriendlyURL}"><@clay["icon"] symbol="home-full" /></a>
							</li>
							<#if breadcrumbLinksJSONArray.length() gt 0>
								<#list breadcrumbLinksJSONArray.length()-1..0 as i>
									<#assign breadcrumbLink = breadcrumbLinksJSONArray.getJSONObject(i)?eval />
									<li>
										<a href="${breadcrumbLink.url}">${breadcrumbLink.title}</a>
									</li>
								</#list>
							</#if>
					
							<li>
								${.vars['reserved-article-title'].getData()}
							</li>
						</ul>
						<div style="font-family: 'Source Sans Pro', sans-serif; font-size: 1rem; font-style: normal; font-weight: 600; line-height: 1.5rem; color: var(--action-primary-default, #0B5FFF); text-align: center; padding-right: 3rem;">
							<a href="https://liferay.dev/c/portal/login?redirect=https://liferay.dev/ask/questions/liferay-learn-feedback/new" style="text-decoration: none;">
								${languageUtil.get(locale, "send-feedback", "Send Feedback")}
								<@clay["icon"] symbol="message-boards" />
							</a>
						</div>
					</div>
				</#if>
				<#list taxonomyVocabularies as vocabulary>
					<div class="col-10 d-flex mt-2 pl-0" id="tagContent" style="gap: 1rem;">
						<div class="align-items-baseline d-flex flex-wrap" id="${vocabulary}-tags">
							${vocabulary}
						</div>
						<div class="d-flex font-weight-bold mr-2" id="${vocabulary}-Title" style="font-size: 0.875rem;">
							<#list taxonomyCategoriesMap[vocabulary]?sort_by("categoryName") as taxonomyCategory>
								<div class="d-flex" id="${vocabulary}-tag">
									<a class="label label-primary" href="/search?category=${taxonomyCategory.categoryId}" style="border-radius: 1.5rem; border: 1px solid var(--action-primary-default, #0B5FFF); background: var(--action-primary-inverted, #FFF); display: flex; padding: 0.25rem 0.75rem; align-items: center; gap: 0.25rem;">
										<span class="label-item label-item-expand">${taxonomyCategory.categoryName}</span>
									</a>
								</div>
							</#list>
						</div>
					</div>
				</#list>
			</div>
		</div>
		<div class="col-12 doc-content ${isLandingPage?then("landing-page-container", "")}" id="docContent" style="margin-top: 0px;">
			<div class="row" style="overflow: hidden;">
				<div class="article-body col-12 col-md-10 language-log">
					<#if (content.getData())??>
						${content.getData()}
					</#if>
					<#if isLandingPage>
						<#include "${templatesPath}/LANDING-PAGE">
					</#if>
					<div class="autofit-padded-no-gutters-x autofit-row help-center-footer">
						<div class="autofit-col">
							<div class="icon-container">
								<svg class="lexicon-icon liferay-waffle-icon" focusable="false" role="presentation" viewBox="0 0 512 512">
									<use xlink:href="#liferay-waffle" />
								</svg>
							</div>
						</div>
						<div class="autofit-col autofit-col-expand">
							<h3>${languageUtil.get(locale, "not-finding-what-you-are-looking-for", "Not finding what you're looking for?")}</h3>
							<p>${languageUtil.get(locale, "pardon-our-dust-as-we-revamp", "Pardon our dust as we revamp and transition our product documentation to this site. If something seems missing, please check Liferay Help Center documentation for Liferay DXP 7.2 and previous versions.")}</p>
							<a href="https://help.liferay.com/hc/en-us/categories/360001749912">
								<strong>${languageUtil.get(locale, "try-liferays-help-center", "Try Liferay's Help Center")}</strong>
								<svg class="lexicon-icon lexicon-icon-shortcut" focusable="false" role="presentation" viewBox="0 0 512 512">
									<use xlink:href="#shortcut" />
								</svg>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
  .adt-nav-text:hover {
	  background-color: #EDF3FE !important;
	}
	.show .adt-nav-text {
	  background-color: #EDF3FE !important;
	}
	
	.show .adt-nav-text svg {
	  color: var(--color-action-primary-hover);
		transform: rotate(180deg);
	}
	
	.dropdown-item:hover {
	  background-color: #EDF3FE;
	}
	
	.dropdown-menu .row {
	  margin: 0 !important;
	}
	
	.dropdown-item {
	  display: flex;
    padding: 0.75rem;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    align-self: stretch;
	}
	
	
	
	#backLink {
		border-radius: 0.5rem;
	}
	#backLink:hover {
		background-color: #EAECEE;
		transition: box-shadow 0.1s linear, background-color 0.1s linear;
	}
	.currentLevel {
		color: #004AD7 !important;
		background-color: #E6EDFB;
	}
	
	.currentLevel:hover a {
		background-color: #EDF3FE !important;
		color: ##004AD7 !important;
	}
	.sideNav:hover {
		color: #0053F0 !important;
		background-color: #EDF3FE !important;
	}
	.adt-nav-text:hover svg  {
	  	color: var(--color-action-primary-hover);
	}
	
	.toctree-test:hover a {
		color: var(--color-action-primary-hover) !important;
		background-image: clay-icon(angle-right, $color-action-primary-hover);
		background-position: right 0.8rem top $spacing-md;
		background-repeat: no-repeat;
		background-size: 0.65rem;
		color: $color-neutral-6;
		font-size: 1.125rem;
	}
		
	.reference:hover {
		color: #0053F0 !important;
	}
</style>