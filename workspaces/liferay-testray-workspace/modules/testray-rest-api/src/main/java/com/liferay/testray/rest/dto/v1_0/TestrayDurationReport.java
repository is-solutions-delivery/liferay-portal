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
@GraphQLName("TestrayDurationReport")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "TestrayDurationReport")
public class TestrayDurationReport implements Serializable {

	public static TestrayDurationReport toDTO(String json) {
		return ObjectMapperUtil.readValue(TestrayDurationReport.class, json);
	}

	public static TestrayDurationReport unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(
			TestrayDurationReport.class, json);
	}

	@Schema
	public Long getAvgDuration() {
		if (_avgDurationSupplier != null) {
			avgDuration = _avgDurationSupplier.get();

			_avgDurationSupplier = null;
		}

		return avgDuration;
	}

	public void setAvgDuration(Long avgDuration) {
		this.avgDuration = avgDuration;

		_avgDurationSupplier = null;
	}

	@JsonIgnore
	public void setAvgDuration(
		UnsafeSupplier<Long, Exception> avgDurationUnsafeSupplier) {

		_avgDurationSupplier = () -> {
			try {
				return avgDurationUnsafeSupplier.get();
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
	protected Long avgDuration;

	@JsonIgnore
	private Supplier<Long> _avgDurationSupplier;

	@Schema
	public Long[] getDurations() {
		if (_durationsSupplier != null) {
			durations = _durationsSupplier.get();

			_durationsSupplier = null;
		}

		return durations;
	}

	public void setDurations(Long[] durations) {
		this.durations = durations;

		_durationsSupplier = null;
	}

	@JsonIgnore
	public void setDurations(
		UnsafeSupplier<Long[], Exception> durationsUnsafeSupplier) {

		_durationsSupplier = () -> {
			try {
				return durationsUnsafeSupplier.get();
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
	protected Long[] durations;

	@JsonIgnore
	private Supplier<Long[]> _durationsSupplier;

	@Schema
	public Boolean getFlaky() {
		if (_flakySupplier != null) {
			flaky = _flakySupplier.get();

			_flakySupplier = null;
		}

		return flaky;
	}

	public void setFlaky(Boolean flaky) {
		this.flaky = flaky;

		_flakySupplier = null;
	}

	@JsonIgnore
	public void setFlaky(
		UnsafeSupplier<Boolean, Exception> flakyUnsafeSupplier) {

		_flakySupplier = () -> {
			try {
				return flakyUnsafeSupplier.get();
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
	protected Boolean flaky;

	@JsonIgnore
	private Supplier<Boolean> _flakySupplier;

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
	public Integer getPriority() {
		if (_prioritySupplier != null) {
			priority = _prioritySupplier.get();

			_prioritySupplier = null;
		}

		return priority;
	}

	public void setPriority(Integer priority) {
		this.priority = priority;

		_prioritySupplier = null;
	}

	@JsonIgnore
	public void setPriority(
		UnsafeSupplier<Integer, Exception> priorityUnsafeSupplier) {

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
	protected Integer priority;

	@JsonIgnore
	private Supplier<Integer> _prioritySupplier;

	@Schema
	public String[] getResults() {
		if (_resultsSupplier != null) {
			results = _resultsSupplier.get();

			_resultsSupplier = null;
		}

		return results;
	}

	public void setResults(String[] results) {
		this.results = results;

		_resultsSupplier = null;
	}

	@JsonIgnore
	public void setResults(
		UnsafeSupplier<String[], Exception> resultsUnsafeSupplier) {

		_resultsSupplier = () -> {
			try {
				return resultsUnsafeSupplier.get();
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
	protected String[] results;

	@JsonIgnore
	private Supplier<String[]> _resultsSupplier;

	@Schema
	public Long getTestrayCaseId() {
		if (_testrayCaseIdSupplier != null) {
			testrayCaseId = _testrayCaseIdSupplier.get();

			_testrayCaseIdSupplier = null;
		}

		return testrayCaseId;
	}

	public void setTestrayCaseId(Long testrayCaseId) {
		this.testrayCaseId = testrayCaseId;

		_testrayCaseIdSupplier = null;
	}

	@JsonIgnore
	public void setTestrayCaseId(
		UnsafeSupplier<Long, Exception> testrayCaseIdUnsafeSupplier) {

		_testrayCaseIdSupplier = () -> {
			try {
				return testrayCaseIdUnsafeSupplier.get();
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
	protected Long testrayCaseId;

	@JsonIgnore
	private Supplier<Long> _testrayCaseIdSupplier;

	@Schema
	public String getTestrayCaseTypeName() {
		if (_testrayCaseTypeNameSupplier != null) {
			testrayCaseTypeName = _testrayCaseTypeNameSupplier.get();

			_testrayCaseTypeNameSupplier = null;
		}

		return testrayCaseTypeName;
	}

	public void setTestrayCaseTypeName(String testrayCaseTypeName) {
		this.testrayCaseTypeName = testrayCaseTypeName;

		_testrayCaseTypeNameSupplier = null;
	}

	@JsonIgnore
	public void setTestrayCaseTypeName(
		UnsafeSupplier<String, Exception> testrayCaseTypeNameUnsafeSupplier) {

		_testrayCaseTypeNameSupplier = () -> {
			try {
				return testrayCaseTypeNameUnsafeSupplier.get();
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
	protected String testrayCaseTypeName;

	@JsonIgnore
	private Supplier<String> _testrayCaseTypeNameSupplier;

	@Schema
	public String getTestrayComponentName() {
		if (_testrayComponentNameSupplier != null) {
			testrayComponentName = _testrayComponentNameSupplier.get();

			_testrayComponentNameSupplier = null;
		}

		return testrayComponentName;
	}

	public void setTestrayComponentName(String testrayComponentName) {
		this.testrayComponentName = testrayComponentName;

		_testrayComponentNameSupplier = null;
	}

	@JsonIgnore
	public void setTestrayComponentName(
		UnsafeSupplier<String, Exception> testrayComponentNameUnsafeSupplier) {

		_testrayComponentNameSupplier = () -> {
			try {
				return testrayComponentNameUnsafeSupplier.get();
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
	protected String testrayComponentName;

	@JsonIgnore
	private Supplier<String> _testrayComponentNameSupplier;

	@Schema
	public String getTestrayTeamName() {
		if (_testrayTeamNameSupplier != null) {
			testrayTeamName = _testrayTeamNameSupplier.get();

			_testrayTeamNameSupplier = null;
		}

		return testrayTeamName;
	}

	public void setTestrayTeamName(String testrayTeamName) {
		this.testrayTeamName = testrayTeamName;

		_testrayTeamNameSupplier = null;
	}

	@JsonIgnore
	public void setTestrayTeamName(
		UnsafeSupplier<String, Exception> testrayTeamNameUnsafeSupplier) {

		_testrayTeamNameSupplier = () -> {
			try {
				return testrayTeamNameUnsafeSupplier.get();
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
	protected String testrayTeamName;

	@JsonIgnore
	private Supplier<String> _testrayTeamNameSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof TestrayDurationReport)) {
			return false;
		}

		TestrayDurationReport testrayDurationReport =
			(TestrayDurationReport)object;

		return Objects.equals(toString(), testrayDurationReport.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		Long avgDuration = getAvgDuration();

		if (avgDuration != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"avgDuration\": ");

			sb.append(avgDuration);
		}

		Long[] durations = getDurations();

		if (durations != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"durations\": ");

			sb.append("[");

			for (int i = 0; i < durations.length; i++) {
				sb.append(durations[i]);

				if ((i + 1) < durations.length) {
					sb.append(", ");
				}
			}

			sb.append("]");
		}

		Boolean flaky = getFlaky();

		if (flaky != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"flaky\": ");

			sb.append(flaky);
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

		Integer priority = getPriority();

		if (priority != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"priority\": ");

			sb.append(priority);
		}

		String[] results = getResults();

		if (results != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"results\": ");

			sb.append("[");

			for (int i = 0; i < results.length; i++) {
				sb.append("\"");

				sb.append(_escape(results[i]));

				sb.append("\"");

				if ((i + 1) < results.length) {
					sb.append(", ");
				}
			}

			sb.append("]");
		}

		Long testrayCaseId = getTestrayCaseId();

		if (testrayCaseId != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayCaseId\": ");

			sb.append(testrayCaseId);
		}

		String testrayCaseTypeName = getTestrayCaseTypeName();

		if (testrayCaseTypeName != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayCaseTypeName\": ");

			sb.append("\"");

			sb.append(_escape(testrayCaseTypeName));

			sb.append("\"");
		}

		String testrayComponentName = getTestrayComponentName();

		if (testrayComponentName != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayComponentName\": ");

			sb.append("\"");

			sb.append(_escape(testrayComponentName));

			sb.append("\"");
		}

		String testrayTeamName = getTestrayTeamName();

		if (testrayTeamName != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayTeamName\": ");

			sb.append("\"");

			sb.append(_escape(testrayTeamName));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	@Schema(
		accessMode = Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.testray.rest.dto.v1_0.TestrayDurationReport",
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
					if (valueArray[i] instanceof Map) {
						sb.append(_toJSON((Map<String, ?>)valueArray[i]));
					}
					else if (valueArray[i] instanceof String) {
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