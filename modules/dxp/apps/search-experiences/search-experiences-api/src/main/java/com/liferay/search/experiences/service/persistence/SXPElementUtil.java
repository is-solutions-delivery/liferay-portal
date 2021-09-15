/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 *
 *
 *
 */

package com.liferay.search.experiences.service.persistence;

import com.liferay.portal.kernel.dao.orm.DynamicQuery;
import com.liferay.portal.kernel.service.ServiceContext;
import com.liferay.portal.kernel.util.OrderByComparator;
import com.liferay.search.experiences.model.SXPElement;

import java.io.Serializable;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.osgi.framework.Bundle;
import org.osgi.framework.FrameworkUtil;
import org.osgi.util.tracker.ServiceTracker;

/**
 * The persistence utility for the sxp element service. This utility wraps <code>com.liferay.search.experiences.service.persistence.impl.SXPElementPersistenceImpl</code> and provides direct access to the database for CRUD operations. This utility should only be used by the service layer, as it must operate within a transaction. Never access this utility in a JSP, controller, model, or other front-end class.
 *
 * <p>
 * Caching information and settings can be found in <code>portal.properties</code>
 * </p>
 *
 * @author Brian Wing Shun Chan
 * @see SXPElementPersistence
 * @generated
 */
public class SXPElementUtil {

