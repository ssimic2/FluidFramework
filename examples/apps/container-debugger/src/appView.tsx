/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from "react";
import { Stack } from "react-bootstrap";
import ReactJson from "react-json-view";
import { ContainerInfo, EventItem } from "./dataTypes";
import { EventItemView } from "./eventItemView";

export interface IAppViewProps {
    containerInfo: ContainerInfo;
    eventItems?: EventItem[];
}

export const AppView: React.FC<IAppViewProps> = (props: IAppViewProps) => {
    const { containerInfo, eventItems } = props;
    const [selectedEvent, setSelectedEvent] = useState<EventItem | undefined>(
        eventItems && eventItems[0],
    );

    return (
        <div className="container">
            <Stack gap={5}>
                <div className="m-5">
                    <h5>My Container:</h5>
                    <div style={{ marginBottom: 10, fontSize: 40 }}>
                        {containerInfo.id}
                    </div>
                </div>
            </Stack>

            <div className="row">
                <div className="col">
                    <table className="table table-striped table-bordered">
                        <tbody>
                            {eventItems &&
                                eventItems.map((item) => (
                                    <EventItemView
                                        key={item.id}
                                        item={item}
                                        onSelect={() => setSelectedEvent(item)}
                                    />
                                ))}
                        </tbody>
                    </table>
                </div>
                <div className="col">
                    <ReactJson
                        src={selectedEvent ? (selectedEvent as object) : {}}
                    />
                </div>
            </div>
        </div>
    );
};
