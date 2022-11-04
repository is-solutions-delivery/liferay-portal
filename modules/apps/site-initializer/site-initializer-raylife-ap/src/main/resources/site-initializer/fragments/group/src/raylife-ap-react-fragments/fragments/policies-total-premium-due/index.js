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

import React, {useEffect, useState} from 'react';

import BarChart from '../../../common/components/bar-chart';
import ClayIconProvider from '../../../common/context/ClayIconProvider';
import {getThreeMonthsPolicies} from '../../../common/services/Policy';
import {getProductsNames} from '../../../common/services/Products';
export default function () {
	const [policies, setPolicies] = useState([]);
	const [myObject, setMyObject] = useState({});

	useEffect(() => {
		getProductsNames().then((response) => {
			const productList = response?.data?.items;
			productList.map((productName) => {
				productName.productValue = 0;
			});

			const productsFormatted = {};
			productList.forEach((teste) => {
				if (!productsFormatted[teste?.name]) {
					productsFormatted[teste?.name] = 0;
				}
				setMyObject({...productsFormatted});
			});
		});
	}, []);

	useEffect(() => {
		getThreeMonthsPolicies().then((results) => {
			const policiesList = [];

			results?.data?.items.map((policie) => {
				policiesList.push(policie);
			});
			setPolicies(policiesList);

			return policiesList;
		});
	}, []);

	policies?.map((policy) => {
		if (!myObject[policy?.productName]) {
			myObject[policy?.productName] = policy?.termPremium;
		} else {
			myObject[policy?.productName] += policy?.termPremium;
		}
	});

	const dataColumnsFormatted = [...Object.values(myObject)];

	dataColumnsFormatted.unshift('data');

	const labelColumnsFormatted = [...Object.keys(myObject)];

	labelColumnsFormatted.unshift('x');

	const formatLabel = (labelColumnsFormatted, maxNameLenght) => {
		const productAbbrevation = labelColumnsFormatted.map((name) => {
			if (name?.length > maxNameLenght) {
				return name
					?.split(' ')
					.map((product) => product.charAt(0))
					.join('');
			}

			return name;
		});

		return productAbbrevation;
	};

	const formattedLabel = formatLabel(labelColumnsFormatted, 10);

	const colors = [
		'#55C2FF',
		'#EC676A',
		'#7154E1',
		'#4BC286',
		'#FF9A24',
		'#1F77B4',
		'#4BC286',
		'#FF9A24',
		'#1F77B4',
	];

	return (
		<ClayIconProvider>
			<div className="d-flex flex-column px-5 total-premium-due-container">
				<div className="align-items-center d-flex font-weight-bold h4 justify-content-between mt-3 total-premium-due-title">
					<div>Total Premium Due</div>
				</div>

				<BarChart
					barRatio={0}
					barWidth={10}
					colors={colors}
					dataColumns={dataColumnsFormatted}
					format
					height={275}
					labelColumns={formattedLabel}
					titleTotal={false}
					width={425}
				/>
			</div>

			<hr className="mx-3 my-1" />

			<div className="d-flex h4 justify-content-center py-2">
				Total:
				<span className="h4 px-1">Value</span>
			</div>
		</ClayIconProvider>
	);
}
