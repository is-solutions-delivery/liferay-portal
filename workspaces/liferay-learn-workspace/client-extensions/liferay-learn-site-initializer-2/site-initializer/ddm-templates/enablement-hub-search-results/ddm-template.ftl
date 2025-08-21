<#assign
	locale = themeDisplay.getLocale()

	localeKey = locale?replace("-", "_")
>

<div class="search-results ${(entries?size gte 15)?then('has-border', '')}">
	<div class="search-results__layout">
		<button class="active layout-option" data-layout="grid" type="button">
			<span class="icon">
				<svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
					<mask height="16" id="mask0_3452_26372" maskUnits="userSpaceOnUse" style="mask-type:alpha" width="16" x="0" y="0">
						<path d="M1 0H6C6.55176 0 7 0.447998 7 1V6C7 6.552 6.55176 7 6 7H1C0.448242 7 0 6.552 0 6V1C0 0.447998 0.448242 0 1 0Z" fill="#6B6C7E" />
						<path d="M1 9H6C6.55176 9 7 9.448 7 10V15C7 15.552 6.55176 16 6 16H1C0.448242 16 0 15.552 0 15V10C0 9.448 0.448242 9 1 9Z" fill="#6B6C7E" />
						<path d="M15 0H10C9.44824 0 9 0.447998 9 1V6C9 6.552 9.44824 7 10 7H15C15.5518 7 16 6.552 16 6V1C16 0.447998 15.5518 0 15 0Z" fill="#6B6C7E" />
						<path d="M10 9H15C15.5518 9 16 9.448 16 10V15C16 15.552 15.5518 16 15 16H10C9.44824 16 9 15.552 9 15V10C9 9.448 9.44824 9 10 9Z" fill="#6B6C7E" />
					</mask>

					<g mask="url(#mask0_3452_26372)">
						<rect fill="currentColor" height="16" width="16" />
					</g>
				</svg>
			</span>

			<span class="text">${languageUtil.get(locale, "grid", "Grid")}</span>
		</button>

		<button class="layout-option" data-layout="list" type="button">
			<span class="icon">
				<svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg">
					<mask height="15" id="mask0_3452_26378" maskUnits="userSpaceOnUse" style="mask-type:alpha" width="17" x="-1" y="1">
						<path d="M4.9918 13.0037H14.998C16.3324 13.0037 16.3324 15.002 14.998 15.002H4.9918C3.6668 15.002 3.6668 13.0037 4.9918 13.0037ZM4.9918 9.00731H14.998C16.3324 9.00731 16.3324 7.00909 14.998 7.00909H4.9918C3.6668 7.00909 3.6668 9.00731 4.9918 9.00731ZM4.9918 3.00017H14.998C16.3324 3.00017 16.3324 1.00195 14.998 1.00195H4.9918C3.6668 1.00195 3.6668 3.00017 4.9918 3.00017ZM-0.00195312 2.00418C-0.00195312 3.33425 1.99805 3.33425 1.99805 2.00418C1.99805 0.670999 -0.00195312 0.670999 -0.00195312 2.00418ZM-0.00195312 8.0082C-0.00195312 9.33826 1.99805 9.33826 1.99805 8.0082C1.99805 6.67501 -0.00195312 6.67501 -0.00195312 8.0082ZM-0.00195312 14.0028C-0.00195312 15.3329 1.99805 15.3329 1.99805 14.0028C1.99805 12.6697 -0.00195312 12.6697 -0.00195312 14.0028Z" fill="#6B6C7E" />
					</mask>

					<g mask="url(#mask0_3452_26378)">
						<rect fill="currentColor" height="16" width="16" />
					</g>
				</svg>
			</span>

			<span class="text">${languageUtil.get(locale, "list-view", "List View")}</span>
		</button>
	</div>

	<ul class="search-results__display" data-layout="grid">
		<#assign summary = searchContainer.getResults() />

		<#if entries?has_content>
			<#list entries as entry>
				<#assign documentEntry = summary[entry?index] />

				<@getEntryInfo documentEntry entry />

				<li class="display-item">
					<a href="${entry.getViewURL()}" <#if isDocument>data-icon="${fileExtension}"</#if>>
						<div class="display-item__image">
							<img alt="List Item Thumbnail" src="${thumbnailURL!}" />
						</div>

						<div class="display-item__content">
							<h4 class="content-title">
								${htmlUtil.escape(entry.getTitle())}

								<#if isDocument>
									(.${fileExtension!""})
								</#if>
							</h4>

							<p class="content-description">${description!""}</p>

							<div class="content-info">
								<div class="tag tag--${tagClass!}">${tag!""}</div>

								<p class="date">${entry.getModifiedDateString()}</p>
							</div>
						</div>
					</a>
				</li>
			</#list>
		</#if>
	</ul>
