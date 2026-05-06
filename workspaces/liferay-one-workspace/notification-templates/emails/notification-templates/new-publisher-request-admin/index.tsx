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
    publisherImage: string;
    publisherName: string;
};

export default function NewPublisherRequestAdmin({
    catalogName = '[%CATALOG_NAME%]',
    publisherImage = '[%PUBLISHER_IMAGE%]',
    publisherName = '[%PUBLISHER_NAME%]',
}: Props) {
    return (
        <Layout preview="New Publisher Request Pending Approval">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                New Publisher Request Pending Approval
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    A user has requested to become a publisher on the
                    marketplace. Please review the request in the admin panel
                    and decide whether to approve or reject it.
                </Text>
            </Section>

            <Section className="mb-6">
                <Row>
                    <Column width="58">
                        <Img
                            src={publisherImage}
                            width="58"
                            height="58"
                            alt="App Icon"
                            className="rounded-full block"
                        />
                    </Column>
                    <Column className="pl-3">
                        <Text className="text-[23px] font-semibold text-heading m-0">
                            {publisherName}
                        </Text>
                        <Text className="text-base text-text m-0">
                            {catalogName}
                        </Text>
                    </Column>
                </Row>
            </Section>

            <Section className="mb-6">
                <Text className="text-base text-text m-0 mb-4">
                    Once approved, the user will be able to submit apps and
                    manage their listings. Thank you for your attention.
                </Text>
            </Section>

            <Section className="mb-6">
                <Link
                    href={`${LIFERAY_HOME}/administrator-dashboard#/publisher-request`}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    Review Publisher Request
                </Link>
            </Section>
        </Layout>
    );
}

NewPublisherRequestAdmin.PreviewProps = {
    catalogName: 'Liferay, Inc.',
    publisherImage: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    publisherName: 'Liferay, Inc.',
} as Props;
