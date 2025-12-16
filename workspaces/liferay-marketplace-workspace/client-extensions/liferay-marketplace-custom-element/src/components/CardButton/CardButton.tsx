/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from '@clayui/icon';
import classNames from 'classnames';
import { MouseEvent, ReactNode } from 'react';

import './CardButton.scss';

type CardSize = 'default' | 'full'

const CardButton = ({
	cardSize = 'default',
	description,
	disabled,
	icon = '',
	iconRight,
	onClick,
	selected,
	title,
}: {
	cardSize?: CardSize;
	description: string;
	disabled?: boolean;
	icon?: ReactNode;
	iconRight?: boolean;
	onClick: (event: MouseEvent) => void;
	selected: boolean;
	title: string;
}) => (
	<div
		aria-disabled={disabled}
		className={classNames('card-button d-flex', {
			'card-button--disabled': disabled,
			'card-button--selected': selected,
			"w-100": cardSize = 'full',

		})}
		onClick={(event) => {
			if (disabled) {
				return;
			}

			onClick(event);
		}}
	>
		{typeof icon === 'string' ? <ClayIcon symbol={icon} /> : icon}

		<div className="card-button-info">
			<div
				className={classNames('card-button-text', {
					'icon-right': iconRight,
				})}
			>
				{title}

				{iconRight && icon}
			</div>

			<small className="card-button-description">{description}</small>
		</div>
	</div>
);

export { CardButton };

export default CardButton;
