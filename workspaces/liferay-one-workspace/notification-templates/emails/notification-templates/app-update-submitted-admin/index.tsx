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
    productType: string;
    catalogName: string;
    productName: string;
    cpDefinitionProductId: string;
    productThumbnail: string;
};

export default function AppUpdateSubmittedAdmin({
    catalogName = '[%CATALOG_NAME%]',
    cpDefinitionProductId = '[%CPDEFINITION_PRODUCTID%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
    productName = '[%PRODUCT_NAME%]',
    productType = '[%PRODUCT_TYPE%]',
}: Props) {
    return (
        <Layout preview="Updated App Submission Pending Your Review">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Updated App Submission Pending Your Review
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    A publisher has submitted an update to an existing app on
                    the marketplace. Please review the updated submission in the
                    admin panel.
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
                <Text className="text-base text-text m-0">
                    Once approved, the updated app will go live, replacing the
                    previous version on the marketplace.
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

AppUpdateSubmittedAdmin.PreviewProps = {
    productType: 'SaaS',
    catalogName: 'Liferay, Inc.',
    productName: 'Liferay',
    cpDefinitionProductId: '123456789',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
} as Props;
