import {
    Column,
    Heading,
    Img,
    Link,
    Row,
    Section,
    Text,
} from '@react-email/components';

import Layout from '../../layout/Layout';
import { LIFERAY_HOME } from '../../constants';

type Props = {
    buttonText: string;
    catalogName: string;
    description: string;
    livePreview: boolean;
    orderId: string;
    productName: string;
    productThumbnail: string;
    totalFormatted: string;
};

// ORDER-CONFIRMATION

export default function OrderConfirmation({
    buttonText = '[%BUTTON_TEXT%]',
    catalogName = '[%CATALOG_NAME%]',
    description = '[%DESCRIPTION%]',
    livePreview = false,
    orderId = '[%ORDER_ID%]',
    productName = '[%PRODUCT_NAME%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
    totalFormatted = '[%TOTAL_FORMATTED%]',
}: Props) {
    return (
        <Layout preview="Order Confirmation">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Order Confirmation
            </Heading>

            <Section className="mb-6">
                <Text className="text-base text-text m-0 mb-0">
                    Congratulations on the purchase of:
                </Text>
            </Section>

            <Section className="mb-6">
                <Row>
                    <Column width="56">
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
                            <Column>
                                <Text
                                    className="text-[23px] font-semibold text-heading m-0"
                                    style={{ lineHeight: '1' }}
                                >
                                    {productName}
                                </Text>
                            </Column>
                            <Column>
                                <Text
                                    className="text-[14px] font-semibold text-right"
                                    style={{ lineHeight: '1' }}
                                >
                                    {totalFormatted}
                                </Text>
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <table
                                    cellPadding="0"
                                    cellSpacing="0"
                                    border={0}
                                >
                                    <tr>
                                        <td
                                            style={{
                                                verticalAlign: 'middle',
                                                paddingRight: '8px',
                                                position: 'relative',
                                                top: '-2px',
                                            }}
                                        >
                                            <span className="text-base text-text m-0">
                                                {catalogName}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </Column>
                        </Row>
                    </Column>
                </Row>
            </Section>

            <Section className="mb-6">
                <Text className="text-base text-text m-0 mb-4">
                    Your Order ID is:{' '}
                    <span className="font-bold">{orderId}</span>
                </Text>
                {livePreview ? (
                    <div
                        className="text-muted m-0 lh-base"
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

OrderConfirmation.PreviewProps = {
    buttonText: 'Go to Dashboard',
    catalogName: 'Liferay, Inc.',
    description: `<p style="color:gray; margin:0px; line-height: 24px;">Your workspace is being created now!</p>
    <p style="color:gray; margin:0px; line-height: 24px;">Click the button below to go to your dashboard and check the status of your environment. You can start using it as soon as it is ready.</p>`,
    livePreview: true,
    orderId: '26574346',
    productName: 'Customer Data Platform',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    totalFormatted: '€1.230,00',
} as Props;
