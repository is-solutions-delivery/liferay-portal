<#if entries?has_content>
	<#assign
		knowledgeBaseFrequency = 0
		knowledgeBaseIds = []
		sortedTaxonomyCategories = []
		totalCount = 0
	/>
	<#list entries as entry>
		<#assign label = entry.bucketText?upper_case />
		<#if stringUtil.equals(label, "OFFICIAL DOCUMENTATION")>
			<#assign sortedTaxonomyCategories = [entry] + sortedTaxonomyCategories />
		<#elseif stringUtil.equals(label, "HOW TO") || stringUtil.equals(label, "TROUBLESHOOTING") || stringUtil.equals(label, "REFERENCE")>
			<#assign
				knowledgeBaseFrequency += entry.getFrequency()
				knowledgeBaseIds += [entry.getFilterValue()]
			/>
		</#if>
	</#list>
	<#list assetCategoriesSearchFacetDisplayContext.getBucketDisplayContexts() as bucketDisplayContext>
		<#assign totalCount = totalCount + bucketDisplayContext.getCount() />
	</#list>
	<div class="form-group">
		<#assign
			knowledgeBaseSelected = false
			selectedLabel = ""
			selectedResourceTypeIds = paramUtil.getParameterValues(request, "resource-type")![]
		/>

		<#list selectedResourceTypeIds as selectedId>
			<#if knowledgeBaseIds?seq_contains(selectedId)>
				<#assign knowledgeBaseSelected = true />
			</#if>
		</#list>

		<#function getTabLabel itemCount label>
			<#local tabLabel = '<span class="tab-label-selected">' + label + '</span>' />
			<#if itemCount?has_content>
				<#local tabLabel = tabLabel + ' <span class="term-count">' + itemCount + '</span>' />
			</#if>
			<#return tabLabel>
		</#function>

		<#if knowledgeBaseSelected && knowledgeBaseFrequency?has_content>
			<#assign selectedLabel = getTabLabel(
				knowledgeBaseFrequency,
				languageUtil.get(locale, "knowledge-base", "Knowledge Base")
			) />
		<#elseif !knowledgeBaseSelected>
			<#list sortedTaxonomyCategories as entry>
				<#if entry.isSelected() && entry.isFrequencyVisible()>
					<#assign selectedLabel = getTabLabel(
						entry.getFrequency(),
						htmlUtil.escape(entry.getBucketText())
					) />
				</#if>
			</#list>
		</#if>

		<#if !selectedLabel?has_content && totalCount?has_content>
			<#assign selectedLabel = getTabLabel(
				totalCount,
				languageUtil.get(locale, "all-results", "All Results")
			) />
		</#if>

		<#macro
			renderSelectOption
			hasCount
			itemCount
			label
			value
>
			<option value="${value}">
				${label}
				<#if hasCount>(${itemCount})</#if>
			</option>
		</#macro>

		<select class="form-control d-none" id="real-select" onchange="${namespace}updateSelection(event)">
			<@renderSelectOption
				hasCount = totalCount?has_content
				itemCount = totalCount
				label = languageUtil.get(locale, "all-results", "All Results")
				value = "clear"
			/>

			<#list sortedTaxonomyCategories as entry>

				<@renderSelectOption
					hasCount = entry.isFrequencyVisible()
					itemCount = entry.getFrequency()
					label = htmlUtil.escape(entry.getBucketText())
					value = entry.getFilterValue()
				/>
			</#list>

			<@renderSelectOption
				hasCount = knowledgeBaseFrequency?has_content
				itemCount = knowledgeBaseFrequency
				label = languageUtil.get(locale, "knowledge-base", "Knowledge Base")
				value = knowledgeBaseIds?join(',')
			/>
		</select>

		<div class="custom-select learn-category-facet-tabs list-unstyled tab-list">
			<div class="custom-select-trigger">
				<div class="custom-select-trigger-text">
					${selectedLabel}
				</div>

				<div class="icon-custom-select">
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<mask id="mask0_820_11850" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="3" y="5" width="10" height="6">
							<path d="M3.21478 6.3781L7.48679 10.6499C7.76929 10.9324 8.23071 10.9324 8.51321 10.6499L12.7852 6.3781C13.2435 5.91985 12.9202 5.13831 12.2704 5.13831H3.72956C3.07981 5.13831 2.75651 5.91985 3.21478 6.3781Z" fill="#6B6C7E" />
						</mask>

						<g mask="url(#mask0_820_11850)">
							<rect width="16" height="16" fill="#999AA3" />
						</g>
					</svg>
				</div>
			</div>

			<div class="custom-select-options">
				<#macro
					renderCustomOption
					itemCount
					label
					selectedClass
					value
