import useSWR from "swr";
import HeadlessCommerceAdminCatalog from "../../../services/rest/HeadlessCommerceAdminCatalog";
import SearchBuilder from "../../../core/SearchBuilder";
import { addDays, eachDayOfInterval, format } from 'date-fns';


export const METRIC_PARAMETER = {
    month: 30,
    q1: 1,
    q2: 2,
    q3: 3,
    q4: 4,
    week: 7,
};

type FilterType = 'month' | 'q1' | 'q2' | 'q3' | 'q4' | 'week';


export const inReviewFilter = new SearchBuilder().lambda(
    'statusCode',
    2, { unquote: true }
).and()

export const approvedFilter = new SearchBuilder().lambda(
    'statusCode',
    0, { unquote: true }
).and()

const searchParams = {
    'nestedFields': 'id',
    'pageSize': '-1',
    'productSpecifications.pageSize': '-1',
}

const useAppsMetricks = (param: FilterType = 'week') => {
    const currentTime = new Date();

    const beforeLastPeriod = addDays(
        currentTime,
        -METRIC_PARAMETER[param as keyof typeof METRIC_PARAMETER] * 2
    );

    const lastPeriod = addDays(
        currentTime,
        -METRIC_PARAMETER[param as keyof typeof METRIC_PARAMETER]
    );

    beforeLastPeriod.setHours(0, 0, 0);
    lastPeriod.setHours(23, 59, 59);

    const {
        data: [
            allApps,
            inReview,
            inreviewLastlastweek,
            inreviewBeforeLastWeek,
            approved,
            approvedLastWeek,
            approvedBeforeLastWeek
        ] = [],
    } = useSWR('/administrator/orders/metrics', () =>
        Promise.all([
            HeadlessCommerceAdminCatalog.getProducts(
                new URLSearchParams({
                    ...searchParams
                })
            ),
            HeadlessCommerceAdminCatalog.getProducts(
                new URLSearchParams({
                    'filter': inReviewFilter.build(),
                    ...searchParams
                })
            ),
            HeadlessCommerceAdminCatalog.getProducts(
                new URLSearchParams({
                    'filter': inReviewFilter.clone()
                        .gt('createDate', lastPeriod.toISOString())
                        .build(),
                    ...searchParams
                })
            ),
            HeadlessCommerceAdminCatalog.getProducts(
                new URLSearchParams({
                    'filter': inReviewFilter.clone()
                        .lt('createDate', lastPeriod.toISOString())
                        .and()
                        .gt('createDate', beforeLastPeriod.toISOString())
                        .build(),
                    ...searchParams
                })
            ),
            HeadlessCommerceAdminCatalog.getProducts(
                new URLSearchParams({
                    'filter': approvedFilter.build(),
                    ...searchParams
                })
            ),
            HeadlessCommerceAdminCatalog.getProducts(
                new URLSearchParams({
                    'filter': approvedFilter.clone().gt('createDate', lastPeriod.toISOString())
                        .build(),
                    ...searchParams
                })
            ),
            HeadlessCommerceAdminCatalog.getProducts(
                new URLSearchParams({
                    'filter': approvedFilter.clone().lt('createDate', lastPeriod.toISOString())
                        .and()
                        .gt('createDate', beforeLastPeriod.toISOString())
                        .build(),
                    ...searchParams
                })
            )
        ])
    );


    return {
        allApps: allApps?.totalCount || 0,
        approved: approved?.totalCount || 0,
        approvedBeforeLastWeek: approvedBeforeLastWeek?.totalCount || 0,
        approvedLastWeek: approvedLastWeek?.totalCount || 0,
        inReview: inReview?.totalCount || 0,
        inreviewBeforeLastWeek: inreviewBeforeLastWeek?.totalCount || 0,
        inreviewLastlastweek: inreviewLastlastweek?.totalCount || 0,
    }


}

export default useAppsMetricks; 