</div>

<#macro getEntryInfo documentEntry entry>
	<#assign
		entryClassName = entry.getClassName()
		isDocument = false
	/>

	<#if entryClassName == "com.liferay.document.library.kernel.model.DLFileEntry">
		<#assign
			ddmFieldArray = documentEntry.get("ddmFieldArray")
			description = documentEntry.get("description")
			fileExtension = documentEntry.get("fileExtension")
			isDocument = true
			thumbnailURL = entry.getThumbnailURLString()!("${themeDisplay.getURLPortal()}/documents/d/global/files-thumbnail")
		/>

		<#if ddmFieldArray?contains("ddmFieldValueKeyword_en_US_String_sortable=[internal & partners]")>
			<#assign
				tag = languageUtil.get(locale, "available-for-partners", "Available for Partners")
				tagClass = "partners"
			/>
		<#elseif ddmFieldArray?contains("ddmFieldValueKeyword_en_US_String_sortable=[liferay staff only]")>
			<#assign
				tag = languageUtil.get(locale, "internal-only", "Internal Only")
				tagClass = "internal"
			/>
		<#else>
			<#assign
				tag = languageUtil.get(locale, "public", "Public")
				tagClass = "public"
			/>
		</#if>

	<#elseif entryClassName?contains("com.liferay.object.model.ObjectDefinition")>
		<#assign
			description = ""
			fallbackDescription = ""
			preferredDescription = ""
			tag = languageUtil.get(locale, "training-kit", "Training Kit")
			tagClass = "training-kit"
			thumbnailURL = "${themeDisplay.getURLPortal()}/documents/d/global/training-kit-thumbnail"
		/>

		<#list documentEntry.getValues("nestedFieldArray") as currentField>
			<#if currentField?contains("fieldName=[overview]")>
				<#if currentField?contains("valueFieldName=[value_${localeKey}]")>
					<#assign preferredDescription = currentField?replace(".*value_${localeKey}=\\[", "", "r")?replace("\\], valueFieldName=.*", "", "r") />
				<#elseif currentField?contains("valueFieldName=[value_en_US]")>
					<#assign fallbackDescription = currentField?replace(".*value_en_US=\\[", "", "r")?replace("\\], valueFieldName=.*", "", "r") />
				</#if>
			</#if>
		</#list>

		<#if preferredDescription?has_content>
			<#assign description = preferredDescription />
		<#elseif !stringUtil.equals(localeKey, "en_US") && fallbackDescription?has_content>
			<#assign description = fallbackDescription />
		</#if>
	</#if>
</#macro>

