import {
    Column,
    Heading,
    Img,
    Link,
    Row,
    Section,
    Text,
} from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    catalogName: string;
    cpDefinitionProductId: string;
    productName: string;
    productThumbnail: string;
    productType: string;
};

export default function NewAppSubmittedAdmin({
    catalogName = '[%CATALOG_NAME%]',
    cpDefinitionProductId = '[%CPDEFINITION_PRODUCTID%]',
    productName = '[%PRODUCT_NAME%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
    productType = '[%PRODUCT_TYPE%]',
}: Props) {
    return (
        <Layout preview="New App Submission Pending Approval">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                New App Submission Pending Approval
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    A publisher has submitted a new app to the marketplace.
                    Please review the app details in the admin panel and decide
                    whether to approve or reject the submission.
                </Text>
            </Section>

            <Section className="mb-6">
                <Row>
                    <Column width="56">
                        <Img
                            src={productThumbnail}
                            width="56"
                            height="56"
                            alt="App Icon"
                            className="block"
                        />
                    </Column>
                    <Column className="pl-3">
                        <Text className="text-[23px] font-semibold text-heading m-0">
                            {productName}
                        </Text>
                        <Row className="mt-1">
                            <Column
                                style={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}>
                                <Text className="text-base text-text m-0 pr-3">
                                    {catalogName}
                                </Text>
                            </Column>
                            <Column
                            style={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}>
                                <Text className="text-[11px] text-center font-semibold px-[8px] m-0 rounded bg-gray-200">
                                    {productType}
                                </Text>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </Section>

            <Section className="mb-6">
                <Text className="text-base text-text m-0 mb-4">
                    Once approved, the app will become available for every
                    Marketplace users.
                </Text>
                <Text className="text-base text-text m-0">
                    Thank you for your attention.
                </Text>
            </Section>

            <Section className="mb-6">
                <Link
                    href={`${LIFERAY_HOME}/administrator-dashboard#/apps/${cpDefinitionProductId}`}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    Review App
                </Link>
            </Section>
        </Layout>
    );
}

NewAppSubmittedAdmin.PreviewProps = {
    catalogName: 'Liferay, Inc.',
    cpDefinitionProductId: '123456789',
    productName: 'Liferay',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    productType: 'SaaS',
} as Props;
