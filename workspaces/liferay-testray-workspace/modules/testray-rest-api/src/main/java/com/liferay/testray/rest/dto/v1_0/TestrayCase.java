package com.liferay.testray.rest.dto.v1_0;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.liferay.petra.function.UnsafeSupplier;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.util.StringUtil;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLField;
import com.liferay.portal.vulcan.graphql.annotation.GraphQLName;
import com.liferay.portal.vulcan.util.ObjectMapperUtil;

import io.swagger.v3.oas.annotations.media.Schema;

import java.io.Serializable;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Supplier;

import javax.annotation.Generated;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author Nilton Vieira
 * @generated
 */
@Generated("")
@GraphQLName("TestrayCase")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "TestrayCase")
public class TestrayCase implements Serializable {

	public static TestrayCase toDTO(String json) {
		return ObjectMapperUtil.readValue(TestrayCase.class, json);
	}

	public static TestrayCase unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(TestrayCase.class, json);
	}

	@Schema
	public String getCaseResultStatus1() {
		if (_caseResultStatus1Supplier != null) {
			caseResultStatus1 = _caseResultStatus1Supplier.get();

			_caseResultStatus1Supplier = null;
		}

		return caseResultStatus1;
	}

	public void setCaseResultStatus1(String caseResultStatus1) {
		this.caseResultStatus1 = caseResultStatus1;

		_caseResultStatus1Supplier = null;
	}

	@JsonIgnore
	public void setCaseResultStatus1(
		UnsafeSupplier<String, Exception> caseResultStatus1UnsafeSupplier) {

		_caseResultStatus1Supplier = () -> {
			try {
				return caseResultStatus1UnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected String caseResultStatus1;

	@JsonIgnore
	private Supplier<String> _caseResultStatus1Supplier;

	@Schema
	public String getCaseResultStatus2() {
		if (_caseResultStatus2Supplier != null) {
			caseResultStatus2 = _caseResultStatus2Supplier.get();

			_caseResultStatus2Supplier = null;
		}

		return caseResultStatus2;
	}

	public void setCaseResultStatus2(String caseResultStatus2) {
		this.caseResultStatus2 = caseResultStatus2;

		_caseResultStatus2Supplier = null;
	}

	@JsonIgnore
	public void setCaseResultStatus2(
		UnsafeSupplier<String, Exception> caseResultStatus2UnsafeSupplier) {

		_caseResultStatus2Supplier = () -> {
			try {
				return caseResultStatus2UnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected String caseResultStatus2;

	@JsonIgnore
	private Supplier<String> _caseResultStatus2Supplier;

	@Schema
	public String getComponent() {
		if (_componentSupplier != null) {
			component = _componentSupplier.get();

			_componentSupplier = null;
		}

		return component;
	}

	public void setComponent(String component) {
		this.component = component;

		_componentSupplier = null;
	}

	@JsonIgnore
	public void setComponent(
		UnsafeSupplier<String, Exception> componentUnsafeSupplier) {

		_componentSupplier = () -> {
			try {
				return componentUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected String component;

	@JsonIgnore
	private Supplier<String> _componentSupplier;

	@Schema
	public String getName() {
		if (_nameSupplier != null) {
			name = _nameSupplier.get();

			_nameSupplier = null;
		}

		return name;
	}

	public void setName(String name) {
		this.name = name;

		_nameSupplier = null;
	}

	@JsonIgnore
	public void setName(UnsafeSupplier<String, Exception> nameUnsafeSupplier) {
		_nameSupplier = () -> {
			try {
				return nameUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected String name;

	@JsonIgnore
	private Supplier<String> _nameSupplier;

	@Schema
	public String getPriority() {
		if (_prioritySupplier != null) {
			priority = _prioritySupplier.get();

			_prioritySupplier = null;
		}

		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;

		_prioritySupplier = null;
	}

	@JsonIgnore
	public void setPriority(
		UnsafeSupplier<String, Exception> priorityUnsafeSupplier) {

		_prioritySupplier = () -> {
			try {
				return priorityUnsafeSupplier.get();
			}
			catch (RuntimeException runtimeException) {
				throw runtimeException;
			}
			catch (Exception exception) {
				throw new RuntimeException(exception);
			}
		};
	}

	@GraphQLField
	@JsonProperty(access = JsonProperty.Access.READ_WRITE)
	protected String priority;

	@JsonIgnore
	private Supplier<String> _prioritySupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof TestrayCase)) {
			return false;
		}

		TestrayCase testrayCase = (TestrayCase)object;

		return Objects.equals(toString(), testrayCase.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		String caseResultStatus1 = getCaseResultStatus1();

		if (caseResultStatus1 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"caseResultStatus1\": ");

			sb.append("\"");

			sb.append(_escape(caseResultStatus1));

			sb.append("\"");
		}

		String caseResultStatus2 = getCaseResultStatus2();

		if (caseResultStatus2 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"caseResultStatus2\": ");

			sb.append("\"");

			sb.append(_escape(caseResultStatus2));

			sb.append("\"");
		}

		String component = getComponent();

		if (component != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"component\": ");

			sb.append("\"");

			sb.append(_escape(component));

			sb.append("\"");
		}

		String name = getName();

		if (name != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"name\": ");

			sb.append("\"");

			sb.append(_escape(name));

			sb.append("\"");
		}

		String priority = getPriority();

		if (priority != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"priority\": ");

			sb.append("\"");

			sb.append(_escape(priority));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	@Schema(
		accessMode = Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.testray.rest.dto.v1_0.TestrayCase",
		name = "x-class-name"
	)
	public String xClassName;

	private static String _escape(Object object) {
		return StringUtil.replace(
			String.valueOf(object), _JSON_ESCAPE_STRINGS[0],
			_JSON_ESCAPE_STRINGS[1]);
	}

	private static boolean _isArray(Object value) {
		if (value == null) {
			return false;
		}

		Class<?> clazz = value.getClass();

		return clazz.isArray();
	}

	private static String _toJSON(Map<String, ?> map) {
		StringBuilder sb = new StringBuilder("{");

		@SuppressWarnings("unchecked")
		Set set = map.entrySet();

		@SuppressWarnings("unchecked")
		Iterator<Map.Entry<String, ?>> iterator = set.iterator();

		while (iterator.hasNext()) {
			Map.Entry<String, ?> entry = iterator.next();

			sb.append("\"");
			sb.append(_escape(entry.getKey()));
			sb.append("\": ");

			Object value = entry.getValue();

			if (_isArray(value)) {
				sb.append("[");

				Object[] valueArray = (Object[])value;

				for (int i = 0; i < valueArray.length; i++) {
					if (valueArray[i] instanceof String) {
						sb.append("\"");
						sb.append(valueArray[i]);
						sb.append("\"");
					}
					else {
						sb.append(valueArray[i]);
					}

					if ((i + 1) < valueArray.length) {
						sb.append(", ");
					}
				}

				sb.append("]");
			}
			else if (value instanceof Map) {
				sb.append(_toJSON((Map<String, ?>)value));
			}
			else if (value instanceof String) {
				sb.append("\"");
				sb.append(_escape(value));
				sb.append("\"");
			}
			else {
				sb.append(value);
			}

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

	private static final String[][] _JSON_ESCAPE_STRINGS = {
		{"\\", "\"", "\b", "\f", "\n", "\r", "\t"},
		{"\\\\", "\\\"", "\\b", "\\f", "\\n", "\\r", "\\t"}
	};

	private Map<String, Serializable> _extendedProperties;

}