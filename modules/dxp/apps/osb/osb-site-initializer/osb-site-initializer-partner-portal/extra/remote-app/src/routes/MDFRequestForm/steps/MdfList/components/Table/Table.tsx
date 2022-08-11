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
     label: string;
     columnKey: string;
     render?: (data: any, item: any) => any;
 };
 
 type TableProps<T = any> = {
     actions?: any[];
     columns: Columns[];
     responsive?:boolean
     rows: T[];
 };
 
 const Table: React.FC<TableProps> = ({columns, rows, ...props}) => {
     return (
         <ClayTable {...props}>
             <ClayTable.Head>
                 <ClayTable.Row>
                     {columns.map((column, index) => (
                         <ClayTable.Cell headingCell key={index}>
                             {column.label}
                         </ClayTable.Cell>
                     ))}
                 </ClayTable.Row>
             </ClayTable.Head>
 
             <ClayTable.Body>
                 {rows.map((row, index) => (
                     <ClayTable.Row key={index}>
                         {columns.map((column, index) => {
                             const data = row[column.columnKey];
                             return (
                                 <ClayTable.Cell headingCell key={index}>
                                     {column.render
                                         ? column.render(data, row)
                                         : column.columnKey === "requestId" ? <a href='/marketing'>{data}</a> :
                                         data}
                                         
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