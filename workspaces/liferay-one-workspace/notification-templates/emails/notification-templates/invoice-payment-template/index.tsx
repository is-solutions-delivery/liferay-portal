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

type Props = {
    accountId: string;
    accountName: string;
    appName: string;
    billingAddressFormatted: string;
    billingAddressName: string;
    billingAddressPhone: string;
    catalogName: string;
    emailAddress: string;
    exchangeRate: string;
    licenseType: string;
    netPriceFormatted: string;
    orderDate: string;
    orderId: string;
    orderPaymentMethod: string;
    orderStatus: string;
    paymentTermDescription: string;
    productThumbnail: string;
    productType: string;
    taxAmountFormatted: string;
    taxId: string;
    totalFormatted: string;
};

export default function InvoicePaymentTemplate({
    accountId = '[%ACCOUNT_ID%]',
    accountName = '[%ACCOUNT_NAME%]',
    appName = '[%PRODUCT_NAME%]',
    billingAddressFormatted = '[%BILLING_ADDRESS_FORMATTED%]',
    billingAddressName = '[%BILLING_ADDRESS_NAME%]',
    billingAddressPhone = '[%BILLING_ADDRESS_PHONE%]',
    catalogName = '[%CATALOG_NAME%]',
    emailAddress = '[%EMAIL_ADDRESS%]',
    exchangeRate = '[%EXCHANGE_RATE%]',
    licenseType = '[%LICENSE_TYPE%]',
    netPriceFormatted = '[%SUBTOTAL_FORMATTED%]',
    orderDate = '[%ORDER_DATE%]',
    orderId = '[%ORDER_ID%]',
    orderPaymentMethod = '[%ORDER_PAYMENT_METHOD%]',
    orderStatus = '[%ORDER_STATUS%]',
    paymentTermDescription = '[%PAYMENT_TERM_DESCRIPTION%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
    productType = '[%PRODUCT_TYPE%]',
    taxAmountFormatted = '[%TAX_AMOUNT_FORMATTED%]',
    taxId = '[%TAX_ID%]',
    totalFormatted = '[%TOTAL_FORMATTED%]',
}: Props) {
    return (
        <Layout preview="New Order Placed">
            <Heading className="text-2xl font-semibold text-heading m-0 mb-6">
                New Order Placed
            </Heading>

            <Text className="text-base text-text m-0 mb-6">
                A new order has been successfully placed by the{' '}
                <span className="font-semibold">{accountName}</span>.<br />
                Below you can find the order and account details for Finance review and
                processing.
            </Text>

            <Text className="text-lg font-semibold text-heading m-0 mb-2 block">
                Order Details
            </Text>
            <Hr className="border-[#e2e2e4] my-2 mb-4" />

            <Text className="text-sm m-0">
                Order ID: <span className="font-semibold">{orderId}</span>
            </Text>
            <Text className="text-sm m-0">
                Order Date: <span className="font-semibold">{orderDate}</span>
            </Text>
            <Text className="text-sm m-0">
                Order Payment Method:{' '}
                <span className="font-semibold">{orderPaymentMethod}</span>
            </Text>
            <Text className="text-sm m-0 mb-4">
                Order Status: <span className="font-semibold">{orderStatus}</span>
            </Text>

            <Section className="mt-6 mb-8">
                <Row>
                    <Column width="56">
                        <Img
                            src={productThumbnail}
                            width="56"
                            height="56"
                            alt="App Icon"
                            className="rounded-lg block"
                        />
                    </Column>
                    <Column className="pl-3">
                        <Heading as="h2" className="text-lg text-heading m-0">
                            {appName}
                        </Heading>
                        <div className="mt-1">
                            <span className="text-sm text-text m-0">
                                {catalogName}
                            </span>
                            <span className="border border-[#2E5AAC] text-[#2E5AAC] rounded px-2 py-0.5 text-xs ml-2">
                                {productType}
                            </span>
                        </div>
                    </Column>
                </Row>
            </Section>

            <Text className="text-lg font-semibold text-heading m-0 mt-4 block">
                Order Summary
            </Text>
            <Hr className="border-[#e2e2e4] my-2 mb-4" />
            
            <Section>
            <Section
                className="text-heading text-base"
                align="left"
            >
                <Row>
                    <Column width="110" className="pr-4 pb-1 whitespace-nowrap" align="left">
                        Net Price:
                    </Column>
                    <Column width="100" align="right" className="font-semibold whitespace-nowrap pb-1">
                        {netPriceFormatted}
                    </Column>
                    <Column className="pl-2 pb-1 text-left"></Column>
                </Row>
                <Row>
                    <Column width="110" className="pr-4 pb-1 whitespace-nowrap" align="left">
                        VAT:
                    </Column>
                    <Column width="100" align="right" className="font-semibold pb-1">
                        {taxAmountFormatted}
                    </Column>
                    <Column className="pl-2 pb-1 text-left"></Column>
                </Row>
                <Row>
                    <Column width="110" className="pr-4 pb-1 whitespace-nowrap" align="left">
                        Total:
                    </Column>
                    <Column width="100" align="right" className="text-lg font-semibold pb-1">
                        {totalFormatted}
                    </Column>
                    <Column className="pl-2 pb-1 text-left">
                        <span className="bg-[#E6EBF5] text-[#1C3667] text-[11px] rounded px-2 py-0.5 whitespace-nowrap inline-block">
                            {licenseType}
                        </span>
                    </Column>
                </Row>
                <Row>
                    <Column width="110" className="pr-4 whitespace-nowrap" align="left">
                        Exchange Rate:
                    </Column>
                    <Column width="100" align="right" className="font-semibold">
                        {exchangeRate}
                    </Column>
                    <Column className="pl-2 text-left">
                        <span
                            title={`Exchange rate applied on ${orderDate}`}
                            className="border border-[#1C3667] text-[#1C3667] rounded-full text-[13px] font-semibold w-4 h-4 text-center inline-block cursor-help"
                        >
                            ?
                        </span>
                    </Column>
                </Row>
            </Section>

            </Section>

            <Text className="text-lg font-semibold text-heading m-0 mt-4 block">
                Account Details
            </Text>
            <Hr className="border-[#e2e2e4] my-2 mb-4" />


            <Text className="text-heading text-base m-0">
                Account Name: <span className="font-semibold">{accountName}</span>
            </Text>
            <Text className="text-heading text-base m-0">
                Account ID: <span className="font-semibold">{accountId}</span>
            </Text>
            <Text className="text-heading text-base m-0">
                Tax/VAT ID: <span className="font-semibold">{taxId}</span>
            </Text>
            <Text className="text-heading text-base m-0">
                Payment Terms:{' '}
                <span className="font-semibold">{paymentTermDescription}</span>
            </Text> 

            <Text className="text-lg font-semibold text-heading m-0 mt-6 block">
                Billing Address
            </Text>
            <Hr className="border-[#e2e2e4] my-2 mb-4" />

            <Text className="text-base font-semibold text-heading m-0 block">
                {billingAddressName}
            </Text>
            <Text className="text-base text-text m-0 mb-4">
                {billingAddressFormatted}
            </Text>

            <Text className="text-lg font-semibold text-heading m-0 mt-0 block">
                Billing Contact
            </Text>
            <Hr className="border-[#e2e2e4] my-2 mb-4" />

            <Text className="text-heading text-base m-0">
                Contact Person:{' '}
                <span className="font-semibold">{billingAddressName}</span>
            </Text>
            <Text className="text-heading text-base m-0">
                E-mail: <span className="font-semibold">{emailAddress}</span>
            </Text>
            <Text className="text-heading text-base m-0 mb-4">
                Phone Number:{' '}
                <span className="font-semibold">{billingAddressPhone}</span>
            </Text>
        </Layout>
    );
}

InvoicePaymentTemplate.PreviewProps = {
    accountId: '12345',
    accountName: 'Liferay',
    appName: 'Liferay',
    billingAddressFormatted: '123 Main St, Los Angeles, CA 90001',
    billingAddressName: 'John Doe',
    billingAddressPhone: '123-456-7890',
    catalogName: 'Liferay, Inc.',
    emailAddress: 'test@liferay.com',
    exchangeRate: '1.0',
    licenseType: 'Enterprise',
    netPriceFormatted: '$100.00',
    orderDate: '2023-01-01',
    orderId: '123456789',
    orderPaymentMethod: 'Credit Card',
    orderStatus: 'Completed',
    paymentTermDescription: 'Net 30',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    productType: 'SaaS',
    taxAmountFormatted: '$10.00',
    taxId: '123456789',
    totalFormatted: '$110.00',
} as Props;
