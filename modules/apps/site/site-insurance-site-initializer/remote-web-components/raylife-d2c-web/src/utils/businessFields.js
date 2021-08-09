export const BCC_ALLOWED = {
    PERCENT_SALES: ["750", "1349"],
    OWN_BRAND_LABEL: ["750", "1280", "1349"]
}
export const SEGMENT_ALLOWED = {
    OVERALL_SALES: ["Retail"]
}

export const businessTotalFields = (properties) => {
    let fieldCount = 4;

    if (BCC_ALLOWED.OWN_BRAND_LABEL.includes(properties?.businessClassCode)) fieldCount++;
    if (BCC_ALLOWED.PERCENT_SALES.includes(properties?.businessClassCode)) fieldCount++;
    if (SEGMENT_ALLOWED.OVERALL_SALES.includes(properties?.segment)) fieldCount++;

    return fieldCount;
}

export const validatePercentSales = (bcc) => BCC_ALLOWED.PERCENT_SALES.includes(bcc);
export const validateOwnBrandLabel = (bcc) => BCC_ALLOWED.OWN_BRAND_LABEL.includes(bcc);
export const validateOverallSales = (segment) => SEGMENT_ALLOWED.OVERALL_SALES.includes(segment);