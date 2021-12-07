import {gql} from '@apollo/client';

export const getAccountSubscriptionsTerms = gql`
	query accountSubscriptionsTerms(
		$filter: String
		$page: Int
		$pageSize: Int
	) {
		c {
			accountSubscriptionTerms(
				filter: $filter
				page: $page
				pageSize: $pageSize
			) {
				totalCount,
				items {
					accountKey
					accountSubscriptionERC
					accountSubscriptionGroupERC
					accountSubscriptionTermId
					c_accountSubscriptionTermId
					endDate
					instanceSize
					quantity
					startDate
					subscriptionTermStatus
				}
			}
		}
	}
`;

export const getAccountSubscriptionGroupsByFilter = gql`
	query accountSubscriptionGroups($filter: String) {
		c {
			accountSubscriptionGroups(filter: $filter) {
				items {
					name
				}
			}
		}
	}
`;

export const getAccountSubscriptions = gql`
	query accountSubscriptions($filter: String) {
		c {
			accountSubscriptions(filter: $filter) {
				items {
					accountKey
					accountSubscriptionId
					c_accountSubscriptionId
					endDate
					instanceSize
					quantity
					startDate
					name
					accountSubscriptionGroupERC
					subscriptionStatus
				}
			}
		}
	}
`;

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

export const addAccountFlag = gql`
	mutation addAccountFlag($accountFlag: InputC_AccountFlag!) {
		c {
			createAccountFlag(AccountFlag: $accountFlag) {
				accountFlagId
				accountKey
				name
				userUuid
				value
			}
		}
	}
`;
