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
                    title: "Filtered out",
                    color: "red",
                    filterOut: true,
                },
                eventNames: [
                    "fluid:telemetry:ScheduleManager",
                    "fluid:telemetry:Summarizer",
                    "fluid:telemetry:SummaryManager",
                    "fluid:telemetry:RouterliciousDriver:uploadSummaryWithContext",
                    "fluid:telemetry:Container:Request",
                ],
            },
            {
                meta: {
                    title: "Container",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:Container",
                    "fluid:telemetry:ContainerLoadStats",
                ],
            },
            {
                meta: {
                    title: "Driver",
                    color: "red",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:RouterliciousDriver:",
                ],
            },
            {
                meta: {
                    title: "OpPerf",
                    color: "yellow",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:OpPerf:OpRoundtripTime",
                ],
            },
            {
                meta: {
                    title: "DeltaManager",
                    color: "red",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:DeltaManager:",
                ],
            },
        ],
    };

    const transformer = new EventTransformer(properties);

    ReactDOM.render(<AppView title={"test"} transformer={transformer}/>, div);
}

start().catch((error) => console.error(error));
