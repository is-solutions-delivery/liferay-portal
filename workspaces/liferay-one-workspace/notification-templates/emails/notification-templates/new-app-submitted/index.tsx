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
    createDate: string;
    catalogName: string;
    productName: string;
    productThumbnail: string;
    dashboardURL: string;
};

// NEW-APP-SUBMITTED

export default function NewAppSubmitted({
    catalogName = '[%CATALOG_NAME%]',
    createDate = '[%CREATE_DATE%]',
    dashboardURL = '[%DASHBOARD_URL%]',
    productName = '[%PRODUCT_NAME%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
}: Props) {
    return (
        <Layout preview="New app submitted">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-center">
                New App Submitted
            </Heading>

            <Section className="mb-6">
                <Row>
                    <Column width="60">
                        <Img
                            src={productThumbnail}
                            width="60"
                            height="60"
                            alt="App Icon"
                            className="rounded"
                        />
                    </Column>
                    <Column className="pl-3">
                        <Text className="text-xl font-semibold text-heading m-0">
                            {productName}
                        </Text>
                        <Text className="text-base text-text m-0">
                            {catalogName}
                        </Text>
                    </Column>
                </Row>
            </Section>

            <Section className="mb-6">
                <Text className="text-lg text-text">
                    Submission Date:{' '}
                    <span className="font-semibold text-heading">
                        {createDate}
                    </span>
                </Text>
            </Section>

            <Section className="mb-6 text-center">
                <Link
                    href={LIFERAY_HOME}
                    className="bg-primary text-white font-bold py-3 px-6 rounded-lg text-base no-underline inline-block"
                >
                    Go to app
                </Link>
            </Section>
        </Layout>
    );
}

NewAppSubmitted.PreviewProps = {
    catalogName: 'Liferay, Inc.',
    createDate: 'Jan 1, 2023',
    productName: 'Liferay',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
} as Props;