<style>
	.search-results {
		display: flex;
		flex-direction: column;
		gap: 24px;
		margin-bottom: 1rem;
	}

	.search-results__display {
		display: grid;
		list-style: none;
		padding-left: 0;
	}

	.search-results__display .display-item a {
		display: flex;
		height: 100%;
	}

	.search-results__display .display-item .display-item__content,
	.search-results__display .display-item .display-item__content .content-info {
		display: flex;
		flex-direction: column;
		gap: 8px;
		justify-content: space-between;
	}

	.search-results__display .display-item .display-item__content .content-description {
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		color: #282934 !important;
		display: -webkit-box;
		font-size: 16px;
		font-weight: 400;
		line-clamp: 2;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.search-results__display .display-item .display-item__content .content-info .date {
		color: #54555F;
		font-size: 13px;
		font-weight: 400;
		line-height: 16px;
		margin: 0;
	}

	.search-results__display .display-item .display-item__content .content-info .tag {
		border-radius: 4px;
		font-size: 11px;
		max-width: max-content;
		padding: 1.6px 8px;
	}

	.search-results__display .display-item .display-item__content .content-info .tag--internal {
		background-color: #F7EAE0;
		color: #6F3000;
	}

	.search-results__display .display-item .display-item__content .content-info .tag--partners {
		background-color: #E9F5E8;
		color: #2C6723;
	}

	.search-results__display .display-item .display-item__content .content-info .tag--public {
		background-color: #cce5ff;
		color: #004085;
	}

	.search-results__display .display-item .display-item__content .content-info .tag--training-kit {
		background-color: #E1E1E4;
		color: #54555F;
	}

	.search-results__display .display-item .display-item__content .content-title {
		align-items: center;
		color: #0B5FFF;
		display: flex;
		font-size: 18px;
		font-weight: 600;
		gap: 8px;
		line-height: 20px;
		margin: 0;
	}

	.search-results__display[data-layout="grid"] [data-icon] .display-item__image::before,
	.search-results__display[data-layout="list"] [data-icon] .display-item__content .content-title::before {
		background-position: center;
		background-repeat: no-repeat;
		background-size: 16px;
		content: "";
		display: inline-block;
	}

	.search-results__display[data-layout="grid"] [data-icon="pdf"] .display-item__image::before,
	.search-results__display[data-layout="list"] [data-icon="pdf"] .display-item__content .content-title::before {
		background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_328_15609' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='2' y='0' width='12' height='16'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M10.25 0H3.5C2.6709 0 2 0.670898 2 1.5V14.5C2 15.3291 2.6709 16 3.5 16H12.5C13.3291 16 14 15.3291 14 14.5V3.75L10.25 0ZM12 7.5C12 7.77614 11.7761 8 11.5 8H4.5C4.22386 8 4 7.77614 4 7.5C4 7.22386 4.22386 7 4.5 7H11.5C11.7761 7 12 7.22386 12 7.5ZM11.5 9H4.5C4.22386 9 4 9.22386 4 9.5C4 9.77614 4.22386 10 4.5 10H11.5C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM4.5 11H7.5C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12H4.5C4.22386 12 4 11.7761 4 11.5C4 11.2239 4.22386 11 4.5 11Z' fill='black'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_328_15609)'%3E%3Crect width='16' height='16' fill='%23E60000'/%3E%3C/g%3E%3C/svg%3E%0A");
	}

	.search-results__display[data-layout="grid"] [data-icon="pptx"] .display-item__image::before,
	.search-results__display[data-layout="list"] [data-icon="pptx"] .display-item__content .content-title::before {
		background-image: url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cmask id='mask0_551_38388' style='mask-type:alpha' maskUnits='userSpaceOnUse' x='2' y='0' width='12' height='16'%3E%3Cpath d='M10.25 0.5H3.5C2.6709 0.5 2 1.1709 2 2V14C2 14.8291 2.6709 15.5 3.5 15.5H12.5C13.3291 15.5 14 14.8291 14 14V4.25L10.25 0.5ZM9.5 11.75H6.5V11H9.5V11.75ZM11.75 10.25H4.25V6.5H11.75V10.25Z' fill='%236B6C7E'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_551_38388)'%3E%3Crect width='16' height='16' fill='%23FF6200'/%3E%3C/g%3E%3C/svg%3E%0A");
	}

	.search-results__display[data-layout="grid"] {
		gap: 32px;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
	}

	.search-results__display[data-layout="grid"] .display-item {
		border: 1px solid #e7e7ed;
		border-radius: 4px;
		box-shadow: 0px 2px 4px 0px #2728331F;
		flex-direction: column;
		height: 350px;
		transform: scale(1);
		transition: transform 0.3s;
	}

	.search-results__display[data-layout="grid"] .display-item:active,
	.search-results__display[data-layout="grid"] .display-item:focus,
	.search-results__display[data-layout="grid"] .display-item:focus-visible,
	.search-results__display[data-layout="grid"] .display-item:focus-within,
	.search-results__display[data-layout="grid"] .display-item:hover {
		transform: scale(1.05);
	}

	.search-results__display[data-layout="grid"] .display-item a {
		flex-direction: column;
	}

	.search-results__display[data-layout="grid"] .display-item .display-item__content {
		flex-grow: 1;
		padding: 12px 8px 12px 16px;
	}

	.search-results__display[data-layout="grid"] .display-item .display-item__content .content-title {
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		display: -webkit-box;
		line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.search-results__display[data-layout="grid"] .display-item .display-item__image {
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
		position: relative;
	}

	.search-results__display[data-layout="grid"] .display-item .display-item__image img {
		border-top-left-radius: inherit;
		border-top-right-radius: inherit;
		height: 160px;
		object-fit: cover;
		object-position: 0 20%;
		vertical-align: middle;
		width: 100%;
	}

	.search-results__display[data-layout="grid"] [data-icon] .display-item__image::before {
		background-color: white;
		border-radius: 4px;
		bottom: 16px;
		height: 32px;
		left: 16px;
		padding: 8px;
		position: absolute;
		width: 32px;
	}

	.search-results__display[data-layout="list"] {
		gap: 24px;
		grid-template-columns: 1fr;
	}

	.search-results__display[data-layout="list"] .display-item {
		border-radius: 10px;
		height: 156px;
	}

	.search-results__display[data-layout="list"] .display-item:active,
	.search-results__display[data-layout="list"] .display-item:focus,
	.search-results__display[data-layout="list"] .display-item:focus-visible,
	.search-results__display[data-layout="list"] .display-item:focus-within,
	.search-results__display[data-layout="list"] .display-item:hover {
		background: #EDF3FE;
	}

	.search-results__display[data-layout="list"] .display-item a {
		border-radius: inherit;
		gap: 8px;
		padding: 16px;
	}

	.search-results__display[data-layout="list"] .display-item .display-item__content {
		justify-content: space-between;
		padding: 0;
		width: 80%;
	}

	.search-results__display[data-layout="list"] .display-item .display-item__image img {
		height: 83px;
		object-fit: cover;
		object-position: center;
		width: 83px;
	}

	.search-results__display[data-layout="list"] .display-item [data-icon] .display-item__content .content-title::before {
		height: 16px;
		position: relative;
		width: 16px;
	}

	.search-results.has-border {
		border-bottom: 1px solid #E2E2E4;
	}

	.search-results__layout {
		border: 1px solid #E2E2E4;
		border-radius: 10px;
		display: flex;
		max-width: max-content;
	}

	.search-results__layout .layout-option {
		background: #FFFFFF;
		border: none;
		color: #999AA3;
		padding: 8px 16px;
	}

	.search-results__layout .layout-option.active {
		background: #F7F7F8;
		color: #282934;
	}

	.search-results__layout .layout-option .text {
		font-size: 16px;
		font-weight: 600;
		margin-left: 4px;
	}

	.search-results__layout .layout-option[data-layout="grid"] {
		border-bottom-left-radius: inherit;
		border-right: 1px solid #E2E2E4;
		border-top-left-radius: inherit;
	}

	.search-results__layout .layout-option[data-layout="list"] {
		border-bottom-right-radius: inherit;
		border-top-right-radius: inherit;
	}

	@media(max-width: 454px){
		.search-results__display[data-layout="list"] .display-item {
			height: max-content;
		}

		.search-results__display[data-layout="list"] .display-item a {
			flex-wrap: wrap;
		}
	}
</style>

<script>
	function changeLayoutView() {
		const displayLayout = document.querySelector(".search-results__display");
		const layoutOptions = document.querySelectorAll(".search-results__layout .layout-option");
		const layoutPreference = localStorage.getItem("@liferay/_sa_s_layout");

		layoutOptions.forEach(currentOption => {
			if (layoutPreference && currentOption.dataset.layout === layoutPreference) {
				layoutOptions.forEach(option => option.classList.remove("active"));

				currentOption.classList.add("active");
				displayLayout.dataset.layout = layoutPreference;
			}

			currentOption.addEventListener("click", () => {
				layoutOptions.forEach(option => option.classList.remove("active"));

				currentOption.classList.add("active");
				displayLayout.dataset.layout = currentOption.dataset.layout;

				localStorage.setItem("@liferay/_sa_s_layout", currentOption.dataset.layout);
			});
		});
	}

	changeLayoutView();
</script>