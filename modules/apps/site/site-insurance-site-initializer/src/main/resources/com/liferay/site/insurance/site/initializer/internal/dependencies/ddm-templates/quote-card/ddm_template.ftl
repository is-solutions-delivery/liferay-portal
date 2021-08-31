<style>
	#quote {
		background-color: #FFF;
		border-radius: 8px;
		width: 292px;
		height: 576px;
		border: 1px solid #A6C2FF;
	}
	
	#quote .quote-content {
		padding: 24px;
		display: flex;
		height: 549px;
		flex-direction: column;
		justify-content: space-between;
	}
	
	#quote .quote-header {
		text-align: center;
	}
	
	#quote .quote-header .title {
		font-weight: 700;
		font-size: 24px;
		color: #4D85FF;
		line-height: 28px;
	}
	
	#quote .quote-header .value {
		font-weight: 800;
		font-size: 49px;
		color: #09101D;
		line-height: 56px;
	}
	
	#quote .quote-header .value span {
		font-weight: 300;
		font-size: 37px;
		color: #2F313D;
	}
	
	#quote .quote-header .subtitle {
		font-weight: 500;
		font-size: 11px;
		color: #606167;
		line-height: 16px;
	}
	
	#quote .quote-header .subtitle span {
		color: #4D85FF;
	}
	
	#quote .most-popular  {
		background-color: #F4870B;
		border-radius: 8px;
		height: 25px;
		font-size: 18px;
		font-weight: 600;
		color: #FFF;
		border-radius: 8px 8px 0 0;
		text-align: center;
	}
	
	#quote ul {
		padding: 0;
	}

	#quote li {
		color: #606167;
		font-size: 13px;
		font-weight: 500;
		list-style: none;
		display: flex;
    justify-content: space-between;
		flex: auto;
	}
	
	#quote li:not(last-child) {
		margin-bottom: 24px;
	}
	
	#quote li .checkIcon,
	#quote li .closeIcon {
		display: flex;
	}
	
	<#if checkIcon.getData() ?? && checkIcon.getData() != "">
		#quote li .checkIcon::before {
			background-color: #4D85FF;
			content: "";
			display: inline-block;
			height: 16px;
			margin-right: 4px;
			mask: url(${checkIcon.getData()}) no-repeat 50% 50%;
			width: 16px;
			-webkit-mask: url(${checkIcon.getData()}) no-repeat 50% 50%;
			-webkit-mask-size: cover;
		}
	</#if>

	<#if closeIcon.getData() ?? && closeIcon.getData() != "">
		#quote li .closeIcon::before {
			background-color: #606167;
			content: "";
			display: inline-block;
			height: 16px;
			margin-right: 4px;
			mask: url(${closeIcon.getData()}) no-repeat 50% 50%;
			width: 16px;
			-webkit-mask: url(${closeIcon.getData()}) no-repeat 50% 50%;
			-webkit-mask-size: cover;
		}
	</#if>

	#quote #purchase {
		color: #4C85FF;
		cursor: pointer;
		background: none;
		border: 1px solid #4C85FF;
		padding: 0;
		border-radius: 4px;
		padding: 16px 12px;
	}
	
	#quote #purchase:hover {
		color: #FFF;
		cursor: pointer;
		background: #4C85FF;
		border: 1px solid #4C85FF;
		padding: 0;
		border-radius: 4px;
		padding: 16px 12px;
		font-size: 16px;
		font-weight: 700;
	}

	#quote #dismiss {
		color: #7D7E85;
		cursor: pointer;
		background: none;
		border: none;
		padding-top: 16px;
		text-decoration-line: underline;
		font-size: 16px;
		font-weight: 500;
	}

</style>

<div id="quote">
		<#if (mostPopular.getData())??>
			<div class="most-popular">${mostPopular.getData()}</div>
		</#if>
		<div class="quote-content">
			<div class="quote-header">
				<#if (title.getData())??>
					<div class="title">${title.getData()}</div>
				</#if>
				<#if (value.getData())??>
					<div class="value">${value.getData()}</div>
				</#if>
				<#if (subtitle.getData())??>
					<div class="subtitle">
						${subtitle.getData()}
					</div>
				</#if>
			</div>
			<div class="quote-body">
				<#if (listTerms.getData())??>
					${listTerms.getData()}
				</#if>
			</div>
			<div class="quote-footer">
				<div class="d-flex justify-content-center">
					<button type="button" id="purchase" onclick="event.preventDefault();">PURCHASE THIS POLICY</button>
				</div>
				<div class="d-flex justify-content-center">
					<button type="button" id="dismiss" onclick="event.preventDefault();">Policy Details</button>
				</div>
			</div>
	</div>
</div>