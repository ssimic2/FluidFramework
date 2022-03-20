/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    AzureFunctionTokenProvider,
    AzureClient,
    AzureConnectionConfig,
    AzureContainerServices,
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
import { DiceRollerController } from "./controller";
import { makeAppView } from "./view";

import { fluidFetchInit } from "./fluidFetchInit";
import {
    fluidFetchSnapshotVersions,
    fetchBlobsFromVersion,
    fetchSummaryFromVersion
  } from "./fluidFetchSnapshot";

export interface ICustomUserDetails {
    gender: string;
    email: string;
}

const fluidUrl =
  "https://alfred.westus2.fluidrelay.azure.com/?storage=https://historian.westus2.fluidrelay.azure.com";
const tenantId = "tenantId";
const containerId = "containerId";

// const userDetails: ICustomUserDetails = {
//     gender: "female",
//     email: "xyz@microsoft.com",
// };

// Define the server we will be using and initialize Fluid
const useAzure = process.env.FLUID_CLIENT === "azure";

const user = generateTestUser();

export const userConfig = {
    id: user.id,
    name: user.name,
};

const connectionConfig: AzureConnectionConfig = useAzure ? {
    tenantId: "tenantId",
    tokenProvider: 
        new AzureFunctionTokenProvider(
            "https://ssazuretokengen.azurewebsites.net/api/GetFrsToken", { 
                userId: "test-user", userName: "Test User" }),
    orderer: "https://alfred.westus2.fluidrelay.azure.com",
    storage: "https://historian.westus2.fluidrelay.azure.com",
} : {
    tenantId: "tenantId",
    tokenProvider: new InsecureTokenProvider("tenantKey", userConfig),
    orderer: "https://alfred.westus2.fluidrelay.azure.com",
    storage: "https://historian.westus2.fluidrelay.azure.com",
};


// Define the schema of our Container.
// This includes the DataObjects we support and any initial DataObjects we want created
// when the container is first created.
const containerSchema = {
    initialObjects: {
        /* [id]: DataObject */
        map1: SharedMap,
        map2: SharedMap,
    },
};

async function initializeNewContainer(container: IFluidContainer): Promise<void> {
    // Initialize both of our SharedMaps for usage with a DiceRollerController
    const sharedMap1 = container.initialObjects.map1 as SharedMap;
    const sharedMap2 = container.initialObjects.map2 as SharedMap;
    await Promise.all([
        DiceRollerController.initializeModel(sharedMap1),
        DiceRollerController.initializeModel(sharedMap2),
    ]);
}

async function start(): Promise<void> {
    // Create a custom ITelemetryBaseLogger object to pass into the Tinylicious container
    // and hook to the Telemetry system
    const clientProps = {
        connection: connectionConfig,
    };
    const client = new AzureClient(clientProps);
    let container: IFluidContainer;
    let services: AzureContainerServices;
    let id: string;

    // Get or create the document depending if we are running through the create new flow
    const createNew = location.hash.length === 0;
    if (createNew) {
        // The client will create a new detached container using the schema
        // A detached container will enable the app to modify the container before attaching it to the client
        ({container, services} = await client.createContainer(containerSchema));
        // Initialize our models so they are ready for use with our controllers
        await initializeNewContainer(container);

        // If the app is in a `createNew` state, and the container is detached, we attach the container.
        // This uploads the container to the service and connects to the collaboration session.
        id = await container.attach();
        // The newly attached container is given a unique ID that can be used to access the container in another session
        location.hash = id;
    } else {
        id = location.hash.substring(1);
        // Use the unique container ID to fetch the container created earlier.  It will already be connected to the
        // collaboration session.
        ({container, services} = await client.getContainer(id, containerSchema));
    }


    const docService = await fluidFetchInit(
        `${fluidUrl}&tenantId=${tenantId}&containerId=${containerId}`
      );

    const data = await fluidFetchSnapshotVersions(docService);
    console.log("Data", data)

    //const tree = await fetchBlobsFromVersion(docService);
    //console.log("Tree", tree)

    const tree1 = await fetchSummaryFromVersion(docService);
    console.log("Tree1", tree1)

    const { container: testContainer } = await client.createContainer(containerSchema);
    const newTree = JSON.parse(((testContainer as any).container.serialize()))
    console.log("newTree1", newTree)

    newTree.tree[".app"].tree[".channels"] = (tree1 as any).tree[".app"].tree[".channels"];
    console.log("newTree2", newTree)

    const { container: newContainer } = await client.createContainerFromSummary(containerSchema, JSON.stringify(newTree))
    console.log("c-------", newContainer)
    const newId = await newContainer.attach();
    console.log("newId-------", newId)


    document.title = id;

    // Here we are guaranteed that the maps have already been initialized for use with a DiceRollerController
    const sharedMap1 = container.initialObjects.map1 as SharedMap;
    const sharedMap2 = container.initialObjects.map2 as SharedMap;
    const diceRollerController1 = new DiceRollerController(sharedMap1);
    const diceRollerController2 = new DiceRollerController(sharedMap2);

    const contentDiv = document.getElementById("content") as HTMLDivElement;
    contentDiv.append(makeAppView([diceRollerController1, diceRollerController2], services.audience));
}

start().catch(console.error);
