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

import ClayButton from '@clayui/button';
import ClayEmptyState from '@clayui/empty-state';
import {ClayInput} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import {useManualQuery} from 'graphql-hooks';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import {withRouter} from 'react-router-dom';

import {AppContext} from '../../AppContext.es';
import Alert from '../../components/Alert.es';
import Breadcrumb from '../../components/Breadcrumb.es';
import PaginatedList from '../../components/PaginatedList.es';
import QuestionRow from '../../components/QuestionRow.es';
import ResultsMessage from '../../components/ResultsMessage.es';
import SubscriptionButton from '../../components/SubscriptionButton.es';
import AskQuestionButton from '../../components/questions/AskQuestionButton.es';
import QuestionsFilter from '../../components/questions/QuestionFilter.es';
import SearchQuestions from '../../components/questions/SearchQuestions';
import useQueryParams from '../../hooks/useQueryParams.es';
import {
	getMessageBoardSectionFilteredMessageBoardThreads,
	getSectionBySectionTitleQuery,
	getSectionsQuery,
	getSubscriptionsQuery,
	subscribeSectionQuery,
	unsubscribeSectionQuery,
} from '../../utils/client.es';
import {ALL_SECTIONS_ID} from '../../utils/contants.es';
import lang from '../../utils/lang.es';
import {
	deleteCacheKey,
	getBasePath,
	getFullPath,
	historyPushWithSlug,
	slugToText,
	useDebounceCallback,
} from '../../utils/utils.es';

