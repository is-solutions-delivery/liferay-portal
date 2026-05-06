import {
    Column,
    Heading,
    Hr,
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
    productId: string;
    publisherImage: string;
    publisherName: string;
};

export default function CongratulationsToBeAPublisher({
    catalogName = '[%CATALOG_NAME%]',
    productId = '[%CPDEFINITION_PRODUCTID%]',
    publisherImage = '[%PUBLISHER_IMAGE%]',
    publisherName = '[%PUBLISHER_NAME%]',
}: Props) {
    return (
        <Layout preview="Congratulations on Becoming a Publisher">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Congratulations!
            </Heading>

            <Section className="mb-6">
                <Row>
                    <Column width="56">
                        <Img
                            src={publisherImage}
                            width="56"
                            height="56"
                            alt="App Icon"
                            className="rounded-full block"
                        />
                    </Column>
                    <Column className="pl-3">
                        <Text className="text-[23px] font-semibold text-heading leading-7 m-0">
                            {publisherName}
                        </Text>
                        <Text className="text-base text-text m-0">
                            {catalogName}
                        </Text>
                    </Column>
                </Row>
            </Section>

            <Section className="mb-6">
                <Text className="text-base text-text m-0">
                    Dear <span className="text-heading font-semibold">{publisherName}</span>,
                </Text>
                <Text className="text-base text-text m-0">
                    Congratulations! Your application to become a publisher on
                    the Liferay Marketplace has been approved. You can now
                    publish your solutions and reach a global audience of
                    Liferay users and organizations. Welcome aboard!
                </Text>
            </Section>

            <Section>
                <Text className="text-base text-lg text-heading font-semibold m-0">
                    What's next?
                </Text>
                <Hr className="border-border mt-2 mb-4" />
            </Section>

            <Section className="mb-4">
                <Text className="text-base text-text m-0 mb-4">
                    Publishing your first app is just a few steps away:
                </Text>

                <div className="mb-6">
                    <Text className="text-base text-text font-semibold text-heading m-0 mb-1">
                        1. Log in to your Publisher Account
                    </Text>
                    <Text className="text-base text-text m-0 mb-4">
                        Access your dedicated publisher dashboard by clicking
                        the button below.
                    </Text>

                    <Link
                        href={`${LIFERAY_HOME}/publisher-dashboard#/app/${productId}`}
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                    >
                        Go to Dashboard
                    </Link>
                </div>

                <div className="mb-6">
                    <Text className="text-base text-text font-semibold text-heading m-0 mb-1">
                        2. Prepare your Application
                    </Text>
                    <Text className="text-base text-text m-0">
                        Ensure your app is packaged correctly and meets all
                        Liferay Marketplace guidelines. You can find detailed
                        documentation and best practices{' '}
                        <Link
                            href="#"
                            className="font-semibold text-primary no-underline"
                        >
                            here
                        </Link>
                    </Text>
                </div>

                <div className="mb-6">
                    <Text className="text-base text-text font-semibold text-heading m-0 mb-1">
                        3. Submit Your App
                    </Text>
                    <Text className="text-base text-text m-0">
                        Follow the intuitive submission process within your
                        publisher dashboard. You'll be guided through providing
                        details, screenshots, pricing, and more.
                    </Text>
                </div>

                <div className="mb-6">
                    <Text className="text-base text-text font-semibold text-heading m-0 mb-1">
                        4. Review Process
                    </Text>
                    <Text className="text-base text-text m-0">
                        Our team will review your submission to ensure it meets
                        our quality and security standards. We'll notify you
                        once it's approved and live on the Marketplace.
                    </Text>
                </div>
            </Section>

            <Section>
                <Text className="text-base text-text font-semibold text-heading m-0 mb-1">
                    Help Publisher
                </Text>
                <Hr className="border-border mt-2 mb-4" />
                <Text className="text-base text-text m-0 mb-4">
                    We're here to support you at every step. For any questions
                    or assistance with your application, contact our{' '}
                    <span className="font-bold">Publisher Support team</span> by
                    clicking the button below.
                </Text>
                <Link
                    href={`${LIFERAY_HOME}/publisher-dashboard#/app/${productId}`}
                    className="bg-white border border-primary text-primary font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    Support
                </Link>
            </Section>

            <Section className="mt-12 mb-6">
                <Text className="text-base text-text m-0">
                    We look forward to seeing your innovative solutions on the{' '}
                    <span className="font-bold">Liferay Marketplace!</span>
                    <br />
                    Best regards,
                    <br />
                    The Liferay Marketplace Team
                </Text>
            </Section>
        </Layout>
    );
}

CongratulationsToBeAPublisher.PreviewProps = {
    catalogName: 'Liferay, Inc.',
    productId: '123456789',
    publisherImage: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    publisherName: 'Liferay, Inc.',
} as Props;
