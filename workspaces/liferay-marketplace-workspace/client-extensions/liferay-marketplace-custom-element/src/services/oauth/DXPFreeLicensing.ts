import { MarketplaceSpringBootOAuth2 } from "./OAuth2Client";

class DXPFreeLicensingOAuth2 extends MarketplaceSpringBootOAuth2 {
    async createDXPFreeLicenseKey(payload: any) {
        return this.post<Response>('/license-key-type-free', payload, {
            earlyReturn: false,
        });
    }

    async getDXPFreeLicenseKey(licenseKeyId: string) {
        return this.get<any>(`/license-key/${licenseKeyId}`, {
            earlyReturn: true,
        });
    }

    async renewDXPFreeLicenseKey(licenseKey: string) {
        return this.post<any>(`/license-key-type-free/${licenseKey}/renew`, {
            earlyReturn: true,
        });
    }
}

const dxpFreeLicensingOAuth2 = new DXPFreeLicensingOAuth2('/provisioning');

export default dxpFreeLicensingOAuth2;


