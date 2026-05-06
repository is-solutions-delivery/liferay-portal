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
    appName: string;
    productType: string;
    catalogName: string;
    cpDefinitionProductId: string;
    productThumbnail: string;
};

export default function NewAppApprovedAndPublished({
    appName = '[%PRODUCT_NAME%]',
    productType = '[%PRODUCT_TYPE%]',
    catalogName = '[%CATALOG_NAME%]',
    cpDefinitionProductId = '[%CPDEFINITION_PRODUCTID%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
}: Props) {
    return (
        <Layout preview="Great news! Your App is Now Live on the Marketplace">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Great news! Your App is Now Live on the Marketplace
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    Your app submitted to the marketplace has been approved and
                    is now availableto users on the marketplace.
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
                            {appName}
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
                <Text className="text-base text-text leading-[22px] m-0 mb-2">
                    From your publisher account, you can:
                </Text>
                <Row>
                    <Column
                        width="20"
                        valign="top"
                        className="text-[20px] leading-[22px]"
                    >
                        •
                    </Column>
                    <Column className="text-base text-text leading-[22px]">
                        <strong>View</strong> how your app appears on the
                        marketplace.
                    </Column>
                </Row>
                <Row>
                    <Column
                        width="20"
                        valign="top"
                        className="text-[20px] leading-[22px]"
                    >
                        •
                    </Column>
                    <Column className="text-base text-text leading-[22px]">
                        <strong>Update</strong> other listing details.
                    </Column>
                </Row>
                <Row>
                    <Column
                        width="20"
                        valign="top"
                        className="text-[20px] leading-[22px]"
                    >
                        •
                    </Column>
                    <Column className="text-base text-text leading-[22px]">
                        <strong>Track</strong> downloads, user feedback, and
                        performance metrics.
                    </Column>
                </Row>
            </Section>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    Thank you for your patience and congratulations on your
                    successful submission!
                </Text>
            </Section>

            <Section className="mb-12">
                <Link
                    href={`${LIFERAY_HOME}/publisher-dashboard#/app/${cpDefinitionProductId}`}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    Go to Dashboard
                </Link>
            </Section>

            <Section className="bg-[#F7F7F8] rounded-lg p-6 mb-6">
                <Text className="text-base font-semibold text-heading m-0 mb-2">
                    Do you need help?
                </Text>
                <Text className="text-xs text-text m-0">
                    If you have any questions, please{' '}
                    <Link
                        href="#"
                        className="font-semibold text-primary no-underline"
                    >
                        Learn more about App Submission and Review.
                    </Link>
                </Text>
            </Section>
        </Layout>
    );
}

NewAppApprovedAndPublished.PreviewProps = {
    appName: 'Liferay',
    productType: 'SaaS',
    catalogName: 'Liferay, Inc.',
    cpDefinitionProductId: '123456789',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
} as Props;
