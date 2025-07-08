package com.liferay.marketplace.util;

import com.liferay.headless.commerce.admin.order.client.dto.v1_0.Order;
import com.liferay.marketplace.service.MarketplaceService;

import java.net.URL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

public class ConsoleProjectContext {

	public ConsoleProjectContext(
			MarketplaceService marketplaceService, Jwt jwt, long orderId,
			String trialDXPDomain, String ssaTrialDXPDomain,
			URL externalTrialHomePageURL, URL externalSSATrialHomePageURL,
			String consoleProjectUid, String consoleSSAProjectUid,
			String consoleProjectPrefix, String consoleSSAProjectPrefix,
			String consoleCluster, String consoleSSACluster)
		throws Exception {

		Order order = marketplaceService.getOrder(orderId);

		this.orderType = order.getOrderTypeExternalReferenceCode();

		if ("SSA_SAAS".equals(orderType)) {
			String subdomain = (jwt != null) ?
				jwt.getClaim(
					"username"
				).toString() : String.valueOf(orderId);

			this.domain = subdomain + "." + ssaTrialDXPDomain;
			this.externalTrialHomePageURL = externalSSATrialHomePageURL;
			this.oauthERC = "external-ssa-trial";
			this.consoleProjectUid = consoleSSAProjectUid;
			this.consoleProjectPrefix = consoleSSAProjectPrefix;
			this.consoleCluster = consoleSSACluster;
		}
		else if ((orderType != null) && orderType.startsWith("SOLUTIONS")) {
			this.externalTrialHomePageURL = externalTrialHomePageURL;
			this.consoleProjectUid = consoleProjectUid;
			this.consoleProjectPrefix = consoleProjectPrefix;
			this.consoleCluster = consoleCluster;

			this.domain = orderId + "." + trialDXPDomain;
			this.oauthERC = "external-trial";
		}
		else {
			throw new IllegalArgumentException(
				"Unsupported orderType: " + orderType);
		}
	}

	public String getConsoleCluster() {
		return consoleCluster;
	}

	public String getConsoleProjectPrefix() {
		return consoleProjectPrefix;
	}

	public String getConsoleProjectUid() {
		return consoleProjectUid;
	}

	public String getDomain() {
		return domain;
	}

	public URL getExternalHomePageURL() {
		return externalTrialHomePageURL;
	}

	public String getOauthERC() {
		return oauthERC;
	}

	public String getOrderType() {
		return orderType;
	}

	@Component
	public static class Factory {

		public ConsoleProjectContext create(Jwt jwt, long orderId)
			throws Exception {

			return new ConsoleProjectContext(
				_marketplaceService, jwt, orderId, trialDXPDomain,
				ssaTrialDXPDomain, externalTrialHomePageURL,
				externalSSATrialHomePageURL, consoleProjectUid,
				consoleSSAProjectUid, consoleProjectPrefix,
				consoleSSAProjectPrefix, consoleCluster, consoleSSACluster);
		}

		@Autowired
		@Lazy
		private MarketplaceService _marketplaceService;

		@Value("${liferay.marketplace.console.cluster}")
		private String consoleCluster;

		@Value("${liferay.marketplace.console.project.prefix}")
		private String consoleProjectPrefix;

		@Value("${liferay.marketplace.console.project.uid}")
		private String consoleProjectUid;

		@Value("${liferay.marketplace.ssa.console.cluster}")
		private String consoleSSACluster;

		@Value("${liferay.marketplace.ssa.console.project.prefix}")
		private String consoleSSAProjectPrefix;

		@Value("${liferay.marketplace.ssa.console.project.uid}")
		private String consoleSSAProjectUid;

		@Value("${external.ssa.trial.oauth2.headless.server.home.page.url}")
		private URL externalSSATrialHomePageURL;

		@Value("${external.trial.oauth2.headless.server.home.page.url}")
		private URL externalTrialHomePageURL;

		@Value("${liferay.marketplace.ssa.trial.dxp.domain}")
		private String ssaTrialDXPDomain;

		@Value("${liferay.marketplace.trial.dxp.domain}")
		private String trialDXPDomain;

	}

	private final String consoleCluster;
	private final String consoleProjectPrefix;
	private final String consoleProjectUid;
	private final String domain;
	private final URL externalTrialHomePageURL;
	private final String oauthERC;
	private final String orderType;

}