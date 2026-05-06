import { Heading, Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    getAppInformationDashboardLink: string;
    getAppInformationOrderId: string;
    getAppInformationProductName: string;
};

export default function CloudNextStepsTemplate({
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

            <Section className="text-left mb-[2.5rem]">
                <Text className="text-text m-0 mb-4">
                    Congratulations on the purchase of{' '}
                    <b>{getAppInformationProductName}</b>. You will need to
                    deploy the app to your project in the Cloud Console. To
                    access the Cloud Console, click the button below and provide
                    your Order ID when prompted.
                </Text>
                <Text className="text-text m-0">
                    Your Order ID is:{' '}
                    <b className="text-heading">{getAppInformationOrderId}</b>
                </Text>
            </Section>

            <Section className="text-left mb-[2.5rem]">
                <Link
                    href={getAppInformationDashboardLink}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    Go to Dashboard
                </Link>
            </Section>
        </Layout>
    );
}

CloudNextStepsTemplate.PreviewProps = {
    getAppInformationDashboardLink: 'https://console.liferay.com',
    getAppInformationOrderId: '123456789',
    getAppInformationProductName: 'Liferay',
} as Props;
