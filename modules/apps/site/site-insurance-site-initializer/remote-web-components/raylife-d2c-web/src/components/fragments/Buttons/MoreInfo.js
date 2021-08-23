import ClayIcon from '@clayui/icon';
import React from 'react';

import {useCustomEvent} from '../../../hooks/useCustomEvent';

import classNames from 'classnames';

export const MoreInfoButton = ({value, event, selected, callback}) => {
	// eslint-disable-next-line no-unused-vars
	const [dispatchEvent] = useCustomEvent(event);

	const updateState = () => {
		dispatchEvent({
			...value,
			hide: selected
		});
		callback();
	}

	return (
		<button
			type="button"
			className={classNames("btn badge", {
				"open": selected
			})}
			onClick={updateState}
		>
			More Info
			<ClayIcon symbol="question-circle-full" />
		</button>
	);
};
