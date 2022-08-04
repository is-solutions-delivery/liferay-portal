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

import InputText from '../InputText';
import Select from '../Select';

const LIST_TYPE_ENTRIES = {
	contentMarketing: 'Content Marketing',
	digitalMarketing: 'Digital Marketing',
	event: 'Event',
	miscellaneousMarketing: 'Miscellaneous Marketing',
};

type Props = {formik: any; typeOfActivity: any};

const fieldsTypeActivity = ({formik, typeOfActivity}: Props) => {
	let typeSelected = 'Event';
	if (formik?.values.typeActivity) {
		typeSelected = typeOfActivity?.filter(({id}: any) =>
			formik?.values.typeActivity.includes(id)
		)[0].name;
	}

	const optionsDoYouRequireAnyAssetsFromLiferay = [
		{
			key: '',
			name: '',
		},
		{
			key: 'yes',
			name:
				'Yes (please describe including specifications and due dates (another text field))',
		},
		{
			key: 'no',
			name: 'No',
		},
	];

	const optionsYesNo = [
		{
			key: '',
			name: '',
		},
		{
			key: 'yes',
			name: 'Yes',
		},
		{
			key: 'no',
			name: 'No',
		},
	];

	const FieldTypes = {
		[LIST_TYPE_ENTRIES.digitalMarketing]: (
			<>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Overall message/content/CTA"
							name="overallMessage"
							onChange={formik.handleChange}
							placeholder="Overall message/content/CTA"
							type="text"
							value={formik.values.overallMessage}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Any specific sites to be used"
							name="anySpecificSitesToBeUsed"
							onChange={formik.handleChange}
							placeholder="Any specific sites to be used"
							type="text"
							value={formik.values.anySpecificSitesToBeUsed}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Keywords for PPC campaigns (must be approved by Liferay prior to execution)"
							name="keywordsForPpcCampaigns"
							onChange={formik.handleChange}
							placeholder="Keywords for PPC campaigns (must be approved by Liferay prior to execution)"
							type="text"
							value={formik.values.keywordsForPpcCampaigns}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Ad (any size/type)"
							name="ad"
							onChange={formik.handleChange}
							placeholder="Ad (any size/type)"
							type="text"
							value={formik.values.ad}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<Select
							label="Do you require any assets from Liferay?"
							name="doYouRequireAnyAssetsFromLiferay"
							onChange={formik.handleChange}
							options={optionsDoYouRequireAnyAssetsFromLiferay}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="How will the Liferay brand be used in the campaign?"
							name="howWillTheLiferayBrandBeUsedInTheCampaign"
							onChange={formik.handleChange}
							placeholder="How will the Liferay brand be used in the campaign?"
							type="text"
							value={
								formik.values
									.howWillTheLiferayBrandBeUsedInTheCampaign
							}
						/>
					</div>
				</div>
			</>
		),
		[LIST_TYPE_ENTRIES.contentMarketing]: (
			<>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<Select
							label="Will this content be gated and have a landing page?"
							name="willThisContentBeGatedAndHaveALandingPage"
							onChange={formik.handleChange}
							options={optionsYesNo}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Describe the primary theme or message of your content"
							name="describeThePrimaryThemeOrMessageOfYourContent"
							onChange={formik.handleChange}
							placeholder="Describe the primary theme or message of your content"
							type="text"
							value={
								formik.values
									.describeThePrimaryThemeOrMessageOfYourContent
							}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Goal of content"
							name="goalOfContent"
							onChange={formik.handleChange}
							placeholder="Goal of content"
							type="text"
							value={formik.values.goalOfContent}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<Select
							label="Are you hiring an outside writer or agency to prepare the content?"
							name="areYouHiringAnOutsideWriterOrAgencyToPrepareTheContent"
							onChange={formik.handleChange}
							options={optionsYesNo}
						/>
					</div>
				</div>
			</>
		),
		[LIST_TYPE_ENTRIES.event]: (
			<>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Activity Description"
							name="activityDesription"
							onChange={formik.handleChange}
							placeholder="Activity Description"
							type="text"
							value={formik.values.activityDesription}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Activity Location"
							name="activityLocation"
							onChange={formik.handleChange}
							placeholder="Activity Location"
							type="text"
							value={formik.values.activityLocation}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Venue Name"
							name="venueName"
							onChange={formik.handleChange}
							placeholder="Venue Name"
							type="text"
							value={formik.values.venueName}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Liferay Branding"
							name="liferayBranding"
							onChange={formik.handleChange}
							placeholder="Liferay Branding"
							type="text"
							value={formik.values.liferayBranding}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Liferay Participation / Requirements"
							name="liferayParticipationRequirements"
							onChange={formik.handleChange}
							placeholder="Liferay Participation / Requirements"
							type="text"
							value={
								formik.values.liferayParticipationRequirements
							}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Source and Size of Invite List"
							name="sourceSizeInviteList"
							onChange={formik.handleChange}
							placeholder="Source and Size of Invite List"
							type="text"
							value={formik.values.sourceSizeInviteList}
						/>
					</div>
				</div>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Activity Promotion"
							name="activityPromotion"
							onChange={formik.handleChange}
							placeholder="Activity Promotion"
							type="text"
							value={formik.values.activityPromotion}
						/>
					</div>
				</div>
			</>
		),
		[LIST_TYPE_ENTRIES.miscellaneousMarketing]: (
			<>
				<div className="form-group-autofit">
					<div className="form-group-item">
						<InputText
							className="form-control shadow-none"
							disabled={false}
							label="Describe the marketing activity"
							name="describeTheMarketingActivity "
							onChange={formik.handleChange}
							placeholder="Describe the marketing activity "
							type="text"
							value={formik.values.describeTheMarketingActivity}
						/>
					</div>
				</div>
			</>
		),
	};

	return FieldTypes[typeSelected];
};

export default fieldsTypeActivity;
