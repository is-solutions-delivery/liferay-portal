/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const useHighPriorityContacts = ({
	addContactList,
	currentHighPriorityContacts,
	highPriorityContactsCategory,
	removedContactList,
	rolesId,
}: {
	addContactList: (newValue: any[]) => void;
	currentHighPriorityContacts: any;
	highPriorityContactsCategory: any;
	removedContactList: (newValue: any[]) => void;
	rolesId: any[];
}) => {
	const addContacts = (contacts: any[], currentContacts: any[]) => {
		const contactsWithoutCategory = contacts.filter(
			(contact) =>
				!currentContacts.some(
					(currentContact) => currentContact.id === contact?.id
				)
		);

		return contactsWithoutCategory.map((newContact) => ({
			...newContact,
			category: highPriorityContactsCategory.contactsCategory,
			filterId: rolesId.filter(
				(role) =>
					role.displayName ===
					highPriorityContactsCategory.contactsCategory.role
			)[0]?.id,
		}));
	};

	const deleteContacts = (
		currentContactsList: any[],
		newContactsList: any[]
	) => {
		return currentContactsList.filter(
			(currentContact) =>
				!newContactsList.some(
					(newContact) => currentContact.id === newContact?.id
				)
		);
	};

	const updateContacts = (contacts: any[]) => {
		const addedContacts = addContacts(
			contacts,
			currentHighPriorityContacts
		);

		const removedContacts = deleteContacts(
			currentHighPriorityContacts,
			contacts
		);

		addContactList(addedContacts);
		removedContactList(removedContacts);
	};

	return {
		updateContacts,
	};
};

export {useHighPriorityContacts};
