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

import {ClayButtonWithIcon} from '@clayui/button';
import {ClayDropDownWithItems} from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React from 'react';

import {normalizeRating, stripHTML} from '../utils/utils.es';
import ArticleBodyRenderer from './ArticleBodyRenderer.es';
import EditedTimestamp from './EditedTimestamp.es';
import Link from './Link.es';
import QuestionBadge from './QuestionsBadge.es';
import SectionLabel from './SectionLabel.es';
import TagList from './TagList.es';
import UserIcon from './UserIcon.es';

const DAYS_UNTIL_SHOW_LABEL = 3;

export default function QuestionRow({
	context,
	creatorId,
	currentSection,
	getQuestionCreatedInDays,
	display = {
		articleBody: true,
		linksLayer: false,
		styled: true,
	},
	items,
	linkProps,
	question,
	rowSelected,
	showSectionLabel,
}) {
	const sectionTitle =
		currentSection || currentSection === '0'
			? currentSection
			: question.messageBoardSection &&
			  question.messageBoardSection.title;

	const creatorInformation = question.creator
		? {
				link: `/questions/all/creator/${question.creator.id}`,
				name: question.creator.name,
				portraitURL: question.creator.image,
				userId: String(question.creator.id),
		  }
		: {
				link: `/questions/${sectionTitle}`,
				name: '',
				portraitURL: '',
				userId: '0',
		  };

	const isRowSelected = question.friendlyUrlPath === rowSelected;

	const rowLabelAnswers =
		question.labelAnswers === 'RE:'
			? Liferay.Language.get('answer')
			: Liferay.Language.get('question');
	const rowLabelAsk =
		question.labelAnswers === 'RE:' ? '' : Liferay.Language.get('asked');

	return (
		<div
			className={classNames(
				'c-mt-4 c-p-3 position-relative question-row text-secondary',
				{'question-row-selected': isRowSelected}
			)}
		>
			<div
				className={classNames(
					'align-items-center mb-0 d-flex flex-wrap',
					{
						'justify-content-between': display.styled,
					}
				)}
			>
				{!display.linksLayer && (
					<>
						<span>
							{showSectionLabel && (
								<SectionLabel
									section={question.messageBoardSection}
								/>
							)}
						</span>
						<ul className="c-mb-0 d-flex flex-wrap list-unstyled mb-3 stretched-link-layer">
							<li>
								<QuestionBadge
									symbol={
										normalizeRating(
											question.aggregateRating
										) < 0
											? 'caret-bottom'
											: 'caret-top'
									}
									tooltip={Liferay.Language.get('votes')}
									value={normalizeRating(
										question.aggregateRating
									)}
								/>
							</li>

							<li>
								<QuestionBadge
									symbol="view"
									tooltip={Liferay.Language.get('view-count')}
									value={question.viewCount}
								/>
							</li>

							<li data-testid="has-valid-answer-badge">
								<QuestionBadge
									className={
										question.hasValidAnswer
											? 'alert-success border-0'
											: question.hasValidAnswer
									}
									symbol={
										question.hasValidAnswer
											? 'check-circle-full'
											: 'message'
									}
									tooltip={Liferay.Language.get(
										'number-of-replies'
									)}
									value={
										question.numberOfMessageBoardMessages
									}
								/>
							</li>

							{items && !!items.length && (
								<li>
									<ClayDropDownWithItems
										className="c-py-1"
										items={items}
										trigger={
											<ClayButtonWithIcon
												displayType="unstyled"
												small
												symbol="ellipsis-v"
											/>
										}
									/>
								</li>
							)}
						</ul>
					</>
				)}

				{display.linksLayer && (
					<ul className="align-items-center c-mb-2 d-flex flex-nowrap list-badges list-unstyled stretched-link-layer">
						{getQuestionCreatedInDays <= DAYS_UNTIL_SHOW_LABEL && (
							<li>
								<span className="new-question-badge">
									{Liferay.Language.get('new')}
								</span>
							</li>
						)}

						<li>
							<QuestionBadge
								className="bg-light label-secondary"
								symbol="question-circle-full"
								value={rowLabelAnswers}
							/>
						</li>

						<li>
							<QuestionBadge
								className="bg-light label-secondary"
								value={question.messageBoardSection.title}
							/>
						</li>
					</ul>
				)}
			</div>

			<Link
				className="questions-title stretched-link"
				to={`/questions/${sectionTitle}/${question.friendlyUrlPath}`}
				{...linkProps}
			>
				<h2
					className={classNames(
						'c-mb-0',
						'stretched-link-layer',
						'text-dark',
						{
							'question-seen':
								question.seen ||
								context?.questionsVisited?.includes(
									question.id
								),
						}
					)}
				>
					{question.headline}

					{question.status && question.status !== 'approved' && (
						<span className="c-ml-2">
							<ClayLabel displayType="info">
								{question.status}
							</ClayLabel>
						</span>
					)}

					{!!question.locked && (
						<span className="c-ml-2">
							<ClayIcon
								data-tooltip-align="top"
								symbol="lock"
								title={Liferay.Language.get(
									'this-question-is-closed-new-answers-and-comments-are-disabled'
								)}
							/>
						</span>
					)}
				</h2>
			</Link>

			<div
				className={classNames(
					'c-mb-0 c-mt-3 stretched-link-layer text-truncate',
					{
						'question-row-article-body': display.styled,
					}
				)}
			>
				{display.articleBody && (
					<ArticleBodyRenderer
						{...question}
						articleBody={stripHTML(question.articleBody)}
						compactMode={true}
					/>
				)}
			</div>

			<div className="align-items-sm-center align-items-start d-flex flex-column-reverse flex-sm-row justify-content-between">
				<div className="c-mt-3 c-mt-sm-0 stretched-link-layer">
					<Link
						className={classNames({
							'disabled-link': !!creatorId,
						})}
						to={creatorInformation.link}
					>
						{creatorInformation.portraitURL && (
							<UserIcon
								fullName={creatorInformation.name}
								portraitURL={creatorInformation.portraitURL}
								size="sm"
								userId={creatorInformation.userId}
							/>
						)}

						<strong className="c-ml-2 text-dark">
							{creatorInformation.name ||
								Liferay.Language.get(
									'anonymous-user-configuration-name'
								)}
						</strong>
					</Link>

					<EditedTimestamp
						dateCreated={question.dateCreated}
						dateModified={question.dateModified}
						operationText={Liferay.Language.get(`${rowLabelAsk}`)}
					/>
				</div>

				{question.keywords && (
					<TagList
						sectionTitle={
							sectionTitle?.title
								? sectionTitle.title
								: sectionTitle
						}
						tags={question.keywords}
					/>
				)}
			</div>
		</div>
	);
}
