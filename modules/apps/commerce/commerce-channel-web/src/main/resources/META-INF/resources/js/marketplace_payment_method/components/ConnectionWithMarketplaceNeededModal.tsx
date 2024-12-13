/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import ClayModal from '@clayui/modal';
import {Observer} from '@clayui/modal/lib/types';
import React from 'react';

type ConnectionWithMarketplaceNeededModalProps = {
	observer: Observer;
	open: boolean;
};

export default function ConnectionWithMarketplaceNeededModal(
	props: ConnectionWithMarketplaceNeededModalProps
) {
	if (!props.open) {
		return null;
	}

	return (
		<ClayModal center observer={props.observer} status="info">
			<ClayModal.Header>
				Connection With Markeplace Needed
			</ClayModal.Header>

			<ClayModal.Body>
				<p>
					You are trying to add a new payment method through the
					Marketplace, but the connection has not been established
					yet. Please go to Instance Settings to enable the connection
					into DXP.
				</p>
				&ensp;
				<div>
					<h5>Do you need help?</h5>

					<span>
						Click <a href="https://learn.liferay.com">here</a> to
						Cloud learn how to connect Liferay DXP to Marketplace
					</span>
				</div>
			</ClayModal.Body>

			<ClayModal.Footer
				last={
					<ClayButton.Group spaced>
						<ClayButton
							displayType="info"
							onClick={() => {
								window.location.href =
									'http://localhost:8080/group/control_panel/manage?p_p_id=com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet_mvcRenderCommandName=%2Fconfiguration_admin%2Fview_configuration_screen&_com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet_configurationScreenKey=marketplace';
							}}
						>
							Go to Instance Settings
						</ClayButton>
					</ClayButton.Group>
				}
			/>
		</ClayModal>
	);
}
