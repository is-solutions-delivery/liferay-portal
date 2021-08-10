<style>
	.tip_container {
		padding: 24px;
		width: auto;
	
		background-color: #F9F9F9;
	}
	.tip_container .title {
		font-size: 24px;
	}
	.tip_container .title::before {
		content: url([resources:action-help.svg]);
	}
	.tip_container li {
		 list-style-image: url([resources:check_gray.svg]);
		 color: #606167;
		 font-size: 16px;
		 font-weight: bold;
	}
	.tip_container .dismiss_container {
		display: flex;
		margin-top: calc(540px - 500px)
	}
	.tip_container .dismiss {
		color: #7D7E85;
		cursor: pointer;
		text-decoration-line: underline;
	}
</style>
<div class="tip_container">
	<#if (title.getData())??>
		<h1 class="title">${title.getData()}</h1>
	</#if>
	
	<p class="subtitle">
		<#if (subtitle.getData())??>
			${subtitle.getData()}
		</#if>
	</p>
	
	<p class="description">
		<#if (description.getData())??>
			${description.getData()}
		</#if>
	</p>
	
	<div class="dismiss_container d-flex justify-content-center">
		<span class="dismiss">Dismiss</span>
	</div>
</div>