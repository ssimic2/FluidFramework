/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    BaseContainerRuntimeFactory,
} from "@fluidframework/aqueduct";
import { IContainerRuntime } from "@fluidframework/container-runtime-definitions";
import { rootDataStoreRequestHandler } from "@fluidframework/request-handler";

import { RecoveryAgentInstantiationFactory } from "./recoveryAgent";

export const recoveryAgentId = "recovery-agent-id";

export class InventoryListContainerRuntimeFactory extends BaseContainerRuntimeFactory {
    constructor() {
        super(
            new Map([
                RecoveryAgentInstantiationFactory.registryEntry,
            ]), // registryEntries
            undefined,
            [
                rootDataStoreRequestHandler,
            ],
        );
    }

    /**
     * {@inheritDoc BaseContainerRuntimeFactory.containerInitializingFirstTime}
     */
    protected async containerInitializingFirstTime(runtime: IContainerRuntime) {
        await Promise.all([
            runtime.createRootDataStore(
                RecoveryAgentInstantiationFactory.type,
                recoveryAgentId,
            ),
        ]);
    }
}
