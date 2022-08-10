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

import classNames from 'classnames';
import React from 'react';

import {getWebDavUrl} from '../../utils/webdav';

type ProductListProps = {
	onSelect: (productName: string) => void;
	productList: ProductCell[];
};

export type ProductCell = {
	active: boolean;
	productName: string;
	salesGoal: number;
	totalSales: number;
};

const ProductList: React.FC<ProductListProps> = ({onSelect, productList}) => {
	return (
		<div className="ray-product-list">
			{productList.map((productCell: ProductCell, index: number) => (
				<div
					className={classNames(
						'd-flex justify-content-between p-5 product-item',
						{
							'product-selected': productCell.active,
						}
					)}
					key={index}
					onClick={() => onSelect(productCell.productName)}
				>
					<div className="align-items-center col-6 d-flex product-container px-0">
						<img
							className="mr-2"
							height="40px"
							src={`${getWebDavUrl()}/auto_icon.svg`}
							width="40px"
						/>

						<p className="grey-title-color mb-0 product-title text-paragraph">
							{productCell.productName}
						</p>
					</div>

					<div className="col-6 goals-container px-0">
						<p className="font-weight-bolder grey-title-color mb-0 text-paragraph text-right">
							{productCell.totalSales.toLocaleString('en-US', {
								currency: 'USD',
								style: 'currency',
							})}
						</p>

						<p className="mb-0 text-paragraph-sm text-right yearly-goal">
							Yearly Goal:&nbsp;
							{productCell.salesGoal.toLocaleString('en-US', {
								currency: 'USD',
								style: 'currency',
							})}
						</p>
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductList;
