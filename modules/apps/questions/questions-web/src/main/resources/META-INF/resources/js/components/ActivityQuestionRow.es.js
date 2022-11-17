/* eslint-disable default-case */
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

import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import classNames from 'classnames';
import React from 'react';

import {stripHTML} from '../utils/utils.es';
import ArticleBodyRenderer from './ArticleBodyRenderer.es';
import EditedTimestamp from './EditedTimestamp.es';
import Link from './Link.es';
import QuestionBadge from './QuestionsBadge.es';
import TagList from './TagList.es';
import UserIcon from './UserIcon.es';

const DAYS_UNTIL_SHOW_LABEL = 3;

const COMMENT_REPLY_LABEL = Liferay.Language.get('comment-reply');
const QUESTION_LABEL = Liferay.Language.get('question');
const ANSWER_LABEL = Liferay.Language.get('answer');

export default function UserActivityQuestionRow({
	context,
	creatorId,
	currentSection,
	getQuestionCreatedInDays,
	linkProps,
	question,
	rowSelected,
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

	const rowLabelAsk =
		question.labelAnswers[0] === 'RE:' ? '' : Liferay.Language.get('asked');

	const verifyCurrentBadgeFields = () => {
		const storeFields = {
			label: '',
			symbol: '',
		};

		if (question.labelAnswers[1] === 'RE:') {
			storeFields.label = COMMENT_REPLY_LABEL;
			storeFields.symbol = 'reply';
		} else if (question.labelAnswers[0] === 'RE:') {
			storeFields.label = ANSWER_LABEL;
			storeFields.symbol = 'message';
		} else {
			storeFields.label = QUESTION_LABEL;
			storeFields.symbol = 'question-circle-full';
		}

		return storeFields;
	};

	const badgeField = verifyCurrentBadgeFields();

	const normalizeQuestionHeadLine = () => {
		let storeRowHeadLine = '';
		if (question.labelAnswers[1] === 'RE:') {
			storeRowHeadLine = question.headline.substr(7);
		} else if (question.labelAnswers[0] === 'RE:') {
			storeRowHeadLine = question.headline.substr(3);
		} else {
			storeRowHeadLine = question.headline;
		}

		return storeRowHeadLine;
	};

	const headLineNormalized = normalizeQuestionHeadLine();

	return (
		<div
			className={classNames(
				'c-mt-3 c-p-3 position-relative question-row text-secondary',
				{'question-row-selected': isRowSelected}
			)}
		>
			<div className="align-items-center d-flex flex-wrap justify-content-between">
				<ul className="align-items-center c-mb-2 d-flex flex-nowrap list-badges list-unstyled stretched-link-layer">
					{getQuestionCreatedInDays <= DAYS_UNTIL_SHOW_LABEL &&
						badgeField.label !== COMMENT_REPLY_LABEL && (
							<li>
								<span className="new-question-badge text-uppercase">
									{Liferay.Language.get('new')}
								</span>
							</li>
						)}

					<li>
						<QuestionBadge
							className={classNames(
								'bg-light label-secondary text-uppercase',
								{
									'questions-reply':
										badgeField.symbol === 'reply',
								}
							)}
							iconInvert={classNames({
								'questions-reply-icon':
									badgeField.symbol === 'reply',
							})}
							isActivityBadge
							symbol={badgeField.symbol}
							value={badgeField.label}
						/>
					</li>

					<li>
						<QuestionBadge
							className="bg-light label-secondary text-uppercase"
							isActivityBadge
							value={question.messageBoardSection.title}
						/>
					</li>
				</ul>
			</div>

			<Link
				className="questions-title stretched-link"
				to={`/questions/${sectionTitle}/${question.friendlyUrlPath}`}
				{...linkProps}
			>
				<h4
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
					{headLineNormalized}

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
				</h4>
			</Link>

			<div className="c-mb-1 c-mt-2 stretched-link-layer text-truncate">
				{badgeField.label !== QUESTION_LABEL && (
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

						<strong
							className={classNames('text-dark', {
								'c-ml-2': creatorInformation.portraitURL,
							})}
						>
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
