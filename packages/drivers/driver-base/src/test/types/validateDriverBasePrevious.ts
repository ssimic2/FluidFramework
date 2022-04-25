/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-validator in @fluidframework/build-tools.
 */
/* eslint-disable max-lines */
import * as old from "@fluidframework/driver-base-previous";
import * as current from "../../index";

type TypeOnly<T> = {
    [P in keyof T]: TypeOnly<T[P]>;
};

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DocumentDeltaConnection": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_DocumentDeltaConnection():
    TypeOnly<old.DocumentDeltaConnection>;
declare function use_current_ClassDeclaration_DocumentDeltaConnection(
    use: TypeOnly<current.DocumentDeltaConnection>);
use_current_ClassDeclaration_DocumentDeltaConnection(
    get_old_ClassDeclaration_DocumentDeltaConnection());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_DocumentDeltaConnection": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_DocumentDeltaConnection():
    TypeOnly<current.DocumentDeltaConnection>;
declare function use_old_ClassDeclaration_DocumentDeltaConnection(
    use: TypeOnly<old.DocumentDeltaConnection>);
use_old_ClassDeclaration_DocumentDeltaConnection(
    get_current_ClassDeclaration_DocumentDeltaConnection());
