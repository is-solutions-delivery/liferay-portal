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

import React from 'react';

import TokenGroup from '../components/TokenGroup';
import TokenItem from '../components/TokenItem';

const TOKEN_GROUPS = [
	{
		categoryTitle: Liferay.Language.get('hotkeys'),
		hotkeys: [
			{label: 'c-kbd', style: 'c-kbd'},
			{label: 'c-kbd-dark', style: 'c-kbd c-kbd-dark'},
			{label: 'c-kbd-light', style: 'c-kbd c-kbd-light'},
			{label: 'c-kbd-monospaced', style: 'c-kbd c-kbd-monospaced'},
		],
		size: 'small',
	},
	{
		categoryTitle: Liferay.Language.get('hotkeys-sizes'),
		hotkeys: [
			{label: 'c-kbd c-kbd-sm', style: 'c-kbd c-kbd-sm'},
			{label: 'c-kbd', style: 'c-kbd'},
			{label: 'c-kbd c-kbd-lg', style: 'c-kbd c-kbd-lg'},
			{label: 'c-kbd-dark c-kbd-sm', style: 'c-kbd c-kbd-dark c-kbd-sm'},
			{label: 'c-kbd-dark', style: 'c-kbd c-kbd-dark'},
			{label: 'c-kbd-dark c-kbd-lg', style: 'c-kbd c-kbd-dark c-kbd-lg'},
			{
				label: 'c-kbd-light c-kbd-sm',
				style: 'c-kbd c-kbd-light c-kbd-sm',
			},
			{label: 'c-kbd-light', style: 'c-kbd c-kbd-light'},
			{
				label: 'c-kbd-light c-kbd-lg',
				style: 'c-kbd c-kbd-light c-kbd-lg',
			},
			{
				label: 'c-kbd-monospaced c-kbd-sm',
				style: 'c-kbd c-kbd-monospaced c-kbd-sm',
			},
			{label: 'c-kbd-monospaced', style: 'c-kbd c-kbd-monospaced'},
			{
				label: 'c-kbd-monospaced c-kbd-lg',
				style: 'c-kbd c-kbd-monospaced c-kbd-lg',
			},
		],
		size: 'medium',
	},
];

const HotkeyGuide = () => {
	return (
		<>
			{TOKEN_GROUPS.map((token) => (
				// eslint-disable-next-line react/jsx-key
				<TokenGroup group="hotkeys" title={token.categoryTitle}>
					{token.hotkeys.map((item) => (
						<TokenItem
							key={item}
							label={item.label}
							size={token.size}
						>
							<kbd className={item.style}>A</kbd>
						</TokenItem>
					))}
				</TokenGroup>
			))}

			<TokenGroup
				group="hotkeys"
				title={Liferay.Language.get('hotkeys-groups')}
			>
				<TokenItem label="c-kbd-inline">
					<kbd className="c-kbd">
						<kbd className="c-kbd">A</kbd>

						<span className="c-kbd-separator">+</span>

						<kbd className="c-kbd">⇧</kbd>

						<span className="c-kbd-separator">+</span>

						<kbd className="c-kbd">M</kbd>
					</kbd>
				</TokenItem>
			</TokenGroup>
		</>
	);
};
export default HotkeyGuide;
