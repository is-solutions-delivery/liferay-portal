import React from 'react';
import usePermissionActions from '../../../common/hooks/usePermissionActions';
import {ObjectActionName} from '../../../common/enums/objectActionName';

export enum PermissionActionTypeTest {
	VIEW = 'VIEW',
	UPDATE = 'UPDATE',
	UPDATE_WO_CHANGE_STATUS = 'UPDATE-WO-CHANGE-STATUS',
	DELETE = 'DELETE',
	CREATE = 'CREATE',
	EXPORT = 'EXPORT',
	MARKETING_REVIEW_STATUS_UPDATE = 'MARKETING-REVIEW-STATUS-UPDATE',
	APPROVE = 'APPROVE',
	IN_FINANCE_REVIEW_STATUS = 'IN-FINANCE-REVIEW-STATUS',
	REQUEST_MORE_INFO = 'REQUEST-MORE-INFO',
	REJECT = 'REJECT',
	EXPIRE = 'EXPIRE',
	IN_DIRECTOR_REVIEW_STATUS = 'IN-DIRECTOR-REVIEW-STATUS',
	CLAIM_PAID_STATUS = 'CLAIM-PAID-STATUS',
	CANCEL = 'CANCEL',
}

const useGetPermissions = () => {
	const permissionActions = usePermissionActions(ObjectActionName.MDF_CLAIM);

	return {
		hasMarketingReviewAction:
			permissionActions?.includes(
				PermissionActionTypeTest.MARKETING_REVIEW_STATUS_UPDATE
			) || false,
		hasApproveAction:
			permissionActions?.includes(PermissionActionTypeTest.APPROVE) ||
			false,
		hasFinanceReviewAction:
			permissionActions?.includes(
				PermissionActionTypeTest.IN_FINANCE_REVIEW_STATUS
			) || false,
		hasRequestMoreInfoAction:
			permissionActions?.includes(
				PermissionActionTypeTest.REQUEST_MORE_INFO
			) || false,
		hasRejectAction:
			permissionActions?.includes(PermissionActionTypeTest?.REJECT) ||
			false,
		hasExpireAction:
			permissionActions?.includes(PermissionActionTypeTest.EXPIRE) ||
			false,
		hasDirectorReviewAction:
			permissionActions?.includes(
				PermissionActionTypeTest.IN_DIRECTOR_REVIEW_STATUS
			) || false,
		hasClaimPaidAction:
			permissionActions?.includes(
				PermissionActionTypeTest.CLAIM_PAID_STATUS
			) || false,
	};
};

export default useGetPermissions;