>
					<span class="custom-select-option ${selectedClass}" data-value="${value}">
						<div class="title-count">
							${label}
							<#if itemCount?has_content>
								<span class="item-count">${itemCount}</span>
							</#if>
						</div>
					</span>
				</#macro>

				<@renderCustomOption
					itemCount = totalCount
					label = languageUtil.get(locale, "all-results", "All Results")
					selectedClass = assetCategoriesSearchFacetDisplayContext.isNothingSelected()?then('tab-button--active', '')
					value = "clear"
				/>

				<#list sortedTaxonomyCategories as entry>
					<@renderCustomOption
						itemCount = entry.isFrequencyVisible()?then(entry.getFrequency(), "")
						label = htmlUtil.escape(entry.getBucketText())
						selectedClass = (entry.isSelected()?then('tab-button--active', ''))
						value = entry.getFilterValue()
					/>
				</#list>

				<@renderCustomOption
					itemCount = knowledgeBaseFrequency
					label = languageUtil.get(locale, "knowledge-base", "Knowledge Base")
					selectedClass = knowledgeBaseSelected?then('tab-button--active', '')
					value = knowledgeBaseIds?join(',')
				/>
			</div>
		</div>

	<ul class="learn-category-facet-tabs list-unstyled tab-list" id="tab-list">
		<li class="facet-value">
			<@clay.button
				cssClass="btn-unstyled facet-clear tab-btn text-center ${assetCategoriesSearchFacetDisplayContext.isNothingSelected()?then('selected-tab-btn', '')}"
				displayType="link"
				onClick="${namespace}updateSelection(event)"
				value="clear"
			>
				<span class="term-text">${languageUtil.get(locale, "all-results", "All Results")}</span>
				<#if totalCount?has_content>
					<span class="term-count">${totalCount}</span>
				</#if>
			</@clay.button>
		</li>
		<#list sortedTaxonomyCategories as entry>
			<li class="facet-value">
				<@clay.button
					cssClass="btn-unstyled facet-term tab-btn term-name text-center ${(entry.isSelected())?then('selected-tab-btn', '')}"
					data\-term\-id="${entry.getFilterValue()}"
					disabled="true"
					displayType="link"
					onClick="${namespace}updateSelection(event)"
				>
					<span class="term-text">
						${htmlUtil.escape(entry.getBucketText())}
					</span>
					<#if entry.isFrequencyVisible()>
						<span class="term-count">
							${entry.getFrequency()}
						</span>
					</#if>
				</@clay.button>
			</li>
		</#list>
		<#assign
			selectedResourceTypeIds = paramUtil.getParameterValues(request, "resource-type")![]
			knowledgeBaseSelected = false
		/>

		<#list selectedResourceTypeIds as selectedId>
			<#if knowledgeBaseIds?seq_contains(selectedId)>
				<#assign knowledgeBaseSelected = true />
			</#if>
		</#list>
		<li class="facet-value">
			<@clay.button
				cssClass="btn-unstyled facet-term tab-btn term-name text-center ${knowledgeBaseSelected?then('selected-tab-btn', '')}"
				data\-term\-ids="${knowledgeBaseIds?join(',')}"
				displayType="link"
				onClick="${namespace}updateSelection(event)"
			>
				<span class="term-text">${languageUtil.get(locale, "knowledge-base", "Knowledge Base")}</span>
				<#if knowledgeBaseFrequency?has_content>
					<span class="term-count">${knowledgeBaseFrequency}</span>
				</#if>
			</@clay.button>
		</li>
	</ul>
