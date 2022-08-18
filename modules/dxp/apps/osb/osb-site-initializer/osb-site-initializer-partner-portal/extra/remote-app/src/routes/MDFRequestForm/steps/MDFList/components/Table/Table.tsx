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

import ClayTable from '@clayui/table';

type Columns = {
	columnKey: string;
	label: string;
	render?: (data: any, item: any) => any;
};

type TableProps<T = any> = {
	borderless?: boolean;
	columns: Columns[];
	responsive?: boolean;
	rows: T[] | void;
};

const Table = ({columns, rows, ...props}: TableProps) => {
	return (
		<ClayTable {...props} tableVerticalAlignment="middle">
			<ClayTable.Head>
				<ClayTable.Row>
					{columns.map((column: Columns, index: number) => (
						<ClayTable.Cell align="left" headingCell key={index}>
							<span className="text-neutral-10">
								{column.label}
							</span>
						</ClayTable.Cell>
					))}
				</ClayTable.Row>
			</ClayTable.Head>

			<ClayTable.Body>
				{rows?.map((row, index) => (
					<ClayTable.Row key={index}>
						{columns.map((column, index) => {
							const data = row[column.columnKey];

							return (
								<ClayTable.Cell
									align="left"
									className="font-weight-normal py-5 text-neutral-10"
									headingCell
									key={index}
								>
									{column.render
										? column.render(data, row)
										: data}
								</ClayTable.Cell>
							);
						})}
					</ClayTable.Row>
				))}
			</ClayTable.Body>
		</ClayTable>
	);
};

export default Table;
