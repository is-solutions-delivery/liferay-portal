<#assign
	pageTitle = layout.getName(locale)
	taxonomyCategoryByKnowledgeArticles = restClient.get("/c/p2s3knowledgearticles/?fields=taxonomyCategoryBriefs.embeddedTaxonomyCategory.externalReferenceCode%2CtaxonomyCategoryBriefs.embeddedTaxonomyCategory.id&nestedFields=embeddedTaxonomyCategory")
	taxonomyCategoriesIds = []
/>

<#list taxonomyCategoryByKnowledgeArticles["items"] as taxonomyCategoryByKnowledgeArticle>
	<#list taxonomyCategoryByKnowledgeArticle.taxonomyCategoryBriefs as taxonomyCategoryBrief>
		<#assign embeddedTaxonomyCategory = taxonomyCategoryBrief["embeddedTaxonomyCategory"] />
		<#if ["TROUBLESHOOTING", "HOW_TO", "REFERENCE"]?seq_contains(embeddedTaxonomyCategory.externalReferenceCode)
				 && !(taxonomyCategoriesIds?seq_contains(embeddedTaxonomyCategory.id))>
			<#assign taxonomyCategoriesIds = taxonomyCategoriesIds + [embeddedTaxonomyCategory.id] />
		</#if>
	</#list>
</#list>

<@liferay_aui.fieldset cssClass="search-bar">
	<@liferay_aui.input
		cssClass="search-bar-empty-search-input"
		name="emptySearchEnabled"
		type="hidden"
		value=searchBarPortletDisplayContext.isEmptySearchEnabled()
	/>

	<div class="input-group">
		<input
			autocomplete="on"
			class="form-control input-group-inset input-group-inset-after search-bar-keywords-input"
			data-qa-id="searchInput"
			id="${namespace + stringUtil.randomId()}"
			name="${htmlUtil.escape(searchBarPortletDisplayContext.getKeywordsParameterName())}"
			placeholder="Search ${pageTitle}"
			title="${languageUtil.get(locale, "Search")}"
			type="text"
			value="${htmlUtil.escape(searchBarPortletDisplayContext.getKeywords())}"
		/>

		<div class="input-group-inset-item input-group-inset-item-after">
			<div class="search-knowledge-base">
				<a class="search-button" href="">
					<svg class="lexicon-icon lexicon-icon-search" role="presentation" viewBox="0 0 512 512">
						<g>
							<path class="lexicon-icon-outline" d="M499.2,455.5L377.7,333.4c146-241.1-148.1-435.8-318.2-274c-165.1,185.9,41.6,460.6,273.4,319l121.5,118.8C489.5,535.8,534.4,490.8,499.2,455.5z M206.2,63.6c191.9,0,198.1,289,0,289C13.3,352.6,18.8,63.6,206.2,63.6z"></path>
						</g>
					</svg>
				</a>
			</div>
		</div>
	</div>
</@liferay_aui.fieldset>

<script>
	document.addEventListener("DOMContentLoaded", () => {
		const searchBarKeywordsInput = document.querySelector(".search-bar-keywords-input");
		const searchButton = document.querySelector(".search-button");
		const taxonomyCategoriesIds = [<#list taxonomyCategoriesIds as id>${id}<#if id_has_next>,</#if></#list>];

		function buildSearchURL(keywords, categoryIds) {
			let searchURL = "/search?q=" + encodeURIComponent(keywords.trim());

			categoryIds.forEach(id => {
				searchURL += "&resource-type=" + id;
			});

			return searchURL;
		}

		function redirectToSearchResults() {
			window.location.href = buildSearchURL(searchBarKeywordsInput.value, taxonomyCategoriesIds);
		}

		searchBarKeywordsInput.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				redirectToSearchResults();
			}
		});

		searchButton.addEventListener("click", (event) => {
			event.preventDefault();
			redirectToSearchResults();
		});
	});
</script>

<style>
	.input-group>.form-control:not(:last-child), .input-group>.custom-select:not(:last-child) {
		border-bottom-left-radius: 48px;
		border-color: var(--Action-Primary-Hover, rgba(0, 83, 240, 1));
		border-right-style: none;
		border-top-left-radius: 48px;
	}

	.input-group .input-group-inset-item-after {
		border-bottom-right-radius: 48px !important;
		border-color: var(--Action-Primary-Hover, rgba(0, 83, 240, 1));
		border-left-style: none;
		border-top-right-radius: 48px !important;
		padding: 16px 24px;
	}

	.input-group-inset:focus-visible~.input-group-inset-item {
		border-color: var(--Action-Primary-Hover, rgba(0, 83, 240, 1)) !important;
	}
</style>