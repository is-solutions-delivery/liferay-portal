<style type="text/css">
    .app-search-image {
        -webkit-user-drag: none;
        fit-content: contain;
        height: 56px;
        user-drag: none;
        width: 56px;
    }

    .app-type-badge {
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        display: inline-block;
        height: 20;
        padding-left: 10px;
        padding-right: 10px;
        position: absolute;
        right: 32px;
        top: -6px;
        width: 80;
    }

    .apps-container {
        gap: 24px;
        padding: 5px;
    }

    .batch {
        background: #FFE6C6;
        color: #9D4C00;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .checkout {
        background: #DAF4C7;
        color: #4E7135;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .fragments {
        background: #DCD7E9;
        color: #503690;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .image-container .app-search-image {
        height: 56px;
        object-fit: contain;
        width: 56px;
    }

    .no-type {
        background: #cccccc;
        color: #ffffff;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .object-action {
        background-color: #D1ECFA;
        color: #166E9E;
    }

    .other {
        background: #DAF4C7;
        color: #4E7135;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .pagination-bar {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        width: 100%;
    }

    .pagination-items-per-page .dropdown-toggle,
    .pagination-results {
        color: #6b6c7e;
    }

    .payment-methods {
        background: #D2E6FF;
        color: #2868FF;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .price {
        font-family: Source Sans 3;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 0%;
        line-height: 24px;
        vertical-align: middle;
    }

    .product-card {
        border: solid 1px #E2E2E4;
        border-radius: 10px;
        box-sizing: border-box;
        cursor: point;
        max-height: 340px;
        max-width: 430px;
        min-width: 430px;
        position: relative;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .product-card:hover {
        background: #FBFCFE !important;
        background: linear-gradient(172deg, rgba(251, 252, 254, 1) 80%, rgba(212, 222, 255, .5) 100%);
        border: 1px solid #BBD2FF;
        box-shadow: 0px 6px 12px 0px #3C3C3C0F;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .product-card-paragraph {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        display: -webkit-box;
        font-size: 14px;
        font-size: 14px;
        font-weight: 400;
        height: 60px;
        letter-spacing: 0%;
        line-height: 20px;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 340px;
    }

    .product-tag {
        background-color: #E6EBF5;
        box-sizing: border-box;
        color: #2E5AAC;
        font-family: Source Sans 3;
        font-size: 13px;
        font-weight: 400;
        letter-spacing: 0%;
        line-height: 16px;
        max-height: 24px;
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
        vertical-align: middle;
    }

    .site-initializer {
        background: #D1EEDC;
        color: #0E7835;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .tags-container {
        gap: 8px;
    }

    .theme {
        background: #FBE0FF;
        color: #720086;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }

    .workflow-action {
        background: #DCD7E9;
        color: #503690;
        transition: all 0.3s cubic-bezier(.25,.8,.25,1);
    }
</style>

<#-- Bloco de inicialização de variáveis -->
<#assign commerceContext=renderRequest.getAttribute("COMMERCE_CONTEXT") />
<#assign url=themeDisplay.getURLCurrent()?string>
<#assign basePageURL = url?keep_before("?")>
<#assign queryString = "">
<#assign idx = url?index_of("?")>
<#if idx != -1>
  <#assign queryString = url?substring(idx + 1)>
</#if>

<#-- Valores padrão para paginação -->
<#assign delta = 8>
<#assign start = 1>
	
<#-- Leitura dos parâmetros da URL -->
<#if queryString?has_content>
  <#assign params = queryString?split("&")>
  <#list params as param>
    <#assign keyValue = param?split("=")>
    <#if keyValue?size == 2>
      <#if keyValue[0] == "delta">
        <#assign delta = keyValue[1]?number>
      </#if>
      <#if keyValue[0] == "start">
        <#assign start = keyValue[1]?number>
      </#if>
    </#if>
  </#list>
</#if>
				
<#assign baseURL="https://marketplace-uat.liferay.com" />
			
				
<#assign channelId=commerceContext.getCommerceChannelId() />
<#assign urlParts=url?split("/")>
<#assign lastSegment=urlParts[urlParts?size - 1]?split(" \\?")[0]>
<#assign publisePage=restClient.get("/c/publisherdetailses/" + lastSegment ) />
	
<#if publisePage.catalogId?has_content>
	<#assign publisherAccountId=publisePage.catalogId />
</#if>

<#-- Construção da URL da API com os parâmetros de paginação -->
<#assign requestUrl = "/headless-commerce-delivery-catalog/v1.0/channels/" + channelId + "/products?accountId=-1&nestedFields=categories,productSpecifications&filter=catalogId eq " + publisherAccountId>
<#assign requestUrl = requestUrl + "&pageSize=" + delta>
<#assign requestUrl = requestUrl + "&page=" + start>

<#assign catalogApps=restClient.get(requestUrl) />

<#-- Verificação principal: só renderiza se houver conteúdo -->
<#if catalogApps?has_content && catalogApps.items?has_content>
	<#assign products = catalogApps.items />

	<div class="d-flex flex-wrap apps-container flex-row mb-5" >
		<#list products as productEntry>
			<#if productEntry?has_content>

				<#assign
					accountEntryId=commerceContext.getAccountEntry().getAccountEntryId()
					portalURL=portalUtil.getLayoutURL(themeDisplay)
					productId=productEntry.id
					productName=productEntry.name
					remainingCategoriesText=[]
					productImage=cpContentHelper.getDefaultImageFileURL(accountEntryId, productEntry.id)
					catalogName=productEntry.catalogName 
					appFriendlyURLName=productEntry.slug
				/>
					<#if productEntry.categories?has_content>
						<#assign
							productCategories=productEntry.categories?filter(productCategory -> productCategory.vocabulary?replace(" ", "-") == "marketplace-app-category")![]
							categoriesListSize = productCategories?size-1
							productTypes=productEntry.categories?filter(productCategory -> productCategory.vocabulary?replace(" ", "-") == "marketplace-category")![]
						/>
							
					</#if>
						<#if productTypes[0]?has_content>
							<#assign productType=productTypes[0]/>
								<#else>
							<#assign productType=""/>
						</#if>
				
						<#if productEntry.productSpecifications?has_content>
							<#assign productSpecifications=productEntry.productSpecifications![] />
						</#if>
						<#if productEntry.description?has_content>
							<#assign productDescription=stringUtil.shorten(htmlUtil.stripHtml(productEntry.description!""), 150, "..." ) />
						<#else>
							<#assign productDescription="" />
						</#if>
						<a class="product-card p-5 bg-white border-radius-medium d-flex flex-column mb-0 text-dark text-decoration-none" href="${baseURL}/p/${appFriendlyURLName}">
							<div class="align-items-center card-image-title-container d-flex">
								<div class="image-container mr-2 rounded">
									<img alt="${productName}" class="app-search-image" src="${productImage}" width="56" height="56" />
								</div>
								<div>
									<span class="d-flex justify-content-end">
										<div>
										<#if productType?has_content >
											<#if productType.name == 'Other'>	
												<div class="app-type-badge"></div>
												<#else>
														<div class="app-type-badge no-type font-weight-bold
												<#if productType.name == 'Theme'> theme</#if>
												<#if productType.name == 'Object action'> object-action</#if>
												<#if productType.name == 'Site Initializer'> site-initializer</#if>
												<#if productType.name == 'Payment methods'> payment-methods</#if>
												<#if productType.name == 'Workflow action'>	workflow-action</#if>
												<#if productType.name == 'Batch'>	batch</#if>
												<#if productType.name == 'Checkout'>	checkout</#if>
												<#if productType.name == 'Fragments'>	fragments</#if>				
											">
												${productType.name}
											</div>
											</#if>
										
											</#if>
											
										</div>
									</span>
									<div class="font-weight-bold">
										${productName}
									</div>
							
									<#if productSpecifications?has_content>
										<#assign productDeveloperName=productSpecifications?filter(item -> item.specificationKey == "developer-name") />
										<#list productDeveloperName as developerNameItem>
											<#if developerNameItem.value?has_content>
												<#assign developerName=developerNameItem.value />
											<#else>
												<#assign developerName="" />
											</#if>
											<div class="mt-1 text-black-50">
												${developerName}
											</div>
										</#list>
									</#if>
								</div>
							</div>
							<div class="d-flex flex-column font-size-paragraph-small h-100 justify-content-between">
								<div class="font-weight-normal my-6 text-break">
									${productDescription}
								</div>
								<div class="d-flex flex-column">
									<#if productSpecifications?has_content>
										<#assign productPriceModels=productSpecifications?filter(item -> item.specificationKey == "price-model") />
										<#list productPriceModels as productPriceModel>
											<#if productPriceModel.value?has_content>
												<#assign priceModel=productPriceModel.value />
											<#else>
												<#assign priceModel="" />
											</#if>
											<div class="font-weight-semi-bold my-4 text-capitalize">
												${priceModel}
											</div>
										</#list>
									</#if>
									<#if productCategories?has_content>
										<#assign
											principalCategory=productCategories[0]
											remainingCategories=productCategories?filter(category -> category.name != principalCategory.name)
										/>
										<#list remainingCategories as category>
											<#assign remainingCategoriesText=remainingCategoriesText + [category.name] />
										</#list>
									</#if>
									<#if principalCategory?has_content>
										<div>
											<span class="product-tag px-2 py-1 rounded mr-3" title="${principalCategory.name}">
												${principalCategory.name}
											</span>
											<#if categoriesListSize?has_content && remainingCategoriesText?has_content>
												<span class="product-tag px-2 py-1 rounded" title="${remainingCategoriesText?join('\n')}">
													+ ${categoriesListSize}
												</span>
											</#if>
										</div>
									</#if>
								</div>
							</div>
						</a>
					</#if>
				</#list>
	</div>

	<#-- Pagination -->

	<#assign currentPage = catalogApps.page />
	<#assign pageSize = catalogApps.pageSize />
	<#assign totalCount = catalogApps.totalCount />
	<#assign totalPages = (totalCount / pageSize)?ceiling />
	
	

		<div class="pagination-bar">
			<div class="dropdown pagination-items-per-page">
				<a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle" data-toggle="dropdown" href="javascript:;" role="button">
					${pageSize} per page
					<@clay["icon"] symbol="caret-bottom" />
				</a>
				<ul class="dropdown-menu dropdown-menu-top">
					<#list [8, 16, 24, 48] as deltaOption>
						<li><a class="dropdown-item" href="${basePageURL}?delta=${deltaOption}&start=1">${deltaOption}</a></li>
					</#list>
				</ul>
			</div>
			
			
			<#assign startItem = (currentPage - 1) * pageSize + 1 />
		
			<#assign endItem = [(currentPage * pageSize), totalCount]?min />
			<div class="pagination-results">Swhowing ${startItem} to ${endItem} of ${totalCount} Results.</div>

			<ul class="pagination">
			
				<li class="page-item<#if currentPage == 1> disabled</#if>">
					<a class="page-link" href="<#if currentPage gt 1>${basePageURL}?delta=${pageSize}&start=${currentPage - 1}<#else>javascript:;</#if>" role="button">
						<@clay["icon"] symbol="angle-left" />
						<span class="sr-only">Back</span>
					</a>
				</li>
				
				
				<#assign ellipsisPrinted = false />
				<#list 1..totalPages as pageNumber>
					<#assign showPage = false />
					
					<#if (pageNumber == 1) || 
						 (pageNumber == totalPages) || 
						 (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)>
						<#assign showPage = true />
					</#if>
					
					<#if showPage>
						<li class="page-item<#if pageNumber == currentPage> active</#if>">
							<a class="page-link" href="${basePageURL}?delta=${pageSize}&start=${pageNumber}">${pageNumber}</a>
						</li>
						<#assign ellipsisPrinted = false />
					<#else>
						<#if !ellipsisPrinted>
							<li class="page-item disabled">
								<a class="page-link" href="javascript:;" tabindex="-1">...</a>
							</li>
							<#assign ellipsisPrinted = true />
						</#if>
					</#if>
				</#list>
				
		
				<li class="page-item<#if currentPage == totalPages> disabled</#if>">
					<a class="page-link" href="<#if currentPage lt totalPages>${basePageURL}?delta=${pageSize}&start=${currentPage + 1}<#else>javascript:;</#if>" role="button">
						<@clay["icon"] symbol="angle-right" />
						<span class="sr-only">Next</span>
					</a>
				</li>
			</ul>
		</div>



<#else>
	<div class="alert alert-info">No apps found for this publisher.</div>
</#if>
			
<script>
    // Usamos um único listener no 'document' que nunca será destruído.
    document.addEventListener('click', function (event) {
        
        // 1. LÓGICA PARA ABRIR E FECHAR O DROPDOWN
        
        // Verifica se o elemento clicado (ou um de seus pais) é o nosso '.dropdown-toggle'
        const toggle = event.target.closest('.dropdown-toggle');
        
        // Se o clique NÃO foi em um toggle, a gente ignora esta parte.
        if (toggle) {
            // Impede a ação padrão do link (como navegar)
            event.preventDefault();

            const dropdown = toggle.closest('.dropdown');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (menu) {
                // Alterna a visibilidade do menu que foi clicado
                const isCurrentlyShown = menu.classList.contains('show');
                
                // Antes de mostrar o menu, vamos fechar todos os outros que possam estar abertos
                closeAllDropdowns();

                // Se o menu não estava sendo mostrado, agora o mostramos.
                // (Se já estava, o closeAllDropdowns() já o fechou).
                if (!isCurrentlyShown) {
                    menu.classList.add('show');
                    toggle.setAttribute('aria-expanded', 'true');
                }
            }
            return; // Encerra a função aqui, pois já tratamos o clique no toggle
        }

        // 2. LÓGICA PARA FECHAR O DROPDOWN SE CLICAR FORA
        
        // Se o clique não foi em um toggle, verificamos se foi fora de um menu aberto.
        // Se o elemento clicado NÃO está dentro de um .dropdown, fechamos todos.
        if (!event.target.closest('.dropdown')) {
            closeAllDropdowns();
        }
    });

    /**
     * Função auxiliar para encontrar todos os dropdowns abertos e fechá-los.
     */
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu.show').forEach(function(openMenu) {
            openMenu.classList.remove('show');
            
            // Atualiza também o atributo 'aria-expanded' do botão correspondente
            const dropdown = openMenu.closest('.dropdown');
            if (dropdown) {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    }
	
	  document.addEventListener("DOMContentLoaded", function () {
    // Seu código aqui
    console.log("Página carregada (DOM pronto)");
  });

</script>