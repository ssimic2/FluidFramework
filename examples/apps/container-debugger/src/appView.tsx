/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
//
// import { ITelemetryBaseEvent } from "@fluidframework/common-definitions";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { EventItemView } from "./eventItemView";
import { EventTransformer, ILogItem } from "./eventTransformer";

export interface IAppViewProps {
    title: string;
    transformer: EventTransformer;
}

export interface IContainerItem {
    containerId: string;
    clientId?: string;
    clientType?: string;
}

export const AppView: React.FC<IAppViewProps> = (props: IAppViewProps) => {
    const [containerItems, setContainerItems] = useState<IContainerItem[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<
        IContainerItem | undefined
    >(undefined);

    const [logItems, setLogItems] = useState<ILogItem[]>([]);
    const [filteredEventItems, setFilteredEventItems] =
        useState<ILogItem[]>(logItems);
    const [selectedLogItem, setSelectedLogItem] = useState<
        ILogItem | undefined
    >(logItems[0]);

    useEffect(() => {
        const messageEvent = (event) => {
            let data: any;
            try {
                data = JSON.parse(event.data);
            } catch {
                console.log("cannot parse event", event);
                return;
            }

            const id = Math.round(event.timeStamp * 1000).toString();

            const logItem = props.transformer.getLogItem(id, data);
            if (!logItem) {
                return;
            }

            // const newItem = {
            //     id,
            //     type: EventItemType.IncommingOp,
            //     title: `${data.eventName} ${data.containerId}`,
            //     data,
            // };

            logItems.push(logItem);
            setLogItems([...logItems]);

            // Containers
            let citem: IContainerItem | undefined = containerItems.find(
                (i: IContainerItem) => {
                    return i.containerId === data.containerId;
                },
            );
            const isExisting = citem !== undefined;
            citem = citem ?? {
                containerId: data.containerId,
            };
            if (data.clientId !== undefined) {
                citem.clientId = data.clientId;
                citem.clientType = data.clientType;
            }
            if (!isExisting) {
                containerItems.push(citem);
            }
            setContainerItems([...containerItems]);

            if (event.origin !== "http://example.org:8080") {
                return;
            }
            // TODO: Set local state
        };
        window.addEventListener("message", messageEvent);
        return () => {
            window.removeEventListener("input", messageEvent);
        };
    }, []);

    useEffect(() => {
        if (selectedContainer) {
            const items = logItems.filter(
                (a) =>
                    a.eventItem.data.containerId ===
                    selectedContainer.containerId,
            );
            setFilteredEventItems(items);
        } else {
            setFilteredEventItems(logItems);
        }
    }, [selectedContainer]);

    return (
        <div className="container" style={{ marginTop: 40, marginBottom: 120 }}>
            <div className="row" style={{ marginTop: 40, marginBottom: 40 }}>
                <div className="col">
                    <h5>Select Container</h5>
                    <select
                        value={selectedContainer?.containerId ?? ""}
                        className="form-select"
                        onChange={(e) => {
                            const cId = e.target.value;
                            const item = containerItems.find(
                                (i) => i.containerId === cId,
                            );
                            setSelectedContainer(
                                item ??
                                    (cId && cId !== "All Containers"
                                        ? { containerId: cId }
                                        : undefined),
                            );
                        }}
                        aria-label="Default select example"
                    >
                        <option value={undefined}>All Containers</option>
                        {containerItems.map((c) => (
                            <option key={c.containerId} value={c.containerId}>
                                {c.containerId}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col">
                    {selectedContainer ? (
                        <div style={{ marginTop: 34 }}>
                            <p className="h6">
                                Client Id: {selectedContainer.clientId}
                            </p>
                            <p className="h6">
                                Client Type: {selectedContainer.clientType}
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="row" style={{ minWidth: 120 }}>
                <div
                    className="col overflow-auto"
                    style={{ minWidth: 120, maxHeight: 800 }}
                >
                    <ul className="list-group">
                        {filteredEventItems.map((item) => (
                            <EventItemView
                                key={item.eventItem.id}
                                item={item}
                                onSelect={() => setSelectedLogItem(item)}
                            />
                        ))}
                    </ul>
                </div>
                <div className="col overflow-auto" style={{ maxHeight: 800 }}>
                    <ReactJson
                        src={selectedLogItem ? (selectedLogItem as object) : {}}
                    />
                </div>
            </div>
        </div>
    );
};
