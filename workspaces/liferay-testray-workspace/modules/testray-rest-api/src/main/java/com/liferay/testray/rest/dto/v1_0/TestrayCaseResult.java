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
@GraphQLName("TestrayCaseResult")
@JsonFilter("Liferay.Vulcan")
@XmlRootElement(name = "TestrayCaseResult")
public class TestrayCaseResult implements Serializable {

	public static TestrayCaseResult toDTO(String json) {
		return ObjectMapperUtil.readValue(TestrayCaseResult.class, json);
	}

	public static TestrayCaseResult unsafeToDTO(String json) {
		return ObjectMapperUtil.unsafeReadValue(TestrayCaseResult.class, json);
	}

	@Schema
	public String getError1() {
		if (_error1Supplier != null) {
			error1 = _error1Supplier.get();

			_error1Supplier = null;
		}

		return error1;
	}

	public void setError1(String error1) {
		this.error1 = error1;

		_error1Supplier = null;
	}

	@JsonIgnore
	public void setError1(
		UnsafeSupplier<String, Exception> error1UnsafeSupplier) {

		_error1Supplier = () -> {
			try {
				return error1UnsafeSupplier.get();
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
	protected String error1;

	@JsonIgnore
	private Supplier<String> _error1Supplier;

	@Schema
	public String getError2() {
		if (_error2Supplier != null) {
			error2 = _error2Supplier.get();

			_error2Supplier = null;
		}

		return error2;
	}

	public void setError2(String error2) {
		this.error2 = error2;

		_error2Supplier = null;
	}

	@JsonIgnore
	public void setError2(
		UnsafeSupplier<String, Exception> error2UnsafeSupplier) {

		_error2Supplier = () -> {
			try {
				return error2UnsafeSupplier.get();
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
	protected String error2;

	@JsonIgnore
	private Supplier<String> _error2Supplier;

	@Schema
	public Long getId1() {
		if (_id1Supplier != null) {
			id1 = _id1Supplier.get();

			_id1Supplier = null;
		}

		return id1;
	}

	public void setId1(Long id1) {
		this.id1 = id1;

		_id1Supplier = null;
	}

	@JsonIgnore
	public void setId1(UnsafeSupplier<Long, Exception> id1UnsafeSupplier) {
		_id1Supplier = () -> {
			try {
				return id1UnsafeSupplier.get();
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
	protected Long id1;

	@JsonIgnore
	private Supplier<Long> _id1Supplier;

	@Schema
	public Long getId2() {
		if (_id2Supplier != null) {
			id2 = _id2Supplier.get();

			_id2Supplier = null;
		}

		return id2;
	}

	public void setId2(Long id2) {
		this.id2 = id2;

		_id2Supplier = null;
	}

	@JsonIgnore
	public void setId2(UnsafeSupplier<Long, Exception> id2UnsafeSupplier) {
		_id2Supplier = () -> {
			try {
				return id2UnsafeSupplier.get();
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
	protected Long id2;

	@JsonIgnore
	private Supplier<Long> _id2Supplier;

	@Schema
	public String getIssues1() {
		if (_issues1Supplier != null) {
			issues1 = _issues1Supplier.get();

			_issues1Supplier = null;
		}

		return issues1;
	}

	public void setIssues1(String issues1) {
		this.issues1 = issues1;

		_issues1Supplier = null;
	}

	@JsonIgnore
	public void setIssues1(
		UnsafeSupplier<String, Exception> issues1UnsafeSupplier) {

		_issues1Supplier = () -> {
			try {
				return issues1UnsafeSupplier.get();
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
	protected String issues1;

	@JsonIgnore
	private Supplier<String> _issues1Supplier;

	@Schema
	public String getIssues2() {
		if (_issues2Supplier != null) {
			issues2 = _issues2Supplier.get();

			_issues2Supplier = null;
		}

		return issues2;
	}

	public void setIssues2(String issues2) {
		this.issues2 = issues2;

		_issues2Supplier = null;
	}

	@JsonIgnore
	public void setIssues2(
		UnsafeSupplier<String, Exception> issues2UnsafeSupplier) {

		_issues2Supplier = () -> {
			try {
				return issues2UnsafeSupplier.get();
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
	protected String issues2;

	@JsonIgnore
	private Supplier<String> _issues2Supplier;

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
	public String getStatus1() {
		if (_status1Supplier != null) {
			status1 = _status1Supplier.get();

			_status1Supplier = null;
		}

		return status1;
	}

	public void setStatus1(String status1) {
		this.status1 = status1;

		_status1Supplier = null;
	}

	@JsonIgnore
	public void setStatus1(
		UnsafeSupplier<String, Exception> status1UnsafeSupplier) {

		_status1Supplier = () -> {
			try {
				return status1UnsafeSupplier.get();
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
	protected String status1;

	@JsonIgnore
	private Supplier<String> _status1Supplier;

	@Schema
	public String getStatus2() {
		if (_status2Supplier != null) {
			status2 = _status2Supplier.get();

			_status2Supplier = null;
		}

		return status2;
	}

	public void setStatus2(String status2) {
		this.status2 = status2;

		_status2Supplier = null;
	}

	@JsonIgnore
	public void setStatus2(
		UnsafeSupplier<String, Exception> status2UnsafeSupplier) {

		_status2Supplier = () -> {
			try {
				return status2UnsafeSupplier.get();
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
	protected String status2;

	@JsonIgnore
	private Supplier<String> _status2Supplier;

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
	public Long getTestrayTeamId() {
		if (_testrayTeamIdSupplier != null) {
			testrayTeamId = _testrayTeamIdSupplier.get();

			_testrayTeamIdSupplier = null;
		}

		return testrayTeamId;
	}

	public void setTestrayTeamId(Long testrayTeamId) {
		this.testrayTeamId = testrayTeamId;

		_testrayTeamIdSupplier = null;
	}

	@JsonIgnore
	public void setTestrayTeamId(
		UnsafeSupplier<Long, Exception> testrayTeamIdUnsafeSupplier) {

		_testrayTeamIdSupplier = () -> {
			try {
				return testrayTeamIdUnsafeSupplier.get();
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
	protected Long testrayTeamId;

	@JsonIgnore
	private Supplier<Long> _testrayTeamIdSupplier;

	@Override
	public boolean equals(Object object) {
		if (this == object) {
			return true;
		}

		if (!(object instanceof TestrayCaseResult)) {
			return false;
		}

		TestrayCaseResult testrayCaseResult = (TestrayCaseResult)object;

		return Objects.equals(toString(), testrayCaseResult.toString());
	}

	@Override
	public int hashCode() {
		String string = toString();

		return string.hashCode();
	}

	public String toString() {
		StringBundler sb = new StringBundler();

		sb.append("{");

		String error1 = getError1();

		if (error1 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"error1\": ");

			sb.append("\"");

			sb.append(_escape(error1));

			sb.append("\"");
		}

		String error2 = getError2();

		if (error2 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"error2\": ");

			sb.append("\"");

			sb.append(_escape(error2));

			sb.append("\"");
		}

		Long id1 = getId1();

		if (id1 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"id1\": ");

			sb.append(id1);
		}

		Long id2 = getId2();

		if (id2 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"id2\": ");

			sb.append(id2);
		}

		String issues1 = getIssues1();

		if (issues1 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"issues1\": ");

			sb.append("\"");

			sb.append(_escape(issues1));

			sb.append("\"");
		}

		String issues2 = getIssues2();

		if (issues2 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"issues2\": ");

			sb.append("\"");

			sb.append(_escape(issues2));

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

		Integer priority = getPriority();

		if (priority != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"priority\": ");

			sb.append(priority);
		}

		String status1 = getStatus1();

		if (status1 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"status1\": ");

			sb.append("\"");

			sb.append(_escape(status1));

			sb.append("\"");
		}

		String status2 = getStatus2();

		if (status2 != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"status2\": ");

			sb.append("\"");

			sb.append(_escape(status2));

			sb.append("\"");
		}

		Long testrayCaseId = getTestrayCaseId();

		if (testrayCaseId != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayCaseId\": ");

			sb.append(testrayCaseId);
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

		Long testrayTeamId = getTestrayTeamId();

		if (testrayTeamId != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"testrayTeamId\": ");

			sb.append(testrayTeamId);
		}

		sb.append("}");

		return sb.toString();
	}

	@Schema(
		accessMode = Schema.AccessMode.READ_ONLY,
		defaultValue = "com.liferay.testray.rest.dto.v1_0.TestrayCaseResult",
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