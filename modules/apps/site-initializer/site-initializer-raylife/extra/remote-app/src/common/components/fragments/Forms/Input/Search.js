import React from 'react';

import {InputAreaWithError} from '../InputArea/WithError';
import {Label} from '../Label';

export const SearchInput = React.forwardRef(
	(
		{
			children,
			error,
			label,
			name,
			renderActions,
			required = false,
			...props
		},
		ref
	) => {
		return (
			<>
				{label && (
					<div className="mb-2">
						<Label label={label} name={name} required={required}>
							{renderActions}
						</Label>
					</div>
				)}
				<div className="row">
					<InputAreaWithError className="col" error={error}>
						<input
							{...props}
							maxLength={255}
							name={name}
							onKeyPress={(event) => {
								if (event.key === 'Enter') {
									event.preventDefault();
								}
							}}
							ref={ref}
							required={required}
						/>
					</InputAreaWithError>

					{children}
				</div>
			</>
		);
	}
);
