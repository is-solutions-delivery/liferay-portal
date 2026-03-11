import { useForm } from "react-hook-form";
import ProductPurchase from "../../../../components/ProductPurchase";
import i18n from "../../../../i18n";
import { zodResolver } from "@hookform/resolvers/zod";
import zodSchema, { z } from "../../../../schema/zod";
import { Input } from "../../../../components/Input/Input";
import ClayForm, { ClayCheckbox, ClayInput, ClaySelect } from "@clayui/form";
import Button from "@clayui/button";
import { useProductPurchaseOutletContext } from "../../ProductPurchaseOutlet";
import DropDown from "@clayui/drop-down";
import ClayIcon from '@clayui/icon';
import { useState } from "react";
import { phones } from "../../../../utils/phones";
import ProductPurchaseDXPFree from "../../services/ProductPurchaseDXPFree";
import classNames from "classnames";
import ClayDropDown, { Align } from '@clayui/drop-down';

import ClayLoadingIndicator from '@clayui/loading-indicator';

import ClayButton from '@clayui/button';

import './DXPFreeForm.scss';

const PURPOSE_OPTIONS = [
    {
        subtitle: 'For students or individuals upskilling.',
        title: 'Personal Learning / Education',
        value: 'personal-learning-education',
    },
    {
        subtitle: 'Testing for a specific project at work..',
        title: 'Proof of Concept (POC)',
        value: 'proof-of-concept',
    },
    {
        subtitle: 'Developers building or debugging integrations.',
        title: 'Development & Testing',
        value: 'development-and-testing',
    },
    {
        subtitle: 'For non-production hobbyist tools within a company.',
        title: 'Internal Side Project',
        value: 'internal-side-project',
    },
    {
        subtitle: 'For professional firms or small companies.',
        title: 'Small Business Production Use',
        value: 'small-business-production',
    },
    {
        subtitle: '',
        title: 'Other (Please Specify)',
        value: 'other',
    },
];

