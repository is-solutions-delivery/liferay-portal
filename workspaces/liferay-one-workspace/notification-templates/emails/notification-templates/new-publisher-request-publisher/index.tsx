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

type Props = {
    catalogName: string;
    publisherImage: string;
    publisherName: string;
};

export default function NewPublisherRequestPublisher({
    catalogName = '[%CATALOG_NAME%]',
    publisherImage = '[%PUBLISHER_IMAGE%]',
    publisherName = '[%PUBLISHER_NAME%]',
}: Props) {
    return (
        <Layout preview="Publisher Request Received">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Thank you for requesting to become a publisher on the
                marketplace.
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    Your publisher request is currently under review by Liferay.
                    Once approved, you'll be able to submit and manage your apps
                    directly from your publisher account.
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
                    You will be notified by email once a decision has been made:{' '}
                    <span className="font-bold">
                        this process may takes up to 3 business days.
                    </span>
                </Text>
                <Text className="text-base text-text m-0">
                    Thanks for your patience!
                </Text>
            </Section>

            <Section className="bg-[#F7F7F8] rounded-lg p-6 mb-6">
                <Text className="text-base font-semibold text-heading m-0 mb-2">
                    Do you need help?
                </Text>
                <Text className="text-xs text-text m-0">
                    If you have any questions, please{' '}
                    <Link
                        href="https://learn.liferay.com/w/dxp/development/marketplace/become-a-publisher"
                        className="font-semibold text-primary no-underline"
                    >
                        Learn more about App Submission and Review.
                    </Link>
                </Text>
            </Section>
        </Layout>
    );
}

NewPublisherRequestPublisher.PreviewProps = {
    catalogName: 'Liferay, Inc.',
    publisherImage: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    publisherName: 'Liferay, Inc.',
} as Props;
