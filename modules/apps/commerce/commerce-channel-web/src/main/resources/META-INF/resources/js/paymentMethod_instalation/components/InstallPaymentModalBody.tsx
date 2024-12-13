/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton, {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayEmptyState from '@clayui/empty-state';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLoadingIndicator from '@clayui/loading-indicator';
import ClayManagementToolbar from '@clayui/management-toolbar';
import {ClayPaginationBarWithBasicItems} from '@clayui/pagination-bar';
import DOMPurify from 'isomorphic-dompurify';
import React, {useState} from 'react';

import useProducts from '../hooks/useProducts';
import {Product} from '../types';
import {PAYMENT_VIEW} from './MarketplaceAppsModal';

type InstallPaymentMethodModalBodyProps = {
	loading: ReturnType<typeof useProducts>['loading'];
	pagination: ReturnType<typeof useProducts>['pagination'];
	products?: Product[];
	searchQuery: any;
	setSearchQuery: any;
	setSelectedApp: any;
	setStep: React.Dispatch<string>;
	sort: ReturnType<typeof useProducts>['sort'];
};

const InstallPaymentMethodModalBody: React.FC<
	InstallPaymentMethodModalBodyProps
> = ({
	loading,
	pagination,
	products,
	searchQuery,
	setSearchQuery,
	setSelectedApp,
	setStep,
	sort,
}) => {
	const [searchMobile, setSearchMobile] = useState(false);
	const filterItems = [
		{label: 'Filter Action 1', onClick: () => alert('Filter clicked')},
		{label: 'Filter Action 2', onClick: () => alert('Filter clicked')},
	];

	const getCategoryVocabulary = (categories: any, vocabulary: any) => {
		return categories?.filter(
			(category: any) => category?.vocabulary === vocabulary
		);
	};

	return (
		<div className="d-flex flex-column justify-content-between payment-methods-modal-body">
			<div>
				<ClayManagementToolbar className="w-100">
					<ClayManagementToolbar.ItemList>
						<ClayDropDownWithItems
							items={filterItems}
							trigger={
								<ClayButton
									className="nav-link"
									displayType="unstyled"
								>
									<span className="navbar-breakpoint-down-d-none">
										<span className="navbar-text-truncate">
											{Liferay.Language.get(
												'filter-and-order'
											)}
										</span>

										<ClayIcon
											className="inline-item inline-item-after"
											symbol="caret-bottom"
										/>
									</span>

									<span className="navbar-breakpoint-d-none">
										<ClayIcon symbol="filter" />
									</span>
								</ClayButton>
							}
						/>

						<ClayManagementToolbar.Item>
							<ClayButton
								aria-label="Order"
								className="nav-link nav-link-monospaced"
								displayType="unstyled"
								onClick={() =>
									sort.setSortDirection((prev: any) =>
										prev === 'asc' ? 'desc' : 'asc'
									)
								}
							>
								<ClayIcon
									symbol={sort.SORT_ICON[sort.sortDirection]}
								/>
							</ClayButton>
						</ClayManagementToolbar.Item>
					</ClayManagementToolbar.ItemList>

					<ClayManagementToolbar.Search showMobile={searchMobile}>
						<ClayInput.Group>
							<ClayInput.GroupItem>
								<ClayInput
									aria-label="Search"
									className="form-control input-group-inset input-group-inset-after"
									defaultValue="Search"
									onChange={(event) =>
										setSearchQuery(event.target.value)
									}
									type="text"
									value={searchQuery}
								/>

								<ClayInput.GroupInsetItem after tag="span">
									<ClayButtonWithIcon
										aria-label="Close search"
										className="navbar-breakpoint-d-none"
										displayType="unstyled"
										onClick={() => setSearchMobile(false)}
										symbol="times"
									/>

									<ClayButtonWithIcon
										aria-label="Search"
										displayType="unstyled"
										symbol="search"
										type="submit"
									/>
								</ClayInput.GroupInsetItem>
							</ClayInput.GroupItem>
						</ClayInput.Group>
					</ClayManagementToolbar.Search>

					<ClayManagementToolbar.ItemList>
						<ClayManagementToolbar.Item className="navbar-breakpoint-d-none">
							<ClayButton
								aria-label="Search"
								className="nav-link nav-link-monospaced"
								displayType="unstyled"
								onClick={() => setSearchMobile(true)}
							>
								<ClayIcon symbol="search" />
							</ClayButton>
						</ClayManagementToolbar.Item>
					</ClayManagementToolbar.ItemList>
				</ClayManagementToolbar>

				{loading ? (
					<div className="align-items-center d-flex justify-content-center payment-methods-modal-body-empty-state pt-4">
						<ClayLoadingIndicator
							displayType="primary"
							shape="squares"
							size="md"
						/>
					</div>
				) : (
					<div>
						<div className="d-flex flex-wrap p-4 payment-method-app-search-results">
							{products?.length ? (
								products?.map((product, index) => {
									const productImage = product?.urlImage;

									const priceModel =
										product?.productSpecifications?.find(
											(specification) =>
												specification?.specificationKey ===
												'price-model'
										);

									const categories = getCategoryVocabulary(
										product?.categories,
										'marketplace app category'
									);

									return (
										<div
											className="border-radius-medium d-flex flex-column justify-content-between mb-0 payment-method-app-search-results-card text-dark text-decoration-none"
											key={index}
										>
											<span
												className="payment-method-app-search-results-card-content"
												onClick={() => {
													setSelectedApp(product);
													setStep(
														PAYMENT_VIEW.details
													);
												}}
											>
												<div>
													<div className="align-items-center card-image-title-container d-flex mb-4">
														<div className="image-container mr-2 rounded">
															<img
																className="payment-method-app-search-results-card-image"
																src={
																	productImage
																}
															/>
														</div>

														<div>
															<div className="payment-method-app-search-results-card-title">
																{product?.name}
															</div>

															<div className="payment-method-app-search-results-card-subtitle">
																{
																	product?.catalogName
																}
															</div>
														</div>
													</div>

													<span
														className="payment-method-app-search-results-card-description"
														dangerouslySetInnerHTML={{
															__html: DOMPurify.sanitize(
																product?.description
															),
														}}
													/>
												</div>

												<div>
													<span className="font-weight-bold">
														{priceModel?.value}
													</span>

													<div className="d-flex my-2 payment-method-app-search-results-card-category">
														{!!categories?.length && (
															<>
																<span className="payment-method-app-search-results-card-tags">
																	{
																		categories[0]
																			?.name
																	}
																</span>

																<span className="payment-method-app-search-results-card-tags">
																	{`+ ${categories?.length}`}
																</span>
															</>
														)}
													</div>
												</div>
											</span>

											<ClayButton
												className="w-100"
												onClick={() => alert('Test')}
											>
												{Liferay.Language.get(
													'install'
												)}
											</ClayButton>
										</div>
									);
								})
							) : (
								<ClayEmptyState
									description="You don't have more notifications to review"
									imgProps={{
										alt: 'Alternative Text',
										title: 'Hello World!',
									}}
									imgSrc="/o/admin-theme/images/states/search_state.svg"
									imgSrcReducedMotion="/o/admin-theme/images/states/search_state.svg"
									title="Hurray"
								/>
							)}
						</div>
					</div>
				)}
			</div>

			<div className="d-flex justify-content-end px-4 py-4 w-100">
				<ClayPaginationBarWithBasicItems
					activeDelta={pagination.delta}
					className="w-100"
					defaultActive={pagination.deltas}
					deltas={pagination.pageSize}
					ellipsisBuffer={1}
					ellipsisProps={{
						'aria-label': Liferay.Language.get('more'),
						'title': Liferay.Language.get('more'),
					}}
					onActiveChange={pagination.setDeltas}
					onDeltaChange={pagination.setDelta}
					totalItems={pagination.totalCount}
				/>
			</div>
		</div>
	);
};

export default InstallPaymentMethodModalBody;
