import { Heading, Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    commerceOrderAuthorFirstName: string;
    commerceOrderId: string;
};

export default function TrialOnHoldOrder({
    commerceOrderAuthorFirstName = '[%COMMERCEORDER_AUTHOR_FIRST_NAME%]',
    commerceOrderId = '[%COMMERCEORDER_ID%]',
}: Props) {
    return (
        <Layout preview="Trial On Hold Order">

            <Section>
                <Text className="text-base text-text mb-4">
                    Dear{' '}
                    <span className="font-bold">
                        {commerceOrderAuthorFirstName}
                    </span>
                    ,
                </Text>

                <Text className="text-base text-text mb-4">
                    Welcome to your trial! We're thrilled to have you on board.
                </Text>

                <Text className="text-base text-text mb-4">
                    Your Order ID is:{' '}
                    <span className="font-bold">{commerceOrderId}</span>
                </Text>

                <Text className="text-base text-text mb-4">
                    At this time, your request is waiting to be processed by our
                    systems.
                </Text>

                <Text className="text-base text-text mb-4">
                    As soon as your solution is ready to use, we will send you a
                    confirmation email with all the activation details.
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

TrialOnHoldOrder.PreviewProps = {
    commerceOrderAuthorFirstName: 'John',
    commerceOrderId: '123456789',
} as Props;
