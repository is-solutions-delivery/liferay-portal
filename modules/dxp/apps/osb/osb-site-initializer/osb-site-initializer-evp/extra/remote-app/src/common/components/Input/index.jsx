import React, {useState} from 'react';

export default function Input({label, type}) {
	const [value, setValue] = useState('');
	const id = label.toLowerCase().replaceAll(' ', '-');

	return (
		<div className="form-group">
			<label className="" htmlFor={id}>
				{label}
			</label>

			<input
				id={id}
				className="form-control"
				type={type}
				value={value}
				onChange={(event) => setValue(event.target.value)}
			/>
		</div>
	);
}

''.replace;
