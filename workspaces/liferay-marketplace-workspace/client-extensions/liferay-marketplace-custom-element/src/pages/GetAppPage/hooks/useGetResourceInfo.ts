/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {useEffect, useState} from 'react';

import useMarketplaceSpringBootOAuth2 from '../../../hooks/useMarketplaceSpringBootOAuth2';
import {
	ConsoleProjectsUsage,
	ConsoleUserProject,
} from '../../../services/oauth/MarketplaceSpringBootOAuth2';

const insuficientResources = 0;
const gigabyte = 1024;

const convertToGigabyte = (value: number) => {
	return value * gigabyte;
};

const compareResource = (required: number, avaliable: number) => {
	return avaliable >= required;
};

const useGetResourceInfo = ({
	product,
	selectedProject,
}: {
	product: any;
	selectedProject?: string;
}) => {
	const [hasResources, setHasResources] = useState<boolean>(false);

	const [resourceRequest, setResourceRequest] = useState<
		ConsoleProjectsUsage
	>();

	const resource = useMarketplaceSpringBootOAuth2();

	const hasProject: ConsoleUserProject = resourceRequest?.userProjects.find(
		(projects) => projects.rootProjectId === selectedProject
	);

	const suficientInstances =
		hasProject?.rootProjectPlanUsage?.remaining?.instance >
		insuficientResources;

	useEffect(() => {
		(async () => {
			const response = await resource.getProductUsages();

			setResourceRequest({
				...response,
				userProjects: response?.userProjects.map((project) => {
					return {
						...project,
						rootProjectPlanUsage: {
							...project.rootProjectPlanUsage,
							remaining: {
								cpu:
									project.rootProjectPlanUsage.cpu.limit -
									project.rootProjectPlanUsage.cpu.used,
								instance:
									project.rootProjectPlanUsage.instance
										.limit -
									project.rootProjectPlanUsage.instance.used,
								memory:
									project.rootProjectPlanUsage.memory.limit -
									project.rootProjectPlanUsage.memory.used,
							},
						},
					};
				}),
			});
		})();
	}, [resource]);

	useEffect(() => {
		if (selectedProject) {
			const producRequirements = ['ram', 'cpu'].map((requirement) =>
				product?.productSpecifications.find(
					(specification: ProductSpecification) =>
						specification.specificationKey === requirement
				)
			);

			const validateRamAndCpu = producRequirements.some((requirement) => {
				if (requirement.specificationKey === 'ram') {
					return compareResource(
						convertToGigabyte(requirement.value),
						hasProject?.rootProjectPlanUsage?.remaining?.memory
					);
				}

				if (requirement.specificationKey === 'cpu') {
					return compareResource(
						requirement.value,
						hasProject?.rootProjectPlanUsage?.remaining?.cpu
					);
				}
			});

			if (!suficientInstances && !validateRamAndCpu) {
				setHasResources(false);
			}

			if (suficientInstances && validateRamAndCpu) {
				setHasResources(true);
			}
		}
	}, [
		hasProject?.rootProjectPlanUsage?.remaining?.cpu,
		hasProject?.rootProjectPlanUsage?.remaining?.memory,
		product?.productSpecifications,
		selectedProject,
		suficientInstances,
	]);

	return {
		hasProject,
		hasResources,
		resourceRequest,
	};
};

export default useGetResourceInfo;
