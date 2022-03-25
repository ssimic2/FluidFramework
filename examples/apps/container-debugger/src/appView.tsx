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

export const AppView: React.FC<IAppViewProps> = (props: IAppViewProps) => {
    const [logItems, setLogItems] = useState<ILogItem[]>([]);
    const [filteredEventItems, setFilteredEventItems] =
        useState<ILogItem[]>(logItems);
    const [selectedLogItem, setSelectedLogItem] = useState<ILogItem | undefined>(
        logItems[0],
    );

    const [liveContainers, setLiveContainers] = useState<string[]>([]);
    const [selectedContainer, setSelectedContainer] = useState<
        string | undefined
    >(undefined);

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
            if(!logItem) {
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

            if (liveContainers.indexOf(data.containerId) === -1) {
                liveContainers.push(data.containerId);
                setLiveContainers([...liveContainers]);
            }

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
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (selectedContainer) {
            const items = logItems.filter(
                (a) => a.eventItem.data.containerId === selectedContainer,
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
                        value={selectedContainer ?? ""}
                        className="form-select"
                        onChange={(e) => setSelectedContainer(e.target.value)}
                        aria-label="Default select example"
                    >
                        <option value={undefined}>All Containers</option>
                        {liveContainers.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col"></div>
            </div>

            <div className="row" style={{ minWidth: 120 }}>
                <div className="col" style={{ minWidth: 120 }}>
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
                <div className="col">
                    <ReactJson
                        src={selectedLogItem ? (selectedLogItem as object) : {}}
                    />
                </div>
            </div>
        </div>
    );
};
