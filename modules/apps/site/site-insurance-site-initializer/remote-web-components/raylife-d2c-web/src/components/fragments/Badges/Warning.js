import React from 'react';
import ClayIcon from '@clayui/icon';

export const WarningBadge = ({children, ...props}) => {
	return (
		<div {...props} className="badge badge-error">
			<ClayIcon symbol="exclamation-full" />
			{children}
		</div>
	);
};
