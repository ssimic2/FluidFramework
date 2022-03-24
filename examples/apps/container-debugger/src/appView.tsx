/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
//
// import { ITelemetryBaseEvent } from "@fluidframework/common-definitions";
import React, { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { EventItem } from "./dataTypes";
import { EventItemView } from "./eventItemView";
import { EventTransformer } from "./eventTransformer";

export interface IAppViewProps {
    title: string;
    transformer: EventTransformer;
}

export const AppView: React.FC<IAppViewProps> = (props: IAppViewProps) => {
    const [eventItems, setEventItems] = useState<EventItem[]>([]);
    const [filteredEventItems, setFilteredEventItems] =
        useState<EventItem[]>(eventItems);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | undefined>(
        eventItems[0],
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

            eventItems.push(logItem.eventItem);
            setEventItems([...eventItems]);

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
            const items = eventItems.filter(
                (a) => a.data.containerId === selectedContainer,
            );
            setFilteredEventItems(items);
        } else {
            setFilteredEventItems(eventItems);
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

            <div className="row">
                <div className="col">
                    {filteredEventItems.map((item) => (
                        <EventItemView
                            key={item.id}
                            item={item}
                            onSelect={() => setSelectedEvent(item)}
                        />
                    ))}
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
