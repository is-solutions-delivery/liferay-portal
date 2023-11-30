<style>
	.btn-checkboxes {
	  color: #2B3A4B;
		font-size: 13px;
		font-weight: 400;
		line-height: 16px;
	}
	
	.treeview-item:hover {
		cursor: pointer;
	}
	
	.btn-view-all {
		padding-top: 16px!important;
		margin: 0!important;
	}
	
	.panel {
	  border-radius: 10px;
		background: #F7F7F8;
		padding: 16px;
	}
	
	.panel-title {
	  color: var(--neutral-10, #282934);
    font-size: 18px;
    font-weight: 600;
    line-height: 20px;
	}
	
	.title-group {
		font-family: Source Sans 3;
		font-style: normal;
		display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
	}
	
	.custom-checkbox {
		display: flex;
    padding-right: 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
	}
	
	.input-list {
		display: flex;
    padding-right: 0px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
	}	
</style>

<#macro treeview_item
	cssClassTreeItem = ""
	vocabularyName = ""
	selected = false
	termDisplayContexts = ""
>
	<#assign termDisplayContextCount = 0 
					 termDisplayContextCheckedCount = 0
					 viewAllButtonClass = "d-none"
	/>
	<div class="input-list">
		<#list termDisplayContexts as termDisplayContext>
		<#if termDisplayContext.isSelected()>
		  <#assign termDisplayContextCheckedCount++ />
		</#if>
		<#if termDisplayContextCheckedCount lte 8>
		  <#assign displayNoneClass = "d-none" 
							 viewAllButtonClass = ""
			/>
			
		</#if>
		<#if termDisplayContextCount lt 8 && !toggleViewAllMap[vocabularyName] || termDisplayContext.isSelected()>
		  <#assign displayNoneClass = "" />
		</#if>
		  <li class="treeview-item ${displayNoneClass}" role="none" id="li-${vocabularyName}-${termDisplayContextCount}">
			<span class="autofit-col autofit-col-expand">
				<div class="custom-checkbox custom-control">
					<label>
						<input
							autocomplete="off"
							${termDisplayContext.isSelected()?then("checked", "")}
							class="custom-control-input facet-term"
							data-term-id=${termDisplayContext.getAssetCategoryId()}
							disabled
							onChange="Liferay.Search.FacetUtil.changeSelection(event);"
							type="checkbox"
							id="checkbox-${vocabularyName}-${termDisplayContext?index}"
						/>
							<span class="custom-control-label">
								<span class="custom-control-label-text">
									${termDisplayContext.getBucketText()}
								</span>
						</span>
					</label>
				</div>
			</span>
	    </li>
		<#assign termDisplayContextCount++ />
	</#list>
	</div>
	<@clay.button
		cssClass="btn-unstyled facet-clear-btn btn-view-all ${viewAllButtonClass} btn-checkboxes"
		displayType="unstyled"
		id="${vocabularyName}-view-all"
		onclick="toggleViewAll('${vocabularyName}', '${termDisplayContexts?size}')"
	 >
		${languageUtil.get(locale, "View all")}
	</@clay.button>
</#macro>
<#assign toggleViewAllMap = {} />
<#list assetCategoriesSearchFacetDisplayContext.getVocabularyNames()![] as vocabularyName>
  <#assign toggleViewAllMap = toggleViewAllMap + {vocabularyName: false} />
	<div 
		class="panel"
		cssClass="search-facet search-facet-display-vocabulary"
		role="tablist"
	>
		
		<#assign termDisplayContexts = assetCategoriesSearchFacetDisplayContext.getBucketDisplayContexts(vocabularyName) />
		  <div class="title-group">
				<span class="panel-title">${vocabularyName}</span>
		    <div class="d-flex align-items-center">
				  <@clay.button
			      cssClass="btn-unstyled c-mb-4 facet-clear-btn btn-checkboxes pr-2"
				    displayType="unstyled"
				    id="facetAssetCategoriesClear"
				    onclick="toggleCheckAll('${vocabularyName}', '${termDisplayContexts?size}', true)"
		      >
				    ${languageUtil.get(locale, "Select all")}
			    </@clay.button>
			    <@clay.button
				    cssClass="btn-unstyled c-mb-4 facet-clear-btn btn-checkboxes"
				    displayType="unstyled"
				    id="${namespace + 'facetAssetCategoriesClear'}"
				    onclick="toggleCheckAll('${vocabularyName}', '${termDisplayContexts?size}', false)"
			    >
				    ${languageUtil.get(locale, "clear")}
			    </@clay.button>
		    </div>
		  </div>
		<div class="panel-collapse" id="${vocabularyName}-panel" role="tabpanel">
			<#assign showAll = false />
			  <ul class="treeview-group" role="group">
			    <@treeview_item
					  cssClassTreeItem="tree-item-vocabulary"
					  vocabularyName="${vocabularyName}"
					  termDisplayContexts=termDisplayContexts
			    />
			</ul>
		</div>
	</div>
	<input class="vocabulary-name-input d-none" value=${vocabularyName} />
</#list>
<script>
	function load() {
		for(const vocabulary of vocabularies) {
		  const viewAllVocabularyNameValue = sessionStorage.getItem("@\liferay-learn-view-all-"+vocabulary);
			if(viewAllVocabularyNameValue == undefined) {
		  	sessionStorage.setItem("@\liferay-learn-view-all-"+vocabulary, false);
				return;
			}	
		  
			const button = document.getElementById(vocabulary+'-view-all');		
			toggleViewAll(vocabulary, );

		}
	}
	
	function load2() {
    const nodes = document.getElementsByClassName('vocabulary-name-input');
		for(const node of nodes) {
			console.log(node.value);
		}
	}
	
	load();
	load2();
	function toggleCheckAll(vocabularyName, entriesNumber, check) {
		for(let i = 0; i < entriesNumber; i++) {
		  const checkbox = document.getElementById('checkbox-'+vocabularyName+'-'+i);
			if(checkbox != undefined) {
			  checkbox.checked = check;
			}
		}
		Liferay.Search.FacetUtil.changeSelection(event);
	}
	
	function toggleViewAll(vocabularyName, entriesNumber) {
		for(let i = 0; i < entriesNumber; i++) {
		  document.getElementById('li-'+vocabularyName+'-'+ i).classList.remove('d-none');
		}
		sessionStorage.setItem("@\liferay-learn-view-all-"+vocabularyName, true);
		document.getElementById(vocabularyName+'-view-all').classList.add('d-none');
  }
</script>