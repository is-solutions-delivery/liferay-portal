import {
    Column,
    Heading,
    Hr,
    Img,
    Link,
    Row,
    Section,
    Text,
} from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    appPrice: string;
    buttonText: string;
    catalogName: string;
    description: string;
    livePreview: boolean;
    orderId: string;
    productName: string;
    productThumbnail: string;
    subtotalFormatted: string;
    taxAmountFormatted: string;
    totalFormatted: string;
};

export default function PaymentApproved({
    buttonText = '[%BUTTON_TEXT%]',
    catalogName = '[%CATALOG_NAME%]',
    description = '[%DESCRIPTION%]',
    livePreview = false,
    orderId = '[%ORDER_ID%]',
    productName = '[%PRODUCT_NAME%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
    subtotalFormatted = '[%SUBTOTAL_FORMATTED%]',
    taxAmountFormatted = '[%TAX_AMOUNT_FORMATTED%]',
    totalFormatted = '[%TOTAL_FORMATTED%]',
}: Props) {
    return (
        <Layout preview="Your App Update is Under Review">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Payment Received!
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0 mb-0">
                    Congratulations on the purchase of:
                </Text>
            </Section>

            <Section className="mb-6">
                <Row>
                    <Column style={{ verticalAlign: 'top' }} width="56">
                        <Img
                            src={productThumbnail}
                            width="56"
                            height="56"
                            alt="App Icon"
                            className="block"
                        />
                    </Column>
                    <Column className="pl-3">
                        <Row className="mt-1">
                            <Column style={{ verticalAlign: 'top' }}>
                                <Text className="text-[23px] font-semibold text-heading m-0">
                                    {productName}
                                </Text>
                                <Text className="text-base text-text m-0 pr-4">
                                    {catalogName}
                                </Text>
                            </Column>
                            <Column style={{ verticalAlign: 'top' }}>
                                <Row>
                                    <Column>
                                        <Text className="text-[14px] text-left m-0">
                                            Net Price:
                                        </Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-[14px] font-semibold text-right m-0">
                                            {subtotalFormatted}
                                        </Text>
                                    </Column>
                                </Row>
                                <Row>
                                    <Column>
                                        <Text className="text-[14px] text-left m-0">
                                            VAT:
                                        </Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-[14px] font-semibold text-right m-0">
                                            {taxAmountFormatted}
                                        </Text>
                                    </Column>
                                </Row>
                                <Row>
                                    <Column>
                                        <Text className="text-[16px] text-left m-0">
                                            Total:
                                        </Text>
                                    </Column>
                                    <Column>
                                        <Text className="text-[16px] font-semibold text-right m-0">
                                            {totalFormatted}
                                        </Text>
                                    </Column>
                                </Row>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </Section>
            <Hr />
            <Section className="mt-4 mb-6">
                <Text className="text-base text-text m-0 mb-4">
                    Your Order ID is:{' '}
                    <span className="font-bold">{orderId}</span>
                </Text>

                {livePreview ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: description,
                        }}
                    />
                ) : (
                    description
                )}
            </Section>

            <Section className="mb-12">
                <Link
                    href={`${LIFERAY_HOME}/customer-dashboard#/order/${orderId}`}
                    className="bg-primary border border-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    {buttonText}
                </Link>
            </Section>

            <Section className="bg-[#F7F7F8] rounded-lg p-6 mb-6">
                <Text className="text-base font-semibold text-heading m-0 mb-2">
                    Do you need help?
                </Text>
                <Text className="text-xs text-text m-0">
                    If you have any questions, please{' '}
                    <Link
                        href="#"
                        className="font-semibold text-primary no-underline"
                    >
                        Contact Support.
                    </Link>
                </Text>
            </Section>
        </Layout>
    );
}

PaymentApproved.PreviewProps = {
    appPrice: '€1.230,00',
    buttonText: 'Launch LDP',
    catalogName: 'Liferay, Inc.',
    description: ` <p style="color:gray; margin:0px; line-height: 24px;">You are all set 🚀 You <b>can start using all the premium features</b> of your Customer Data Platform right away. Click the button below to access your CDP and enjoy the full experience.</p>`,
    livePreview: true,
    orderId: '123456789',
    productName: 'Customer Data Platform',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    subtotalFormatted: '$200.00',
    taxAmountFormatted: '$44.00',
    totalFormatted: '$261.00',
} as Props;
