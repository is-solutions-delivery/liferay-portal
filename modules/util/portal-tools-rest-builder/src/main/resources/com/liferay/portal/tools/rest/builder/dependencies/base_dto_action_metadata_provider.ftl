package ${configYAML.apiPackagePath}.internal.dto.${escapedVersion}.action.metadata;

import ${configYAML.apiPackagePath}.internal.resource.${escapedVersion}.${schemaName}ResourceImpl;
import com.liferay.portal.kernel.security.permission.ActionKeys;
import com.liferay.portal.vulcan.dto.action.ActionInfo;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * @author ${configYAML.author}
 * @generated
 */
public abstract class Base${schemaName}DTOActionMetadataProvider {

	public Base${schemaName}DTOActionMetadataProvider() {
		<#assign
			actionPropertyNames = ["delete", "get", "replace", "update"]
		/>

		<#list actionPropertyNames as actionPropertyName>
			_actionInfos.put("${actionPropertyName}", new ActionInfo(get${actionPropertyName?cap_first}ActionName(), ${schemaName}ResourceImpl.class, get${actionPropertyName?cap_first}ResourceMethodName()));
		</#list>
	}

	public final ActionInfo getActionInfo(String actionName) {
		return _actionInfos.get(actionName);
	}

	public final Set<String> getActionNames() {
		return _actionInfos.keySet();
	}

	public abstract String getPermissionName();

	<#list actionPropertyNames as actionPropertyName>
		<#assign actionName = freeMarkerTool.getActionName(actionPropertyName)!"" />

		protected String get${actionPropertyName?cap_first}ActionName() {
			return ActionKeys.${actionName!};
		}

		<#assign
			javaMethodSignatures = freeMarkerTool.getResourceJavaMethodSignatures(configYAML, openAPIYAML, schemaName)

			resourceMethodName = freeMarkerTool.getResourceMethodName(javaMethodSignatures, actionPropertyName)!""
		/>

		<#if resourceMethodName?has_content>
			protected String get${actionPropertyName?cap_first}ResourceMethodName() {
				return "${resourceMethodName!}";
			}
		<#else>
			protected abstract String get${actionPropertyName?cap_first}ResourceMethodName();
		</#if>
	</#list>

	protected final void registerActionInfo(ActionInfo actionInfo, String actionName) {
		_actionInfos.put(actionName, actionInfo);
	}

	private final Map<String, ActionInfo> _actionInfos = new HashMap<>();

}