<style>
	#tip {
		background-color: #F9F9F9;
		padding: 24px;
		width: auto;
	}

	#tip.hide {
		opacity: 0;
		transition: opacity .5s linear;
		pointer-events: none;
	}
	
	#tip li {
		<#if listIcon.getData() ?? && listIcon.getData() != "">
			list-style-image: url(${listIcon.getData()});
		</#if>
		color: #606167;
		font-size: 16px;
		font-weight: bold;
	}
	
	#tip .dismiss_container {
		display: flex;
		margin-top: calc(540px - 500px)
	}
	
	#tip #dismiss {
		color: #7D7E85;
		cursor: pointer;
		background: none;
		border: none;
		padding: 0;
		text-decoration-line: underline;
	}

	#tip .title {
		font-size: 24px;
	}
	
	<#if titleIcon.getData() ?? && titleIcon.getData() != "">
		#tip .title::before {
			content: url(${titleIcon.getData()});
			margin-right: 5px;
		}
	</#if>

	<#if externalLinkIcon.getData() ?? && externalLinkIcon.getData() != "">
		.tip_container .external_link a::after {
			content: url(${externalLinkIcon.getData()});
			margin-left: 5px;
		}
	</#if>
</style>

<div id="tip">
	<#if (title.getData())??>
		<h1 class="title">${title.getData()}</h1>
	</#if>
	
	<#if (subtitle.getData())??>
		<p class="subtitle">
			${subtitle.getData()}
		</p>
	</#if>
	
	<#if (actionList.getData())??>
		${actionList.getData()}
	</#if>

	<#if (description.getData())??>
		<p class="description">
			${description.getData()}
		</p>
	</#if>

	<#if (externalLink.getData())??>
		<div class="external_link">
			${externalLink.getData()}
		</div>
	</#if>
	
	<div class="dismiss_container d-flex justify-content-center">
		<button type="button" id="dismiss" onclick="event.preventDefault(); document.getElementById('tip').classList.add('hide');">Dismiss</button>
	</div>
</div>