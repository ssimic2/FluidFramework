/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
/* eslint-disable max-lines */
import * as old from "@fluidframework/azure-client-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_AzureAudience": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_AzureAudience():
    TypeOnly<old.AzureAudience>;
declare function use_current_ClassDeclaration_AzureAudience(
    use: TypeOnly<current.AzureAudience>);
use_current_ClassDeclaration_AzureAudience(
    get_old_ClassDeclaration_AzureAudience());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_AzureAudience": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_AzureAudience():
    TypeOnly<current.AzureAudience>;
declare function use_old_ClassDeclaration_AzureAudience(
    use: TypeOnly<old.AzureAudience>);
use_old_ClassDeclaration_AzureAudience(
    get_current_ClassDeclaration_AzureAudience());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_AzureClient": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_AzureClient():
    TypeOnly<old.AzureClient>;
declare function use_current_ClassDeclaration_AzureClient(
    use: TypeOnly<current.AzureClient>);
use_current_ClassDeclaration_AzureClient(
    // @ts-expect-error compatibility expected to be broken
    get_old_ClassDeclaration_AzureClient());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_AzureClient": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_AzureClient():
    TypeOnly<current.AzureClient>;
declare function use_old_ClassDeclaration_AzureClient(
    use: TypeOnly<old.AzureClient>);
use_old_ClassDeclaration_AzureClient(
    get_current_ClassDeclaration_AzureClient());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureClientProps": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_AzureClientProps():
    TypeOnly<old.AzureClientProps>;
declare function use_current_InterfaceDeclaration_AzureClientProps(
    use: TypeOnly<current.AzureClientProps>);
use_current_InterfaceDeclaration_AzureClientProps(
    get_old_InterfaceDeclaration_AzureClientProps());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureClientProps": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_AzureClientProps():
    TypeOnly<current.AzureClientProps>;
declare function use_old_InterfaceDeclaration_AzureClientProps(
    use: TypeOnly<old.AzureClientProps>);
use_old_InterfaceDeclaration_AzureClientProps(
    get_current_InterfaceDeclaration_AzureClientProps());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureConnectionConfig": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_AzureConnectionConfig():
    TypeOnly<old.AzureConnectionConfig>;
declare function use_current_InterfaceDeclaration_AzureConnectionConfig(
    use: TypeOnly<current.AzureConnectionConfig>);
use_current_InterfaceDeclaration_AzureConnectionConfig(
    get_old_InterfaceDeclaration_AzureConnectionConfig());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureConnectionConfig": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_AzureConnectionConfig():
    TypeOnly<current.AzureConnectionConfig>;
declare function use_old_InterfaceDeclaration_AzureConnectionConfig(
    use: TypeOnly<old.AzureConnectionConfig>);
use_old_InterfaceDeclaration_AzureConnectionConfig(
    get_current_InterfaceDeclaration_AzureConnectionConfig());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureContainerServices": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_AzureContainerServices():
    TypeOnly<old.AzureContainerServices>;
declare function use_current_InterfaceDeclaration_AzureContainerServices(
    use: TypeOnly<current.AzureContainerServices>);
use_current_InterfaceDeclaration_AzureContainerServices(
    get_old_InterfaceDeclaration_AzureContainerServices());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureContainerServices": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_AzureContainerServices():
    TypeOnly<current.AzureContainerServices>;
declare function use_old_InterfaceDeclaration_AzureContainerServices(
    use: TypeOnly<old.AzureContainerServices>);
use_old_InterfaceDeclaration_AzureContainerServices(
    get_current_InterfaceDeclaration_AzureContainerServices());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_AzureFunctionTokenProvider": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_AzureFunctionTokenProvider():
    TypeOnly<old.AzureFunctionTokenProvider>;
declare function use_current_ClassDeclaration_AzureFunctionTokenProvider(
    use: TypeOnly<current.AzureFunctionTokenProvider>);
