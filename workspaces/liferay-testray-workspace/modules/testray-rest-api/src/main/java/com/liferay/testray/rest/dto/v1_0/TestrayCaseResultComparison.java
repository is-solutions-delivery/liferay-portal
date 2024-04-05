package com.liferay.testray.rest.dto.v1_0;

import com.fasterxml.jackson.annotation.JsonFilter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import com.liferay.petra.function.UnsafeSupplier;
import com.liferay.petra.string.StringBundler;
import com.liferay.portal.kernel.json.JSONFactoryUtil;
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
@GraphQLName("TestrayCaseResultComparison")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "TestrayCaseResultComparison")
public class TestrayCaseResultComparison implements Serializable {

	public static TestrayCaseResultComparison toDTO(String json) {
		return ObjectMapperUtil.readValue(
			TestrayCaseResultComparison.class, json);
	}

	public static TestrayCaseResultComparison unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(
			TestrayCaseResultComparison.class, json);
	}

	@Schema
	@Valid
	public Object getBlocked() {
		if (_blockedSupplier != null) {
			blocked = _blockedSupplier.get();

			_blockedSupplier = null;
		}

		return blocked;
	}

	public void setBlocked(Object blocked) {
		this.blocked = blocked;

		_blockedSupplier = null;
	}

	@JsonIgnore
	public void setBlocked(
		UnsafeSupplier<Object, Exception> blockedUnsafeSupplier) {

		_blockedSupplier = () -> {
			try {
				return blockedUnsafeSupplier.get();
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
	protected Object blocked;

	@JsonIgnore
	private Supplier<Object> _blockedSupplier;

	@Schema
	@Valid
	public Object getDidNotRun() {
		if (_didNotRunSupplier != null) {
			didNotRun = _didNotRunSupplier.get();

			_didNotRunSupplier = null;
		}

		return didNotRun;
	}

	public void setDidNotRun(Object didNotRun) {
		this.didNotRun = didNotRun;

		_didNotRunSupplier = null;
	}

	@JsonIgnore
	public void setDidNotRun(
		UnsafeSupplier<Object, Exception> didNotRunUnsafeSupplier) {

		_didNotRunSupplier = () -> {
			try {
				return didNotRunUnsafeSupplier.get();
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
	protected Object didNotRun;

	@JsonIgnore
	private Supplier<Object> _didNotRunSupplier;

	@Schema
	@Valid
	public Object getFailed() {
		if (_failedSupplier != null) {
			failed = _failedSupplier.get();

			_failedSupplier = null;
		}

		return failed;
	}

	public void setFailed(Object failed) {
		this.failed = failed;

		_failedSupplier = null;
	}

	@JsonIgnore
	public void setFailed(
		UnsafeSupplier<Object, Exception> failedUnsafeSupplier) {

		_failedSupplier = () -> {
			try {
				return failedUnsafeSupplier.get();
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
	protected Object failed;

	@JsonIgnore
	private Supplier<Object> _failedSupplier;

	@Schema
	@Valid
	public Object getPassed() {
		if (_passedSupplier != null) {
			passed = _passedSupplier.get();

			_passedSupplier = null;
		}

		return passed;
	}

	public void setPassed(Object passed) {
		this.passed = passed;

		_passedSupplier = null;
	}

	@JsonIgnore
	public void setPassed(
		UnsafeSupplier<Object, Exception> passedUnsafeSupplier) {

		_passedSupplier = () -> {
			try {
				return passedUnsafeSupplier.get();
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
	protected Object passed;

	@JsonIgnore
	private Supplier<Object> _passedSupplier;

	@Schema
	@Valid
	public Object getTestFix() {
		if (_testFixSupplier != null) {
			testFix = _testFixSupplier.get();

			_testFixSupplier = null;
		}

		return testFix;
	}

	public void setTestFix(Object testFix) {
		this.testFix = testFix;

		_testFixSupplier = null;
	}

	@JsonIgnore
	public void setTestFix(
		UnsafeSupplier<Object, Exception> testFixUnsafeSupplier) {

		_testFixSupplier = () -> {
			try {
				return testFixUnsafeSupplier.get();
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
	protected Object testFix;

	@JsonIgnore
	private Supplier<Object> _testFixSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof TestrayCaseResultComparison)) {
			return false;
		}

		TestrayCaseResultComparison testrayCaseResultComparison =
			(TestrayCaseResultComparison)object;

		return Objects.equals(
			toString(), testrayCaseResultComparison.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		Object blocked = getBlocked();

		if (blocked != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"blocked\": ");

			if (blocked instanceof Map) {
				sb.append(JSONFactoryUtil.createJSONObject((Map<?, ?>)blocked));
			}
			else if (blocked instanceof String) {
				sb.append("\"");
				sb.append(_escape((String)blocked));
				sb.append("\"");
			}
			else {
				sb.append(blocked);
			}
		}

		Object didNotRun = getDidNotRun();

		if (didNotRun != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"didNotRun\": ");

			if (didNotRun instanceof Map) {
				sb.append(
					JSONFactoryUtil.createJSONObject((Map<?, ?>)didNotRun));
			}
			else if (didNotRun instanceof String) {
				sb.append("\"");
				sb.append(_escape((String)didNotRun));
				sb.append("\"");
			}
			else {
				sb.append(didNotRun);
			}
		}

		Object failed = getFailed();

		if (failed != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"failed\": ");

			if (failed instanceof Map) {
				sb.append(JSONFactoryUtil.createJSONObject((Map<?, ?>)failed));
			}
			else if (failed instanceof String) {
				sb.append("\"");
				sb.append(_escape((String)failed));
				sb.append("\"");
			}
			else {
				sb.append(failed);
			}
		}

		Object passed = getPassed();

		if (passed != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"passed\": ");

			if (passed instanceof Map) {
				sb.append(JSONFactoryUtil.createJSONObject((Map<?, ?>)passed));
			}
			else if (passed instanceof String) {
				sb.append("\"");
				sb.append(_escape((String)passed));
				sb.append("\"");
			}
			else {
				sb.append(passed);
			}
		}

		Object testFix = getTestFix();

		if (testFix != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testFix\": ");

			if (testFix instanceof Map) {
				sb.append(JSONFactoryUtil.createJSONObject((Map<?, ?>)testFix));
			}
			else if (testFix instanceof String) {
				sb.append("\"");
				sb.append(_escape((String)testFix));
				sb.append("\"");
			}
			else {
				sb.append(testFix);
			}
		}

		sb.append("}");

		return sb.toString();
	}

	@Schema(
		accessMode = Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.testray.rest.dto.v1_0.TestrayCaseResultComparison",
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