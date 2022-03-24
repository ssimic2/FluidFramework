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
                    title: "some title",
                    color: "some color",
                    filterOut: false,
                },
                eventNames: ["xxx", "yyy"],
            },
            {
                meta: {
                    title: "Container",
                    color: "blue",
                    filterOut: false,
                },
                eventNames: [
                    "fluid:telemetry:Container:Load_start",
                    "fluid:telemetry:Container:ConnectionStateChange_Connecting",
                ],
            },
        ],
    };

    const transformer = new EventTransformer(properties);

    ReactDOM.render(<AppView title={"test"} transformer={transformer}/>, div);
}

start().catch((error) => console.error(error));
