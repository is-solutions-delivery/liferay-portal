import { Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    trialCreatorFirstName: string;
    trialEndDate: string;
};

export default function TrialExpiringOrder({
    trialCreatorFirstName = '[%TRIAL_CREATOR_FIRST_NAME%]',
    trialEndDate = '[%TRIAL_END_DATE%]',
}: Props) {
    return (
        <Layout preview="Trial Expiring Order">
            <Section>
                <Text className="text-base text-text mb-4">
                    Dear{' '}
                    <span className="font-bold">{trialCreatorFirstName}</span>,
                </Text>

                <Text className="text-base text-text mb-4">
                    Your Trial will end on{' '}
                    <span className="font-bold">{trialEndDate}</span> and all of
                    your data will be deleted automatically.
                </Text>

                <Text className="text-base text-text mb-4">
                    We look forward to continuing to support your success.
                </Text>

                <Text className="text-base text-text mb-8">
                    Thank you,
                    <br />
                    Liferay Marketplace Team
                </Text>

                <Section className="text-left">
                    <Link
                        href={`${LIFERAY_HOME}/customer-dashboard/#/solutions`}
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                    >
                        Go to Dashboard
                    </Link>
                </Section>
            </Section>
        </Layout>
    );
}

TrialExpiringOrder.PreviewProps = {
    trialCreatorFirstName: 'John',
    trialEndDate: 'Jan 01, 2023',
} as Props;
