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

import ClayDropDown, {Align} from '@clayui/drop-down';
import React, {useState} from 'react';

type ContextMenuProps = {
	position: {x: number; y: number};
};

const ContextMenu: React.FC<ContextMenuProps> = ({position}) => {
	const {ItemList} = ClayDropDown;
	// eslint-disable-next-line no-console
	console.log(position);
	const [active, setActive] = useState(true);

	// if (!actions.length) {
	// 	return null;
	// }

	return (
		<ClayDropDown
			active={active}
			alignmentPosition={Align.RightCenter}
			className="dropdown-action"
			onActiveChange={(newVal: boolean) => setActive(newVal)}
			style={{
				left: position.x - 40,
				position: 'fixed',
				top: position.y,
				zIndex: 999999,
			}}
			trigger={
				<div onContextMenu={(event) => event.preventDefault()}></div>
			}
		>
			<ItemList style={{padding: 10}}>
				<p>Options</p>

				<p>Options</p>

				<p>Options</p>

				<p>Options</p>

				<p>Options</p>

				<p>Options</p>

				<p>Options</p>

				{/* {actions.map((action, index) => (
						<DropDownAction
							action={action}
							item={item}
							key={index}
							mutate={mutate}
							setActive={setActive}
						/>
					))} */}
			</ItemList>
		</ClayDropDown>
	);
};
export default ContextMenu;