	/*
	 * NOTE FOR DEVELOPERS:
	 *
	 * Never modify this class directly. Modify <code>service.xml</code> and rerun ServiceBuilder to regenerate this class.
	 */

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#clearCache()
	 */
	public static void clearCache() {
		getPersistence().clearCache();
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#clearCache(com.liferay.portal.kernel.model.BaseModel)
	 */
	public static void clearCache(SXPElement sxpElement) {
		getPersistence().clearCache(sxpElement);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#countWithDynamicQuery(DynamicQuery)
	 */
	public static long countWithDynamicQuery(DynamicQuery dynamicQuery) {
		return getPersistence().countWithDynamicQuery(dynamicQuery);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#fetchByPrimaryKeys(Set)
	 */
	public static Map<Serializable, SXPElement> fetchByPrimaryKeys(
		Set<Serializable> primaryKeys) {

		return getPersistence().fetchByPrimaryKeys(primaryKeys);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery)
	 */
	public static List<SXPElement> findWithDynamicQuery(
		DynamicQuery dynamicQuery) {

		return getPersistence().findWithDynamicQuery(dynamicQuery);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int)
	 */
	public static List<SXPElement> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end) {

		return getPersistence().findWithDynamicQuery(dynamicQuery, start, end);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#findWithDynamicQuery(DynamicQuery, int, int, OrderByComparator)
	 */
	public static List<SXPElement> findWithDynamicQuery(
		DynamicQuery dynamicQuery, int start, int end,
		OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().findWithDynamicQuery(
			dynamicQuery, start, end, orderByComparator);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel)
	 */
	public static SXPElement update(SXPElement sxpElement) {
		return getPersistence().update(sxpElement);
	}

	/**
	 * @see com.liferay.portal.kernel.service.persistence.BasePersistence#update(com.liferay.portal.kernel.model.BaseModel, ServiceContext)
	 */
	public static SXPElement update(
		SXPElement sxpElement, ServiceContext serviceContext) {

		return getPersistence().update(sxpElement, serviceContext);
	}

	/**
	 * Returns all the sxp elements where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the matching sxp elements
	 */
	public static List<SXPElement> findByUuid(String uuid) {
		return getPersistence().findByUuid(uuid);
	}

	/**
	 * Returns a range of all the sxp elements where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @return the range of matching sxp elements
	 */
	public static List<SXPElement> findByUuid(String uuid, int start, int end) {
		return getPersistence().findByUuid(uuid, start, end);
	}

	/**
	 * Returns an ordered range of all the sxp elements where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching sxp elements
	 */
	public static List<SXPElement> findByUuid(
		String uuid, int start, int end,
		OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().findByUuid(uuid, start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the sxp elements where uuid = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching sxp elements
	 */
	public static List<SXPElement> findByUuid(
		String uuid, int start, int end,
		OrderByComparator<SXPElement> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findByUuid(
			uuid, start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Returns the first sxp element in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching sxp element
	 * @throws NoSuchSXPElementException if a matching sxp element could not be found
	 */
	public static SXPElement findByUuid_First(
			String uuid, OrderByComparator<SXPElement> orderByComparator)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().findByUuid_First(uuid, orderByComparator);
	}

	/**
	 * Returns the first sxp element in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching sxp element, or <code>null</code> if a matching sxp element could not be found
	 */
	public static SXPElement fetchByUuid_First(
		String uuid, OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().fetchByUuid_First(uuid, orderByComparator);
	}

	/**
	 * Returns the last sxp element in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching sxp element
	 * @throws NoSuchSXPElementException if a matching sxp element could not be found
	 */
	public static SXPElement findByUuid_Last(
			String uuid, OrderByComparator<SXPElement> orderByComparator)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().findByUuid_Last(uuid, orderByComparator);
	}

	/**
	 * Returns the last sxp element in the ordered set where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching sxp element, or <code>null</code> if a matching sxp element could not be found
	 */
	public static SXPElement fetchByUuid_Last(
		String uuid, OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().fetchByUuid_Last(uuid, orderByComparator);
	}

	/**
	 * Returns the sxp elements before and after the current sxp element in the ordered set where uuid = &#63;.
	 *
	 * @param sxpElementId the primary key of the current sxp element
	 * @param uuid the uuid
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the previous, current, and next sxp element
	 * @throws NoSuchSXPElementException if a sxp element with the primary key could not be found
	 */
	public static SXPElement[] findByUuid_PrevAndNext(
			long sxpElementId, String uuid,
			OrderByComparator<SXPElement> orderByComparator)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().findByUuid_PrevAndNext(
			sxpElementId, uuid, orderByComparator);
	}

	/**
	 * Removes all the sxp elements where uuid = &#63; from the database.
	 *
	 * @param uuid the uuid
	 */
	public static void removeByUuid(String uuid) {
		getPersistence().removeByUuid(uuid);
	}

	/**
	 * Returns the number of sxp elements where uuid = &#63;.
	 *
	 * @param uuid the uuid
	 * @return the number of matching sxp elements
	 */
	public static int countByUuid(String uuid) {
		return getPersistence().countByUuid(uuid);
	}

	/**
	 * Returns all the sxp elements where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the matching sxp elements
	 */
	public static List<SXPElement> findByUuid_C(String uuid, long companyId) {
		return getPersistence().findByUuid_C(uuid, companyId);
	}

	/**
	 * Returns a range of all the sxp elements where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @return the range of matching sxp elements
	 */
	public static List<SXPElement> findByUuid_C(
		String uuid, long companyId, int start, int end) {

		return getPersistence().findByUuid_C(uuid, companyId, start, end);
	}

	/**
	 * Returns an ordered range of all the sxp elements where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of matching sxp elements
	 */
	public static List<SXPElement> findByUuid_C(
		String uuid, long companyId, int start, int end,
		OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().findByUuid_C(
			uuid, companyId, start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the sxp elements where uuid = &#63; and companyId = &#63;.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of matching sxp elements
	 */
	public static List<SXPElement> findByUuid_C(
		String uuid, long companyId, int start, int end,
		OrderByComparator<SXPElement> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findByUuid_C(
			uuid, companyId, start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Returns the first sxp element in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching sxp element
	 * @throws NoSuchSXPElementException if a matching sxp element could not be found
	 */
	public static SXPElement findByUuid_C_First(
			String uuid, long companyId,
			OrderByComparator<SXPElement> orderByComparator)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().findByUuid_C_First(
			uuid, companyId, orderByComparator);
	}

	/**
	 * Returns the first sxp element in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the first matching sxp element, or <code>null</code> if a matching sxp element could not be found
	 */
	public static SXPElement fetchByUuid_C_First(
		String uuid, long companyId,
		OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().fetchByUuid_C_First(
			uuid, companyId, orderByComparator);
	}

	/**
	 * Returns the last sxp element in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching sxp element
	 * @throws NoSuchSXPElementException if a matching sxp element could not be found
	 */
	public static SXPElement findByUuid_C_Last(
			String uuid, long companyId,
			OrderByComparator<SXPElement> orderByComparator)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().findByUuid_C_Last(
			uuid, companyId, orderByComparator);
	}

	/**
	 * Returns the last sxp element in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the last matching sxp element, or <code>null</code> if a matching sxp element could not be found
	 */
	public static SXPElement fetchByUuid_C_Last(
		String uuid, long companyId,
		OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().fetchByUuid_C_Last(
			uuid, companyId, orderByComparator);
	}

	/**
	 * Returns the sxp elements before and after the current sxp element in the ordered set where uuid = &#63; and companyId = &#63;.
	 *
	 * @param sxpElementId the primary key of the current sxp element
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @param orderByComparator the comparator to order the set by (optionally <code>null</code>)
	 * @return the previous, current, and next sxp element
	 * @throws NoSuchSXPElementException if a sxp element with the primary key could not be found
	 */
	public static SXPElement[] findByUuid_C_PrevAndNext(
			long sxpElementId, String uuid, long companyId,
			OrderByComparator<SXPElement> orderByComparator)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().findByUuid_C_PrevAndNext(
			sxpElementId, uuid, companyId, orderByComparator);
	}

	/**
	 * Removes all the sxp elements where uuid = &#63; and companyId = &#63; from the database.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 */
	public static void removeByUuid_C(String uuid, long companyId) {
		getPersistence().removeByUuid_C(uuid, companyId);
	}

	/**
	 * Returns the number of sxp elements where uuid = &#63; and companyId = &#63;.
	 *
	 * @param uuid the uuid
	 * @param companyId the company ID
	 * @return the number of matching sxp elements
	 */
	public static int countByUuid_C(String uuid, long companyId) {
		return getPersistence().countByUuid_C(uuid, companyId);
	}

	/**
	 * Caches the sxp element in the entity cache if it is enabled.
	 *
	 * @param sxpElement the sxp element
	 */
	public static void cacheResult(SXPElement sxpElement) {
		getPersistence().cacheResult(sxpElement);
	}

	/**
	 * Caches the sxp elements in the entity cache if it is enabled.
	 *
	 * @param sxpElements the sxp elements
	 */
	public static void cacheResult(List<SXPElement> sxpElements) {
		getPersistence().cacheResult(sxpElements);
	}

	/**
	 * Creates a new sxp element with the primary key. Does not add the sxp element to the database.
	 *
	 * @param sxpElementId the primary key for the new sxp element
	 * @return the new sxp element
	 */
	public static SXPElement create(long sxpElementId) {
		return getPersistence().create(sxpElementId);
	}

	/**
	 * Removes the sxp element with the primary key from the database. Also notifies the appropriate model listeners.
	 *
	 * @param sxpElementId the primary key of the sxp element
	 * @return the sxp element that was removed
	 * @throws NoSuchSXPElementException if a sxp element with the primary key could not be found
	 */
	public static SXPElement remove(long sxpElementId)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().remove(sxpElementId);
	}

	public static SXPElement updateImpl(SXPElement sxpElement) {
		return getPersistence().updateImpl(sxpElement);
	}

	/**
	 * Returns the sxp element with the primary key or throws a <code>NoSuchSXPElementException</code> if it could not be found.
	 *
	 * @param sxpElementId the primary key of the sxp element
	 * @return the sxp element
	 * @throws NoSuchSXPElementException if a sxp element with the primary key could not be found
	 */
	public static SXPElement findByPrimaryKey(long sxpElementId)
		throws com.liferay.search.experiences.exception.
			NoSuchSXPElementException {

		return getPersistence().findByPrimaryKey(sxpElementId);
	}

	/**
	 * Returns the sxp element with the primary key or returns <code>null</code> if it could not be found.
	 *
	 * @param sxpElementId the primary key of the sxp element
	 * @return the sxp element, or <code>null</code> if a sxp element with the primary key could not be found
	 */
	public static SXPElement fetchByPrimaryKey(long sxpElementId) {
		return getPersistence().fetchByPrimaryKey(sxpElementId);
	}

	/**
	 * Returns all the sxp elements.
	 *
	 * @return the sxp elements
	 */
	public static List<SXPElement> findAll() {
		return getPersistence().findAll();
	}

	/**
	 * Returns a range of all the sxp elements.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @return the range of sxp elements
	 */
	public static List<SXPElement> findAll(int start, int end) {
		return getPersistence().findAll(start, end);
	}

	/**
	 * Returns an ordered range of all the sxp elements.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @return the ordered range of sxp elements
	 */
	public static List<SXPElement> findAll(
		int start, int end, OrderByComparator<SXPElement> orderByComparator) {

		return getPersistence().findAll(start, end, orderByComparator);
	}

	/**
	 * Returns an ordered range of all the sxp elements.
	 *
	 * <p>
	 * Useful when paginating results. Returns a maximum of <code>end - start</code> instances. <code>start</code> and <code>end</code> are not primary keys, they are indexes in the result set. Thus, <code>0</code> refers to the first result in the set. Setting both <code>start</code> and <code>end</code> to <code>QueryUtil#ALL_POS</code> will return the full result set. If <code>orderByComparator</code> is specified, then the query will include the given ORDER BY logic. If <code>orderByComparator</code> is absent, then the query will include the default ORDER BY logic from <code>SXPElementModelImpl</code>.
	 * </p>
	 *
	 * @param start the lower bound of the range of sxp elements
	 * @param end the upper bound of the range of sxp elements (not inclusive)
	 * @param orderByComparator the comparator to order the results by (optionally <code>null</code>)
	 * @param useFinderCache whether to use the finder cache
	 * @return the ordered range of sxp elements
	 */
	public static List<SXPElement> findAll(
		int start, int end, OrderByComparator<SXPElement> orderByComparator,
		boolean useFinderCache) {

		return getPersistence().findAll(
			start, end, orderByComparator, useFinderCache);
	}

	/**
	 * Removes all the sxp elements from the database.
	 */
	public static void removeAll() {
		getPersistence().removeAll();
	}

	/**
	 * Returns the number of sxp elements.
	 *
	 * @return the number of sxp elements
	 */
	public static int countAll() {
		return getPersistence().countAll();
	}

	public static SXPElementPersistence getPersistence() {
		return _serviceTracker.getService();
	}

	private static ServiceTracker<SXPElementPersistence, SXPElementPersistence>
		_serviceTracker;

	static {
		Bundle bundle = FrameworkUtil.getBundle(SXPElementPersistence.class);

		ServiceTracker<SXPElementPersistence, SXPElementPersistence>
			serviceTracker =
				new ServiceTracker
					<SXPElementPersistence, SXPElementPersistence>(
						bundle.getBundleContext(), SXPElementPersistence.class,
						null);

		serviceTracker.open();

		_serviceTracker = serviceTracker;
	}

}