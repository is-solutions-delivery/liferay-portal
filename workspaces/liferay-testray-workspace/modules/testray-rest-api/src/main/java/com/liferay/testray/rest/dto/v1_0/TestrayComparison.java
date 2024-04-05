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
@GraphQLName("TestrayComparison")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "TestrayComparison")
public class TestrayComparison implements Serializable {

	public static TestrayComparison toDTO(String json) {
		return ObjectMapperUtil.readValue(TestrayComparison.class, json);
	}

	public static TestrayComparison unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(TestrayComparison.class, json);
	}

	@Schema
	@Valid
	public TestrayComponentComparison[] getTestrayComponentComparisons() {
		if (_testrayComponentComparisonsSupplier != null) {
			testrayComponentComparisons =
				_testrayComponentComparisonsSupplier.get();

			_testrayComponentComparisonsSupplier = null;
		}

		return testrayComponentComparisons;
	}

	public void setTestrayComponentComparisons(
		TestrayComponentComparison[] testrayComponentComparisons) {

		this.testrayComponentComparisons = testrayComponentComparisons;

		_testrayComponentComparisonsSupplier = null;
	}

	@JsonIgnore
	public void setTestrayComponentComparisons(
		UnsafeSupplier<TestrayComponentComparison[], Exception>
			testrayComponentComparisonsUnsafeSupplier) {

		_testrayComponentComparisonsSupplier = () -> {
			try {
				return testrayComponentComparisonsUnsafeSupplier.get();
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
	protected TestrayComponentComparison[] testrayComponentComparisons;

	@JsonIgnore
	private Supplier<TestrayComponentComparison[]>
		_testrayComponentComparisonsSupplier;

	@Schema
	@Valid
	public TestrayCaseResultComparison getTestrayRunComparison() {
		if (_testrayRunComparisonSupplier != null) {
			testrayRunComparison = _testrayRunComparisonSupplier.get();

			_testrayRunComparisonSupplier = null;
		}

		return testrayRunComparison;
	}

	public void setTestrayRunComparison(
		TestrayCaseResultComparison testrayRunComparison) {

		this.testrayRunComparison = testrayRunComparison;

		_testrayRunComparisonSupplier = null;
	}

	@JsonIgnore
	public void setTestrayRunComparison(
		UnsafeSupplier<TestrayCaseResultComparison, Exception>
			testrayRunComparisonUnsafeSupplier) {

		_testrayRunComparisonSupplier = () -> {
			try {
				return testrayRunComparisonUnsafeSupplier.get();
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
	protected TestrayCaseResultComparison testrayRunComparison;

	@JsonIgnore
	private Supplier<TestrayCaseResultComparison> _testrayRunComparisonSupplier;

	@Schema
	@Valid
	public TestrayTeamComparison[] getTestrayTeamComparisons() {
		if (_testrayTeamComparisonsSupplier != null) {
			testrayTeamComparisons = _testrayTeamComparisonsSupplier.get();

			_testrayTeamComparisonsSupplier = null;
		}

		return testrayTeamComparisons;
	}

	public void setTestrayTeamComparisons(
		TestrayTeamComparison[] testrayTeamComparisons) {

		this.testrayTeamComparisons = testrayTeamComparisons;

		_testrayTeamComparisonsSupplier = null;
	}

	@JsonIgnore
	public void setTestrayTeamComparisons(
		UnsafeSupplier<TestrayTeamComparison[], Exception>
			testrayTeamComparisonsUnsafeSupplier) {

		_testrayTeamComparisonsSupplier = () -> {
			try {
				return testrayTeamComparisonsUnsafeSupplier.get();
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
	protected TestrayTeamComparison[] testrayTeamComparisons;

	@JsonIgnore
	private Supplier<TestrayTeamComparison[]> _testrayTeamComparisonsSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof TestrayComparison)) {
			return false;
		}

		TestrayComparison testrayComparison = (TestrayComparison)object;

		return Objects.equals(toString(), testrayComparison.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		TestrayComponentComparison[] testrayComponentComparisons =
			getTestrayComponentComparisons();

		if (testrayComponentComparisons != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayComponentComparisons\": ");

			sb.append("[");

			for (int i = 0; i < testrayComponentComparisons.length; i++) {
				sb.append(String.valueOf(testrayComponentComparisons[i]));

				if ((i + 1) < testrayComponentComparisons.length) {
					sb.append(", ");
				}
			}

			sb.append("]");
		}

		TestrayCaseResultComparison testrayRunComparison =
			getTestrayRunComparison();

		if (testrayRunComparison != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayRunComparison\": ");

			sb.append(String.valueOf(testrayRunComparison));
		}

		TestrayTeamComparison[] testrayTeamComparisons =
			getTestrayTeamComparisons();

		if (testrayTeamComparisons != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayTeamComparisons\": ");

			sb.append("[");

			for (int i = 0; i < testrayTeamComparisons.length; i++) {
				sb.append(String.valueOf(testrayTeamComparisons[i]));

				if ((i + 1) < testrayTeamComparisons.length) {
					sb.append(", ");
				}
			}

			sb.append("]");
		}

		sb.append("}");

		return sb.toString();
	}

	@Schema(
		accessMode = Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.testray.rest.dto.v1_0.TestrayComparison",
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