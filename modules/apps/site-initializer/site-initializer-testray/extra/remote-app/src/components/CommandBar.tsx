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

import {
	KBarAnimator,
	KBarPortal,
	KBarPositioner,
	KBarProvider,
	KBarResults,
	KBarSearch,
	useDeepMatches,
} from 'kbar';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';

const positionerStyle = {
	alignItems: 'flex-start',
	background: 'rgba(0, 0, 0, 0.6)',
	boxSizing: 'border-box',
	display: 'flex',
	inset: '0px',
	justifyContent: 'center',
	padding: '14vh 16px 16px',
	position: 'fixed',
	width: '100%',
	zIndex: 9999,
};

const animatorStyle = {
	borderRadius: '8px',
	color: 'var(--primaryColor)',
	maxWidth: '600px',
	overflow: 'hidden',
	width: '100%',
};

const searchStyle = {
	border: 'none',
	boxSizing: 'border-box',
	color: 'var(--primaryColor)',
	fontSize: '16px',
	margin: 0,
	outline: 'none',
	padding: '12px 16px',
	width: '100%',
};

const groupNameStyle = {
	fontSize: '10px',
	letterSpacing: '1px',
	padding: '8px 16px',
	textTransform: 'uppercase',
};

const iconStyle = {
	fontSize: '20px',
	position: 'relative',
	top: '-2px',
};

const kbdStyle = {
	background: 'rgba(255, 255, 255, .1)',
	color: 'var(--secondaryColor)',
	padding: '4px 8px',
	textTransform: 'uppercase',
};

const shortcutStyle = {
	display: 'grid',
	gap: '4px',
	gridAutoFlow: 'column',
};

const actionStyle = {
	alignItems: 'center',
	display: 'flex',
	gap: '8px',
};

const actionRowStyle = {
	display: 'flex',
	flexDirection: 'column',
};

const getResultStyle = (active: boolean) => {
	return {
		alignItems: 'center',
		background: active ? 'rgba(255, 255, 255, 0.1)' : 'var(--commandColor)',
		color: active ? 'var(--primaryColor)' : 'var(--secondaryColor)',
		cursor: 'pointer',
		display: 'flex',
		justifyContent: 'space-between',
		margin: 0,
		padding: '12px 16px',
	};
};

export default function CommandBar(props: any) {
	const navigate = useNavigate();

	const actions = [
		{
			icon: <i className="ri-file-copy-line" style={iconStyle as any} />,
			id: 'copy',
			keywords: 'copy-url',
			name: 'Copy URL',
			perform: () => navigator.clipboard.writeText(window.location.href),
			section: 'General',
			shortcut: ['u'],
		},
		{
			icon: <i className="ri-mail-line" style={iconStyle as any} />,
			id: 'email',
			keywords: 'send-email',
			name: 'Send Email',
			perform: () =>
				window.open('mailto:contato.frankrocha@gmail.com', '_blank'),
			section: 'General',
			shortcut: ['e'],
		},
		{
			icon: <i className="ri-braces-line" style={iconStyle as any} />,
			id: 'source',
			keywords: 'view-source',
			name: 'View Source',
			perform: () =>
				window.open(
					'https://github.com/fsrocha-dev/frank-personal-page',
					'_blank'
				),
			section: 'General',
			shortcut: ['s'],
		},
		{
			icon: <i className="ri-home-5-line" style={iconStyle as any} />,
			id: 'home',
			keywords: 'go-home',
			name: 'Home',
			perform: () => navigate('/'),
			section: 'Go To',
			shortcut: ['g', 'h'],
		},
		{
			icon: <i className="ri-user-line" style={iconStyle as any} />,
			id: 'about',
			keywords: 'go-about',
			name: 'About',
			perform: () => navigate('/about'),
			section: 'Go To',
			shortcut: ['g', 'a'],
		},
		{
			icon: <i className="ri-ball-pen-line" style={iconStyle as any} />,
			id: 'articles',
			keywords: 'go-articles',
			name: 'Articles',
			perform: () => navigate('/articles'),
			section: 'Go To',
			shortcut: ['g', 'b'],
		},
		{
			icon: <i className="ri-youtube-line" style={iconStyle as any} />,
			id: 'videos',
			keywords: 'go-videos',
			name: 'Videos',
			perform: () => navigate('/videos'),
			section: 'Go To',
			shortcut: ['g', 'v'],
		},
		{
			icon: <i className="ri-twitter-line" style={iconStyle as any} />,
			id: 'twitter',
			keywords: 'go-twitter',
			name: 'Twitter',
			perform: () =>
				window.open('https://twitter.com/frankrocha_dev', '_blank'),
			section: 'Follow',
			shortcut: ['f', 't'],
		},
		{
			icon: <i className="ri-linkedin-line" style={iconStyle as any} />,
			id: 'linkedin',
			keywords: 'go-linkedin',
			name: 'LinkedIn',
			perform: () =>
				window.open(
					'https://www.linkedin.com/in/frankrochadev/',
					'_blank'
				),
			section: 'Follow',
			shortcut: ['f', 'l'],
		},
	];

	return (
		<KBarProvider actions={actions}>
			<KBarPortal>
				<KBarPositioner style={positionerStyle as any}>
					<KBarAnimator className="kbar-blur" style={animatorStyle}>
						<KBarSearch
							placeholder="Type a command or search…"
							style={searchStyle as any}
						/>

						<RenderResults />
					</KBarAnimator>
				</KBarPositioner>
			</KBarPortal>

			{props.children}
		</KBarProvider>
	);
}

const ResultItem = React.forwardRef(({action, active}: any, ref) => {
	return (
		<div ref={ref as any} style={getResultStyle(active)}>
			<div style={actionStyle}>
				{action.icon && action.icon}

				<div style={actionRowStyle as any}>
					<span>{action.name}</span>
				</div>
			</div>

			{action.shortcut?.length ? (
				<div aria-hidden style={shortcutStyle}>
					{action.shortcut.map((shortcut: any) => (
						<kbd key={shortcut} style={kbdStyle as any}>
							{shortcut}
						</kbd>
					))}
				</div>
			) : null}
		</div>
	);
});

function RenderResults() {
	const {results} = useDeepMatches();

	return (
		<KBarResults
			items={results}
			onRender={({active, item}) =>
				typeof item === 'string' ? (
					<div style={groupNameStyle as any}>{item}</div>
				) : (
					<ResultItem action={item} active={active} />
				)
			}
		/>
	);
}
