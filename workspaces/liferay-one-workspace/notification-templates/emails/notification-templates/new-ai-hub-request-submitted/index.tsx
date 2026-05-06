import { Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';

type Props = {
    administratorEmailAddress: string;
    aiHubAccountName: string;
    businessEmailAddress: string;
    companyName: string;
    country: string;
    extension: string;
    fullName: string;
    intlCode: string;
    jobTitle: string;
    phoneNumber: string;
    purpose: string;
}

export default function NewCMPFeedbackNotification({
    administratorEmailAddress = '[%AIHUBBETAPRIVATEACCESSREQUEST_ADMINISTRATOREMAILADDRESS%]',
    aiHubAccountName = '[%AIHUBBETAPRIVATEACCESSREQUEST_AIHUBACCOUNTNAME%]',
    businessEmailAddress = '[%AIHUBBETAPRIVATEACCESSREQUEST_BUSINESSEMAILADDRESS%]',
    companyName = '[%AIHUBBETAPRIVATEACCESSREQUEST_COMPANYNAME%]',
    country = '[%AIHUBBETAPRIVATEACCESSREQUEST_COUNTRY%]',
    extension = '[%AIHUBBETAPRIVATEACCESSREQUEST_EXTENSION%]',
    fullName = '[%AIHUBBETAPRIVATEACCESSREQUEST_FULLNAME%]',
    intlCode = '[%AIHUBBETAPRIVATEACCESSREQUEST_INTLCODE%]',
    jobTitle = '[%AIHUBBETAPRIVATEACCESSREQUEST_JOBTITLE%]',
    phoneNumber = '[%AIHUBBETAPRIVATEACCESSREQUEST_PHONENUMBER%]',
    purpose = '[%AIHUBBETAPRIVATEACCESSREQUEST_PURPOSE%]    ',
}: Props) {
    return (
        <Layout preview="New Product Feedback Notification">

            <Section>
                <Text className="text-base text-text mb-4">
                    Dear <span className="font-bold">Admin</span>,
                </Text>

                <Text className="text-base text-text mb-4">
                    A new feedback has been submitted for{' '}
                    <span className="font-semibold">AI Hub</span>.
                </Text>

                <Text className="text-base text-text mb-4">
                    Administrator Email Address: <span className="font-semibold">{administratorEmailAddress}</span>
                    <br />
                    AI Hub Account Name: <span className="font-semibold">{aiHubAccountName}</span>
                    <br />
                    Business Email Address: <span className="font-semibold">{businessEmailAddress}</span>
                    <br />
                    Company Name: <span className="font-semibold">{companyName}</span>
                    <br />
                    Country: <span className="font-semibold">{country}</span>
                    <br />
                    Extension: <span className="font-semibold">{extension}</span>
                    <br />
                    Full Name: <span className="font-semibold">{fullName}</span>
                    <br />
                    International Code: <span className="font-semibold">{intlCode}</span>
                    <br />
                    Job Title: <span className="font-semibold">{jobTitle}</span>
                    <br />
                    Phone Number: <span className="font-semibold">{phoneNumber}</span>
                    <br />
                    Purpose: <span className="font-semibold">{purpose}</span>
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
    administratorEmailAddress: 'john.doe@example.com',
    aiHubAccountName: 'Example AI Hub',
    businessEmailAddress: 'business@example.com',
    companyName: 'Example Company',
    country: 'Example Country',
    extension: '1234',
    fullName: 'John Doe',
    intlCode: '+1',
    jobTitle: 'Software Engineer',
    phoneNumber: '555-1234',
    purpose: 'Example purpose'
} as Props;
