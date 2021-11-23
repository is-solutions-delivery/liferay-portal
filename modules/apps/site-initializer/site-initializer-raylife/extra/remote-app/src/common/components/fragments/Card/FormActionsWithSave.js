import ClayIcon from '@clayui/icon';
import React, {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import ProgressSaved from '~/routes/get-a-quote/components/containers/Forms/Modal/ProgressSaved';
import {hasEmail} from '~/routes/get-a-quote/utils/form';

import {WarningBadge} from '../Badges/Warning';

export function CardFormActionsWithSave({
	form,
	isValid = true,
	onNext,
	onPrevious,
	onSave,
}) {
	const {
		formState: {errors},
	} = useFormContext();

	const [show, setShow] = useState(false);

	const handleClose = () => {
		setShow(!show);
	};

	return (
		<>
			{errors?.continueButton?.message && (
				<WarningBadge>{errors?.continueButton?.message}</WarningBadge>
			)}
			<div className="card-actions">
				{onPrevious && (
					<button
						className="btn btn-flat"
						onClick={onPrevious}
						type="button"
					>
						Previous
					</button>
				)}

				<div>
					{onSave && (
						<button
							className="btn btn-outline"
							disabled={!hasEmail(form)}
							onClick={() => {
								setShow(!show);
							}}
							type="button"
						>
							Save & Exit
						</button>
					)}

					{onNext && (
						<button
							className="btn btn-secondary continue"
							disabled={!isValid}
							onClick={onNext}
							type="submit"
						>
							Continue
							<ClayIcon symbol="angle-right" />
						</button>
					)}
				</div>

				<ProgressSaved
					handleClose={handleClose}
					onSave={onSave}
					show={show}
				/>
			</div>
		</>
	);
}
