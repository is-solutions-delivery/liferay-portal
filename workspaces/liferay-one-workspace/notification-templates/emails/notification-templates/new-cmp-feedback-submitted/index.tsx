import { Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    companyName: string;
    fullName: string;
    jobTitle: string;
    emailAddress: string;
    ratingEaseOfUse: string;
    ratingSatisfaction: string;
    ratingUsefulness: string;
    suggestionFeatures: string;
    suggestionImprovements: string;
    suggestionSatisfaction: string;
};

export default function NewCMPFeedbackNotification({
    companyName = '[%PRODUCTFEEDBACK_COMPANYNAME%]',
    fullName = '[%PRODUCTFEEDBACK_FULLNAME%]',
    jobTitle = '[%PRODUCTFEEDBACK_JOBTITLE%]',
    emailAddress = '[%PRODUCTFEEDBACK_EMAILADDRESS%]',
    ratingEaseOfUse = '[%PRODUCTFEEDBACK_RATINGEASEOFUSE%]',
    ratingSatisfaction = '[%PRODUCTFEEDBACK_RATINGSATISFACTION%]',
    ratingUsefulness = '[%PRODUCTFEEDBACK_RATINGUSEFULNESS%]',
    suggestionFeatures = '[%PRODUCTFEEDBACK_SUGGESTIONFEATURES%]',
    suggestionImprovements = '[%PRODUCTFEEDBACK_SUGGESTIONIMPROVEMENTS%]',
    suggestionSatisfaction = '[%PRODUCTFEEDBACK_SUGGESTIONSATISFACTION%]',
}: Props) {
    return (
        <Layout preview="New Product Feedback Notification">

            <Section>
                <Text className="text-base text-text mb-4">
                    Dear <span className="font-semibold">Admin</span>,
                </Text>

                <Text className="text-base text-text mb-4">
                    A new feedback has been submitted for{' '}
                    <span className="font-semibold">CMP BETA</span>.
                </Text>

                <Text className="text-base text-text mb-4">
                    Name: <span className="font-semibold">{fullName}</span>
                    <br />
                    Email: <span className="font-semibold">{emailAddress}</span>
                    <br />
                    Company: <span className="font-semibold">{companyName}</span>
                    <br />
                    Job Title: <span className="font-semibold">{jobTitle}</span>
                    <br />
                    Rating - Ease of Use:{' '}
                    <span className="font-semibold">{ratingEaseOfUse}</span>
                    <br />
                    Rating - Satisfaction:{' '}
                    <span className="font-semibold">{ratingSatisfaction}</span>
                    <br />
                    Rating - Usefulness:{' '}
                    <span className="font-semibold">{ratingUsefulness}</span>
                    <br />
                    Suggestion - Features:{' '}
                    <span className="font-semibold">{suggestionFeatures}</span>
                    <br />
                    Suggestion - Improvements:{' '}
                    <span className="font-semibold">{suggestionImprovements}</span>
                    <br />
                    Suggestion - Satisfaction:{' '}
                    <span className="font-semibold">{suggestionSatisfaction}</span>
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

NewCMPFeedbackNotification.PreviewProps = {
    companyName: 'Example Company',
    fullName: 'John Doe',
    jobTitle: 'Software Engineer',
    emailAddress: 'john.doe@example.com',
    ratingEaseOfUse: '5',
    ratingSatisfaction: '5',
    ratingUsefulness: '5',
    suggestionFeatures: 'Feature suggestions',
    suggestionImprovements: 'Improvement suggestions',
    suggestionSatisfaction: 'Satisfaction suggestions',
} as Props;
