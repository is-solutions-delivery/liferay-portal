import { Heading, Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    trialExtensionRequestAuthorFirstName: string;
    trialExtensionRequestProjectId: string;
    trialExtensionRequestDueStatus: string;
};

export default function TrialAdminExtensionResponse({
    trialExtensionRequestAuthorFirstName = '[%TRIALEXTENSIONREQUEST_AUTHOR_FIRST_NAME%]',
    trialExtensionRequestProjectId = '[%TRIALEXTENSIONREQUEST_PROJECTID%]',
    trialExtensionRequestDueStatus = '[%TRIALEXTENSIONREQUEST_DUESTATUS%]',
}: Props) {
    return (
        <Layout
            preview="Trial Extension Response"
        >
            <Section>
                <Text className="text-base text-text mb-4">
                    Dear{' '}
                    <span className="font-bold">
                        {trialExtensionRequestAuthorFirstName}
                    </span>
                    ,
                </Text>

                <Text className="text-base text-text mb-4">
                    Your request for{' '}
                    <span className="font-bold">
                        {trialExtensionRequestProjectId}
                    </span>{' '}
                    was{' '}
                    <span className="font-bold">
                        {trialExtensionRequestDueStatus}
                    </span>{' '}
                    by the admin.
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

TrialAdminExtensionResponse.PreviewProps = {
    trialExtensionRequestAuthorFirstName: 'John',
    trialExtensionRequestProjectId: '123456789',
    trialExtensionRequestDueStatus: 'Approved',
} as Props;
