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

import ClayTable from '@clayui/table';
import classnames from 'classnames';
import React, {useEffect, useState} from 'react';

import './index.scss';

type Props = {
	data: InfoRowContent[];
	headers: TableHeaders[];
};

type TableHeaders = {
	bold?: boolean;
	key: string;
	value: string;
};

type InfoRowContent = {[keys: string]: string};

const {Body, Cell, Head, Row} = ClayTable;

const TableList: React.FC<Props> = ({data, headers}) => {
	const [selectedRow, setSelectedRow] = useState(data[0]);

	useEffect(() => {}, [selectedRow]);

	const toggleShow = (item: InfoRowContent) => {
		setSelectedRow(item);
	};

	return (
		<>
			<div className="bg-neutral-0 d-flex w-100">
				<div className="box-activites col d-flex">
					<h2 className="border-link-active font ml-1">Activies</h2>
				</div>

				<div className="blue-line-activites border-title box-activites col d-flex position-relative">
					<p className="font ml-2 text-nowrap">
						{selectedRow.activity}
					</p>
				</div>
			</div>

			<div className="d-flex">
				<div className="d-flex w-50">
					<table className="border-right box-table w-100">
						<Head>
							<Row className="border-header">
								{headers.map(
									(header: TableHeaders, index: number) => (
										<Cell
											className="p-3 py-0 text-paragraph-sm"
											headingCell
											key={index}
										>
											{header.value}
										</Cell>
									)
								)}
							</Row>
						</Head>

						<Body>
							{data.map(
								(
									rowContent: InfoRowContent,
									rowIndex: number
								) => (
									<Row
										className={classnames(
											'cursor-pointer position-relative ',
											{
												'box-shadow gsdc position-relative ':
													selectedRow === rowContent,
												'dotted-line ':
													selectedRow !== rowContent,
											}
										)}
										key={rowIndex}
										onClick={() => toggleShow(rowContent)}
									>
										{headers.map(
											(
												item: TableHeaders,
												index: number
											) => (
												<Cell key={index}>
													<div className="p-3">
														<span
															className={classnames(
																'd-flex  w-100',
																{
																	'font-table': !item.bold,
																	'font-table-bold align-items-start':
																		item.bold,
																}
															)}
														>
															{
																rowContent[
																	item.key
																]
															}
														</span>
													</div>
												</Cell>
											)
										)}
									</Row>
								)
							)}
						</Body>
					</table>
				</div>

				<div className="bg-neutral-0 box-info col d-flex ml-1 rounded">
					<li className="bg-neutral-0 box-info d-flex flex-column float-right rounded w-100">
						<div>
							<p className="font-table ml-0 pt-4">
								{selectedRow.message}
							</p>
						</div>
					</li>
				</div>
			</div>
		</>
	);
};

export default TableList;
