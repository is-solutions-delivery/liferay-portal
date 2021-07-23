import "../../types";
/**
 * @param {AssetCategoryResponse[]}  data Array of matched categories
 * @returns {BusinessType[]} Array of business types
 */
const adaptToBusinessType = (data = []) =>
  data.map(({ categoryId, titleCurrentValue, descriptionCurrentValue }) => ({
    id: categoryId,
    title: titleCurrentValue,
    description: descriptionCurrentValue,
  }));

/**
 * @param {BasicsForm}  data Basics form object
 * @returns {BasicsFormApplicationRequest} Basics Form ready for application request
 */
const adaptToBasicsFormApplicationRequest = ({ businessInformation }) => ({
  address: businessInformation.business.location.address,
  addressApt: businessInformation.business.location.addressApt,
  city: businessInformation.business.location.city,
  state: businessInformation.business.location.state,
  zip: businessInformation.business.location.zip,
  firstName: businessInformation.firstName,
  lastName: businessInformation.lastName,
  email: businessInformation.business.email,
  phone: businessInformation.business.phone,
  website: businessInformation.business.website,
});

export const LiferayAdapt = {
  adaptToBusinessType,
  adaptToBasicsFormApplicationRequest,
};
