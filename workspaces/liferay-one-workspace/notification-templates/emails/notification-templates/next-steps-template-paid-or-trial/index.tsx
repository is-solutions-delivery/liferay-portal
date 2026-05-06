import { Heading, Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    commerceOrderId: string;
};

export default function NextStepsTemplatePaidOrTrial({
    commerceOrderId = '[%COMMERCEORDER_ID%]',
}: Props) {
    return (
        <Layout preview="Next Steps Paid DXP">
            <Heading
                className="text-[32px] font-bold text-heading mb-6 text-left"
            >
                Next Steps
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0 mb-4">
                    Congratulations on your recent purchase!
                </Text>
                <Text className="text-base text-text m-0 mb-4">
                    Before deploying to your DXP instance, you'll need to create
                    a license for your app.
                </Text>
                <Text className="text-base text-text m-0 mb-4">
                    Your Order ID is: <strong>{commerceOrderId}</strong>
                </Text>
                <Text className="text-base text-text m-0">
                    Click <strong>Continue Configuration</strong> below to
                    license your app, or visit your Dashboard to locate your
                    Order ID and create a license. Be sure to have your instance
                    details (IP address, MAC address, or hostname) ready.
                </Text>
            </Section>

            <Section className="text-left mb-14">
                <Link
                    href="https://console.marketplacedemo.liferay.sh/projects"
                    className="bg-primary text-white font-semibold py-2 px-4 mr-4 rounded-lg text-base no-underline inline-block"
                >
                    Continue Configuration
                </Link>
                <Link
                    href={`${LIFERAY_HOME}/web/marketplace/customer-dashboard`}
                    className="bg-white border border-primary text-primary font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
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
                        href="https://learn.liferay.com"
                        className="font-semibold text-primary no-underline"
                    >
                        Learn more about App Configuration
                    </Link>
                </Text>
            </Section>
        </Layout>
    );
}

NextStepsTemplatePaidOrTrial.PreviewProps = {
    commerceOrderId: '123456789',
} as Props;