</#if>
<@liferay_aui.script>
	const customSelect = document.querySelector(".custom-select");
	const realSelect = document.getElementById("real-select");

	const closeCustomSelect = () => customSelect.classList.remove("open");

	const handleStyleTabs = (event) => {
		const targetButton = event.currentTarget;

		document.querySelectorAll('.tab-btn').forEach(button => button.classList.remove('selected-tab-btn'));

		if (targetButton.classList.contains('tab-btn')) {
			targetButton.classList.add('selected-tab-btn');
		}
	};

	const ${namespace}updateSelection = (event) => {
		const dataTermId = event.currentTarget.getAttribute('data-term-id');
		const dataTermIds = event.currentTarget.getAttribute('data-term-ids');
		const urlSearchParams = new URLSearchParams(window.location.search);
		const value = event.currentTarget.value;

		event.preventDefault?.();
		handleStyleTabs?.(event);

		if (!event.currentTarget.form && event.currentTarget.tagName !== 'SELECT') {
			return;
		}

		if (value === 'clear') {
			urlSearchParams.delete('resource-type');

			window.location.href = window.location.pathname + (urlSearchParams.toString() ? '?' + urlSearchParams.toString() : '');
			return;
		}

		urlSearchParams.delete('resource-type');

		if (event.currentTarget.tagName === 'SELECT') {
			if (value) {
				if (value.includes(',')) {
					value.split(',').forEach(id => urlSearchParams.append('resource-type', id.trim()));
				} else {
					urlSearchParams.append('resource-type', value);
				}
			}
		} else {
			if (dataTermIds) {
				dataTermIds.split(',').forEach(id => urlSearchParams.append('resource-type', id.trim()));
			} else if (dataTermId) {
				urlSearchParams.append('resource-type', dataTermId);
			}
		}

		window.location.href = window.location.pathname + '?' + urlSearchParams.toString();
	};

	customSelect.addEventListener("click", (event) => {
		const option = event.target.closest(".custom-select-option");
		if (!option) return;

		realSelect.value = option.dataset.value;

		closeCustomSelect();

		realSelect.dispatchEvent(new Event("change", { bubbles: true }));
	});

	customSelect.querySelector(".custom-select-trigger").addEventListener("click", (event) => {
		event.stopPropagation();

		customSelect.classList.toggle("open");
	});

	document.addEventListener("click", (event) => {
		if (!customSelect.contains(event.target)) {
			closeCustomSelect();
		}
	});
