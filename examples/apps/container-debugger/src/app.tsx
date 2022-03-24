/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import React from "react";
import ReactDOM from "react-dom";

import { AzureClient } from "@fluidframework/azure-client";

import { IFluidContainer, SharedMap } from "fluid-framework";
import { connectionConfig } from "./azureConfig";

import { AppView } from "./appView";
import { EventItemType } from "./dataTypes";
// Define the schema of our Container.
const containerSchema = {
    initialObjects: {
        dataMap: SharedMap,
        recoveryMap: SharedMap,
    },
};

async function start(): Promise<void> {
    const clientProps = {
        connection: connectionConfig,
    };
    const client = new AzureClient(clientProps);
    let container: IFluidContainer;
    let containerId: string;

    const div = document.getElementById("content") as HTMLDivElement;
    ReactDOM.render(
        <div className="d-flex justify-content-center m-5">
            <div className="spinner-border" role="status" />
        </div>,
        div,
    );

    // Get or create the document depending if we are running through the create new flow
    const createNew = location.hash.length === 0;
    if (createNew) {
        // The client will create a new detached container using the schema
        // A detached container will enable the app to modify the container before attaching it to the client
        ({ container } = await client.createContainer(containerSchema));

        // If the app is in a `createNew` state, and the container is detached, we attach the container.
        // This uploads the container to the service and connects to the collaboration session.
        containerId = await container.attach();

        // The newly attached container is given a unique ID that can be used to access the container in another session
        location.hash = containerId;
    } else {
        containerId = location.hash.substring(1);
        // Use the unique container ID to fetch the container created earlier.  It will already be connected to the
        // collaboration session.
        ({ container } = await client.getContainer(
            containerId,
            containerSchema,
        ));
    }

    const containerInfo = {
        id: containerId,
        connected: true,
        dirty: false,
    };

    const eventItems = [
        {
            id: "1",
            type: EventItemType.IncommingOp,
            title: "Incoming op 1",
            data: { someData1: "hey" },
        },
        {
            id: "2",
            type: EventItemType.OutgoingOp,
            title: "Outgoing op 1",
            data: { someData2: "hey there" },
        },
    ];

    ReactDOM.render(
        <AppView containerInfo={containerInfo} eventItems={eventItems} />,
        div,
    );
}

start().catch((error) => console.error(error));
