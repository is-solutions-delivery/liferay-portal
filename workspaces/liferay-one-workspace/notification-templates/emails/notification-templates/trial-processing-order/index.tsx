import { Heading, Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    commerceOrderAuthorFirstName: string;
    commerceOrderId: string;
};

export default function TrialProcessingOrder({
    commerceOrderAuthorFirstName = '[%COMMERCEORDER_AUTHOR_FIRST_NAME%]',
    commerceOrderId = '[%COMMERCEORDER_ID%]',
}: Props) {
    return (
        <Layout preview="Trial Processing Order">
            <Section>
                <Text className="text-base text-text mb-4">
                    Dear{' '}
                    <span className="font-bold">
                        {commerceOrderAuthorFirstName}
                    </span>
                    ,
                </Text>

                <Text className="text-base text-text mb-4">
                    Welcome to Liferay Marketplace! We're thrilled to have you
                    on board for your trial.
                </Text>

                <Text className="text-base text-text mb-4">
                    Your Order ID is:{' '}
                    <span className="font-bold">{commerceOrderId}</span>
                </Text>

                <Text className="text-base text-text mb-4">
                    Please be patient as we provision your solution. This
                    process{' '}
                    <span className="font-bold">may take a few minutes.</span>
                </Text>

                <Text className="text-base text-text mb-4">
                    Once provisioning is complete, you'll receive another email
                    containing detailed instructions.
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

TrialProcessingOrder.PreviewProps = {
    commerceOrderAuthorFirstName: 'John',
    commerceOrderId: '123456789',
} as Props;
