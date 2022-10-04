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

const StepIcon = ({active}: {active?: boolean}) => {
	if (active) {
		return (
			<svg
				fill="none"
				height="14"
				viewBox="0 0 14 14"
				width="14"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle cx="7" cy="7" opacity="0.5" r="6.5" stroke="#0B5FFF" />

				<circle cx="7" cy="7" fill="#0B5FFF" r="5" />
			</svg>
		);
	}

	return (
		<svg
			fill="none"
			height="6"
			viewBox="0 0 6 6"
			width="14"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="3" cy="3" fill="#999AA3" r="3" />
		</svg>
	);
};

export default StepIcon;
