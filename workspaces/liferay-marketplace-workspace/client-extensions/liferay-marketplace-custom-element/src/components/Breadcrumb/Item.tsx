/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayLink from '@clayui/link';
import classNames from 'classnames';
import React from 'react';

interface IItem extends React.HTMLAttributes<HTMLLIElement> {

	/**
	 * Flag to indicate if the Breadcrumb item is active or not.
	 */
	active?: boolean;

	/**
	 * This value is used to be the target of the link.
	 */
	href?: string;

	/**
	 * Label of the Breadcrumb item
	 */
	label: string;

	/**
	 * Callback for when a Breadcrumb item is clicked.
	 */
	onClick?: (event: React.SyntheticEvent) => void;
}

const Item = ({active, href, label, onClick, ...otherProps}: IItem) => (
	<li
		className={classNames('breadcrumb-item', {
			active,
		})}
		{...otherProps}
	>
		{active ? (
			<span aria-current="page">{label}</span>
		) : (
			<ClayLink
				className="breadcrumb-link"
				data-testid={`testId${label}`}
				href={href}
				onClick={(event) => {
					if (onClick) {
						event.preventDefault();
						onClick(event);
					}
				}}
			>
				{label}
			</ClayLink>
		)}
	</li>
);

export default Item;
