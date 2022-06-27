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

import {Skeleton} from '../../../../common/components';

const SupportOverviewSkeleton = () => {
	return (
		<div className="container mb-5 mx-0 project-contacs-container">
			<div className="row">

				<div className="col-5">

					<Skeleton className="mb-4" height={21} width={215} />

					<Skeleton className="mb-1" height={85} width={215} />

				</div>

				<div className="col-5">
					<Skeleton className="mb-4" height={21} width={250}/>

					<Skeleton className="mb-1" height={24} width={250}/>

					<Skeleton className="" height={16} width={250} />

				</div>
				
				<div className="mt-6"> 
					<Skeleton height={40} width={300}/>
				</div>

			</div>
		</div>
	);
};

export default SupportOverviewSkeleton;
