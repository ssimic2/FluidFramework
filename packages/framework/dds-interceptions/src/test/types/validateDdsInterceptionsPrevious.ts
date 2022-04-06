/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
/* eslint-disable max-lines */
import * as old from "@fluidframework/dds-interceptions-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createDirectoryWithInterception": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createDirectoryWithInterception():
    TypeOnly<typeof old.createDirectoryWithInterception>;
declare function use_current_FunctionDeclaration_createDirectoryWithInterception(
    use: TypeOnly<typeof current.createDirectoryWithInterception>);
use_current_FunctionDeclaration_createDirectoryWithInterception(
    get_old_FunctionDeclaration_createDirectoryWithInterception());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createDirectoryWithInterception": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createDirectoryWithInterception():
    TypeOnly<typeof current.createDirectoryWithInterception>;
declare function use_old_FunctionDeclaration_createDirectoryWithInterception(
    use: TypeOnly<typeof old.createDirectoryWithInterception>);
use_old_FunctionDeclaration_createDirectoryWithInterception(
    get_current_FunctionDeclaration_createDirectoryWithInterception());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createSharedMapWithInterception": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createSharedMapWithInterception():
    TypeOnly<typeof old.createSharedMapWithInterception>;
declare function use_current_FunctionDeclaration_createSharedMapWithInterception(
    use: TypeOnly<typeof current.createSharedMapWithInterception>);
use_current_FunctionDeclaration_createSharedMapWithInterception(
    get_old_FunctionDeclaration_createSharedMapWithInterception());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createSharedMapWithInterception": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createSharedMapWithInterception():
    TypeOnly<typeof current.createSharedMapWithInterception>;
declare function use_old_FunctionDeclaration_createSharedMapWithInterception(
    use: TypeOnly<typeof old.createSharedMapWithInterception>);
use_old_FunctionDeclaration_createSharedMapWithInterception(
    get_current_FunctionDeclaration_createSharedMapWithInterception());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createSharedStringWithInterception": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_createSharedStringWithInterception():
    TypeOnly<typeof old.createSharedStringWithInterception>;
declare function use_current_FunctionDeclaration_createSharedStringWithInterception(
    use: TypeOnly<typeof current.createSharedStringWithInterception>);
use_current_FunctionDeclaration_createSharedStringWithInterception(
    get_old_FunctionDeclaration_createSharedStringWithInterception());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken.0.58.2000:
* "FunctionDeclaration_createSharedStringWithInterception": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_createSharedStringWithInterception():
    TypeOnly<typeof current.createSharedStringWithInterception>;
declare function use_old_FunctionDeclaration_createSharedStringWithInterception(
    use: TypeOnly<typeof old.createSharedStringWithInterception>);
use_old_FunctionDeclaration_createSharedStringWithInterception(
    get_current_FunctionDeclaration_createSharedStringWithInterception());