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

import ClayButton from '@clayui/button';
import ClayIcon, {ClayIconSpriteContext} from '@clayui/icon';

import {forwardRef} from 'react';
import getIconSpriteMap from '../../../utils/getIconSpriteMap';

const ButtonBase = ({
	buttonText,
	icon,
	...props }: { buttonText: string; icon: string; }) => {
	return (
		<>
			{icon ? (
						<ClayIconSpriteContext.Provider value={getIconSpriteMap()}>
						<ClayButton {...props}>
							<ClayIcon symbol={icon} className="mr-1" />
							
							<span>
								{buttonText}
							</span>
						</ClayButton>
					</ClayIconSpriteContext.Provider>	
			):
			<ClayButton {...props}>		
				<span>
					{buttonText}
				</span>
			</ClayButton>
			} 
		</>
	);
};
const Button = forwardRef(ButtonBase);
export default Button;

