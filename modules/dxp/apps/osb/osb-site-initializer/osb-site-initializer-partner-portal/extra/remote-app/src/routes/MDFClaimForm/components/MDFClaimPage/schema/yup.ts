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

import {array, boolean, mixed, number, object, string} from 'yup';

const KB_TO_MB = 1024;
const MAX_MB = KB_TO_MB * 3;

const validDocument = {
	maxSize: MAX_MB,
	types: [
		'image/jpg',
		'image/jpeg',
		'image/gif',
		'image/png',
		'application/pdf',
	],
};

export const requiredBudgetSchema = object({
	claimAmount: number().when('invoice', {
		is: (invoice: File) => Boolean(invoice),
		then: (schema) =>
			schema
				.moreThan(0, 'Need be bigger than 0')
				.test(
					'biggerAmount',
					'Invoice amount is bigger than requested amount early',
					(claimAmount, testContext) => {
						return (
							Number(claimAmount) <=
							Number(testContext.parent.requestAmount)
						);
					}
				),
	}),
	invoice: mixed()
		.test('fileSize', 'File Size is too large', (invoice) => {
			return invoice
				? Math.ceil(invoice.size / 1000) <= validDocument.maxSize
				: true;
		})
		.test(
			'fileType',
			'Unsupported File Format, upload a valid format *jpg *jpeg *gif *png *pdf',
			(invoice) =>
				invoice ? validDocument.types.includes(invoice.type) : true
		),
	requestAmount: number(),
});

const claimSchema = object({
	activities: array()
		.of(
			object({
				budgets: array().when('selected', {
					is: (selected: boolean) => selected,
					then: (schema) =>
						schema.of(
							object({
								claimAmount: number().when('invoice', {
									is: (invoice: File) => Boolean(invoice),
									then: (schema) =>
										schema
											.moreThan(
												0,
												'Need be bigger than 0'
											)
											.test(
												'biggerAmount',
												'Invoice amount is bigger than requested amount early',
												(claimAmount, testContext) =>
													Number(claimAmount) <=
													Number(
														testContext.parent
															.requestAmount
													)
											),
								}),
								invoice: mixed()
									.test(
										'fileSize',
										'File Size is too large',
										(invoice) => {
											return invoice
												? Math.ceil(
														invoice.size / 1000
												  ) <= validDocument.maxSize
												: true;
										}
									)
									.test(
										'fileType',
										'Unsupported File Format, upload a valid format *jpg *jpeg *gif *png *pdf',
										(invoice) =>
											invoice
												? validDocument.types.includes(
														invoice.type
												  )
												: true
									),
							})
						),
				}),

				listQualifiedLeads: mixed().when('selected', {
					is: (selected: boolean) => selected,
					then: (schema) =>
						schema
							.test(
								'fileSize',
								'File Size is too large',
								(listQualifiedLeads) => {
									return listQualifiedLeads
										? Math.ceil(
												listQualifiedLeads.size / 1000
										  ) <= validDocument.maxSize
										: true;
								}
							)
							.test(
								'fileType',
								'Unsupported File Format, upload a valid format *jpg *jpeg *gif *png *pdf',
								(listQualifiedLeads) =>
									listQualifiedLeads
										? validDocument.types.includes(
												listQualifiedLeads.type
										  )
										: true
							),
				}),
				metrics: string().max(
					350,
					'You have exceeded the character limit'
				),
				selected: boolean(),
			})
		)
		.test(
			'needAtLeatOneSelectedActivity',
			'Need at least one selected activity',
			(activities) =>
				Boolean(activities?.some((activity) => activity.selected))
		)
		.test(
			'needMoreThanOneSelectedActivity',
			'Need at least one invoice uploaded',
			(activities) =>
				Boolean(
					activities?.some((activity) =>
						Boolean(
							activity.budgets?.some((budget) => budget.invoice)
						)
					)
				)
		),
	reimbursementInvoice: mixed()
		.required('Required')
		.test('fileSize', 'File Size is too large', (reimbursementInvoice) => {
			return reimbursementInvoice
				? Math.ceil(reimbursementInvoice.size / 1000) <=
						validDocument.maxSize
				: true;
		})
		.test(
			'fileType',
			'Unsupported File Format, upload a valid format *jpg *jpeg *gif *png *pdf',
			(reimbursementInvoice) =>
				reimbursementInvoice
					? validDocument.types.includes(reimbursementInvoice.type)
					: true
		),
	totalClaimAmount: number()
		.moreThan(0, 'Need be bigger than 0')
		.required('Required')
		.test(
			'is-greater-than-the-requested-amount',
			'Total Claim Amount cannot be greater than Total MDF Requested Amount',
			(totalClaimAmount, testContext) =>
				Number(totalClaimAmount) <=
				Number(testContext.parent.totalrequestedAmount)
		),
});

export default claimSchema;
