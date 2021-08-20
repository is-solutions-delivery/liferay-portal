import React from 'react';
import ClayIcon from '@clayui/icon';

export const CardFormActionsWithSave = ({
	onPrevious = () => {},
	onSave = () => {},
	onNext = () => {},
	isValid = true,
}) => {
	return (
		<div className="card-actions">
			<button type="button" className="btn btn-flat" onClick={onPrevious}>
				Previous
			</button>
			<div>
				<button
					type="button"
					className="btn btn-outline"
					onClick={onSave}
				>
					Save & Exit
				</button>
				<button
					type="submit"
					className="btn btn-secondary continue"
					onClick={onNext}
					disabled={!isValid}
				>
					Continue
					<ClayIcon symbol="angle-right" />
				</button>
			</div>
		</div>
	);
};
