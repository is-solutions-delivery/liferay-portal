<style>	
    .details-section {
        border-bottom:solid 1px  #EBEEF2;
    }

    .help-and-support-link-icon {
        color: rgb(133, 140, 148);
    }
</style>

<div class="d-flex flex-column">
	<#if (ObjectField_websiteURL.getData())??>
		
		<#assign publisherUrlFiltered=ObjectField_websiteURL.getData()>
		<#assign publisherUrl = publisherUrlFiltered?trim?replace(' ', '') />

		<#if publisherUrl?starts_with("http://") || publisherUrl?starts_with("https://")>
			<#assign sanitizedUrl = publisherUrl />
	<#else>
			<#assign sanitizedUrl = "https://" + publisherUrl />
		</#if>

		<div class="d-flex mb-2 flex-column details-section">
			<div>
				<div class="h4 mb-2">
					WEBSITE
				</div>
			</div>
			
			<div class="d-flex flex-row mb-4">
				<span class="help-and-support-link-icon">
					<@clay["icon"] symbol="display"/>
				</span>

				<a class="d-flex w-100 justify-content-between help-and-support-link" href="${sanitizedUrl}" target="_blank">
					<span class="copy-text ml-2 help-and-support-link">
						${sanitizedUrl}
					</span>
				</a>
			</div>
		</div>
	</#if>
	
	<#if (ObjectField_emailAddress.getData())??>
		<div class="d-flex mb-2 flex-column details-section">
			<div>
				<div class="h4 mb-2">
					MAIL
				</div>
			</div>
			
			<div class="d-flex flex-row mb-4">
				<span class="help-and-support-link-icon">
					<@clay["icon"] symbol="envelope-closed"/>
				</span>

				<a class="d-flex w-100 justify-content-between help-and-support-link" href="mailto:	${ObjectField_emailAddress.getData()}">
					<span class="copy-text ml-2 help-and-support-link">
						${ObjectField_emailAddress.getData()}
					</span>
				</a>
			</div>
		</div>
	</#if>
	
	<#if (ObjectField_location.getData())??>
		<div class="d-flex mb-2 flex-column ">
			<div>
				<div class="h4 mb-2">
					LOCATION
				</div>
			</div>
			
			<div class="d-flex flex-row mb-4">
				<span class="help-and-support-link-icon">
						<@clay["icon"] symbol="geolocation"/>
				</span>

				<a class="d-flex w-100 justify-content-between help-and-support-link" href="https://www.google.com/maps?q=${ObjectField_location.getData()}" target="_blank">
					<span class="copy-text ml-2 help-and-support-link">
							${ObjectField_location.getData()}
					</span>
				</a>
			</div>
		</div>
	</#if>
</div>