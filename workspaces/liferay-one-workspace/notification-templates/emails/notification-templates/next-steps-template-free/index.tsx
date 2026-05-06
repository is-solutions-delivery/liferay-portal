import { Heading, Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    getAppInformationDashboardLink: string;
    getAppInformationOrderId: string;
    getAppInformationProductName: string;
};

export default function NextStepsTemplateFree({
    getAppInformationDashboardLink = '[%GETAPPINFORMATION_DASHBOARDLINK%]',
    getAppInformationOrderId = '[%GETAPPINFORMATION_ORDERID%]',
    getAppInformationProductName = '[%GETAPPINFORMATION_PRODUCTNAME%]',
}: Props) {
    return (
        <Layout preview="Next Steps">
            <Heading
                className="text-[32px] font-bold text-heading mb-6 text-left"
            >
                Next Steps
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0 mb-4">
                    Congratulations on the purchase of{' '}
                    <span className="font-bold">{getAppInformationProductName}</span>!
                </Text>
                <Text className="text-base text-text m-0 mb-4">
                    Your app is ready for download.
                </Text>
                <Text className="text-base text-text m-0 mb-4">
                    Your Order ID is:{' '}
                    <span className="font-bold">{getAppInformationOrderId}</span>
                </Text>
                <Text className="text-base text-text m-0">
                    To find your app download, find your Order ID and choose
                    Manage, then Download LPKG.
                </Text>
            </Section>

            <Section className="mb-6">
                <Link
                    href={getAppInformationDashboardLink}
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

NextStepsTemplateFree.PreviewProps = {
    getAppInformationDashboardLink: 'https://console.liferay.com',
    getAppInformationOrderId: '123456789',
    getAppInformationProductName: 'Liferay',
} as Props;
