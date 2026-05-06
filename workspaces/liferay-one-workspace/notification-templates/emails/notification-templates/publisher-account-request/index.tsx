import { Heading, Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    reviewSubmissionLink: string;
};

export default function PublisherAccountRequest({
    reviewSubmissionLink = '[$REVIEW_SUBMISSION_LINK$]',
}: Props) {
    return (
        <Layout preview="Invite Members">
            <Section className="mb-[40px]">
                <Heading className="text-[23px] font-bold text-heading mb-6 text-left">
                    New Publisher Account Request
                </Heading>


                <Text className="text-base text-text m-0">
                    A new request has been submitted to the Marketplace for a
                    publisher account. Please review the submission and create
                    the publisher account. Invite the user to the account as per
                    existing Marketplace functionality.
                </Text>
            </Section>

            <Section className="mb-6">
                <Link
                    href={reviewSubmissionLink}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    Review Submission
                </Link>
            </Section>
        </Layout>
    );
}

PublisherAccountRequest.PreviewProps = {
    reviewSubmissionLink: 'https://liferay.com',
} as Props;
