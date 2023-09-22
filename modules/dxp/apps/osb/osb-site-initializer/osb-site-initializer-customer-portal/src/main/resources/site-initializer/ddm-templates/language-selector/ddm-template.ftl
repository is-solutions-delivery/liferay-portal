<div class="language-selector-container ml-2">
	<button class="d-flex language language-selector language-selector-${template_id} px-2 py-2 utility-nav-link" data-toggle="liferay-dropdown" id="language-selector-id" tabindex="${template_id}">
		<div class="language-selector-globe-icon"><@clay["icon"] symbol="globe-lines"/></div>
		<div class="language-selector-text">
			<#assign current_locale = locale />
			<#if current_locale?has_content>
				<#assign current_locale = locale[0..1] + " (" + locale[3..4] + ")" />
			</#if>
			${current_locale?upper_case}
		</div>

		<div>
			<span class="language-caret-icon">
				<@clay["icon"] symbol="caret-bottom-l" />
			</span>
			<span class="d-none language-caret-icon">
				<@clay["icon"] symbol="caret-top-l" />
			</span>
		</div>
	</button>

	<div aria-labelledby="language-selector-id" class="dropdown-menu dropdown-menu-content">
		<div class="language-dropdown-list-container">
			<div class="language-dropdown-list">
				<ul>
					<#if entries?has_content>
						<#list entries as curLanguage>
							<li class="${(curLanguage.isSelected())?then('selected', '')} language-nav-item">
								<#if curLanguage.isSelected()>
									<div class="d-inline-block selected-icon">
										<@clay["icon"] symbol="check" />
									</div>
								</#if>

								<#assign curLanguageLabel = curLanguage.longDisplayName?capitalize />
								<#if curLanguage.shortDisplayName = "en" | curLanguage.shortDisplayName = "pt">
									<#assign
										curLanguageLocale = curLanguage.getLocale()
										curLanguageLabel = curLanguageLabel + " (" + curLanguageLocale.getDisplayCountry(curLanguageLocale) + ")"
									/>
								</#if>

								<@liferay_aui["a"]
									cssClass="language-entry-long-text"
									href=curLanguage.getURL()
									label=curLanguageLabel
									lang=curLanguage.getW3cLanguageId()
									localizeLabel=false
								/>
							</li>
						</#list>
					</#if>
				</ul>
			</div>
		</div>
	</div>
</div>

<script>
	const languageBtn = document.querySelector(`.language-selector-${template_id}`);
	const languageBtnIcons = languageBtn.querySelectorAll(
		'.language-caret-icon'
	);

	languageBtn.addEventListener('click', () => {
		languageBtnIcons.forEach((cur_languageBtnIcon) => {
			cur_languageBtnIcon.classList.toggle('d-none');
		});
	});
</script>

<style>
.portlet {
	margin-bottom: 0px !important;
}

.language-selector-container .language-selector {
	background: inherit;
	border: none;
	border-radius: var(--border-radius-sm);
	color: var(--black);
	cursor: pointer;
	display: inline-block;
	font-weight: bolder;
	padding-right: 0;
}

.language-selector-container .language-selector .lexicon-icon-caret-bottom-l {
	height: 1.5rem;
	padding-bottom: 0.1rem;
	width: 1.5rem;
}

.language-selector-container .language-selector .language-selector-globe-icon,
.language-selector-container .language-selector .language-caret-icon {
	opacity: 0.5;
}

.language-selector-container .language-selector .language-selector-text {
	opacity: 0.8;
}

.language-selector-container .dropdown-menu-content.dropdown-menu {
	max-height: fit-content;
	min-width: 288px;
}

.language-selector-container .language-selector svg {
	height: 1.5rem;
	padding-bottom: 0.1rem;
	width: 1.5rem;
	margin-right: 0.25rem;
}

.language-selector-container .language-selector.list-open .language-caret-icon {
	transform: translate3d(0, 0, 0) scale3d(1, 1, 1) rotateX(180deg)
		rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
}

.language-selector-container .language-selector.list-open .language-selector-globe-icon,
.language-selector-container .language-selector.list-open .language-caret-icon {
	opacity: 0.7;
}

.language-selector-container .language-selector:hover {
	background-color: #edf3fe !important;
	color: #0053f0 !important;
}

.language-selector-container .language-selector:hover .language-selector-globe-icon,
.language-selector-container .language-selector:hover .language-caret-icon {
	opacity: 1;
}

.language-selector-container .language-dropdown-list-container .language-dropdown-list ul {
	padding-inline-start: 0;
}

.language-selector-container .language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item {
	align-items: center;
	border-radius: var(--border-radius-xs);
	display: flex;
	font-weight: var(--font-weight-semi-bold);
	text-align: left;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item:active,
.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item:focus,
.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item:hover {
	background-color: #edf3fe !important;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item
	.language-entry-long-text {
	color: var(--black);
	padding: 0.75rem 0.75rem 0.75rem 3.5rem;
	width: 100%;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item
	.selected-icon {
	height: 16px;
	width: 16px;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item
	.selected-icon svg{
	height: 100%;
	width: 100%;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item
	.language-entry-long-text:active,
.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item
	.language-entry-long-text:focus,
.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item
	.language-entry-long-text:hover {
	color: var(--black);
	text-decoration: none;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item.selected {
		padding-left: 1.5rem;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item.selected:before {
	margin: 0 1rem;
}

.language-selector-container
	.language-dropdown-list-container
	.language-dropdown-list
	.language-nav-item.selected
	span.language-entry-long-text {
	padding-left: 1rem;
}
</style>