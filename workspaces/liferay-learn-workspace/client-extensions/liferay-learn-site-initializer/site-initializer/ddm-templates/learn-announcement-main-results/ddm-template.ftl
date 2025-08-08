<#assign announcement = restClient.get("/c/p2s3learnannouncements/?nestedFields=r_p2S3AnnouncementImageType_c_p2s3AnnouncementImageType&pageSize=500") />

<div class="announcement-container">
	<#if entries?has_content>
		<#list entries as searchEntry>
			<#assign
				className = searchEntry.getClassName()!""
				classPK = searchEntry.getClassPK()!""
				matchingItem = ""
				searchEntryContent = searchEntry.getContent()!languageUtil.get(locale, "no-content-preview", "No content preview")
				searchEntryTitle = searchEntry.getTitle()!""
			/>

			<#list announcement.items as item>
				<#if item.id == classPK>
					<#assign matchingItem = item />
					<#break>
				</#if>
			</#list>

			<div class="announcement-main-container">
				<div class="announcement-group-container">
					<div class="announcement-group-top">
						<div class="announcement-categories">
							<#if matchingItem?? && matchingItem.taxonomyCategoryBriefs?has_content>
								<#list matchingItem.taxonomyCategoryBriefs as cat>
									<span class="category-item">${cat.taxonomyCategoryName}</span>
								</#list>
							</#if>
						</div>

						<div class="announcement-title">
							<#if (searchEntryTitle)??>
								<span>
									${searchEntryTitle}
								</span>
							</#if>
						</div>

						<div class="announcement-date-created">
							<#if entry?has_content && entry.getModifiedDateString()?has_content>
								<#assign dateParts = entry.getModifiedDateString()?split(" ") />

								${dateParts[0]} ${dateParts[1]} ${dateParts[2]}
							</#if>
						</div>
					</div>

					<div class="announcement-description">
						<#if matchingItem?? && matchingItem.description?has_content>
							<span class="description-item">
								${matchingItem.description}
							</span>
						</#if>
					</div>

					<div class="announcement-button">
						<a>${languageUtil.get(locale, "read-more", "Read More")}</a>
					</div>
				</div>

				<div class="announcement-image-container">
					<#if matchingItem?? && matchingItem.r_p2S3AnnouncementImageType_c_p2s3AnnouncementImageType?has_content>
						<#assign imageHref = matchingItem.r_p2S3AnnouncementImageType_c_p2s3AnnouncementImageType.image.link.href!"" />

						<#if imageHref?has_content>
							<img alt="Announcement Image Type" class="announcement-image-type" src="${imageHref}" />
						</#if>
					</#if>
				</div>
			</div>
		</#list>
	</#if>
</div>

<style>
	.announcement-button a {
		align-items: center;
		color: #0B5FFF !important;
		cursor: pointer;
		display: flex;
		font-size: 0.875rem;
		font-weight: 600;
		gap: 4px;
		line-height: 1rem;
		max-width: 108px;
		padding: 8px 0 8px 12px;
		text-align: center;
	}

	.announcement-button a:after {
		background-image: url(";data: image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns=';http: //www.w3.org/2000/svg'%3E%3Cmask id='mask0_141_2460' style=';mask-type:alpha' maskUnits='userSpaceOnUse' x='1' y='4' width='13' height='8'%3E%3Cpath d='M11.4998 11.1703L13.7395 8.76752C14.0773 8.36817 14.0898 7.66344 13.7395 7.23053L11.4998 4.82771C10.4488 3.82765 9.15688 5.35794 10.0671 6.36471L10.5895 6.92514H2.99462C1.6652 6.92514 1.6652 9.07291 2.99462 9.07291H10.5895L10.0671 9.63334C9.13186 10.7005 10.5332 12.167 11.4998 11.1703Z' fill='%230B5FFF'/%3E%3C/mask%3E%3Cg mask='url(%23mask0_141_2460)'%3E%3Crect width='16' height='16' fill='%230B5FFF'/%3E%3C/g%3E%3C/svg%3E%0A");
		background-repeat: no-repeat;
		background-size: contain;
		content: '';
		display: inline-block;
		height: 1rem;
		width: 1rem;
	}

	.announcement-button a:hover {
		background-color: #EDF3FE;
		border: 1px solid none;
		border-radius: 6px;
	}

	.announcement-categories {
		display: flex;
		gap: 8px;
	}

	.announcement-categories span {
		background: #E6EBF5;
		border: 1px solid #E6EBF5;
		border-radius: 4px;
		color: #1C3667;
		font-size: 13px;
		font-weight: 400;
		line-height: 16px;
		padding: 4px 8px;
	}

	.announcement-date-created {
		color: #282934;
		font-size: 0.875rem;
		font-weight: 300;
		line-height: 1rem;
	}

	.announcement-description {
		color: #54555F;
		font-size: 1rem;
		font-weight: 400;
		line-height: 24px;
		width: 95%;
	}

	.announcement-group-container {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		justify-content: space-between;
		padding: 0.5rem 1rem 3rem 0;
		width: 70%;
	}

	.announcement-group-top {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.announcement-image-container {
		display: flex;
		flex-direction: row-reverse;
	}

	.announcement-image-type {
		max-height: 250px;
		max-width: 350px;
		object-fit: contain;
	}

	.announcement-main-container {
		align-items: start;
		border-bottom: 1px solid #E2E2E4;
		display: flex;
		justify-content: space-between;
		padding-bottom: 2.5rem;
		padding-top: 1.5rem;
		width: 100% !important;
	}

	.announcement-title {
		color: #282934;
		font-size: 1.75rem;
		font-weight: 700;
		line-height: 2rem;
	}
</style>