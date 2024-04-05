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

import javax.validation.Valid;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author Nilton Vieira
 * @generated
 */
@Generated("")
@GraphQLName("TestrayComponentComparison")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "TestrayComponentComparison")
public class TestrayComponentComparison implements Serializable {

	public static TestrayComponentComparison toDTO(String json) {
		return ObjectMapperUtil.readValue(
			TestrayComponentComparison.class, json);
	}

	public static TestrayComponentComparison unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(
			TestrayComponentComparison.class, json);
	}

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
	@Valid
	public TestrayCaseResultComparison getTestrayCaseResultComparison() {
		if (_testrayCaseResultComparisonSupplier != null) {
			testrayCaseResultComparison =
				_testrayCaseResultComparisonSupplier.get();

			_testrayCaseResultComparisonSupplier = null;
		}

		return testrayCaseResultComparison;
	}

	public void setTestrayCaseResultComparison(
		TestrayCaseResultComparison testrayCaseResultComparison) {

		this.testrayCaseResultComparison = testrayCaseResultComparison;

		_testrayCaseResultComparisonSupplier = null;
	}

	@JsonIgnore
	public void setTestrayCaseResultComparison(
		UnsafeSupplier<TestrayCaseResultComparison, Exception>
			testrayCaseResultComparisonUnsafeSupplier) {

		_testrayCaseResultComparisonSupplier = () -> {
			try {
				return testrayCaseResultComparisonUnsafeSupplier.get();
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
	protected TestrayCaseResultComparison testrayCaseResultComparison;

	@JsonIgnore
	private Supplier<TestrayCaseResultComparison>
		_testrayCaseResultComparisonSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof TestrayComponentComparison)) {
			return false;
		}

		TestrayComponentComparison testrayComponentComparison =
			(TestrayComponentComparison)object;

		return Objects.equals(
			toString(), testrayComponentComparison.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

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

		TestrayCaseResultComparison testrayCaseResultComparison =
			getTestrayCaseResultComparison();

		if (testrayCaseResultComparison != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayCaseResultComparison\": ");

			sb.append(String.valueOf(testrayCaseResultComparison));
		}

		sb.append("}");

		return sb.toString();
	}

	@Schema(
		accessMode = Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.testray.rest.dto.v1_0.TestrayComponentComparison",
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