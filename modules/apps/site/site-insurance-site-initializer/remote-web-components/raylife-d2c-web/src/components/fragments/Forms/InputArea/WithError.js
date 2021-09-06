import React from 'react';
import classNames from 'classnames';

import {WarningBadge} from '../../Badges/Warning';

export const InputAreaWithError = ({children, className, error}) => {
	return (
		<div
			className={classNames('input-area', {
				invalid: error,
				[className]: className,
			})}
		>
			{children}
			{error?.message && <WarningBadge>{error.message}</WarningBadge>}
		</div>
	);
};
