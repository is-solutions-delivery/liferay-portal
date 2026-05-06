import { Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    commerceOrderAccountName: string;
    commerceOrderAuthorEmailAddress: string;
    commerceOrderId: string;
    commerceOrderCreateDate: string;
};

export default function TrialAdminNotification({
    commerceOrderAccountName = '[%COMMERCEORDER_ACCOUNT_NAME%]',
    commerceOrderAuthorEmailAddress = '[%COMMERCEORDER_AUTHOR_EMAIL_ADDRESS%]',
    commerceOrderId = '[%COMMERCEORDER_ID%]',
    commerceOrderCreateDate = '[%COMMERCEORDER_CREATEDATE%]',
}: Props) {
    return (
        <Layout
            preview="Trial Admin Notification"
        >
            <Section>
                <Text className="text-base text-text mb-4">
                    Dear <span className="font-bold">SSA Admin</span>,
                </Text>

                <Text className="text-base text-text mb-4">
                    A new trial has been started.
                </Text>

                <Text className="text-base text-text mb-4">
                    Author Name:{' '}
                    <span className="font-bold">
                        {commerceOrderAccountName}
                    </span>
                    <br />
                    Author Email:{' '}
                    <span className="font-bold">
                        {commerceOrderAuthorEmailAddress}
                    </span>
                    <br />
                    Order ID:{' '}
                    <span className="font-bold">{commerceOrderId}</span>
                    <br />
                    Created At:{' '}
                    <span className="font-bold">{commerceOrderCreateDate}</span>
                </Text>

                <Text className="text-base text-text mb-8">
                    Regards,
                    <br />
                    The Liferay Marketplace Team
                </Text>
            </Section>
        </Layout>
    );
}

TrialAdminNotification.PreviewProps = {
    commerceOrderAccountName: 'Liferay',
    commerceOrderAuthorEmailAddress: 'test@liferay.com',
    commerceOrderId: '123456789',
    commerceOrderCreateDate: 'Jan 01, 2023',
} as Props;
