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

import dayjs from 'dayjs';
import moment from 'moment';
import * as Yup from 'yup';

const validations = Yup.object({
	activityName: Yup.string()
		.max(350, 'You have exceeded the character limit')
		.required('Required'),
	availableItems: Yup.array()
		.of(
			Yup.object().shape({
				maxCheckedItems: Yup.boolean(),
			})
		)
		.required('Required'),
	detailsOnLead: Yup.string()
		.max(1000, 'You have exceeded the character limit')
		.required('Required'),
	endDate: Yup.date()
		.test('Year test', 'End date must be different than today', (value) => {
			const currentTime = dayjs();
			const chosenDate = dayjs(value);

			return currentTime.diff(chosenDate) <= 0;
		})
		.test({
			exclusive: false,
			message: 'End date must be grater than start date',
			name: 'same',
			params: {},
			test(value) {
				const startDate = moment(this.parent.startDate).format(
					'MM-DD-YYYY'
				);
				const endDate = moment(value).format('MM-DD-YYYY');

				return !moment(startDate).isSame(moment(endDate));
			},
		})
		.test({
			exclusive: false,
			message: 'End date must be less than six month after start date',
			name: 'same',
			params: {},
			test(value) {
				const sixMonthStartDate = moment(this.parent.startDate)
					.add(6, 'M')
					.format('MM-DD-YYYY');
				const endDate = moment(value).format('MM-DD-YYYY');

				return !moment(sixMonthStartDate).isBefore(moment(endDate));
			},
		})
		.required('Required'),
	leadListOutcomeActivity: Yup.string().required('Required'),
	startDate: Yup.date()
		.test('Year test', 'cannot be today', (value) => {
			const currentTime = dayjs();
			const chosenDate = dayjs(value);

			return currentTime.diff(chosenDate) <= 0;
		})
		.required('Required'),
	targetLeads: Yup.string().required('Required'),
});

export default validations;
