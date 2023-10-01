import classNames from 'classnames';
import {MouseEvent, ReactNode} from 'react';

import arrowLeft from '../../assets/icons/guide_icon.svg';

import './CardButton.scss';

export function CardButton({
	description,
	disabled,
	icon,
	iconRight,
	onClick,
	selected,
	title,
}: {
	description: string;
	disabled: boolean;
	icon?: ReactNode;
	iconRight?: boolean;
	onClick: (event: MouseEvent) => void;
	selected: boolean;
	title: string;
}) {
	return (
		<div
			className={classNames('card-button', {
				'card-button--disabled': disabled,
				'card-button--selected': selected,
			})}
			onClick={onClick}
		>
			{!iconRight &&
				(icon ? (
					icon
				) : (
					<img
						alt="trial"
						className="card-button-icon"
						src={arrowLeft}
					/>
				))}

			<div className="card-button-info">
				<div className="card-button-title">
					<div
						className={classNames('card-button-text', {
							'icon-right': iconRight,
						})}
					>
						{title}
						{iconRight && icon}
					</div>
					<div className="card-button-description">{description}</div>
				</div>
			</div>
		</div>
	);
}