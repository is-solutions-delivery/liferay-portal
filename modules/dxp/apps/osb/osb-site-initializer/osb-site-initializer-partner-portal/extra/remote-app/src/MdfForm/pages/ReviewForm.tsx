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

import { Form, Formik } from 'formik';

import Button from '../../components/Button';
import listActivities from '../../components/listActivities';
import SiteMapCard from '../../components/SiteMapCard';

const ReviewForm: any = ({
	generalObject,
	setStep,
}: {
	generalObject: any;
	setStep: any;
}) => {
	const handleOnSubmit = (generalObject: any) => {
		// eslint-disable-next-line no-console
		console.log(`generalObject=`, generalObject);
	};

	const objectTeste = {
		activities: [
			{
				activityDesription: "teste",
				activityName: "teste",
				activityPromotion: "teste",
				addExpenses: [
					{
						budget: "$1,500.00",
						expense: "foodAndBeverage"
					},
					{
						budget: "$2,500.00",
						expense: "roomRental"
					}
				],
				detailsOnLead: "teste",
				endDate: "29/08/2022",
				leadListOutcomeActivity: "yes",
				liferayBranding: "teste",
				liferayParticipationRequirements: "teste",
				sourceSizeInviteList: "teste",
				startDateValue: "",
				tactic: "In Person, Industry 1",
				targetLeads: "teste",
				totalMdfRequestedAmount: "$2,500.00",
				typeActivity: "foodAndBeverage",
				venueName: "teste",
				starDate: "27/08/2022",
				leadFollowStrategy: [
					"teste1",
					"teste2"
				]
			},
			{
				activityDesription: "teste2",
				activityName: "teste2",
				activityPromotion: "teste2",
				addExpenses: [
					{
						budget: "$1,500.00",
						expense: "foodAndBeverage"
					},
					{
						budget: "$2,500.00",
						expense: "roomRental"
					}
				],
				detailsOnLead: "teste",
				endDate: "29/08/2022",
				leadListOutcomeActivity: "yes",
				liferayBranding: "teste",
				liferayParticipationRequirements: "teste",
				sourceSizeInviteList: "teste",
				startDateValue: "",
				tactic: "In Person, Industry 1",
				targetLeads: "teste",
				totalMdfRequestedAmount: "$2,500.00",
				typeActivity: "foodAndBeverage",
				venueName: "teste",
				starDate: "27/08/2022",
				leadFollowStrategy: [
					"teste1",
					"teste2"
				]
			}
		],
		additionalOptions: "upgradeMigration",
		businessSalesGoals: [
			"leadGeneration",
			"thoughtLeadership"
		],
		businessSalesGoalsOther: "",
		companyName: "Company 2",
		country: "br",
		goalsTargetMarket: [
			"aerospaceDefense",
			"agriculture"
		],
		provideNameAndDescription: "teste",
		targetAudienceRole: [
			"cLevelExecutiveVP",
			"directorManager"
		]
	};

	// eslint-disable-next-line no-console
	console.log(`generalObject=`, objectTeste);

	return (
		<Formik
			initialValues={{
				additionalOptions: '',
			}}
			onSubmit={() => {
				handleOnSubmit(generalObject);
			}}
		>
			{(formik) => (
				<div className="align-items-start d-flex justify-content-center">
					<SiteMapCard
						className="border-1 flex-column m-5 nav shadow-lg sheet sheet-lg"
						visit={2}
					></SiteMapCard>

					<form onSubmit={formik.handleSubmit}>
						<div>
							<div className='border-0 mt-5 shadow-lg sheet sheet-lg'>
								<h6 className="text-primary">REVIEW</h6>

								<h2>Review Campaign MDF Request</h2>

								<h6 className="text-secondary">
									Please ensure that all the information
									below is accurate before submitting your
									request.
								</h6>
							</div>

							<div className='border-0 mt-1 shadow-lg sheet'>
								<h6 className='text-info'>GOALS</h6>

								<h5>Campaign Information</h5>

								<hr></hr>

								<table className='table table-striped'>
									<thead>
										<tr>
											<th scope='col'>Partner Summary</th>
										</tr>
									</thead>

									<tbody>
										<tr>
											<td>Company Name</td>

											<td>{objectTeste.companyName}</td>
										</tr>

										<tr>
											<td>Region</td>

											<td>{objectTeste.country}</td>
										</tr>

									</tbody>
								</table>



								<table className='table table-striped'>
									<thead>
										<tr>
											<th scope='col'>Activity Summary</th>
										</tr>
									</thead>

									<tbody>
										<tr>
											<td>Business Plan ID</td>

											<td>()</td>
										</tr>

										<tr>
											<td>Provide a name and short description of the overall campaign</td>

											<td>{objectTeste.provideNameAndDescription}</td>
										</tr>

										<tr>
											<td>Liferay business/sales goals</td>

											<td>{objectTeste.businessSalesGoals} </td>
										</tr>
									</tbody>

								</table>


								<table className='table table-striped'>
									<thead>
										<tr>
											<th scope='col'>Target Market</th>
										</tr>
									</thead>

									<tbody>
										<tr>
											<td>Target Market(s)</td>

											<td>{objectTeste.goalsTargetMarket}</td>
										</tr>

										<tr>
											<td>Additional Options</td>

											<td>{objectTeste.additionalOptions}</td>
										</tr>

										<tr>
											<td>Target Audience/Role</td>

											<td>{objectTeste.targetAudienceRole}</td>
										</tr>
									</tbody>
								</table>

							</div>

							<div className='border-0 mt-1 shadow-lg sheet'>

								<h6>ACTIVITIES</h6>

								<h5>{objectTeste.provideNameAndDescription}</h5>
							
								{objectTeste.activities.map((activity) => (
									<div>	
										<table className='table table-striped'>
									<thead>
										<tr>
											<th scope='col'>Campaign Activity</th>
										</tr>
									</thead>

									<tbody>
										<tr>
											<td>Activity Name</td>

											<td>{activity.activityName}</td>
										</tr>

										<tr>
											<td>Type of Activity</td>

											<td>{activity.typeActivity}</td>
										</tr>

										<tr>
											<td>Tactic</td>

											<td>{activity.tactic}</td>
										</tr>

										<tr>
											<td>Activity Description</td>

											<td>{activity.activityDesription}</td>
										</tr>

										<tr>
											<td>Venue Name</td>

											<td>{activity.venueName}</td>
										</tr>

										<tr>
											<td>Liferay Branding</td>

											<td>{activity.liferayBranding}</td>
										</tr>

										<tr>
											<td>Liferay Participation / Requirements</td>

											<td>{activity.liferayParticipationRequirements}</td>
										</tr>

										<tr>
											<td>Source and Size of Invite List</td>

											<td>{activity.sourceSizeInviteList}</td>
										</tr>

										<tr>
											<td>Activity Promotion</td>

											<td>{activity.activityPromotion}</td>
										</tr>

										<tr>
											<td>Start Date</td>

											<td>{activity.starDate}</td>
										</tr>

										<tr>
											<td>End Date</td>

											<td>{activity.endDate}</td>
										</tr>
									</tbody>
								</table>

									
							<hr></hr>	
									<table className='table table-striped'>
										<thead>
											<tr>
												<th scope='col'>Budget Breakdown</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Sponsorship Fee</td>
												<td>{ }</td>
											</tr>
											<tr>
												<td>Room Rental</td>
												<td>{ }</td>
											</tr>
										</tbody>
									</table>

									<hr></hr>
									
									<table className='table table-striped'>
										<thead>
											<tr>
												<th scope='col'>Lead List</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>Is a lead list an outcome of this activity?</td>
												<td>Yes</td>
											</tr>
											<tr>
												<td>Target # of Leads</td>
												<td>1,000</td>
											</tr>
											<tr>
												<td>Lead Follow Up strategy</td>
												<td>Social Campaign</td>
											</tr>
											<tr>
												<td>Details on Lead Follow Up</td>
												<td>()</td>
											</tr>
										</tbody>
									</table>
								</div>

								))}

							
							</div>
				


							<div className='border-0 mt-1 shadow-lg sheet'>
								<table className='table table-striped'>
									<tbody>
										<tr>
											<td>Total Budget</td>

											<td>{ }</td>
										</tr>

										<tr>
											<td>Claim Percent</td>

											<td>{50}%</td>
										</tr>

										<tr>
											<td>Total MDF Requested Amount</td>

											<td>{ }</td>
										</tr>
									</tbody>
								</table>
								
								<div className='border-0 d-flex justify-content-between mt-5 sheet sheet-lg'>
									<div className="mr-auto p-2">
										<Button
											className="mr-3"
											displayType="unstyled"
											icon=""
											label="Previous"
											onClick={() => {
												setStep(1);
											}}
											type="button"
										/>

										<Button
											className=""
											displayType="unstyled"
											icon=""
											label="Save as Draft"
											onClick={() => { }}
											type="button"
										/>
									</div>

									<div>
										<Button
											className="mr-4"
											displayType="secondary"
											icon=""
											label="Cancel"
											onClick={() => { }}
											type="button"
										/>
									</div>

									<div >
										<Button
											className=""
											displayType="primary"
											icon=""
											label="Submit"
											onClick={() => { }}
											type="submit"
										/>
									</div>
								</div>

							</div>

						</div>

					</form>

				</div>
			)}
		</Formik>
	);
};

export default ReviewForm;