</@liferay_aui.script>
<style>
	.custom-select {
		border: none;
		cursor: pointer;
		display: none !important;
		font-family: sans-serif;
		justify-content: center;
		position: relative;
		width: 100%;

		.custom-select-options {
			background: white;
			border: none;
			border-radius: 8px;
			box-shadow: 0 4px 8px rgba(0,0,0,0.1);
			display: none;
			flex-direction: column;
			left: 0;
			padding: 8px;
			position: absolute;
			right: 0;
			top: 100%;
			z-index: 10;

			.custom-select-option {
				align-items: center;
				border-radius: 6px;
				display: flex;
				font-family: 'Source Sans 3';
				font-weight: 600;
				gap: 12px;
				justify-content: space-between;
				padding: 10px;
				transition: background 0.2s;
				width: 100%;

				&:hover {
					background: #EDF3FE;
				}
			}
		}
		.custom-select-trigger {
			border-radius: 99px;
			color: #282934;
			display: flex;
			justify-content: space-between;
			padding: 8px;
			width: 100%;

			.custom-select-trigger-text {
				width: 100%;
			}

			&:hover {
				background: #E6EDFB;
			}
		}

		&.open .custom-select-options {
			display: flex;
		}
	}
	.item-count {
		background: #2E5AAC;
		border-radius: 12px;
		color: #FFFFFF;
		padding: 2px 5px;
	}
	.learn-category-facet-tabs .facet-term-unselected .term-text {
		opacity: 0.8;
	}
	.learn-category-facet-tabs .facet-value {
		flex:1;
	}
	.learn-category-facet-tabs.tab-list {
		align-items:center;
		background: var(--Neutral-01, #F7F7F8);
		border-radius: 99px;
		display: flex;
		height: 52px;
		padding: 4px 6px;
	}
	.learn-category-facet-tabs .selected-tab-btn {
		background: var(--Action-Primary-Active-Lighten, #E6EDFB);
		border-radius: 99px;
		opacity: 1;
		padding: 8px;
		text-align: center;
		width: 100%;
	}
	.learn-category-facet-tabs .term-count {
		background: var(--Status-Info-Info, #2E5AAC);
		border-radius: 12px;
		color: var(--Neutral-00, #FFF);
		font-size: 13px;
		padding: 2px 5px;
	}
	.learn-category-facet-tabs .term-text {
		color: var(--Neutral-10, #282934);
		font-size: 14px;
		font-style: normal;
		font-weight: 600;
	}
	.selected-item-mobile-tab::after {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' fill='currentColor' class='lexicon-icon lexicon-icon-check' role='presentation' viewBox='0 0 512 512'%3E%3Cpath d='M192.9,429.5c-8.3,0-16.4-3.3-22.3-9.2L44.5,294.1C15,263.2,62.7,222,89.1,249.5L191.5,352l230-258.9 c27.2-30.5,74.3,11.5,47.1,41.9L216.4,418.9c-5.8,6.5-14,10.3-22.6,10.6C193.5,429.5,193.2,429.5,192.9,429.5z'%3E%3C/path%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
		content: "";
		height: 15px;
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 15px;
	}
	.tab-button--active {
		&:after {
			background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_820_174' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='1' y='2' width='14' height='12'%3E%3Cpath d='M6.02807 13.4237C5.76869 13.4237 5.51557 13.3205 5.33119 13.1362L1.39057 9.19242C0.468691 8.2268 1.95932 6.9393 2.78432 7.79867L5.98432 11.0018L13.1718 2.91117C14.0218 1.95805 15.4937 3.27055 14.6437 4.22055L6.76244 13.0924C6.58119 13.2955 6.32494 13.4143 6.05619 13.4237C6.04682 13.4237 6.03744 13.4237 6.02807 13.4237Z' fill='%236B6C7E'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_820_174)'%3E%3Crect width='16' height='16' fill='%2354555F'/%3E%3C/g%3E%3C/svg%3E%0A");
			content: '';
			height: 16px;
			width: 16px;
		}
	}
	.tab-label-selected {
		font-family: 'Source Sans 3';
		font-weight: 600;
		opacity: 80%;
	}

	@media screen and (max-width: 992px) {
		.custom-select {
			display: flex !important;
		}
		.learn-category-facet-tabs .facet-value-mobile {
			gap: var(--spacer-2, 0.5rem);
		}
		.learn-category-facet-tabs .facet-value-mobile .term-text {
			opacity: 0.80;
		}
		.learn-category-facet-tabs .dropdown-menu,
		.learn-category-facet-tabs#tab-list-mobile {
			max-width: none;
			padding: var(--spacer-2, 0.5rem);
			width: 100%;
		}
		.learn-category-facet-tabs#tab-list {
			display: none !important;
		}
		.learn-category-facet-tabs#tab-list-mobile {
			align-items: center;
			display: flex !important;
			width: 100%;
		}
	}
	#tab-list-mobile {
		display: none;
	}
	#tab-list-mobile::after {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath fill='%23999AA3' d='M103.5 204.3l136.1 136.1c9 9 23.7 9 32.7 0l136.1-136.1c14.6-14.6 4.3-39.5-16.4-39.5H119.9C99.2 164.8 88.9 189.7 103.5 204.3z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-size: contain;
		content: "";
		height: 15px;
		position: absolute;
		right: 1rem;
		top: 50%;
		transform: translateY(-50%);
		width: 15px;
	}
</style>