use_current_ClassDeclaration_AzureFunctionTokenProvider(
    get_old_ClassDeclaration_AzureFunctionTokenProvider());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "ClassDeclaration_AzureFunctionTokenProvider": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_AzureFunctionTokenProvider():
    TypeOnly<current.AzureFunctionTokenProvider>;
declare function use_old_ClassDeclaration_AzureFunctionTokenProvider(
    use: TypeOnly<old.AzureFunctionTokenProvider>);
use_old_ClassDeclaration_AzureFunctionTokenProvider(
    get_current_ClassDeclaration_AzureFunctionTokenProvider());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureMember": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_AzureMember():
    TypeOnly<old.AzureMember>;
declare function use_current_InterfaceDeclaration_AzureMember(
    use: TypeOnly<current.AzureMember>);
use_current_InterfaceDeclaration_AzureMember(
    get_old_InterfaceDeclaration_AzureMember());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_AzureMember": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_AzureMember():
    TypeOnly<current.AzureMember>;
declare function use_old_InterfaceDeclaration_AzureMember(
    use: TypeOnly<old.AzureMember>);
use_old_InterfaceDeclaration_AzureMember(
    get_current_InterfaceDeclaration_AzureMember());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "TypeAliasDeclaration_IAzureAudience": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_IAzureAudience():
    TypeOnly<old.IAzureAudience>;
declare function use_current_TypeAliasDeclaration_IAzureAudience(
    use: TypeOnly<current.IAzureAudience>);
use_current_TypeAliasDeclaration_IAzureAudience(
    get_old_TypeAliasDeclaration_IAzureAudience());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "TypeAliasDeclaration_IAzureAudience": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_IAzureAudience():
    TypeOnly<current.IAzureAudience>;
declare function use_old_TypeAliasDeclaration_IAzureAudience(
    use: TypeOnly<old.IAzureAudience>);
use_old_TypeAliasDeclaration_IAzureAudience(
    get_current_TypeAliasDeclaration_IAzureAudience());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITelemetryBaseEvent": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITelemetryBaseEvent():
    TypeOnly<old.ITelemetryBaseEvent>;
declare function use_current_InterfaceDeclaration_ITelemetryBaseEvent(
    use: TypeOnly<current.ITelemetryBaseEvent>);
use_current_InterfaceDeclaration_ITelemetryBaseEvent(
    get_old_InterfaceDeclaration_ITelemetryBaseEvent());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITelemetryBaseEvent": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITelemetryBaseEvent():
    TypeOnly<current.ITelemetryBaseEvent>;
declare function use_old_InterfaceDeclaration_ITelemetryBaseEvent(
    use: TypeOnly<old.ITelemetryBaseEvent>);
use_old_InterfaceDeclaration_ITelemetryBaseEvent(
    get_current_InterfaceDeclaration_ITelemetryBaseEvent());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITelemetryBaseLogger": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITelemetryBaseLogger():
    TypeOnly<old.ITelemetryBaseLogger>;
declare function use_current_InterfaceDeclaration_ITelemetryBaseLogger(
    use: TypeOnly<current.ITelemetryBaseLogger>);
use_current_InterfaceDeclaration_ITelemetryBaseLogger(
    get_old_InterfaceDeclaration_ITelemetryBaseLogger());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITelemetryBaseLogger": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITelemetryBaseLogger():
    TypeOnly<current.ITelemetryBaseLogger>;
declare function use_old_InterfaceDeclaration_ITelemetryBaseLogger(
    use: TypeOnly<old.ITelemetryBaseLogger>);
use_old_InterfaceDeclaration_ITelemetryBaseLogger(
    get_current_InterfaceDeclaration_ITelemetryBaseLogger());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITokenClaims": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITokenClaims():
    TypeOnly<old.ITokenClaims>;
declare function use_current_InterfaceDeclaration_ITokenClaims(
    use: TypeOnly<current.ITokenClaims>);
use_current_InterfaceDeclaration_ITokenClaims(
    get_old_InterfaceDeclaration_ITokenClaims());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITokenClaims": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITokenClaims():
    TypeOnly<current.ITokenClaims>;
