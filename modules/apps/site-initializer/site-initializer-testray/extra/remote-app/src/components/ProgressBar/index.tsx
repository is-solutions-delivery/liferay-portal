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

import classNames from 'classnames';

import {Progress, Tasks} from '../../util/mock';

type ProgressBarProps = {
	bar_style: string;
	items: Tasks | Progress;
	legend?: boolean;
};

const ProgressBar: React.FC<ProgressBarProps> = (props) => {
	const {bar_style, items, legend} = props;

	const tempValues = Object.entries(items).sort(
		(value1, value2) => value2[1] - value1[1]
	);
	const total = tempValues
		.map((valor) => valor[1])
		.reduce((value, index) => {
			return value + index;
		});
	const completeProgressBarValue = tempValues
		.filter((valor) => {
			if (valor[0] !== 'incomplete') {
				return valor[1];
			}
		})
		.map((valor) => valor[1])
		.reduce((previus, current) => previus + current);

	const taskClasses = (classes: string) => {
		return {
			'blocked': classes === 'blocked',
			'failed': classes === 'failed',
			'passed': classes === 'passed',
			'test-fix': classes === 'test_fix',
			'test-incomplete': classes === 'incomplete',
		};
	};

	const progressClasses = (classes: string) => {
		return {
			'others-completed': classes === 'other',
			'self-completed': classes === 'self',
			'test-incomplete': classes === 'incomplete',
		};
	};

	return (
		<div>
			{bar_style === 'taskbar' && (
				<>
					<div className="testray-progress-bar">
						{tempValues.map((item, index) => {
							const percent = Math.ceil((item[1] * 100) / total);
							if (item[1] !== 0) {
								return (
									<div
										className={classNames(
											'progress-bar-item',
											taskClasses(item[0])
										)}
										key={index}
										style={{width: `${percent}%`}}
										title={`${percent}% ${item[0]}`}
									></div>
								);
							}
						})}
					</div>
					{legend && (
						<>
							<div className="d-flex testray-progress-bar">
								<div className="justify-content-between mr-5">
									<div className="align-items-center d-flex">
										<span className="font-family-sans-serif font-weight-semi-bold mr-1 text-paragraph-lg">
											{completeProgressBarValue}
										</span>

										<span>/</span>

										<span className="font-family-sans-serif ml-1 text-paragraph-sm">
											{total}
										</span>
									</div>

									<span className="font-family-sans-serif text-neutral-6 text-paragraph-xs">
										TOTAL COMPLETED
									</span>
								</div>

								{tempValues.map((item, index) => {
									const percent = Math.ceil(
										(item[1] * 100) / total
									);

									return (
										<div
											className="d-flex flex-column"
											key={index}
										>
											<div className="align-items-center d-flex mr-5">
												<div
													className={classNames(
														'legend-bar-item font-family-sans-serif',
														taskClasses(item[0])
													)}
													key={index}
													title={`${percent}% ${item[0]}`}
												></div>

												<span
													className="font-family-sans-serif mx-2"
													title={`${percent}% ${item[0]}`}
												>
													{`${percent}% (${item[1]})`}
												</span>
											</div>

											<span className="mt-1 text-neutral-6 text-paragraph-xs">
												{item[0].toLocaleUpperCase()}
											</span>
										</div>
									);
								})}
							</div>
						</>
					)}
				</>
			)}

			{bar_style === 'progress' && (
				<>
					<div className="testray-progress-bar">
						{tempValues.map((item, index) => {
							const percent = Math.ceil((item[1] * 100) / total);
							if (item[1] !== 0) {
								return (
									<div
										className={classNames(
											'progress-bar-item',
											progressClasses(item[0])
										)}
										key={index}
										style={{width: `${percent}%`}}
										title={`${percent}% ${item[0]}`}
									></div>
								);
							}

							return '';
						})}
					</div>
					{legend && (
						<>
							<div className="d-flex testray-progress-bar">
								<div className="justify-content-between mr-5">
									<div className="align-items-center d-flex">
										<span className="font-family-sans-serif font-weight-semi-bold mr-1 text-paragraph-lg">
											{completeProgressBarValue}
										</span>

										<span>/</span>

										<span className="ml-1 text-paragraph-sm">
											{total}
										</span>
									</div>

									<span className="text-neutral-6 text-paragraph-xs">
										TOTAL COMPLETED
									</span>
								</div>

								{tempValues.map((item, index) => {
									const percent = Math.ceil(
										(item[1] * 100) / total
									);

									return (
										<div
											className="d-flex flex-column"
											key={index}
										>
											<div className="align-items-center d-flex mr-5">
												<div
													className={classNames(
														'legend-bar-item ',
														progressClasses(item[0])
													)}
													key={index}
													title={`${percent}% ${item[0]}`}
												></div>

												<span
													className="font-family-sans-serif mx-2"
													title={`${percent}% ${item[0]}`}
												>
													{`${percent}% (${item[1]})`}
												</span>
											</div>

											<span className="mt-1 text-neutral-6 text-paragraph-xs">
												{item[0].toLocaleUpperCase()}
											</span>
										</div>
									);
								})}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default ProgressBar;
