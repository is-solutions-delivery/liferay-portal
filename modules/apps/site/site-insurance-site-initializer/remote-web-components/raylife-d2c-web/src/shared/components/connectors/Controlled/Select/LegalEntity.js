import React from 'react';

import {ControlledSelect} from '.';
import {useLegalEntity} from '~/apps/get-a-quote/hooks/useLegalEntity';

export function LegalEntityControlledSelect({...props}) {
	const {entities} = useLegalEntity();

	return (
		<ControlledSelect {...props}>
			<option hidden>Select</option>
			{entities.map(({name}) => (
				<option key={name} value={name}>
					{name}
				</option>
			))}
		</ControlledSelect>
	);
}
