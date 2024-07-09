<#assign
	navigationJSONObject = jsonFactoryUtil.createJSONObject(navigation.getData())

	courseJSONObject = navigationJSONObject.getJSONObject("course")
	modulesJSONArray = navigationJSONObject.getJSONArray("modules")

	lastModuleLessonsJSONObject = modulesJSONArray.getJSONObject(modulesJSONArray.length() - 1).lessons

	lastCourseLessonJSONObject = lastModuleLessonsJSONObject.getJSONObject(modulesJSONArray.length() - 1)
	previousLesson =
		{
			"title": "",
			"url": ""
		}
	selfJSONObject = navigationJSONObject.getJSONObject("self")
/>

<#if modulesJSONArray.getJSONObject(0).url == selfJSONObject.url>
	<#assign
		previousLesson =
			{
				"title": "Introduction",
				"url": selfJSONObject.url + "/introduction"
			}
		nextLesson =
			{
		"title": modulesJSONArray.getJSONObject(0).lessons.getJSONObject(0).title,
				"url": modulesJSONArray.getJSONObject(0).lessons.getJSONObject(0).url
			}
	/>
</#if>
<#if lastCourseLessonJSONObject.url == selfJSONObject.url>
	<#assign nextLesson =
		{
			"title": "Finish the course",
			"url": selfJSONObject.url + "/congratulations"
		}
	/>
</#if>

<#list 0..modulesJSONArray.length()-1 as i>
	<#if modulesJSONArray.getJSONObject(i).url == selfJSONObject.url>
		<#if !previousLesson?has_content>
			<#assign
				previousModuleLessonsJSONObject = modulesJSONArray.getJSONObject(i-1).lessons
				previousLesson =
					{
						"title": previousModuleLessonsJSONObject.getJSONObject(previousModuleLessonsJSONObject.length() -1).title,
						"url": previousModuleLessonsJSONObject.getJSONObject(previousModuleLessonsJSONObject.length() -1).url
					}
			/>
		</#if>
		<#assign
			nextLesson =
				{
					"title": modulesJSONArray.getJSONObject(i).lessons.getJSONObject(0).title,
					"url": modulesJSONArray.getJSONObject(i).lessons.getJSONObject(0).url
				}
		/>
	<#else>
		<#assign currentModuleLessonsJSONArray = modulesJSONArray.getJSONObject(i).getJSONArray("lessons") />

		<#list 0..currentModuleLessonsJSONArray.length()-1 as j>
			<#if currentModuleLessonsJSONArray.getJSONObject(j).url == selfJSONObject.url>
				<#if j == 0>
					<#assign previousLesson =
						{
							"title": modulesJSONArray.getJSONObject(i).title,
							"url": modulesJSONArray.getJSONObject(i).url
						}
					/>
				<#elseif previousLesson?has_content>
					<#assign
						previousLesson =
							{
								"title": currentModuleLessonsJSONArray.getJSONObject(j-1).title,
								"url": currentModuleLessonsJSONArray.getJSONObject(j-1).url
							}
					/>
				</#if>

				<#if !nextLesson?has_content>
					<#if j == currentModuleLessonsJSONArray.length()-1>
						<#assign
							nextLesson =
								{
									"title": modulesJSONArray.getJSONObject(i+1).title,
									"url": modulesJSONArray.getJSONObject(i+1).url
								}
						/>
					<#else>
						<#assign
							nextLesson =
								{
									"title": currentModuleLessonsJSONArray.getJSONObject(j+1).title,
									"url": currentModuleLessonsJSONArray.getJSONObject(j+1).url
								}
						/>
					</#if>
				</#if>
			</#if>
		</#list>
	</#if>
</#list>

<a href=${nextLesson.url}>
	<div class="course-nav-bottom__banner d-flex">
		<div class="banner-options d-flex">
			<div class="banner-next-container">
				Up next
			</div>

			<div class="banner-title">
				${nextLesson.title}
			</div>
		</div>

		<div class="banner-icon">
			<svg
				class="lexicon-icon lexicon-icon-order-arrow-right"
				role="presentation"
				viewBox="0 0 512 512"
				>
					<use xlink:href="/o/admin-theme/images/clay/icons.svg#order-arrow-right"></use>
			</svg>
		</div>
	</div>
</a>

<div class="course-nav-bottom__menu d-flex">
	<div class="menu-previous-lesson d-flex">
			<a href=${previousLesson.url}>
			<div class="previous-lesson-icon">
				<svg
				class="lexicon-icon lexicon-icon-order-arrow-left"
				role="presentation"
				viewBox="0 0 512 512"
				>
					<use xlink:href="/o/admin-theme/images/clay/icons.svg#order-arrow-left"></use>
				</svg>
			</div>
		</a>

		<div class="previous-lesson-title">
			Previous Lesson
		</div>
	</div>

	<#if !themeDisplay.isSignedIn()>
		<div class="menu-sign-in">
			<a href="${htmlUtil.escape(themeDisplay.getURLSignIn())}">Sign in</a> to save your progress!
		</div>
	</#if>
</div>

<script>
	document.querySelector('.course-nav-bottom__banner').style.height = document.querySelector('.course-nav-bottom__banner').offsetHeight + "px";
</script>