export default withRouter(
	({
		history,
		location,
		match: {
			params: {creatorId, sectionTitle, tag},
		},
	}) => {
		const MAX_NUMBER_OF_QUESTIONS = 500;
		const [
			allowCreateTopicInRootTopic,
			setAllowCreateTopicInRootTopic,
		] = useState(false);
		const [error, setError] = useState({});
		const [filter, setFilter] = useState({});
		const [loading, setLoading] = useState(true);
		const [page, setPage] = useState(null);
		const [pageSize, setPageSize] = useState(null);
		const [questions, setQuestions] = useState({});
		const [search, setSearch] = useState(null);
		const [section, setSection] = useState({});
		const [sectionQuery, setSectionQuery] = useState('');
		const [sectionQueryVariables, setSectionQueryVariables] = useState({});

		const queryParams = useQueryParams(location);

		const context = useContext(AppContext);

		const [getSections] = useManualQuery(getSectionsQuery, {
			variables: {siteKey: context.siteKey},
		});
		const [getSectionBySectionTitle] = useManualQuery(
			getSectionBySectionTitleQuery,
			{
				variables: {
					filter: `title eq '${slugToText(
						sectionTitle
					)}' or id eq '${slugToText(sectionTitle)}'`,
					siteKey: context.siteKey,
				},
			}
		);

		const [getThreadsFiltered] = useManualQuery(
			getMessageBoardSectionFilteredMessageBoardThreads
		);

		useEffect(() => {
			const pageNumber = queryParams.get('page') || 1;
			setPage(isNaN(pageNumber) ? 1 : parseInt(pageNumber, 10));
		}, [queryParams]);

		useEffect(() => {
			setPageSize(queryParams.get('pagesize') || 20);
		}, [queryParams]);

		useEffect(() => {
			setSearch(queryParams.get('search') || '');
		}, [queryParams]);

		useEffect(() => {
			document.title =
				sectionTitle === ALL_SECTIONS_ID
					? Liferay.Language.get('all-questions')
					: (section && section.title) || sectionTitle;
		}, [sectionTitle, section]);

		useEffect(() => {
			if (
				+context.rootTopicId === 0 &&
				location.pathname.endsWith('/' + context.rootTopicId)
			) {
				const fn =
					!context.rootTopicId || context.rootTopicId === '0'
						? getSections()
						: getSectionBySectionTitle().then(
								({data}) => data.messageBoardSections.items[0]
						  );

				fn.then((result) => ({
					...result,
					data: result.data.messageBoardSections,
				}))
					.then(({data}) => {
						setAllowCreateTopicInRootTopic(
							data.actions && !!data.actions.create
						);
					})
					.catch((error) => {
						if (process.env.NODE_ENV === 'development') {
							console.error(error);
						}
						setLoading(false);
						setError({message: 'Loading Topics', title: 'Error'});
					});
			}
		}, [
			context.rootTopicId,
			context.siteKey,
			location.pathname,
			getSectionBySectionTitle,
			getSections,
		]);

		const getMbThreads = useCallback(
			({
				filter,
				messageBoardSectionId = section.id,
				search,
				sort,
				tag,
			}) => {
				getThreadsFiltered({
					variables: {
						filter,
						messageBoardSectionId,
						page,
						pageSize,
						search,
						sort,
						tag: tag || null,
					},
				})
					.then(({data}) => {
						const messageBoardThreads =
							data?.messageBoardSectionFilteredMessageBoardThreads ||
							{};

						setQuestions({
							...messageBoardThreads,
							totalCount:
								messageBoardThreads.totalCount >
								MAX_NUMBER_OF_QUESTIONS
									? MAX_NUMBER_OF_QUESTIONS
									: messageBoardThreads.totalCount,
						});
					})
					.catch((error) => {
						if (process.env.NODE_ENV === 'development') {
							console.error(error);
						}
						setError({
							message: 'Loading Questions',
							title: 'Error',
						});
					})
					.finally(() => setLoading(false));
			},
			[getThreadsFiltered, page, pageSize, section.id]
		);

		useEffect(() => {
			if (section.id) {
				getMbThreads({
					filter: '',
					messageBoardSectionId: section.id,
					search: '',
					sort: '',
					tag: '',
				});
			}
		}, [getMbThreads, section.id]);

		const historyPushParser = historyPushWithSlug(history.push);

		function buildURL(search, page, pageSize) {
			let url = '/questions';

			if (sectionTitle || sectionTitle === ALL_SECTIONS_ID) {
				url += `/${sectionTitle}`;
			}

			if (tag) {
				url += `/tag/${tag}`;
			}
			if (creatorId) {
				url += `/creator/${creatorId}`;
			}
			if (search) {
				url += `?search=${search}&`;
			} else {
				url += '?';
			}

			url += `page=${page}&pagesize=${pageSize}`;

			return url;
		}

		function changePage(search, page, pageSize) {
			historyPushParser(buildURL(search, page, pageSize));
		}

		const [debounceCallback] = useDebounceCallback(
			(search) => changePage(search, 1, 20),
			500
		);

		useEffect(() => {
			if (sectionTitle && sectionTitle !== ALL_SECTIONS_ID) {
				const variables = {
					filter: `title eq '${slugToText(
						sectionTitle
					)}' or id eq '${slugToText(sectionTitle)}'`,
					siteKey: context.siteKey,
				};
				getSectionBySectionTitle({
					variables,
				}).then(({data}) => {
					if (data.messageBoardSections.items[0]) {
						setSection(data.messageBoardSections.items[0]);
						setSectionQuery(getSectionBySectionTitleQuery);
						setSectionQueryVariables(variables);
					} else {
						setSection(null);
						setError({message: 'Loading Topics', title: 'Error'});
						setLoading(false);
					}
				});
			} else if (sectionTitle === ALL_SECTIONS_ID) {
				const variables = {siteKey: context.siteKey};
				getSections({
					variables,
				})
					.then(({data: {messageBoardSections}}) => ({
						actions: messageBoardSections.actions,
						id: 0,
						messageBoardSections,
						numberOfMessageBoardSections:
							messageBoardSections &&
							messageBoardSections.items &&
							messageBoardSections.items.length,
					}))
					.then((section) => {
						setSection(section);
						setSectionQuery(getSectionsQuery);
						setSectionQueryVariables(variables);
					});
			}
		}, [
			sectionTitle,
			context.siteKey,
			getSections,
			getSectionBySectionTitle,
		]);

		const navigateToNewQuestion = () => {
			if (context.redirectToLogin && !themeDisplay.isSignedIn()) {
				const baseURL = getBasePath();

				window.location.replace(
					`/c/portal/login?redirect=${baseURL}${
						context.historyRouterBasePath
							? context.historyRouterBasePath.replace('/', '')
							: '#'
					}/questions/${sectionTitle}/new`
				);
			} else {
				historyPushParser(`/questions/${sectionTitle}/new`);
			}

			return false;
		};

		return (
			<section className="questions-section questions-section-list">
				<Breadcrumb
					allowCreateTopicInRootTopic={allowCreateTopicInRootTopic}
					section={section}
				/>

				<div className="questions-container row">
					<div className="c-mt-3 col col-xl-12">
						<QuestionsNavigationBar />
					</div>

					{!!search && !loading && (
						<ResultsMessage
							maxNumberOfSearchResults={MAX_NUMBER_OF_QUESTIONS}
							searchCriteria={search}
							totalCount={questions.totalCount}
						/>
					)}

					{!section && (
						<ClayEmptyState
							className="c-mx-auto c-px-0 col-xl-10"
							description={lang.sub(
								Liferay.Language.get(
									'the-link-you-followed-may-be-broken-or-the-topic-no-longer-exists'
								),
								[sectionTitle]
							)}
							imgSrc={
								context.includeContextPath +
								'/assets/empty_questions_list.png'
							}
							title={Liferay.Language.get(
								'the-topic-is-not-found'
							)}
						>
							<ClayButton
								displayType="primary"
								onClick={() => historyPushParser('/questions')}
							>
								{Liferay.Language.get('home')}
							</ClayButton>
						</ClayEmptyState>
					)}

					{section && (
						<div className="c-mx-auto c-px-0 col-xl-10">
							<PaginatedList
								activeDelta={pageSize}
								activePage={page}
								changeDelta={(pageSize) =>
									changePage(search, page, pageSize)
								}
								changePage={(page) =>
									changePage(search, page, pageSize)
								}
								data={questions}
								emptyState={
									sectionTitle && !search ? (
										<ClayEmptyState
											description={Liferay.Language.get(
												'there-are-no-questions-inside-this-topic-be-the-first-to-ask-something'
											)}
											imgSrc={
												context.includeContextPath +
												'/assets/empty_questions_list.png'
											}
											title={Liferay.Language.get(
												'this-topic-is-empty'
											)}
										>
											{((context.redirectToLogin &&
												!themeDisplay.isSignedIn()) ||
												context.canCreateThread) && (
												<ClayButton
													displayType="primary"
													onClick={
														navigateToNewQuestion
													}
												>
													{Liferay.Language.get(
														'ask-question'
													)}
												</ClayButton>
											)}
										</ClayEmptyState>
									) : (
										<ClayEmptyState
											title={Liferay.Language.get(
												'there-are-no-results'
											)}
										/>
									)
								}
								hrefConstructor={(page) =>
									`${getFullPath('questions')}${
										context.historyRouterBasePath
											? ''
											: '#/'
									}questions/${sectionTitle}?page=${page}&pagesize=${pageSize}`
								}
								loading={loading}
								totalCount={questions.totalCount}
							>
								{(question) => (
									<QuestionRow
										context={context}
										currentSection={sectionTitle}
										key={question.id}
										question={question}
										showSectionLabel={
											!!section.numberOfMessageBoardSections
										}
									/>
								)}
							</PaginatedList>

							<ClayButton
								className="btn-monospaced d-block d-sm-none position-fixed questions-button shadow"
								displayType="primary"
								onClick={navigateToNewQuestion}
							>
								<ClayIcon symbol="pencil" />

								<span className="sr-only">
									{Liferay.Language.get('ask-question')}
								</span>
							</ClayButton>

							<Alert info={error} />
						</div>
					)}
				</div>
			</section>
		);

		function QuestionsNavigationBar() {
			return (
				<div className="d-flex flex-column flex-xl-row justify-content-between">
					<div className="align-items-center d-flex flex-grow-1">
						{section &&
							section.actions &&
							section.actions.subscribe && (
								<div className="c-ml-3">
									<SubscriptionButton
										isSubscribed={section.subscribed}
										onSubscription={() => {
											deleteCacheKey(
												sectionQuery,
												sectionQueryVariables
											);
											deleteCacheKey(
												getSubscriptionsQuery,
												{
													contentType:
														'MessageBoardSection',
												}
											);
										}}
										parentSection={section.parentSection}
										queryVariables={{
											messageBoardSectionId: section.id,
										}}
										showTitle={true}
										subscribeQuery={subscribeSectionQuery}
										unsubscribeQuery={
											unsubscribeSectionQuery
										}
									/>
								</div>
							)}
					</div>

					{((questions && questions.totalCount > 0) ||
						search ||
						filter) && (
						<div className="c-mt-3 c-mt-xl-0 d-flex flex-column flex-grow-1 flex-md-row">
							<ClayInput.Group className="justify-content-xl-end">
								<QuestionsFilter onApplyFilter={getMbThreads} />
							</ClayInput.Group>

							<ClayInput.Group className="c-ml-2 c-mt-3 c-mt-md-0">
								<SearchQuestions
									debounceCallback={debounceCallback}
									loading={loading}
									questions={questions}
									search={search}
									slugToText={slugToText}
								/>

								{sectionTitle &&
									questions &&
									questions.totalCount > 0 &&
									((context.redirectToLogin &&
										!themeDisplay.isSignedIn()) ||
										(section &&
											section.actions &&
											Boolean(
												section.actions['add-thread']
											)) ||
										context.canCreateThread) &&
									sectionTitle !== ALL_SECTIONS_ID && (
										<AskQuestionButton
											navigateToNewQuestion={
												navigateToNewQuestion
											}
										/>
									)}
							</ClayInput.Group>
						</div>
					)}

					{section && (
						<Helmet>
							<title>{section.title}</title>

							<link
								href={`${getFullPath('questions')}${
									context.historyRouterBasePath ? '' : '#/'
								}questions/${sectionTitle}?page=${page}&pagesize=${pageSize}`}
								rel="canonical"
							/>
						</Helmet>
					)}
				</div>
			);
		}
	}
);
