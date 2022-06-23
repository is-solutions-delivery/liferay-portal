create unique index IX_7A27FEA3 on SXPBlueprint (companyId, externalReferenceCode[$COLUMN_LENGTH:75$]);
create index IX_C989A082 on SXPBlueprint (uuid_[$COLUMN_LENGTH:75$], companyId);

create unique index IX_D4D87BCC on SXPElement (companyId, externalReferenceCode[$COLUMN_LENGTH:75$]);
create index IX_62CF31E7 on SXPElement (companyId, readOnly);
create index IX_2F49914A on SXPElement (companyId, type_, status);
create index IX_34C38FAB on SXPElement (uuid_[$COLUMN_LENGTH:75$], companyId);