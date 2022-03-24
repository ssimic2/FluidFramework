/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import React from "react";
import ReactDOM from "react-dom";

import { AppView } from "./appView";

async function start(): Promise<void> {
    const div = document.getElementById("content") as HTMLDivElement;
    ReactDOM.render(
        <div className="d-flex justify-content-center m-5">
            <div className="spinner-border" role="status" />
        </div>,
        div,
    );

    ReactDOM.render(<AppView title={"test"} />, div);
}

start().catch((error) => console.error(error));
