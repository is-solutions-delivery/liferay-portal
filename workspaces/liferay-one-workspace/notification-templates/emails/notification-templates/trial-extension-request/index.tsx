import { Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    trialExtensionRequestAuthorFirstName: string;
    trialExtensionRequestDuration: string;
    trialExtensionRequestProjectId: string;
};

export default function TrialExtensionRequest({
    trialExtensionRequestAuthorFirstName = '[%TRIALEXTENSIONREQUEST_AUTHOR_FIRST_NAME%]',
    trialExtensionRequestDuration = '[%TRIALEXTENSIONREQUEST_DURATION%]',
    trialExtensionRequestProjectId = '[%TRIALEXTENSIONREQUEST_PROJECTID%]',
}: Props) {
    return (
        <Layout preview="Trial Extension Requested">
            <Section>
                <Text className="text-base text-text mb-4">
                    Dear <span className="font-bold">SSA Admin</span>,
                </Text>

                <Text className="text-base text-text mb-4">
                    User{' '}
                    <span className="font-bold">
                        {trialExtensionRequestAuthorFirstName}
                    </span>{' '}
                    has requested a{' '}
                    <span className="font-bold">
                        {trialExtensionRequestDuration}
                    </span>
                    -day extension for trial environment{' '}
                    <span className="font-bold">
                        {trialExtensionRequestProjectId}
                    </span>
                    .
                </Text>

                <Text className="text-base text-text mb-4">
                    Please go to the dashboard for details and approval.
                </Text>

                <Text className="text-base text-text mb-8">
                    Regards,
                    <br />
                    The Liferay Marketplace Team
                </Text>

                <Section className="text-left">
                    <Link
                        href={`${LIFERAY_HOME}/web/marketplace/ssa-dashboard`}
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                    >
                        Go to Dashboard
                    </Link>
                </Section>
            </Section>
        </Layout>
    );
}

TrialExtensionRequest.PreviewProps = {
    trialExtensionRequestAuthorFirstName: 'John',
    trialExtensionRequestDuration: '30',
    trialExtensionRequestProjectId: '123456789',
} as Props;
