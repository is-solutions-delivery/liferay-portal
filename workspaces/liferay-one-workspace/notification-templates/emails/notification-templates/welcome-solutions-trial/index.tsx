import {
    Heading,
    Section,
    Text,
} from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    commerceOrderAuthorFirstName: string;
    commerceOrderId: string;
};

export default function WelcomeSolutionsTrial({
    commerceOrderAuthorFirstName = '[%COMMERCEORDER_AUTHOR_FIRST_NAME%]',
    commerceOrderId = '[%COMMERCEORDER_ID%]',
}: Props) {
    return (
        <Layout preview="Welcome Solutions Trial">
            <Section className="mb-6 text-left">
                <Heading className="text-[30px] font-bold text-black m-0 text-left">
                    Your solution is being provisioned
                </Heading>
            </Section>

            <Section>
                <Text className="text-base text-text mb-4">
                    Dear{' '}
                    <span className="font-bold">
                        {commerceOrderAuthorFirstName}
                    </span>
                    ,
                </Text>

                <Text className="text-base text-text mb-4">
                    Welcome to Liferay Marketplace! We're
                    thrilled to have you on board for your
                    Solutions Trial.
                </Text>

                <Text className="text-base text-text mb-4">
                    Your Order ID is:{' '}
                    <span className="font-bold">
                        {commerceOrderId}
                    </span>
                </Text>

                <Text className="text-base text-text mb-4">
                    Please be patient as we provision your
                    solution. This process{' '}
                    <span className="font-bold">
                        may take a few moments.
                    </span>
                </Text>

                <Text className="text-base text-text mb-4">
                    Once provisioning is complete, you'll
                    receive another email containing
                    detailed instructions.
                </Text>

                <Text className="text-base text-text mb-0">
                    Thank you,
                </Text>
                <Text className="text-base text-text mt-0">
                    Liferay Marketplace.
                </Text>
            </Section>
        </Layout>
    );
}

WelcomeSolutionsTrial.PreviewProps = {
    commerceOrderAuthorFirstName: 'John',
    commerceOrderId: '123456789',
} as Props;
