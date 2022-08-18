/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import {Skeleton} from '../../../../../../../../../common/components';

const CardSubscriptionSkeleton = () => {
	return (
		<div className="align-items-center border border-neutral-3 cp-card-subscription d-flex flex-column px-3 py-4 rounded">
			<div>
				<Skeleton height={46.5} width={46.5} />
			</div>

			<div className="align-items-center d-flex flex-column mt-2">
				<Skeleton className="mt-3" height={18} width={186} />

				<Skeleton className="mt-3" height={13} width={186} />

				<Skeleton className="mt-3" height={14} width={186} />

				<Skeleton className="mt-3" height={14} width={186} />

				<Skeleton className="mt-3" height={13} width={67.9} />
			</div>
		</div>
	);
};
export default CardSubscriptionSkeleton;
