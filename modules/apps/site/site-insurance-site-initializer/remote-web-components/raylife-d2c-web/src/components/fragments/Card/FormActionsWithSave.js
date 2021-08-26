import React from 'react';
import ClayIcon from '@clayui/icon';
import {useFormContext} from 'react-hook-form';
import {WarningBadge} from '../Badges/Warning';

export const CardFormActionsWithSave = ({
	onPrevious,
	onSave,
	onNext,
	isValid = true,
}) => {
	const {
		formState: {errors},
	} = useFormContext();
	return (
		<>
			{errors?.continueButton?.message && (
				<WarningBadge>{errors?.continueButton?.message}</WarningBadge>
			)}
			<div className="card-actions">
				{onPrevious && (
					<button
						type="button"
						className="btn btn-flat"
						onClick={onPrevious}
					>
						Previous
					</button>
				)}

				<div>
					{onSave && (
						<button
							type="button"
							className="btn btn-outline"
							onClick={onSave}
						>
							Save & Exit
						</button>
					)}

					{onNext && (
						<button
							type="submit"
							className="btn btn-secondary continue"
							onClick={onNext}
							disabled={!isValid}
						>
							Continue
							<ClayIcon symbol="angle-right" />
						</button>
					)}
				</div>
			</div>
		</>
	);
};
