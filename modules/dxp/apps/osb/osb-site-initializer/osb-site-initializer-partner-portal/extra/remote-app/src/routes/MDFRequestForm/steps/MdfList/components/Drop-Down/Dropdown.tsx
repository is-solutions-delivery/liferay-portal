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

import ClayDropDown from '@clayui/drop-down';
import ClayIcon from '@clayui/icon';

type OptionList = {
	icon: string;
	label: string;
	optionKey: string;
};

type Props = {
	optionList: OptionList[];
};

const DropDown = ({optionList}: Props) => {
	return (
		<ClayDropDown
			trigger={
				<button className="btn-unstyled">
					<ClayIcon symbol="ellipsis-v"></ClayIcon>
				</button>
			}
		>
			<ClayDropDown.ItemList>
				<ClayDropDown.Group>
					{optionList.map((item, i) => (
						<ClayDropDown.Item key={i} onClick={() => {}}>
							<ClayIcon symbol={item.icon}></ClayIcon>

							{item.label}
						</ClayDropDown.Item>
					))}
				</ClayDropDown.Group>
			</ClayDropDown.ItemList>
		</ClayDropDown>
	);
};
export default DropDown;
