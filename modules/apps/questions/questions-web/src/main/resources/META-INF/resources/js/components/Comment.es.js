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
import ClayForm, {ClayInput, ClayRadio, ClayRadioGroup} from '@clayui/form';
import ClayIcon from '@clayui/icon';
import ClayLabel from '@clayui/label';
import {useMutation} from 'graphql-hooks';
import React, {useState} from 'react';
import {Link, withRouter} from 'react-router-dom';

import {deleteMessageQuery} from '../utils/client.es';
import lang from '../utils/lang.es';
import {getDateFormatted} from '../utils/time.es';
import ArticleBodyRenderer from './ArticleBodyRenderer.es';
import Modal from './Modal.es';

export default withRouter(
	({comment, commentChange, editable = true, match: {url}}) => {
		const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(
			false
		);
		const [onOpenChange, setOnOpenChange] = useState(false);

		const [deleteMessage] = useMutation(deleteMessageQuery);

		const suspiciousCategories = [
			{label: 'Inappropriate content', value: 0},
			{label: 'Harassment or bullying', value: 1},
			{label: 'Harmful or dangerous acts', value: 2},
			{label: 'Spam or misleading', value: 3},
			{label: 'Infringes human rights', value: 4},
		];

		const MAX_DESCRIPTION_LENGTH = 500;

		const [form, setForm] = useState({
			description: '',
			suspiciousCategoryId: suspiciousCategories[0]?.value,
		});

		return (
			<div className="c-my-3 questions-reply row">
				<div className="align-items-md-center col-2 col-md-1 d-flex justify-content-end justify-content-md-center">
					<ClayIcon
						className="c-mt-3 c-mt-md-0 questions-reply-icon text-secondary"
						symbol="reply"
					/>
				</div>

				<div className="col-10 col-lg-11">
					<span className="text-secondary">
						{lang.sub(Liferay.Language.get('replied-x'), [
							getDateFormatted(comment.dateCreated),
						])}
					</span>

					{comment.status && comment.status !== 'approved' && (
						<span className="c-ml-2 text-secondary">
							<ClayLabel displayType="info">
								{comment.status}
							</ClayLabel>
						</span>
					)}

					<div className="c-mb-0">
						<ArticleBodyRenderer
							{...comment}
							signature={comment.creator && comment.creator.name}
						/>
					</div>

					{editable && comment.actions.delete && (
						<>
							<div
								className="font-weight-bold text-secondary"
								spaced={true}
							>
								<ClayButton
									className="btn-sm c-mr-2 c-px-2 c-py-1"
									displayType="secondary"
									onClick={() => {
										setShowDeleteCommentModal(true);
									}}
								>
									{Liferay.Language.get('delete')}
								</ClayButton>

								<>
									<ClayButton
										className="btn-sm c-mr-2 c-px-2 c-py-1"
										data-testid="mark-as-answer-button"
										displayType="secondary"
										onClick={() => {
											setOnOpenChange(true);
										}}
									>
										{Liferay.Language.get('report')}
									</ClayButton>
									<Modal
										body={
											<ClayForm>
												<h2 className="mb-3">
													Do you want to report this
													comment?
												</h2>

												<ClayRadioGroup
													defaultValue={
														form.suspiciousCategoryId
													}
												>
													{suspiciousCategories.map(
														(
															suspiciousCategory,
															index
														) => (
															<ClayRadio
																key={index}
																label={
																	suspiciousCategory.label
																}
																onClick={() =>
																	setForm({
																		...form,
																		suspiciousCategoryId:
																			suspiciousCategory.value,
																	})
																}
																value={
																	suspiciousCategory.value
																}
															/>
														)
													)}
												</ClayRadioGroup>

												<ClayForm.Group className="form-group-sm">
													<label htmlFor="description">
														{Liferay.Language.get(
															'description'
														)}
													</label>

													<ClayInput
														component="textarea"
														id="description"
														maxLength={
															MAX_DESCRIPTION_LENGTH
														}
														onChange={(event) =>
															setForm({
																...form,
																description:
																	event.target
																		.value,
															})
														}
														placeholder="Report Suspicious Activity"
														value={form.description}
													/>

													<div className="d-flex form-text justify-content-end mt-1">
														{`${
															form?.description
																?.length
																? form
																		?.description
																		?.length
																: 0
														} / ${MAX_DESCRIPTION_LENGTH}`}
													</div>

													<div className="form-text">
														Reported activity is
														moderated by community
														admins to determine
														whether they violate any
														guidelines. Accounts are
														penalized, and serious
														or repeated violations
														can lead to account
														termination.
													</div>
												</ClayForm.Group>
											</ClayForm>
										}
										onClose={() => {
											setOnOpenChange(false);
										}}
										status="warning"
										textPrimaryButton={Liferay.Language.get(
											'report'
										)}
										title="Report comment?"
										visible={onOpenChange}
									/>
								</>

								<ClayButton
									className="btn-sm c-px-2 c-py-1"
									displayType="secondary"
								>
									<Link
										className="text-reset"
										to={`${url}/answers/${comment.friendlyUrlPath}/edit`}
									>
										{Liferay.Language.get('edit')}
									</Link>
								</ClayButton>
							</div>

							<Modal
								body={Liferay.Language.get(
									'do-you-want-to-delete–this-comment'
								)}
								callback={() => {
									deleteMessage({
										variables: {
											messageBoardMessageId: comment.id,
										},
									}).then(() => {
										if (commentChange) {
											commentChange(comment);
										}
									});
								}}
								onClose={() => {
									setShowDeleteCommentModal(false);
								}}
								status="warning"
								textPrimaryButton={Liferay.Language.get(
									'delete'
								)}
								title={Liferay.Language.get('delete-comment')}
								visible={showDeleteCommentModal}
							/>
						</>
					)}
				</div>
			</div>
		);
	}
);
