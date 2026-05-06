import { Link, Section, Text } from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    name: string;
    url: string;
    email: string;
};

export default function TrialCompletedOrder({
    name = '%NAME%',
    url = '%URL%',
    email = '%EMAIL%',
}: Props) {
    return (
        <Layout preview="Trial Completed Order">
            <Section>
                <Text className="text-base text-text mb-4">
                    Dear <span className="font-bold">{name}</span>,
                </Text>

                <Text className="text-base text-text mb-4">
                    Your Trial is available at the following URL:{' '}
                    <Link href={`https://${url}`}>{url}</Link>
                </Text>

                <Text className="text-base text-text mb-4">
                    Please use the information below to access it:
                </Text>

                <Text className="text-base text-text mb-4">
                    <span className="font-bold">Username:</span> {email}
                    <br />
                    <span className="font-bold">Password:</span> `test`
                </Text>

                <Text className="text-base text-text mb-4">
                    You can manage your trial using the Marketplace Dashboard.
                    It will be available for 7 days unless you choose to extend
                    it.
                </Text>

                <Text className="text-base text-text mb-8">
                    Regards,
                    <br />
                    The Liferay Marketplace Team
                    <br />
                </Text>

                <Section className="mt-5 text-left mb-14">
                    <Link
                        href={url}
                        className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block mr-4"
                    >
                        Access your solution
                    </Link>
                    <Link
                        href={`${LIFERAY_HOME}/web/marketplace/customer-dashboard/#/solutions`}
                        className="bg-white border border-primary text-primary font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                    >
                        Go to Dashboard
                    </Link>
                </Section>
            </Section>
        </Layout>
    );
}

TrialCompletedOrder.PreviewProps = {
    name: 'John Doe',
    url: 'liferay.com',
    email: 'test@liferay.com',
} as Props;
