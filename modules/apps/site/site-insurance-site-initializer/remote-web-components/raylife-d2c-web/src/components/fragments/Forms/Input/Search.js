import React from 'react';

import { Label } from '../Label';
import { InputAreaWithError } from '../InputArea/WithError';

export const SearchInput = React.forwardRef(
	(
		{
			name,
			label,
			renderActions,
			children,
			required = false,
			error,
			...props
		},
		ref
	) => {
		return (
			<>
				{label && (
					<Label name={name} label={label} required={required}>
						{renderActions}
					</Label>
				)}
				<div className="content-row">
					<InputAreaWithError error={error}>
						<input
							{...props}
							ref={ref}
							name={name}
							required={required}
							maxLength={255}
						/>
					</InputAreaWithError>
					{children}
				</div>
			</>
		);
	}
);
