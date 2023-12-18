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
	taxonomyCategoriesMap = {}
	taxonomyCategoryBriefs = restClient.get("/headless-delivery/v1.0/sites/${groupId}/structured-contents/by-key/${journalArticleId}?nestedFields=embeddedTaxonomyCategory").taxonomyCategoryBriefs
	taxonomyVocabularies = []
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
		<#assign
			parentLink = breadcrumbLinksJSONArray.getJSONObject(0)?eval
			topLevelArticle = false
		/>
	</#if>
</#if>

<#if (landingPage.getData())?? && (landingPage.getData() == "true")>
	<#assign isLandingPage = true />
</#if>

<div class="container-fluid documentations main-content" role="main">
	<div class="row">
		<div class="col-12 col-md-2 doc-nav-wrapper mobile-nav-hide">
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

				<div class="doc-nav">
					<#if !topLevelArticle>
						<a class="back-link btn btn-link btn-monospaced d-flex flex-row justify-content-start" href="${parentLink.url}" id="backLink">
							<svg class="lexicon-icon lexicon-icon-angle-left" role="presentation" viewBox="0 0 512 512">
								<use xlink:href="#angle-left" />
							</svg>
							${languageUtil.get(locale, "go-back", "Go Back")}
						</a>
					</#if>

					<#if (navigationLinks.getData())??>
						<#assign urlTitleLastDirectory =.vars['reserved-article-url-title'].getData()?split("/")?last />

						<ul class="current">
							<#if !topLevelArticle>
								<li class="current parent-level toctree-l1">
									<a class="reference internal" href="${parentLink.url}">${parentLink.title}</a>
								</li>
							</#if>

							<#assign navigationLinksJSONArray = jsonFactoryUtil.createJSONArray(navigationLinks.getData()) />

							<#if navigationLinksJSONArray.length() gt 0>
								<#list 0..navigationLinksJSONArray.length()-1 as i>
									<#assign navigationLink = navigationLinksJSONArray.getJSONObject(i)?eval />

									<li class="${topLevelArticle?then("toctree-l1", "toctree-l2")} ${(urlTitleLastDirectory == navigationLink.url)?then("current", "")}">
										<a class="reference internal" href="${navigationLink.url}">${navigationLink.title}</a>
									</li>
								</#list>
							</#if>
						</ul>
					</#if>
				</div>
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
								<li class="font-weight-bold">
									${.vars['reserved-article-title'].getData()}
								</li>
							</ul>

							<div style="font-family: 'Source Sans Pro', sans-serif; font-size: 1rem; font-style: normal; font-weight: 600; line-height: 1.5rem; color: var(--action-primary-default, #0B5FFF); text-align: center; padding-right: 3rem;">
								<a href="https://liferay.dev/c/portal/login?redirect=https://liferay.dev/ask/questions/liferay-learn-feedback/new" style="text-decoration: none;">
									Ask The Community
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
</div>

<style>
  #backLink {
	  border-radius: 0.5rem;
	}
	#backLink:hover {
	  background-color: #EAECEE;
	  transition: box-shadow 0.1s linear, background-color 0.1s linear;
		}
</style>