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

export function getHandleOnUserInvite(setVisible, setUserAccounts) {
	const handleOnUserInvite = (invitedUsers) => {
		setVisible(false);

		if (invitedUsers) {
			const formattedInvitedUsers = invitedUsers?.map((invite) => {
				const userData = invite?.data?.c?.createTeamMembersInvitation;

				return {
					emailAddress: userData?.email,
					name: userData?.email,
					roles: [userData?.role],
				};
			});

			setUserAccounts((previousUserAccounts) => [
				...previousUserAccounts,
				...formattedInvitedUsers,
			]);
		}
	};

	return handleOnUserInvite;
}
