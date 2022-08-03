/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import {ClaySelect} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import React, {useEffect, useState} from 'react';

import DonutChart from '../../../common/components/donut-chart';
import {getPoliciesForSalesGoalCurrentMonth} from '../../../common/services/Policy';
import {getSalesGoalCurrentMonth} from '../../../common/services/SalesGoal';

export default function () {
	const [selectedFilterDate, setSelectedFilterDate] = useState('1');
	const [sumOfSalesCurrentMonth, setSumOfSalesCurrentMonth] = useState(0);
	const [sumOfGoalsCurrentMonth, setSumOfGoalsCurrentMonth] = useState(0);
	const [daysUntilGoal, setDaysUntilGoal] = useState(0);

	const colors = {
		reached: '#ec0d6b',
		remaining: '#fbcee1',
	};

	const options = [
		{
			label: 'This Month',
			value: '1',
		},
		{
			label: '3 MO',
			value: '2',
		},
		{
			label: '6 MO',
			value: '3',
		},
		{
			label: 'YTD',
			value: '4',
		},
	];

	const getCurrentDay = new Date().getDay();
	const getCurrentMonth = new Date().getMonth();
	const arrayOfMonthsWith30Days = [3, 5, 8, 10];
	const arrayOfMonthsWith31Days = [0, 2, 4, 6, 7, 9, 11];

	function getDaysUntilGoal(currentDay, currentMonth, filterOption) {
		if (filterOption === '1') {
			if (arrayOfMonthsWith31Days.includes(currentMonth)) {
				return 31 - currentDay;
			} else if (arrayOfMonthsWith30Days.includes(currentMonth)) {
				return 30 - currentDay;
			} else {
				return 28 - currentDay;
			}
		}
	}

	function getArrayFromArrayOfObjects(arrayOfObjects) {
		const valuesArray = arrayOfObjects.map((values) => {
			return Object.values(values)[1];
		});

		return valuesArray;
	}

	function getSumFromArrayOfValues(comissionsArray) {
		const totalValue = comissionsArray.reduce(
			(commissionSum, commission) => commissionSum + commission,
			0
		);

		return totalValue;
	}

	useEffect(() => {
		getSalesGoalCurrentMonth().then((results) => {
			const salesGoalResult = results?.data?.items;

			const arrayValueOfGoals = salesGoalResult?.map((salesGoal) => {
				return salesGoal.goalValue;
			});

			setSumOfGoalsCurrentMonth(
				getSumFromArrayOfValues(arrayValueOfGoals)
			);
		});

		getPoliciesForSalesGoalCurrentMonth().then((results) => {
			const policiesForSalesGoalResult = results?.data?.items;

			const arrayValueOfSales = Object.values(
				getArrayFromArrayOfObjects(policiesForSalesGoalResult)
			);

			setSumOfSalesCurrentMonth(
				getSumFromArrayOfValues(arrayValueOfSales)
			);
		});

		setDaysUntilGoal(
			getDaysUntilGoal(getCurrentDay, getCurrentMonth, selectedFilterDate)
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// eslint-disable-next-line no-console
	console.log('sumOfSalesCurrentMonth', sumOfSalesCurrentMonth);

	const reachedValue =
		(sumOfSalesCurrentMonth / sumOfGoalsCurrentMonth) * 100;
	// eslint-disable-next-line no-console
	console.log('reachedValue', reachedValue);

	const loadData = [
		{
			dataColumns: [
				['reached', sumOfSalesCurrentMonth],
				['remaining', sumOfGoalsCurrentMonth],
			],
			dateUntilGoal: `${daysUntilGoal} days to goal`,
			goalValue: sumOfGoalsCurrentMonth,
			period: 1,
			salesPercentual: `${reachedValue.toFixed(0)}%`,
			salesValue: sumOfSalesCurrentMonth,
		},
		{
			dataColumns: [
				['reached', 30],
				['remaining', 80],
			],
			dateUntilGoal: '84 days to goal',
			goalValue: 111500,
			period: 2,
			salesPercentual: '27%',
			salesValue: 120000,
		},
		{
			dataColumns: [
				['reached', 60],
				['remaining', 100],
			],
			dateUntilGoal: '110 days to goal',
			goalValue: 12500,
			period: 3,
			salesPercentual: '37%',
			salesValue: 30120,
		},
		{
			dataColumns: [
				['reached', 30],
				['remaining', 90],
			],
			dateUntilGoal: '02 days to goal',
			goalValue: 6.5,
			period: 4,
			salesPercentual: '25%',
			salesValue: 1000,
		},
	];

	const getData = () => {
		return loadData?.filter(
			(data) => data.period === Number(selectedFilterDate)
		);
	};

	const chartData = {
		colors,
		columns: getData()[0]?.dataColumns,
		type: 'donut',
	};

	const getDateUntilGoal = getData()[0]?.dateUntilGoal;
	const getSalesValue = getData()[0]?.salesValue;
	const getGoalValue = getData()[0]?.goalValue;
	const getSalesPercentual = getData()[0]?.salesPercentual;

	const LegendElement = () => (
		<div className="d-flex donut-chart-legend flex-column h-100 justify-content-end ml-5 mt-5">
			<div className="donut-chart-screen font-weight-bolder h5">
				{new Intl.NumberFormat('en-US', {
					currency: 'USD',
					style: 'currency',
				}).format(getSalesValue)}
			</div>

			<div className="font-weight-normal mb-2 text-neutral-8 text-paragraph-sm">
				{`Goal: ${new Intl.NumberFormat('en-US', {
					currency: 'USD',
					style: 'currency',
				}).format(getGoalValue)}`}
			</div>

			<div className="font-weight-bolder text-danger text-paragraph-sm">
				<ClayIcon className="mr-1" symbol="time" />

				{getDateUntilGoal}
			</div>
		</div>
	);

	return (
		<div className="d-flex dashboard-sales-container flex-column flex-shrink-0 pb-4 pt-3 px-3">
			<div className="align-items-center d-flex dashboard-sales-header justify-content-between">
				<div className="dashboard-sales-title font-weight-bolder h4">
					Sales
				</div>

				<ClaySelect
					className="dashboard-sales-select"
					onChange={({target}) => {
						setSelectedFilterDate(target.value);
					}}
					sizing="sm"
					value={selectedFilterDate}
				>
					{options.map((option) => (
						<ClaySelect.Option
							key={option.value}
							label={option.label}
							value={option.value}
						/>
					))}
				</ClaySelect>
			</div>

			{!!chartData.columns.length && (
				<DonutChart
					LegendElement={LegendElement}
					chartData={chartData}
					hasLegend={true}
					title={getSalesPercentual}
				/>
			)}

			{!chartData.columns.length && (
				<div className="align-items-center d-flex flex-grow-1 justify-content-center">
					<span>No Data Applications</span>
				</div>
			)}
		</div>
	);
}
