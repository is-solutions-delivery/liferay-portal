import '../../types';
import {toSlug} from '../../utils';
import {allowedProductQuote} from '../../utils/webContents';

/**
 * @param {AssetCategoryResponse[]}  data Array of matched categories
 * @returns {BusinessType[]} Array of business types
 */
const adaptToBusinessType = (data = []) =>
	data.map(({categoryId, titleCurrentValue, descriptionCurrentValue}) => ({
		description: descriptionCurrentValue,
		id: categoryId,
		title: titleCurrentValue,
	}));

/**
 * @param {DataForm}  data Basics form object
 * @returns {BasicsFormApplicationRequest} Basics Form ready for application request
 */
const adaptToFormApplicationRequest = (form) => ({
	address: form?.basics?.businessInformation?.business?.location?.address,
	addressApt:
		form?.basics?.businessInformation?.business?.location?.addressApt,
	city: form?.basics?.businessInformation?.business?.location?.city,
	state: form?.basics?.businessInformation?.business?.location?.state,
	zip: form?.basics?.businessInformation?.business?.location?.zip,
	firstName: form?.basics?.businessInformation?.firstName,
	lastName: form?.basics?.businessInformation?.lastName,
	email: form?.basics?.businessInformation?.business?.email,
	phone: form?.basics?.businessInformation?.business?.phone,
	website: form?.basics?.businessInformation?.business?.website,

	hasAutoPolicy: form?.business?.hasAutoPolicy,
	hasSellProductsUnderOwnBrand: form?.business?.hasSellProductsUnderOwnBrand,
	hasStoredCustomerInformation: form?.business?.hasStoredCustomerInformation,
	legalEntity: form?.business?.legalEntity,
	overallSales: form?.business?.overallSales,
	salesMerchandise: form?.business?.salesMerchandise,
	yearsOfExperience: form?.business?.yearsOfExperience,

	annualPayrollForEmployees: form?.employees?.annualPayrollForEmployees,
	annualPayrollForOwner: form?.employees?.annualPayrollForOwner,
	businessOperatesYearRound: form?.employees?.businessOperatesYearRound,
	estimatedAnnualGrossRevenue: form?.employees?.estimatedAnnualGrossRevenue,
	fein: form?.employees?.fein,
	hasFein: form?.employees?.hasFein,
	partTimeEmployees: form?.employees?.partTimeEmployees,
	startBusinessAtYear: form?.employees?.startBusinessAtYear,

	buildingSquareFeetOccupied: form?.property?.buildingSquareFeetOccupied,
	doOwnBuildingAtAddress: form?.property?.doOwnBuildingAtAddress,
	isPrimaryBusinessLocation: form?.property?.isPrimaryBusinessLocation,
	isThereDivingBoards: form?.property?.isThereDivingBoards,
	isThereSwimming: form?.property?.isThereSwimming,
	stories: form?.property?.stories,
	totalBuildingSquareFeet: form?.property?.totalBuildingSquareFeet,
	yearBuilding: form?.property?.yearBuilding,
});

/**
 * @param {{
 *    name: {
 *      en_US: string
 *    }
 *    description: {
 *      en_US: string
 *    }
 *    skus: {
 *      price: number
 *      promoPrice: number
 *    }[]
 * }[]}  data Array of products
 * @returns {ProductQuote[]} Array of business types
 */
const adaptToProductQuote = (data = []) =>
	data.map(({productId, name, description, skus}) => ({
		id: productId,
		title: name.en_US,
		description: description.en_US,
		period: `($${skus[0].promoPrice
			.toFixed(2)
			.toString()}-${skus[0].price.toFixed(2).toString()}/mo)`,
		template: {
			name: toSlug(name.en_US),
			allowed: allowedProductQuote(name.en_US),
		},
	}));

export const LiferayAdapt = {
	adaptToBusinessType,
	adaptToProductQuote,
	adaptToFormApplicationRequest,
};
