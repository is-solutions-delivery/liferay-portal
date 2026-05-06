import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface LayoutProps {
    children: React.ReactNode;
    preview: string;
}

export const Layout = ({ children, preview }: LayoutProps) => {
    return (
        <Html>
            <Head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <Preview>{preview}</Preview>
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                background: '#E7EFFF',
                                surface: '#FFFFFF',
                                border: '#DDDDDD',
                                text: '#6C6C75',
                                heading: '#282934',
                                primary: '#0B5FFF',
                            },
                        },
                        fontFamily: {
                            sans: ['"Source Sans 3"', 'sans-serif'],
                        },
                    },
                }}
            >
                <Body className="bg-background font-sans my-auto mx-auto px-2">
                    <Container className="bg-surface border border-border rounded-[20px] my-[40px] mx-auto p-[48px] max-w-[640px]">
                        {/* Header */}
                        <Section className="mb-6 pt-5 pb-5 text-center">
                            <Img
                                className="inline-block align-middle mr-1.5"
                                height="28"
                                alt="Liferay Logo"
                                src="https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28"
                                width="28"
                            />

                            <Heading
                                as="h1"
                                className="text-3xl font-semibold text-heading m-0 inline-block align-middle"
                            >
                                Marketplace
                            </Heading>
                        </Section>
                        <Hr className="border-border my-6" />

                        {/* Main Content */}
                        <Section>{children}</Section>

                        <Hr className="border-border my-6" />

                        {/* Footer */}
                        <Section className="text-center">
                            <Text className="text-sm text-text mb-4">
                                This email was sent by{' '}
                                <Link
                                    href="https://marketplace.liferay.com"
                                    className="text-primary no-underline"
                                >
                                    Liferay Marketplace
                                </Link>
                            </Text>
                            <Img
                                src="https://marketplace.liferay.com/documents/d/marketplace/marketplace_footer_logo"
                                width="110"
                                height="28"
                                alt="Liferay Marketplace"
                                className="mx-auto mb-4"
                            />
                            <Text className="text-sm text-text m-0">
                                Copyright © {new Date().getFullYear()} Liferay,
                                Inc.
                            </Text>
                            <Text className="text-sm text-text m-0">
                                1400 Montefino Ave
                            </Text>
                            <Text className="text-sm text-text m-0 mb-4">
                                Diamond Bar, CA 91765
                            </Text>

                            <Text className="text-xs text-text">
                                <Link
                                    href="https://www.liferay.com/contact-us"
                                    className="text-primary no-underline"
                                >
                                    Contact Support
                                </Link>
                                {' | '}
                                <Link
                                    href="https://learn.liferay.com"
                                    className="text-primary no-underline"
                                >
                                    Documentation
                                </Link>
                                {' | '}
                                <Link
                                    href="https://help.liferay.com/hc"
                                    className="text-primary no-underline"
                                >
                                    Help Center
                                </Link>
                                {' | '}
                                <Link
                                    href="https://help.liferay.com/hc/categories/360000892272-Announcements"
                                    className="text-primary no-underline"
                                >
                                    Announcements
                                </Link>
                                {' | '}
                                <Link
                                    href="https://status.liferay.cloud/"
                                    className="text-primary no-underline"
                                >
                                    Uptime Status
                                </Link>
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default Layout;
