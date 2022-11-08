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
import {createRoot} from 'react-dom/client';
import RequestsForm from './routes/RequestsForm';

const EVPComponent = () => <RequestsForm />;

class EVPRemoteAppComponent extends HTMLElement {
	connectedCallback() {
		if (!this.root) {
			this.root = createRoot(this);

			this.root.render(<EVPComponent />);
		}
	}
}

const ELEMENT_NAME = 'liferay-remote-app-evp';

if (!customElements.get(ELEMENT_NAME)) {
	customElements.define(ELEMENT_NAME, EVPRemoteAppComponent);
}
