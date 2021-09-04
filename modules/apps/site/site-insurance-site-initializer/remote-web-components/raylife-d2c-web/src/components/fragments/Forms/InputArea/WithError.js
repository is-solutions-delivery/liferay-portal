import React from 'react';

import {WarningBadge} from '../../Badges/Warning';
import classNames from 'classnames';

export const InputAreaWithError = ({className, children, error}) => {
	return (
		<div
			className={classNames('input-area', {
				invalid: error,
				[className]: className,
			})}
		>
			{children}
			{error && <WarningBadge>{error.message}</WarningBadge>}
		</div>
	);
};
