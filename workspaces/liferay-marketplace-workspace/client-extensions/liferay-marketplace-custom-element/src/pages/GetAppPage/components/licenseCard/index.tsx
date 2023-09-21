/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayIcon from "@clayui/icon";

import "./LicenseCard.scss";

import ClayButton from "@clayui/button";

import infoCircleFullIcon from "../../../../assets/icons/icon_info_circle_full.svg";

const LicenseSectorCard: React.FC<any> = ({
	icon = <img alt="Info" src={infoCircleFullIcon} />,
	licenseDescription,
	licensetiers,
	lisenceType,
}) => {
	return (
		<div className="license__card p-3">
			<div className="align-items-center d-flex">
				<span>
					<div className="mb-1">
						<span className="font-weight-bold">{lisenceType}</span>
						<span className="license__card__icon ml-3">
							{icon || infoCircleFullIcon}
						</span>
					</div>
					<div>
						<p className="license__card__text mb-0">{licenseDescription}</p>
					</div>
				</span>
				<div className="align-items-center d-flex license__card__buttons__container p-1">
					<span>
						<ClayButton
							aria-label=""
							className="align-items-center d-flex justify-content-center license__card__buttons p-2"
							displayType="primary"
							onClick={() => {
								window.location.href = origin;
							}}
						>
							<ClayIcon
								aria-label="123"
								className="license__card__buttons__icon"
								symbol="hr"
							/>
						</ClayButton>
					</span>
					<span className="d-flex justify-content-center license__card__buttons__container__conut">
						99
					</span>
					<span>
						<ClayButton
							aria-label=""
							className="align-items-center d-flex justify-content-center license__card__buttons p-2"
							displayType="primary"
							onClick={() => {
								window.location.href = origin;
							}}
						>
							<ClayIcon
								aria-label="123"
								className="license__card__buttons__icon"
								symbol="plus"
							/>
						</ClayButton>
					</span>
				</div>
			</div>

			<div className="d-flex flex-column license__card__tier mt-4 p-4">
				<div className="font-weight-bold license__card__tier__title mb-1">
					License Prices
				</div>

				{licensetiers.map((license: any, index: any) => (
					<span className="license__card__tier__price__text" key={index}>
						{`${license?.quantity} License: ${license?.value} each`}
					</span>
				))}
			</div>
		</div>
	);
};

export default LicenseSectorCard;
