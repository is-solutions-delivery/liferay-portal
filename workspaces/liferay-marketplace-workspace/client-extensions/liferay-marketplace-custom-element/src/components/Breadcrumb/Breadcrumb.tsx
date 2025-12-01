/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useSelector} from '@xstate/store/react';
import classNames from 'classnames';
import React, {useMemo} from 'react';
import {useLocation} from 'react-router-dom';
import warning from 'warning';

import {breadcrumbStore} from '../../context/store/BreadcrumbStore';
import i18n from '../../i18n';
import {Liferay} from '../../liferay/liferay';
import Item from './Item';

import './Breadcrumb.scss';

type TItem = React.ComponentProps<typeof Item>;
type TItems = Array<TItem>;

interface IProps extends React.HTMLAttributes<HTMLOListElement> {

	/**
	 * Defines the aria label of component elements.
	 */
	ariaLabels?: {
		breadcrumb: string;
		close: string;
		open: string;
	};

	/**
	 * Property to define Breadcrumb's items.
	 */
	items: Array<React.ComponentProps<typeof Item>>;
}

const findActiveItems = (items: TItems) => {
	return items.filter((item) => {
		return item.active;
	});
};

const Breadcrumb = ({
	ariaLabels = {
		breadcrumb: 'Breadcrumb',
		close: 'Partially nest breadcrumbs',
		open: 'See full nested',
	},
	className,
	items,
	...otherProps
}: IProps) => {
	warning(
		findActiveItems(items).length === 1,
		'ClayBreadcrumb expects at least one `active` item on `items`.'
	);

	return (
		<nav aria-label={ariaLabels.breadcrumb} className="breadcrumb-bar">
			<ol {...otherProps} className={classNames('breadcrumb', className)}>
				<Items items={items} />
			</ol>
		</nav>
	);
};

type ItemsProps = {
	items: TItems;
};

function Items({items}: ItemsProps) {
	return (
		<>
			{items.map((item: TItem | React.ReactNode, i: number) =>
				React.isValidElement(item) ? (
					React.cloneElement(item, {key: `ellipsis${i}`})
				) : (
					<Item
						active={(item as TItem).active}
						href={(item as TItem).href}
						key={`breadcrumbItem${i}`}
						label={(item as TItem).label}
						onClick={(item as TItem).onClick}
					/>
				)
			)}
		</>
	);
}

type BreadcrumbsProps = {
	basePath?: string;
};

export function Breadcrumbs({
	basePath = Liferay.ThemeDisplay.getLayoutRelativeURL(),
}: BreadcrumbsProps) {
	const disabledPaths = [
		'customer-dashboard#/order',
		'publisher-dashboard#/app',
		'finance-dashboard#/order',
		'ssa-dashboard#/details',
	];

	const {pathname} = useLocation();

	const replacements = useSelector(
		breadcrumbStore,
		({context: {replacements}}) => replacements
	);

	const rawPaths = useMemo(() => {
		return [...basePath.split('/'), ...pathname.split('/')].filter(Boolean);
	}, [basePath, pathname]);

	const pathnames = rawPaths.map(
		(segment) => replacements[segment] || i18n.translate(segment as any)
	);

	const hashPath = rawPaths.map((segment) =>
		segment.endsWith('-dashboard') ? segment + '#' : segment
	);

	const marketplaceHref = '/' + rawPaths.slice(0, 2).join('/');

	const enabledPaths = pathnames
		.slice(2)
		.map((path, i) => ({
			active: i === pathnames.slice(2).length - 1,
			href: '/' + hashPath.slice(0, i + 3).join('/'),
			label: path,
		}))
		.filter((item) => !disabledPaths.some((dp) => item.href.endsWith(dp)));

	const items = [
		{
			active: rawPaths.length === 2,
			href: marketplaceHref,
			label: 'Marketplace',
		},
		...enabledPaths,
	];

	return (
		<Breadcrumb
			className="marketplace-breadcrumb"
			items={items}
			style={{margin: '24px 0'}}
		/>
	);
}
