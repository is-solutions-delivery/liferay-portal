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

package headless.mail.client.serdes.v1_0;

import headless.mail.client.dto.v1_0.Mail;
import headless.mail.client.json.BaseJSONParser;

import java.util.Iterator;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;

import javax.annotation.Generated;

/**
 * @author José Abelenda
 * @generated
 */
@Generated("")
public class MailSerDes {

	public static Mail toDTO(String json) {
		MailJSONParser mailJSONParser = new MailJSONParser();

		return mailJSONParser.parseToDTO(json);
	}

	public static Mail[] toDTOs(String json) {
		MailJSONParser mailJSONParser = new MailJSONParser();

		return mailJSONParser.parseToDTOs(json);
	}

	public static String toJSON(Mail mail) {
		if (mail == null) {
			return "null";
		}

		StringBuilder sb = new StringBuilder();

		sb.append("{");

		if (mail.getBody() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"body\": ");

			sb.append("\"");

			sb.append(_escape(mail.getBody()));

			sb.append("\"");
		}

		if (mail.getId() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"id\": ");

			sb.append(mail.getId());
		}

		if (mail.getSubject() != null) {
			if (sb.length() > 1) {
				sb.append(", ");
			}

			sb.append("\"subject\": ");

			sb.append("\"");

			sb.append(_escape(mail.getSubject()));

			sb.append("\"");
		}

		sb.append("}");

		return sb.toString();
	}

	public static Map<String, Object> toMap(String json) {
		MailJSONParser mailJSONParser = new MailJSONParser();

		return mailJSONParser.parseToMap(json);
	}

	public static Map<String, String> toMap(Mail mail) {
		if (mail == null) {
			return null;
		}

		Map<String, String> map = new TreeMap<>();

		if (mail.getBody() == null) {
			map.put("body", null);
		}
		else {
			map.put("body", String.valueOf(mail.getBody()));
		}

		if (mail.getId() == null) {
			map.put("id", null);
		}
		else {
			map.put("id", String.valueOf(mail.getId()));
		}

		if (mail.getSubject() == null) {
			map.put("subject", null);
		}
		else {
			map.put("subject", String.valueOf(mail.getSubject()));
		}

		return map;
	}

	public static class MailJSONParser extends BaseJSONParser<Mail> {

		@Override
		protected Mail createDTO() {
			return new Mail();
		}

		@Override
		protected Mail[] createDTOArray(int size) {
			return new Mail[size];
		}

		@Override
		protected void setField(
			Mail mail, String jsonParserFieldName,
			Object jsonParserFieldValue) {

			if (Objects.equals(jsonParserFieldName, "body")) {
				if (jsonParserFieldValue != null) {
					mail.setBody((String)jsonParserFieldValue);
				}
			}
			else if (Objects.equals(jsonParserFieldName, "id")) {
				if (jsonParserFieldValue != null) {
					mail.setId(Long.valueOf((String)jsonParserFieldValue));
				}
			}
			else if (Objects.equals(jsonParserFieldName, "subject")) {
				if (jsonParserFieldValue != null) {
					mail.setSubject((String)jsonParserFieldValue);
				}
			}
		}

	}

	private static String _escape(Object object) {
		String string = String.valueOf(object);

		for (String[] strings : BaseJSONParser.JSON_ESCAPE_STRINGS) {
			string = string.replace(strings[0], strings[1]);
		}

		return string;
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
			sb.append(entry.getKey());
			sb.append("\": ");

			Object value = entry.getValue();

			Class<?> valueClass = value.getClass();

			if (value instanceof Map) {
				sb.append(_toJSON((Map)value));
			}
			else if (valueClass.isArray()) {
				Object[] values = (Object[])value;

				sb.append("[");

				for (int i = 0; i < values.length; i++) {
					sb.append("\"");
					sb.append(_escape(values[i]));
					sb.append("\"");

					if ((i + 1) < values.length) {
						sb.append(", ");
					}
				}

				sb.append("]");
			}
			else if (value instanceof String) {
				sb.append("\"");
				sb.append(_escape(entry.getValue()));
				sb.append("\"");
			}
			else {
				sb.append(String.valueOf(entry.getValue()));
			}

			if (iterator.hasNext()) {
				sb.append(", ");
			}
		}

		sb.append("}");

		return sb.toString();
	}

}