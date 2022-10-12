/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

package com.liferay.headless.portal.instances.client.dto.v1_0;

import com.liferay.headless.portal.instances.client.function.UnsafeSupplier;
import com.liferay.headless.portal.instances.client.serdes.v1_0.SiteInstanceSerDes;

import java.io.Serializable;

import java.util.Objects;

import javax.annotation.Generated;

/**
 * @author Alberto Chaparro
 * @generated
 */
@Generated("")
public class SiteInstance implements Cloneable, Serializable {

	public static SiteInstance toDTO(String json) {
		return SiteInstanceSerDes.toDTO(json);
	}

	public Long getGroupId() {
		return groupId;
	}

	public void setGroupId(Long groupId) {
		this.groupId = groupId;
	}

	public void setGroupId(
		UnsafeSupplier<Long, Exception> groupIdUnsafeSupplier) {

		try {
			groupId = groupIdUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected Long groupId;

	public String getSiteInitializerKey() {
		return siteInitializerKey;
	}

	public void setSiteInitializerKey(String siteInitializerKey) {
		this.siteInitializerKey = siteInitializerKey;
	}

	public void setSiteInitializerKey(
		UnsafeSupplier<String, Exception> siteInitializerKeyUnsafeSupplier) {

		try {
			siteInitializerKey = siteInitializerKeyUnsafeSupplier.get();
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	protected String siteInitializerKey;

	@Override
	public SiteInstance clone() throws CloneNotSupportedException {
		return (SiteInstance)super.clone();
	}

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof SiteInstance)) {
			return false;
		}

		SiteInstance siteInstance = (SiteInstance)object;

		return Objects.equals(toString(), siteInstance.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		return SiteInstanceSerDes.toJSON(this);
	}

}