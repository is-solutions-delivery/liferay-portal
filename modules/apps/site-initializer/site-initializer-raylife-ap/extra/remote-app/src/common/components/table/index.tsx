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

import Button, {ClayButtonWithIcon} from '@clayui/button';
import ClayTable from '@clayui/table';
import classnames from 'classnames';

import SettingsButton, {ActionObject} from '../settings-button';

const {Body, Cell, Head, Row} = ClayTable;
type TableProps = {
	actions: ActionObject[];
	data: {[keys: string]: string}[];
	headers: TableHeaders[];
	onClickRules?: (item: any, rowContent: any) => void;
	onSaveCurrent?: (item: any) => void;
	setSortByDate?: (item: any) => void;
	setSortState?: (item: any) => void;
	sort?: any;
	sortByDate?: string;
	valuer?: string;
};

type TableHeaders = {
	bold?: boolean;
	centered?: boolean;
	click?: boolean;
	clickable?: boolean;
	greyColor?: boolean;
	hasSort?: boolean;
	icon?: boolean;
	key: string;
	redColor?: boolean;
	req: string;
	type?: string;
	value: string;
};

const Table: React.FC<TableProps> = ({
	data,
	headers,
	actions,
	setSortByDate,
	setSortState,
	sort,
	sortByDate,
	onClickRules = () => null,
	onSaveCurrent,
}) => {
	const setCurrentHeaderPlus = (item: string) => {
		if (onSaveCurrent) {
			onSaveCurrent(item);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const updateSort = (colunn: string) => {
		const newSort: any = {};

		headers.forEach((item) => {
			if (item.req === colunn) {
				newSort[item.key] = true;

				return;
			}

			newSort[item.key] = false;
		});

		if (setSortState) {
			setSortState(newSort);
		}
	};

	return (
		<table className="border-0 ray-table show-quick-actions-on-hover table table-autofit table-list table-responsive">
			<Head>
				<Row className="ray-table-head">
					{headers.map((header, index: any) => (
						<Cell
							className="py-0 text-paragraph-sm"
							headingCell
							key={index}
						>
							{headers[index].click && (
								<Button
									displayType="unstyled"
									onClick={() => {
										updateSort(headers[index].req);
										setCurrentHeaderPlus(
											headers[index].req
										);

										setSortByDate;
									}}
								>
									{header.value}
								</Button>
							)}

							{!headers[index].click && (
								<Button displayType="unstyled">
									{header.value}
								</Button>
							)}

							{sort[header.key] && (
								<ClayButtonWithIcon
									className="bg-neutral-0 btn-sm text-brand-primary-darken-1"
									symbol={
										sortByDate === 'asc'
											? 'order-arrow-up'
											: 'order-arrow-down'
									}
								></ClayButtonWithIcon>
							)}
						</Cell>
					))}

					{!!actions.length && (
						<Cell className="py-0" headingCell></Cell>
					)}
				</Row>
			</Head>

			<Body>
				{data.map((rowContent, rowIndex) => (
					<Row key={rowIndex}>
						{headers.map((item, index) => (
							<Cell
								className={classnames('border-top-0', {
									'ray-row-table-danger':
										rowContent.isRedLine === 'true',
								})}
								key={index}
							>
								<div
									className={classnames({
										'align-items-center d-flex':
											item.type === 'hasBubble',
										'text-center': item.centered,
									})}
								>
									{item.type === 'hasBubble' && (
										<div
											className={`${rowContent[
												item.key
											].toLowerCase()} flex-shrink-0 mr-2 rounded-circle status-color`}
										></div>
									)}

									<span
										className={classnames('', {
											'cursor-pointer': !!item.clickable,
											'font-weight-bolder': !!item.bold,
											'text-danger font-weight-bolder':
												Number(rowContent[item.key]) <
													15 ||
												rowContent[item.key] ===
													'Due Today',
											'text-neutral-7': !!item.greyColor,
										})}
										onClick={() => {
											onClickRules(item, rowContent);
										}}
									>
										{rowContent[item.key]}
									</span>
								</div>
							</Cell>
						))}

						{!!actions.length && (
							<Cell
								className={classnames('border-top-0', {
									'ray-row-table-danger':
										rowContent.isRedLine === 'true',
								})}
							>
								<SettingsButton
									actions={actions}
									identifier={rowContent.key}
								/>
							</Cell>
						)}
					</Row>
				))}
			</Body>
		</table>
	);
};

export default Table;
