/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import React from "react";
import ReactDOM from "react-dom";

import { AppView } from "./appView";
import { EventTransformer } from "./eventTransformer";

async function start(): Promise<void> {
    const div = document.getElementById("content") as HTMLDivElement;
    ReactDOM.render(
        <div className="d-flex justify-content-center m-5">
            <div className="spinner-border" role="status" />
        </div>,
        div,
    );

    const properties = {
        eventGroups: [
            {
                meta: {
                    title: "Container",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:Container:Load_start",
                    "fluid:telemetry:Container:ConnectionStateChange_Connecting",
                    "fluid:telemetry:Container:ConnectionStateChange_Connected",
                    "fluid:telemetry:Container:Attach_end",
                    "fluid:telemetry:Container:noWaitOnDisconnected",
                    "fluid:telemetry:Container:ConnectionStateChange_Disconnected",
                    "fluid:telemetry:Container:OpsSentOnReconnect",
                    "fluid:telemetry:Container:Request_end",
                    "fluid:telemetry:Container:Load_end",
                    "fluid:telemetry:ContainerLoadStats",
                    "fluid:telemetry:Container:Load_start",
                    "fluid:telemetry:Container:ConnectionStateChange_Connecting",
                ],
            },
            {
                meta: {
                    title: "Driver",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:RouterliciousDriver:readBlob_end",
                    "fluid:telemetry:RouterliciousDriver:getDeltas_end",
                    "fluid:telemetry:RouterliciousDriver:getVersions_end",
                    "fluid:telemetry:RouterliciousDriver:getSnapshotTree_end",
                    "fluid:telemetry:RouterliciousDriver:uploadSummaryWithContext_end",
                ],
            },
            {
                meta: {
                    title: "Summerizer",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:Summarizer:Running:Summarize_generate",
                    "fluid:telemetry:Summarizer:Running:Summarize_Op",
                    "fluid:telemetry:Summarizer:Running:Summarize_end",
                    "fluid:telemetry:Summarizer:RunningSummarizer",
                ],
            },
            {
                meta: {
                    title: "SummaryManager",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:SummaryManager:CreatingSummarizer",

                ],
            },
            {
                meta: {
                    title: "OpPerf",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:OpPerf:OpRoundtripTime",
                ],
            },
            {
                meta: {
                    title: "DeltaManager",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:DeltaManager:ExtraStorageCall",
                    "fluid:telemetry:DeltaManager:enqueueMessages",
                ],
            },
        ],
    };

    const transformer = new EventTransformer(properties);

    ReactDOM.render(<AppView title={"test"} transformer={transformer}/>, div);
}

start().catch((error) => console.error(error));
