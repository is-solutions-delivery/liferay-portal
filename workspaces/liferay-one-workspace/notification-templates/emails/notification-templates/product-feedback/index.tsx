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

type Props = {
    catalogName: string;
    emailBody: string;
    livePreview: boolean;
    marketplaceHost: string;
    orderId: string;
    productName: string;
    productThumbnail: string;
    productType: string;
};

export default function ProductFeedback({
    catalogName = '[%CATALOG_NAME%]',
    emailBody = '[%EMAIL_BODY%]',
    livePreview = false,
    marketplaceHost = '[%MARKETPLACE_HOST%]',
    orderId = '[%ORDER_ID%]',
    productName = '[%PRODUCT_NAME%]',
    productThumbnail = '[%PRODUCT_THUMBNAIL%]',
    productType = '[%PRODUCT_TYPE%]',
}: Props) {
    return (
        <Layout preview="Your Opinion Matters">
            <Heading className="text-[32px] font-bold text-heading mb-6 text-left">
                Your Opinion Matters!
            </Heading>

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
                            <Column
                                style={{
                                    display: 'inline-block',
                                    width: 'auto',
                                }}
                            >
                                <Text className="text-[23px] font-semibold text-heading m-0">
                                    {productName}
                                </Text>
                            </Column>

                            <Column
                                style={{
                                    display: 'inline-block',
                                    width: 'auto',
                                    paddingTop: '0',
                                    paddingLeft: '12px',
                                }}
                            >
                                <Text className="text-[13px] text-[#166E9E] font-semibold text-center rounded bg-[#D1ECFA] px-[8px] py-[4px] m-0">
                                    {productType}
                                </Text>
                            </Column>
                        </Row>
                        <Text className="text-base text-text m-0 pr-4">
                            {catalogName}
                        </Text>
                    </Column>
                </Row>
            </Section>

            <Section className="mb-4 text-base text-text">
                {livePreview ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: emailBody,
                        }}
                    />
                ) : (
                    emailBody
                )}
            </Section>

            <Section className="mb-6">
                <Link
                    href={`${marketplaceHost}/product-feedback?orderId=${orderId}`}
                    className="bg-primary text-white font-semibold py-2 px-4 rounded-lg text-base no-underline inline-block"
                >
                    Share Beta Feedback
                </Link>
            </Section>
        </Layout>
    );
}

ProductFeedback.PreviewProps = {
    catalogName: 'Liferay, Inc.',
    emailBody: `<p>It has been a few weeks since you started using <b>CMP Beta</b>
                    via the Marketplace. We hope it's helping you
                    streamline your Liferay operations. Could you spare 
                    <b>5 minutes</b> to let us know how we're doing?</p>`,
    livePreview: true,
    marketplaceHost: 'https://marketplace-uat.liferay.com',
    orderId: '42168052',
    productName: 'Content Marketing Platform',
    productThumbnail: 'https://marketplace.liferay.com/documents/d/marketplace/liferay-logo-28',
    productType: 'Beta',
} as Props;
