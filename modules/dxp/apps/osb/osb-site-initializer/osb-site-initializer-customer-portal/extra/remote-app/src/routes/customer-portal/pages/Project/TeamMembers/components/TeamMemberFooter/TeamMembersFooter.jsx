/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import React from 'react';
import './TeamMembersFooter.css';

class TeamMemberFooter extends React.Component {
	render() {
		return (
			<div className="customer-portal-card-footer">
				<div className="customer-portal-card-footer-title">
					<h1>
						Incident Contacts
						{this.props.name}
					</h1>
				</div>

				<div className="customer-portal-card-footer-description">
					<p>
						Team members who can be contacted with high priority
						messages.
					</p>
				</div>

				<div className="customer-portal-card-title">
					<div className="customer-portal-card-description">
						<h3>Critical Incident Contacts</h3>

						<h4>Name</h4>

						<h5>Email</h5>

						<h5>Contact</h5>
					</div>

					<div className="customer-portal-card-description">
						<h3>Security Breach </h3>

						<h4>Name</h4>

						<h5>Email</h5>

						<h5>Contact</h5>
					</div>

					<div className="customer-portal-card-description">
						<h3>Privacy Breach </h3>

						<h4>Name</h4>

						<h5>Email</h5>

						<h5>Contact</h5>
					</div>
				</div>
			</div>
		);
	}
}

export default TeamMemberFooter;
