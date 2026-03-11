import { OrderCustomFields, OrderTypes } from "../../../enums/Order";
import { Liferay } from "../../../liferay/liferay";
import zodSchema from "../../../schema/zod";
import dxpFreeLicensingOAuth2 from "../../../services/oauth/DXPFreeLicensing";
import HeadlessDXPFreeRequest from "../../../services/rest/HeadlessDXPFreeRequest";
import { getSiteURL } from "../../../utils/site";


import ProductPurchase from "./ProductPurchase";
import { z } from "zod";

type DXPFreeForm = z.infer<typeof zodSchema.dxpFree>

export default class ProductPurchaseDXPFree extends ProductPurchase {
    private form?: DXPFreeForm;
    protected orderTypeExternalReferenceCode = OrderTypes.DXP;

    setForm(form: DXPFreeForm) {
        this.form = form;
    }

    protected getCart() {
        const baseCart = super.getCart();
        const cartItems = super.getCartItems();

        return {
            ...baseCart,
            cartItems,
            customFields: {
                ...baseCart?.customFields,
                [OrderCustomFields.ORDER_METADATA]: JSON.stringify({
                    ...baseCart?.customFields?.[OrderCustomFields.ORDER_METADATA],
                    ...this.form,
                }),
            },
        } as Cart;
    }

    public async createOrder() {
        if (!this.form) {
            throw new Error('Form is missing.');
        }

        const cart = this.getCart();

        const order = await super.createOrder(cart);

        const dxpFreeRequest = await HeadlessDXPFreeRequest.createDXPFree({
            "businessEmail": this.form.businessEmail,
            "companyName": this.form.companyName,
            "country": this.form.country,
            "domain": this.form.domain,
            "extension": this.form.extension,
            "fullName": this.form.fullname,
            "intlCode": this.form.intlCode.code,
            "jobTitle": this.form.jobTitle,
            "notifyMe": this.form.notifyMeAboutProducts,
            "phoneNumber": this.form.phoneNumber,
            "purpose": this.form.purpose,
            "purposeOther": this.form.purposeOther,
            "r_orderToDXPFreeRequest_commerceOrderId": order.id
        })

        await dxpFreeLicensingOAuth2.createDXPFreeLicenseKey({
            "assetReceiptLicenseUuid": order.id,
            "domains": this.form.domain,
            "owner": Liferay.ThemeDisplay.getUserEmailAddress(),
        })

        return order;
    }

    public async getNextStepsLink(cart: Cart) {
        if (cart.orderTypeExternalReferenceCode !== OrderTypes.DXP) {
            return super.getNextStepsLink(cart);
        }

        return `${window.location.origin}${getSiteURL()}/customer-dashboard#/products/${cart.id}/activation-keys?next-steps`;
    }
}