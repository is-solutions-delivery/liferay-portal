/*	const mdfListObject = data?.items.reduce(
        (objAccumulator: any, values: any) => {

            const obj = {
                activityPeriod: values.minDateActivity + values.maxDateActivity,
                approved: '',
                reimpursementClaim: '',
                requestId: values.id,
                requested: '',
                status: values.status.label_i18n,
                totalCost: '',
        };
            return {
 
                items: [...objAccumulator.items, obj],

            };
        },
        {items: []}
    );
*/

import MDFRequest from "../../../../../common/interfaces/mdfRequest";


export default function getMDFListObject(data: MDFRequest[] | undefined) {
    return (
    data?.map((values) => (
             {
                activityPeriod: values.minDateActivity + values.maxDateActivity,
                approved: '',
                reimpursementClaim: '',
                requestId: values.id,
                requested: '',
                status: '',
                totalCost: values.totalCostOfExpense,
        }
    )))
    
}