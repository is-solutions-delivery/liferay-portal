<#assign
	groupPathFriendlyURLPublic = themeDisplay.getPathFriendlyURLPublic() + themeDisplay.getScopeGroup().getFriendlyURL()
	navigationJSONObject = jsonFactoryUtil.createJSONObject(navigation.getData())

	courseData = navigationJSONObject.getJSONObject("course")
	modulesJSONArray = navigationJSONObject.getJSONArray("modules")
/>

<div class="learn-course-side-nav">
	<div class="learn-course-nav-content">
		<#if modulesJSONArray.length() gt 0>
			<ul class="m-0 p-2">
				<li class="learn-course-nav-item ${(navigationJSONObject.getJSONObject("self").url == courseData.url)?then("selected", "")}">
					<a class="liferay-nav-item" href="${courseData.url}">
						<span>Introduction</span>
					</a>
				</li>

				<#list 0..modulesJSONArray.length()-1 as i>
					<div>
						<#assign
							module = modulesJSONArray.getJSONObject(i)

							lessons = module.getJSONArray("lessons")
						/>

						<div class="panel-group">
							<div class="panel panel-secondary">
								<button
									aria-controls= "collapsePanel${i}"
									aria-expanded="false"
									class="btn btn-unstyled panel-header panel-header-link collapse-icon collapse-icon-middle collapsed"
									data-target= "#collapsePanel${i}"
									data-toggle="liferay-collapse"
									onclick="togglePanel(this)"
								>
									<span class="panel-title">
										<li class="learn-course-nav-item">
											<div
												class="liferay-nav-item ${(navigationJSONObject.getJSONObject("self").url == module.url)?then("selected", "")}"
												href="${module.url}"
												style="display: flex; justify-content: space-between;"
										>
												<div class="nav-item-number-title">
													<div>
														<span class="course-module-number">${i+1}</span>
													</div>

													<span class="course-module-title">${module.getString("title")}</span>
												</div>
											</div>

											<span class="collapse-icon-closed">
											<svg
												class="lexicon-icon lexicon-icon-angle-right"
												role="presentation"
											>
												<use xlink:href="/o/admin-theme/images/clay/icons.svg#angle-right"></use>
											</svg>
											</span>
											<span class="collapse-icon-open">
												<svg
													class="lexicon-icon lexicon-icon-angle-down"
													role="presentation"
												>
													<use xlink:href="/o/admin-theme/images/clay/icons.svg#angle-down"></use>
												</svg>
											</span>
										</li>
									</span>
								</button>

								<div class="panel-collapse collapse" id="collapsePanel${i}">
									<div class="panel-body">
										<#assign lessons = lessons?eval_json />

										<#list lessons as lesson>
											<div class="container-lesson"><div class="course-module-transparent" ></div><a href="${lesson.url}">${lesson.title}</a></div>
										</#list>
									</div>
								</div>
							</div>
						</div>
					</div>
				</#list>
			</ul>
		</#if>
	</div>
</div>

<script>
	function togglePanel(button) {
		const courseModuleNumber = button.querySelector('.course-module-number');
		const liferayNavItem = button.querySelector('.liferay-nav-item');
		
		if (button.getAttribute('aria-expanded') === 'true') {
			button.setAttribute('aria-expanded', 'false');
			courseModuleNumber.classList.remove('highlighted');
			liferayNavItem.classList.remove('highlightedNavItem');
		}
		else {
			button.setAttribute('aria-expanded', 'true');
			courseModuleNumber.classList.add('highlighted');
			liferayNavItem.classList.add('highlightedNavItem');
		}
	}
</script>