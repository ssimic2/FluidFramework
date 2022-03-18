/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import React from "react";
import ReactDOM from "react-dom";

import {
    AzureFunctionTokenProvider,
    AzureClient,
    AzureConnectionConfig,
    // LOCAL_MODE_TENANT_ID,
} from "@fluidframework/azure-client";
import {
    generateTestUser,
    InsecureTokenProvider,
} from "@fluidframework/test-client-utils";

import {
    IFluidContainer,
    SharedMap,
} from "fluid-framework";
import { TimestampController } from "./controller";
import { RollbackAgent } from "./RollbackAgent";

import { AppView } from "./appView";

// Define the server we will be using and initialize Fluid
const useAzure = process.env.FLUID_CLIENT === "azure";

const user = generateTestUser();

export const userConfig = {
    id: user.id,
    name: user.name,
};

const connectionConfig: AzureConnectionConfig = useAzure ? {
    tenantId: "1e298c52-acdc-49ad-baf7-b2516d555fe7",
    tokenProvider:
        new AzureFunctionTokenProvider(
            "https://ssazuretokengen.azurewebsites.net/api/GetFrsToken", {
                userId: "test-user", userName: "Test User" }),
    orderer: "https://alfred.westus2.fluidrelay.azure.com",
    storage: "https://historian.westus2.fluidrelay.azure.com",
} : {
    tenantId: "1e298c52-acdc-49ad-baf7-b2516d555fe7",
    tokenProvider: new InsecureTokenProvider("5f9d1943796b6d248041950aa2c1d7dc", userConfig),
    orderer: "https://alfred.westus2.fluidrelay.azure.com",
    storage: "https://historian.westus2.fluidrelay.azure.com",
};

// Define the schema of our Container.
const containerSchema = {
    initialObjects: {
        /* [id]: DataObject */
        map: SharedMap,
    },
};

async function initializeNewContainer(container: IFluidContainer): Promise<void> {
    // Initialize both of our SharedMaps for usage with a DiceRollerController
    const sharedMap = container.initialObjects.map as SharedMap;
    await Promise.all([
        TimestampController.initializeModel(sharedMap),
    ]);
}

async function start(): Promise<void> {
    const clientProps = {
        connection: connectionConfig,
    };
    const client = new AzureClient(clientProps);
    let container: IFluidContainer;
    let id: string;

    // Get or create the document depending if we are running through the create new flow
    const createNew = location.hash.length === 0;
    if (createNew) {
        // The client will create a new detached container using the schema
        // A detached container will enable the app to modify the container before attaching it to the client
        ({container} = await client.createContainer(containerSchema));
        // Initialize our models so they are ready for use with our controllers
        await initializeNewContainer(container);

        // If the app is in a `createNew` state, and the container is detached, we attach the container.
        // This uploads the container to the service and connects to the collaboration session.
        id = await container.attach();

        // Setup recover agent
        const rollContainerId = await RollbackAgent.createRecoveryContainer(id);
        const myMap = container.initialObjects.map as SharedMap;
        myMap.set("recoverContainerId", rollContainerId);

        // The newly attached container is given a unique ID that can be used to access the container in another session
        location.hash = id;
    } else {
        id = location.hash.substring(1);
        // Use the unique container ID to fetch the container created earlier.  It will already be connected to the
        // collaboration session.
        ({container} = await client.getContainer(id, containerSchema));
    }

    const sharedMap = container.initialObjects.map as SharedMap;
    const timestampController = new TimestampController(sharedMap);

    const updateCounter = async () => {
        timestampController.updateTimestamp();
    };

    const myMap = container.initialObjects.map as SharedMap;
    const recoveryContainerId = myMap.get("recoverContainerId");
    const rollbackAgent = await RollbackAgent.loadFromRecoveryContainer(recoveryContainerId);

    const forceCorruption = async () => {
        rollbackAgent.markCorrupted();
    };

    const recoverContainer = async () => {
        await rollbackAgent.recoverDoc();
    };

    // Given an IInventoryList, we can render the list and provide controls for users to modify it.
    const div = document.getElementById("content") as HTMLDivElement;
    ReactDOM.render(
        <AppView
            rollbackAgent={rollbackAgent}
            timestampController={timestampController}
            updateCounter={updateCounter}
            forceCorruption={forceCorruption}
            recoverContainer={recoverContainer}
        />,
        div,
    );
}

start().catch((error) => console.error(error));