const DXPFree = () => {
    const {
        selectedAccount,
        handlePurchase,
        product
    } = useProductPurchaseOutletContext();

    const { formState: { errors }, handleSubmit, register, setValue, trigger, watch } =
        useForm<z.infer<typeof zodSchema.dxpFree>>({
            defaultValues: {
                businessEmail: '',
                companyName: '',
                country: '',
                domain: '',
                extension: '',
                fullname: '',
                intlCode: { code: '+1', flag: 'en-us' },
                jobTitle: '',
                notifyMeAboutProducts: false,
                phoneNumber: '',
                purpose: '',
                purposeOther: '',
                termsAndConditions: false,
                userAgreement: false,
            },
            mode: 'all',
            reValidateMode: 'onChange',
            resolver: zodResolver(zodSchema.dxpFree),
        });

    const { notifyMeAboutProducts, termsAndConditions, userAgreement, intlCode, purpose } = watch();
    const [currentPhonesFlags, setCurrentPhonesFlags] = useState(intlCode);
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: z.infer<typeof zodSchema.dxpFree>) => {
        setLoading(true);

        const productPurchaseDXPFree = new ProductPurchaseDXPFree(selectedAccount, product);
        productPurchaseDXPFree.setForm(data);

        await handlePurchase(productPurchaseDXPFree);

        setLoading(false);
    }

    return <ProductPurchase.Shell
        footerProps={{
            continueButtonProps: {
                hidden: true,
            },
            cancelButtonProps: {
                hidden: true,
            },
            backButtonProps: {
                hidden: true,
            },
        }}
        title={i18n.translate('activation-key-creation')}
    >
        <div className="dxp-free-form ">
            <p className="mb-6 text-black-50">
                {i18n.translate('to-generate-your-unique-activation-key-file-and-access-the-download-please-complete-your-profile-details-below-tell-us-a-bit-about-your-intended-use-to-help-us-support-your-experience')}
            </p>

            <p className="h3 mb-0">
                {i18n.translate('personal-information-and-purpose')}
            </p>

            <hr className="mb-5 mt-3" />

            <form>
                <ClayForm.Group>
                    <ClayInput.Group>
                        <ClayInput.GroupItem>
                            <Input
                                {...register('fullname')}
                                className="w-100"
                                errorMessage={errors.fullname?.message}
                                label={i18n.translate('full-name')}
                                placeholder={i18n.translate('enter-your-full-name')}
                                required
                            />
                        </ClayInput.GroupItem>
                    </ClayInput.Group>

                    <ClayInput.Group>
                        <ClayInput.GroupItem>
                            <Input
                                {...register('businessEmail')}
                                className="w-100"
                                errorMessage={errors.businessEmail?.message}
                                id="businessEmail"
                                label={i18n.translate('business-email')}
                                placeholder={i18n.translate('enter-your-business-email')}
                                required
                            />
                        </ClayInput.GroupItem>
                        <ClayInput.GroupItem>
                            <Input
                                {...register('country')}
                                className="w-100"
                                errorMessage={errors.country?.message}
                                id="country"
                                label={i18n.translate('country')}
                                placeholder={i18n.translate('enter-your-country')}
                                required
                            />
                        </ClayInput.GroupItem>
                    </ClayInput.Group>

                    <ClayInput.Group>
                        <ClayInput.GroupItem>
                            <Input
                                {...register('jobTitle')}
                                className="w-100"
                                errorMessage={errors.jobTitle?.message}
                                id="jobTitle"
                                label={i18n.translate('job-title')}
                                placeholder={i18n.translate('enter-your-job-title')}
                            />
                        </ClayInput.GroupItem>
                        <ClayInput.GroupItem>
                            <Input
                                {...register('companyName')}
                                className="w-100"
                                errorMessage={errors.companyName?.message}
                                id="companyName"
                                label={i18n.translate('company-name')}
                                placeholder={i18n.translate('enter-your-company-name')}
                            />
                        </ClayInput.GroupItem>
                    </ClayInput.Group>

                    <p className="h3">{i18n.translate('phone')}</p>
                    <ClayForm.Group>
                        <div className="d-flex justify-content-between purchased-solutions-phone">
                            <div className="col-3 p-0">
                                <DropDown
                                    closeOnClick
                                    tabIndex={0}
                                    trigger={
                                        <div className="align-items-center custom-input custom-select d-flex form-control p-2 rounded-xs">
                                            <ClayIcon
                                                className="mr-2"
                                                symbol={
                                                    currentPhonesFlags?.flag as string
                                                }
                                            />

                                            {currentPhonesFlags?.code}
                                        </div>
                                    }
                                >
                                    <DropDown.ItemList items={phones as any}>
                                        {(item) => {
                                            const phone = item as any;

                                            return (
                                                <DropDown.Item
                                                    onClick={() => {
                                                        setCurrentPhonesFlags({
                                                            code: phone.code,
                                                            flag: phone.flag,
                                                        });

                                                        setValue('intlCode', {
                                                            code: phone.code,
                                                            flag: phone.flag
                                                        });
                                                    }}
                                                >
                                                    <ClayIcon
                                                        className="mr-2"
                                                        symbol={phone.flag}
                                                    />

                                                    {phone.code}
                                                </DropDown.Item>
                                            );
                                        }}
                                    </DropDown.ItemList>
                                </DropDown>

                                <div className="form-feedback-group">
                                    <div className="form-text">
                                        {i18n.translate('intl-code')}
                                    </div>
                                </div>
                            </div>

                            <div className="col-6">
                                <Input
                                    {...register('phoneNumber')}
                                    className="w-100"
                                    helpMessage={i18n.translate('phone-number')}
                                    id="phoneNumber"
                                    placeholder={"___–___–____"}
                                />
                            </div>

                            <div className="col-3 p-0">
                                <Input
                                    {...register('extension')}
                                    className="w-100 text-nowrap"
                                    helpMessage={`${i18n.translate('extension')} (optional)`}
                                    id="extension"
                                    placeholder="Enter +ext"
                                />
                            </div>
                        </div>
                    </ClayForm.Group>

                    <p className="h3">{i18n.translate('purpose')}</p>
                    <ClayInput.Group>
                        <ClayInput.GroupItem>

                            <div className="provide-app-build-page-cloud-compatible-container w-100">
                                <ClayDropDown
                                    active={
                                        active
                                    }
                                    alignmentPosition={Align.BottomLeft}
                                    className="app-type-dropdown w-100"
                                    onActiveChange={setActive}
                                    trigger={
                                        <ClayButton
                                            className="align-items-center app-type-dropdown d-flex dxp-free-form-select-input justify-content-between rounded-lg w-100"
                                            displayType="secondary"
                                            onClick={() => setActive(!active)}
                                        >
                                            <div className="align-items-center d-flex justify-content-between w-100">
                                                <span>{
                                                    PURPOSE_OPTIONS.find(item => item.value === purpose)?.title
                                                }</span>

                                                <ClayIcon symbol="caret-bottom" />
                                            </div>
                                        </ClayButton>
                                    }
                                >
                                    <ClayDropDown.ItemList className="app-type-list-unstyled">
                                        {PURPOSE_OPTIONS.map(
                                            (option, index) => (
                                                <ClayDropDown.Item
                                                    key={index}
                                                    onClick={() => {
                                                        setActive(false);

                                                        setValue('purpose', option.value);
                                                    }}
                                                >
                                                    <span className="d-flex flex-column">
                                                        <strong>{option.title}</strong>
                                                        <span>{option.subtitle}</span>
                                                    </span>
                                                </ClayDropDown.Item>
                                            )
                                        )}
                                    </ClayDropDown.ItemList>
                                </ClayDropDown>
                            </div>
                        </ClayInput.GroupItem>
                    </ClayInput.Group>

                    {
                        purpose === 'other' && (<ClayInput.Group>
                            <ClayInput.GroupItem>
                                <div className="mt-5 provide-app-build-page-cloud-compatible-container w-100">
                                    <textarea className="w-100 rounded-lg custom-input dxp-free-form-textarea" {...register('purposeOther')} />
                                </div>
                            </ClayInput.GroupItem>
                        </ClayInput.Group>)
                    }

                    <ClayInput.Group>
                        <ClayInput.GroupItem>
                            <label
                                className="align-items-center d-flex flex-row font-weight-normal justify-content-between"
                                style={{ cursor: 'pointer', marginTop: '10px' }}
                            >
                                <ClayCheckbox
                                    checked={notifyMeAboutProducts}
                                    onChange={(e) => {
                                        setValue('notifyMeAboutProducts', e.target.checked);
                                    }}
                                    onError={(e) => console.log(e)}
                                />
                                <p className="mb-1 ml-2 dxp-free-form-notify-me-check-box w-100">
                                    {i18n.translate("notify-me-about-products-services-and-events")}
                                </p>
                            </label>
                        </ClayInput.GroupItem>
                    </ClayInput.Group>

                    <span>
                        <p className="mb-6 dxp-free-form-purpose-helper-text">You can stop receiving marketing emails by clicking the unsubscribe link in each email or withdraw your consent at any time by either using opt-out functionality accessible through the messages you receive or via email to
                            <a className="ml-1" href="https://www.liferay.com/privacy-policy">dataprotection@liferay.com</a>. See <a href="https://www.liferay.com/privacy-policy">privacy policy</a> for details.
                        </p>

                    </span>

                    <p className="h3">{i18n.translate('activation-key-server-details')}</p>

                    <hr className="mb-5 mt-3" />

                    <ClayInput.Group>
                        <ClayInput.GroupItem>
                            <Input
                                {...register('domain')}
                                className="w-100"
                                errorMessage={errors.domain?.message}
                                helpMessage={i18n.translate("input-one-domain-name-per-instance")}
                                label={i18n.translate('domain')}
                                placeholder={i18n.translate("enter-domain-here")}
                                required
                            />

                        </ClayInput.GroupItem>
                    </ClayInput.Group>

                    <p className="dxp-free-form-aggreements-text">
                        <span>
                            Your use of Liferay DXP is subject to these terms and the Liferay End User License Agreement set forth at
                        </span>

                        <a className="ml-1" href="https://www.liferay.com/documents/d/guest/Liferay-EULA-2102602_GL">https://www.liferay.com/documents/d/guest/Liferay-EULA-2102602_GL</a>

                        <span className="ml-1">
                            (these terms and the eula together form the "agreement"). Please read these terms and the Liferay End User License Agreement carefully before accessing, downloading, installing or in any way using the software. By clicking your assent or accessing, downloading, installing or in any way using the software, you signify your assent to and acceptance of the agreement and acknowledge that you have read and you understand terms of the agreement. If you are an individual acting on behalf of an entity, you represent that you have the authority to enter into this agreement on behalf of that entity. If you do not accept the terms of this agreement, then you must not access, download, install or in any way use the software. I have read and agree to all the terms and conditions below (check all boxes).
                        </span>
                    </p>

                    <ClayForm.Group>
                        <ClayInput.GroupItem className="w-100">
                            <label className="d-flex font-weight-normal w-100" style={{ cursor: 'pointer' }}>
                                <ClayCheckbox
                                    checked={termsAndConditions}
                                    className="dxp-free-form-fail"
                                    onChange={(e) => {
                                        setValue('termsAndConditions', e.target.checked);
                                    }}
                                    required
                                />
                                <span className="align-items-center d-flex dxp-free-form-aggreements-check-box mb-0 ml-2 justify-content-center">
                                    <p className={classNames("align-items-center d-flex justify-content-center mb-1", {
                                        "text-red": errors.termsAndConditions?.message
                                    })}>
                                        {i18n.translate('i-have-read-and-agree-to-the-terms-and-conditions-above')}
                                    </p>
                                    <p className="align-items-center d-flex font-weight-bold justify-content-center mb-1 text-red">*</p>
                                </span>
                            </label>
                            <label className="d-flex font-weight-normal" style={{ cursor: 'pointer' }}>
                                <ClayCheckbox
                                    checked={userAgreement}
                                    onChange={(e) => {
                                        setValue('userAgreement', e.target.checked);
                                    }}
                                    required
                                />
                                <span className="align-items-center d-flex dxp-free-form-aggreements-check-box justify-content-center mb-0 ml-2 " >
                                    <p className={classNames("align-items-center d-flex justify-content-center mb-1", {
                                        "text-red": errors.userAgreement?.message
                                    })}>
                                        {i18n.translate('i-have-read-and-agree-to-the-liferay-end-user-agreement')}

                                        <a
                                            className="ml-1"
                                            href="seu-link-aqui"
                                            onClick={(e) => e.stopPropagation()}
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            {i18n.translate('liferay-end-user-agreement')}
                                        </a>
                                    </p>
                                    <p className="align-items-center d-flex font-weight-bold justify-content-center mb-1 text-red">*</p>
                                </span>
                            </label>
                        </ClayInput.GroupItem>
                    </ClayForm.Group>
                </ClayForm.Group>

                <ClayForm.Group>
                    <ClayInput.Group>
                        <ClayInput.GroupItem>
                            <Button className="w-100" onClick={handleSubmit(onSubmit)} disabled={loading}>
                                <div className="align-items-center d-flex justify-content-center">
                                    <span>
                                        {i18n.translate('get-activation-key')}
                                    </span>
                                    <span className=" dxp-free-form-loading ml-3">
                                        {loading && <ClayLoadingIndicator />}
                                    </span>
                                </div>
                            </Button>
                        </ClayInput.GroupItem>
                    </ClayInput.Group>
                </ClayForm.Group>
            </form>
        </div>
    </ProductPurchase.Shell>;
};

export default DXPFree;