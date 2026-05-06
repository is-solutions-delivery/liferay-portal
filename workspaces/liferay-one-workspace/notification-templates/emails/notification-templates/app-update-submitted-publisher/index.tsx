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

export default function AppUpdateSubmittedPublisher({
    catalogName = '[%CATALOG_NAME%]',
    cpDefinitionProductId = '[%CPDEFINITION_PRODUCTID%]',
    productName = '[%PRODUCT_NAME%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
    productType = '[%PRODUCT_TYPE%]',
}: Props) {
    return (
        <Layout preview="Your App Update is Under Review">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Your App Update is Under Review
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    Your submission is currently under review by Liferay's Team.
                    Once the process is complete, the app will be immediately
                    published on the Marketplace. Meanwhile, any information or
                    data from this app submission cannot be updated.
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
                    You will be notified by email once a decision has been made:{' '}
                    <span className="font-bold">
                        this process may take up to 3 business days.
                    </span>
                </Text>
                <Text className="text-base text-text m-0">
                    Thanks for your patience!
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

AppUpdateSubmittedPublisher.PreviewProps = {
    catalogName: 'Liferay, Inc.',
    cpDefinitionProductId: '123456789',
    productName: 'Liferay',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    productType: 'SaaS',
} as Props;
