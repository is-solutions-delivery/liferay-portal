/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-bundles-Identifier: LGPL-2.1-or-later OR bundlesRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import { ClayTooltipProvider } from '@clayui/tooltip';
import classNames from 'classnames';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { DashboardEmptyTable } from '../../../../../components/DashboardTable/DashboardEmptyTable';
import Table from '../../../../../components/Table/Table';
import i18n from '../../../../../i18n';
import TitleSubtitleHeader from '../../../components/TitleSubtitleHeader';

import './Bundles.scss';


const PAGE_SIZES = [
    { label: 5 },
    { label: 10 },
    { label: 20 },
    { label: 30 },
    { label: 50 },
];

const LiferayServiceBundles = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const mockRows = [
        {
            description: 'DXP Q1 2026',
        },

    ];

    const rows = mockRows;

    return (
        <div className="bundles mb-9 mt-4 ">
            {rows.length && (
                <Table
                    hasHover={false}
                    Actions={() => {

                        return (
                            <ClayTooltipProvider>
                                <div className="bundles-actions d-flex justify-content-end">
                                    <ClayButton
                                        displayType="secondary"
                                        className="px-3 rounded bundles-download-btn"
                                        onClick={() => { }}
                                    >
                                        {i18n.translate('download')}
                                    </ClayButton>
                                </div>
                            </ClayTooltipProvider>
                        );
                    }}
                    columns={[
                        {
                            bodyClass: 'border-0 cursor-pointer text-capitalize',
                            expanded: true,
                            key: 'description',
                            noWrap: true,
                            render: (
                                description
                            ) => (
                                <div className="d-flex flex-column">

                                    <span className="bundle-name">
                                        {description}
                                    </span>
                                </div>
                            ),
                            title: (
                                <TitleSubtitleHeader title="Bundle Name" />
                            ),
                        }

                    ]}
                    hasKebabButton
                    hasPagination
                    kebabClassName="border-0"
                    paginationProps={{
                        activeDelta: pageSize,
                        activePage: page,
                        deltas: PAGE_SIZES,
                        onDeltaChange: (pageSize: number) => setPageSize(pageSize),
                        onPageChange: (page: number) => setPage(page),
                        totalItems: rows.length,
                    }}
                    rows={rows}
                />
            )}
        </div>
    );
};

export default LiferayServiceBundles;
