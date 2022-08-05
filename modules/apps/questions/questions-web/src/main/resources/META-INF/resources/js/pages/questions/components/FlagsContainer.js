/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import Flags from '@liferay/flags-taglib';
import React from 'react';

const FlagsContainer = ({context, question = {}}) => {
	const {context: flagsContext, props: flagsProps} =
		context?.flagsProperties || {};

	const namespace = flagsContext?.namespace;

	const props = {
		...flagsProps,
		baseData: {
			[`${namespace}className`]: 'com.liferay.message.boards.model.MBMessage',
			[`${namespace}classPK`]: question.id,
			[`${namespace}contentTitle`]: question.headline,
			[`${namespace}contentURL`]: window.location.href,
			[`${namespace}reportedUserId`]: question?.creator?.id,
		},
		btnProps: {
			className: 'btn btn-secondary',
			small: false,
		},
		message: Liferay.Language.get('report'),
		onlyIcon: true,
		signedIn: Liferay.ThemeDisplay.isSignedIn(),
	};

	return <Flags context={flagsContext} props={props} />;
};

export default FlagsContainer;
