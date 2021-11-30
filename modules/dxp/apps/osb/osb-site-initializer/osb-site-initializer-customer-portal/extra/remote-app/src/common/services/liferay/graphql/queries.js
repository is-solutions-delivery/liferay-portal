import {gql} from '@apollo/client';

export const getUserAccountById = gql`
	query userAccount($userAccountId: Long) {
		userAccount(userAccountId: $userAccountId) {
			id
			name
			image
			externalReferenceCode
			accountBriefs {
				id
				name
				externalReferenceCode
			}
		}
	}
`;

export const getDXPCDataCenterRegions = gql`
	query dXPCDataCenterRegions {
		c {
			dXPCDataCenterRegions {
				items {
					dxpcDataCenterRegionId
					name
					value
				}
			}
		}
	}
`;

export const getKoroneikiAccounts = gql`
	query koroneikiAccounts(
		$aggregation: [String]
		$filter: String
		$page: Int = 1
		$pageSize: Int = 20
		$search: String
		$sort: String
	) {
		c {
			koroneikiAccounts(
				aggregation: $aggregation
				filter: $filter
				page: $page
				pageSize: $pageSize
				search: $search
				sort: $sort
			) {
				items {
					accountKey
					code
					dxpVersion
					slaCurrent
					slaExpired
					slaFuture
					slaCurrentEndDate
					region
					liferayContactName
					liferayContactRole
					liferayContactEmailAddress
				}
			}
		}
	}
`;

export const pageGuard = gql`
	query accountRolesAndAccountFlags(
		$accountId: Long
		$accountFlagsFilter: String
	) {
		accountAccountRoles(accountId: $accountId) {
			items {
				id
				name
			}
		}
		c {
			accountFlags(filter: $accountFlagsFilter) {
				items {
					accountKey
					name
					userUuid
				}
			}
		}
	}
`;

export const accountSubscription = gql`
	query accountSubscriptions(
		$aggregation: [String]
		$filter: String
		$page: Int = 1
		$pageSize: Int = 20
		$search: String
		$sort: String
	) {
		c {
			accountSubscriptions(
				aggregation: $aggregation
				filter: $filter
				page: $page
				pageSize: $pageSize
				search: $search
				sort: $sort
			) {
				items {
					accountKey
					name
				}
			}
		}
	}
`;

export const bannedEmailDomains = gql`
	query bannedEmailDomains(
		$aggregation: [String]
		$filter: String
		$page: Int = 1
		$pageSize: Int = 20
		$search: String
		$sort: String
	) {
		c {
			bannedEmailDomains(
				aggregation: $aggregation
				filter: $filter
				page: $page
				pageSize: $pageSize
				search: $search
				sort: $sort
			) {
				items {
					bannedEmailDomainId
					domain
				}
			}
		}
	}
`;

export const getAccountSubscriptionGroupsByFilter = gql`
	query accountSubscriptionGroups(
		$aggregation: [String]
		$filter: String
		$page: Int = 1
		$pageSize: Int = 20
		$search: String
		$sort: String
	) {
		c {
			accountSubscriptionGroups(
				aggregation: $aggregation
				filter: $filter
				page: $page
				pageSize: $pageSize
				search: $search
				sort: $sort
			) {
				items {
					accountKey
					name
				}
			}
		}
	}
`;

export const createSetupDXP = gql`
	mutation createSetupDXP($SetupDXP: InputC_SetupDXP!, $scopeKey: String) {
		c {
			createSetupDXP(SetupDXP: $SetupDXP, scopeKey: $scopeKey) {
				admins
				disasterDataCenterRegion
				dataCenterRegion
				projectId
			}
		}
	}
`;

export const AddAccountFlag = gql`
	mutation createAccountFlag($AccountFlag: InputC_AccountFlag!) {
		c {
			createAccountFlag(AccountFlag: $AccountFlag) {
				accountFlagId
				accountKey
				c_accountFlagId
				name
				userUuid
				value
			}
		}
	}
`;
