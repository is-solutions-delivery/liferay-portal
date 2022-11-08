import React from 'react';
import Input from '../../common/components/Input';

export default function RequestsForm() {
	return (
		<div>
			<Input type="text" label="Initial User Name" />
			<Input type="text" label="Final User Name" />
		</div>
	);
}
