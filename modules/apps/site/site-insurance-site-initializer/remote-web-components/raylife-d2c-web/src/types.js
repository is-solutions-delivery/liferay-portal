/**
 * @typedef {{
 *  streetNumber: string
 *  street: string
 *  city: string
 *  state: string
 *  country: string
 *  zip: string
 * }} Address
 */

/**
 * @typedef {{
 * categoryId: string
 * titleCurrentValue: string
 * descriptionCurrentValue: string
 * parentCategoryId: string
 * }} AssetCategoryResponse
 */

/**
 * @typedef {{
 * key: string
 * value: string
 * }} CategoryPropertyResponse
 */

/**
 * @typedef {{
 * id: string
 * title: string
 * description: string
 * }} BusinessType
 */

/**
 * @typedef {{
 * firstName: string
 * lastName: string
 * phone: string
 * website: string
 * address: string
 * addressApt: string
 * city: string
 * state: string
 * zip: string
 * }} BasicsFormApplicationRequest
 */

/**
 * @typedef {{
 * businessSearch: string
 * businessCategoryId: string
 * businessClassCode: string
 * businessInformation: {
 *  firstName: string
 *  lastName: string
 *  business: {
 *    email: string
 *    website: string
 *    phone: string
 *    location: {
 *      address: string
 *      addressApt: string
 *      city: string
 *      state: string
 *      zip: string
 *    }
 *  }
 * }
 * }} BasicsForm
 */

/**
 * @typedef {{
 * id: string
 * title: string
 * period: string
 * description: string
 * }} ProductQuote
 */