declare function use_old_InterfaceDeclaration_ITokenClaims(
    use: TypeOnly<old.ITokenClaims>);
use_old_InterfaceDeclaration_ITokenClaims(
    get_current_InterfaceDeclaration_ITokenClaims());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITokenProvider": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITokenProvider():
    TypeOnly<old.ITokenProvider>;
declare function use_current_InterfaceDeclaration_ITokenProvider(
    use: TypeOnly<current.ITokenProvider>);
use_current_InterfaceDeclaration_ITokenProvider(
    get_old_InterfaceDeclaration_ITokenProvider());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITokenProvider": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITokenProvider():
    TypeOnly<current.ITokenProvider>;
declare function use_old_InterfaceDeclaration_ITokenProvider(
    use: TypeOnly<old.ITokenProvider>);
use_old_InterfaceDeclaration_ITokenProvider(
    get_current_InterfaceDeclaration_ITokenProvider());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITokenResponse": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITokenResponse():
    TypeOnly<old.ITokenResponse>;
declare function use_current_InterfaceDeclaration_ITokenResponse(
    use: TypeOnly<current.ITokenResponse>);
use_current_InterfaceDeclaration_ITokenResponse(
    get_old_InterfaceDeclaration_ITokenResponse());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_ITokenResponse": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITokenResponse():
    TypeOnly<current.ITokenResponse>;
declare function use_old_InterfaceDeclaration_ITokenResponse(
    use: TypeOnly<old.ITokenResponse>);
use_old_InterfaceDeclaration_ITokenResponse(
    get_current_InterfaceDeclaration_ITokenResponse());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_IUser": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IUser():
    TypeOnly<old.IUser>;
declare function use_current_InterfaceDeclaration_IUser(
    use: TypeOnly<current.IUser>);
use_current_InterfaceDeclaration_IUser(
    get_old_InterfaceDeclaration_IUser());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "InterfaceDeclaration_IUser": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IUser():
    TypeOnly<current.IUser>;
declare function use_old_InterfaceDeclaration_IUser(
    use: TypeOnly<old.IUser>);
use_old_InterfaceDeclaration_IUser(
    get_current_InterfaceDeclaration_IUser());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "VariableDeclaration_LOCAL_MODE_TENANT_ID": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_LOCAL_MODE_TENANT_ID():
    TypeOnly<typeof old.LOCAL_MODE_TENANT_ID>;
declare function use_current_VariableDeclaration_LOCAL_MODE_TENANT_ID(
    use: TypeOnly<typeof current.LOCAL_MODE_TENANT_ID>);
use_current_VariableDeclaration_LOCAL_MODE_TENANT_ID(
    get_old_VariableDeclaration_LOCAL_MODE_TENANT_ID());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "VariableDeclaration_LOCAL_MODE_TENANT_ID": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_LOCAL_MODE_TENANT_ID():
    TypeOnly<typeof current.LOCAL_MODE_TENANT_ID>;
declare function use_old_VariableDeclaration_LOCAL_MODE_TENANT_ID(
    use: TypeOnly<typeof old.LOCAL_MODE_TENANT_ID>);
use_old_VariableDeclaration_LOCAL_MODE_TENANT_ID(
    get_current_VariableDeclaration_LOCAL_MODE_TENANT_ID());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "EnumDeclaration_ScopeType": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_ScopeType():
    TypeOnly<old.ScopeType>;
declare function use_current_EnumDeclaration_ScopeType(
    use: TypeOnly<current.ScopeType>);
use_current_EnumDeclaration_ScopeType(
    get_old_EnumDeclaration_ScopeType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2002:
* "EnumDeclaration_ScopeType": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_ScopeType():
    TypeOnly<current.ScopeType>;
declare function use_old_EnumDeclaration_ScopeType(
    use: TypeOnly<old.ScopeType>);
use_old_EnumDeclaration_ScopeType(
    get_current_EnumDeclaration_ScopeType());
