/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from "react";
import { Stack } from "react-bootstrap";
export interface IAppViewProps {
    title: string;
}

export const AppView: React.FC<IAppViewProps> = (props: IAppViewProps) => {
    const { title } = props;

    return (
        <div className="col-md-12 text-center">
            <Stack gap={5}>
                <div className="m-5">
                    <h5>My Title:</h5>
                    <div style={{ marginBottom: 10, fontSize: 40 }}>
                        {title}
                    </div>
                </div>
            </Stack>
        </div>
    );
};
