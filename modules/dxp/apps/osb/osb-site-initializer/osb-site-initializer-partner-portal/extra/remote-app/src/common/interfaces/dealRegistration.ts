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

import {RequestStatus} from '../enums/requestStatus';
import LiferayObject from './liferayObject';
import LiferayPicklist from './liferayPicklist';

export default interface DealRegistration extends Partial<LiferayObject> {
	additionalInformationAboutTheOpportunity: string;
	aditionalContactEmailAddress: string;
	aditionalContactFirstName: string;
	aditionalContactLastName: string;
	businessObjectiveProjectTimeline: string;
	generalMdfActivityAssociated: string;
	generalPartnerAccountName: string;
	primaryProspectBusinessUnit: string;
	primaryProspectDepartment: string;
	primaryProspectEmailAddress: string;
	primaryProspectFirstName: string;
	primaryProspectJobRole: string;
	primaryProspectLastName: string;
	primaryProspectPhone: string;
	projectInformationProjectNeed: LiferayPicklist;
	projectSolutionCategories: LiferayPicklist;
	prospectAccountName: string;
	prospectAddress: string;
	prospectCity: string;
	prospectCountry: string;
	prospectIndustry: string;
	prospectPostalCode: string;
	prospectState: string;
	requestStatus?: RequestStatus;
}
