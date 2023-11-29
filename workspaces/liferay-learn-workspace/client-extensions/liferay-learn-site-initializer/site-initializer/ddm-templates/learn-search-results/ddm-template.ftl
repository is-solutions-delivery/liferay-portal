<style>
	.description {
	color: #282934;
	font-family: 'Source Sans 3', sans-serif;
	font-size: 1rem;
	font-style: normal;
	font-weight: 400;
	line-height: 1.5rem;
	}

	.modified-date {
	  color: #6C6C75;
	font-family: 'Source Sans Pro', sans-serif;
	font-size: 13px;
	font-style: normal;
	font-weight: 400;
	line-height: 1rem;
	}

	.search-results-entry {
	  padding: 1rem;
	}

	.search-results-entry:hover {
		border-radius: 0.625rem;
	background: #EDF3FE;
		cursor: pointer;
	}
</style>

<div class="search-results" id="searchResults">
	<h2 class="pb-3 search-results-heading">
		${searchContainer.getTotal()} ${languageUtil.get(locale, "results-for", "results for")} "${htmlUtil.escape(searchResultsPortletDisplayContext.getKeywords())}"
	</h2>
	<#if entries?has_content>
		<#list entries as entry>
			<#assign
				searchEntryContent = entry.getContent()!languageUtil.get(locale, "no-content-preview", "No content preview")
				searchEntryTitle = entry.getTitle()!""
			/>

			<#if searchEntryTitle?has_content>
				<div class="pb-4 search-results-entry">
					<a class="font-weight-bold search-results-entry-title text-decoration-none unstyled" href="${entry.getViewURL()}&highlight=${htmlUtil.escape(searchResultsPortletDisplayContext.getKeywords()?url('ISO-8859-1'))}">
						${searchEntryTitle}
					<div class="description pt-2 search-results-entry-content">
						${searchEntryContent}
					</div>

					<div class="modified-date pt-2">
						${languageUtil.get(locale, "Last Modified Date")}: ${entry.getModifiedDateString()?date?string["dd.MM.yyyy"]}
					</div>
					</a>
				</div>
			</#if>
		</#list>
	</#if>
</div>