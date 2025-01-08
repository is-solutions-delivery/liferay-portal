/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import { ConsoleUserProject, Product, convertMegabyteToGigabyteProps } from '../types';


const getCategoryVocabulary = (product: Product, vocabulary: string) =>
    product.categories.filter(
        (category) => category?.vocabulary === vocabulary
    );

const getProductSpecification = (product: Product, specificationKey: string) =>
    product.productSpecifications.find(
        (specification) => specification?.specificationKey === specificationKey
    );


export function getThumbnailByProductAttachment(
    images?: Partial<any>[]
): string | undefined {
    if (!Array.isArray(images)) {
        return undefined;
    }

    const thumbnail =
        images.find((images) => {
            return (images.tags || []).indexOf('app icon') >= 0;
        }) || images[0];

    return thumbnail?.src;
}

const getIconUrl = (product?: any) => {
    const iconURL = product
        ? getThumbnailByProductAttachment(product.images)?.split('/o/')
        : '';

    return iconURL ? `/o/${iconURL[1]}` : '';
};

const getProductRequirements = (product: Product) => {
    const requirements = {
        cpu: 0,
        ram: 0,
    };

    for (const requirement in requirements) {
        const currentSpecification = product?.productSpecifications.find(
            (specification) => specification.specificationKey === requirement
        );

        (requirements as any)[requirement] = currentSpecification?.value;
    }

    return requirements;
};

const getRequiredLabel = (product: Product) => {
    const requirements = getProductRequirements(product);

    return `${requirements.cpu}CPUs, ${requirements.ram}GB RAM`;
};

const convertMegabyteToGigabyte = ({
    inverseOperation = false,
    value,
}: convertMegabyteToGigabyteProps) => {
    const ONE_GB = 1024;

    if (inverseOperation) {
        return Number((value / ONE_GB).toFixed(2));
    }

    return value * ONE_GB;
};


const getUsageLabel = (
    project: ConsoleUserProject,
    product: Product
) => {
    const requirements = getProductRequirements(product);

    const remainingResource = {
        cpu:
            project.rootProjectPlanUsage?.cpu.limit -
            project.rootProjectPlanUsage?.cpu.used,
        ram: convertMegabyteToGigabyte({
            inverseOperation: true,
            value:
                project.rootProjectPlanUsage.memory.limit -
                project.rootProjectPlanUsage?.memory?.used,
        }),
    };

    return `${requirements.cpu - remainingResource.cpu}CPUs,
        ${requirements.ram - remainingResource.ram}GB RAM`;
};


export {
    convertMegabyteToGigabyte,
    getCategoryVocabulary,
    getIconUrl,
    getRequiredLabel,
    getUsageLabel,
    getProductSpecification,
}