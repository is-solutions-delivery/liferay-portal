/**
 * SPDX-FileCopyrightText: (c) 2024 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { ClayButtonWithIcon } from '@clayui/button';
import { ClayInput } from '@clayui/form';
import ClayManagementToolbar from '@clayui/management-toolbar';
import React from 'react';

type ManagementToolbarProps = {
    PlusButtonAction: () => void
}

const ManagementToolbar: React.FC<ManagementToolbarProps> = ({
    PlusButtonAction
}) => {
    return (<ClayManagementToolbar>
        <ClayManagementToolbar.ItemList>
            <ClayManagementToolbar.Search>
                <ClayInput.Group>
                    <ClayInput.GroupItem>
                        <ClayInput
                            aria-label="Search"
                            className="form-control input-group-inset input-group-inset-after"
                            type="text"
                        />

                        <ClayInput.GroupInsetItem after tag="span">
                            <ClayButtonWithIcon
                                aria-label="Close search"
                                className="navbar-breakpoint-d-none"
                                displayType="unstyled"
                                onClick={() => { }}
                                symbol="times"
                            />

                            <ClayButtonWithIcon
                                aria-label="Search"
                                displayType="unstyled"
                                symbol="search"
                                type="submit"
                            />
                        </ClayInput.GroupInsetItem>
                    </ClayInput.GroupItem>
                </ClayInput.Group>
            </ClayManagementToolbar.Search>

            <ClayManagementToolbar.Item>
                <ClayButtonWithIcon
                    aria-label="Add"
                    className="nav-btn nav-btn-monospaced"
                    onClick={() => PlusButtonAction()}
                    symbol="plus"
                />
            </ClayManagementToolbar.Item>
        </ClayManagementToolbar.ItemList>
    </ClayManagementToolbar>)
}

export default ManagementToolbar;