import "../../types";
import Axios from "axios";
import Cookies from "js-cookie";
import { LiferayAdapt } from "./adapter";

const {
  REACT_APP_LIFERAY_API = "",
  REACT_APP_LIFERAY_AUTH_USERNAME = "",
  REACT_APP_LIFERAY_AUTH_PASSWORD = "",
} = process.env;

/**
 * @param {BasicsForm}  data Basics form object
 * @returns {Promise<number>}  Status code
 */
const createBasicsApplication = async (data) => {
  const payload = LiferayAdapt.adaptToBasicsFormApplicationRequest(data);
  return await _postBasicsFormApplication(payload);
};

/**
 * @param {string} filter - Search string used to filter the results
 * @returns {Promise<BusinessType[]>} Filtered Array of business types
 */
const getBusinessTypes = async (filter = "") => {
  if (!filter.length) return [];

  const normalizedFilter = filter.toLowerCase().replace(/\\/g, "");

  const parentId = Cookies.get("CATEGORY_PARENT_ID");

  const assetCategories = await _getAssetCategoriesByParentId(parentId);

  const filteredBusinessTypes = LiferayAdapt.adaptToBusinessType(
    assetCategories
  ).filter(
    ({ title, description }) =>
      title.toLowerCase().match(normalizedFilter) ||
      description.toLowerCase().match(normalizedFilter)
  );

  return filteredBusinessTypes;
};

/**
 * @param {string} categoryId - Asset Category Id
 * @returns {Promise<number>} Business Class Code
 */
const getBusinessClassCode = async (categoryId) => {
  const categoryProperties = await _getCategoryProperties(categoryId);

  const businessClassCode = categoryProperties.find(({ key }) => key === "BCC");

  return businessClassCode.value;
};

/**
 * @returns {string} Liferay Group Id
 */
const getLiferayGroupId = () => {
  try {
    // eslint-disable-next-line no-undef
    const groupId = Liferay.ThemeDisplay.getSiteGroupId();
    return groupId;
  } catch (error) {
    console.warn("Not able to find Liferay Group Id\n", error);
    return "";
  }
};

/**
 * @returns {string} Liferay Authentication Token
 */
const getLiferayAuthenticationToken = () => {
  try {
    // eslint-disable-next-line no-undef
    const token = Liferay.authToken;
    return token;
  } catch (error) {
    console.warn("Not able to find Liferay auth token\n", error);
    return "";
  }
};

/**
 * @param {string} id - Parent category Id of asset categories
 * @returns {Promise<AssetCategoryResponse[]>}  Array of matched categories
 */
const _getAssetCategoriesByParentId = async (id) => {
  const {
    data: { categories },
  } = await LiferayAPI.get(
    "/api/jsonws/assetcategory/search-categories-display",
    {
      params: {
        groupIds: getLiferayGroupId(),
        parentCategoryIds: id,
        title: "",
        vocabularyIds: "",
        start: 0,
        end: 50,
      },
    }
  );

  return categories;
};

/**
 * @param {string} id - Parent category Id of asset categories
 * @returns {Promise<CategoryPropertyResponse[]>}  Array of matched categories
 */
const _getCategoryProperties = async (id) => {
  const { data } = await LiferayAPI.get(
    "/api/jsonws/assetcategoryproperty/get-category-properties",
    {
      params: {
        entryId: id,
      },
    }
  );

  return data;
};

/**
 * @param {BasicsFormApplicationRequest} payload - Payload used to create the application
 * @returns {Promise<number>}  Status code
 */
const _postBasicsFormApplication = async (payload) => {
  const { status } = await LiferayAPI.post("/o/raylifeapplications", payload);
  return status;
};

const LiferayAPI = Axios.create({
  baseURL: REACT_APP_LIFERAY_API,
  auth: {
    username: REACT_APP_LIFERAY_AUTH_USERNAME,
    password: REACT_APP_LIFERAY_AUTH_PASSWORD,
  },
  headers: {
    "x-csrf-token": getLiferayAuthenticationToken(),
  },
});

export const LiferayService = {
  LiferayAPI,
  createBasicsApplication,
  getBusinessTypes,
  getLiferayAuthenticationToken,
  getLiferayGroupId,
  getBusinessClassCode,
};
