/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React, {useState, useEffect} from "react";
import { ILogItem } from "./eventTransformer";

export interface IEventItemViewProps {
    item: ILogItem;
    onSelect: () => void;
}

export const EventItemView: React.FC<IEventItemViewProps> = (
    props: IEventItemViewProps,
) => {
    const { item, onSelect } = props;
    const [pillClass, setPillClass] = useState<string>("badge rounded-pill");

    useEffect(() => {
        const c = item.eventGroupMeta.color;
        if(c === "blue") {
            setPillClass("badge bg-primary rounded-pill");
        } else if(c === "gray") {
            setPillClass("badge bg-secondary rounded-pill");
        } else {
            setPillClass("badge bg-secondary rounded-pill");
        }
    }, [item]);

    return (
        <li
            className="list-group-item d-flex justify-content-between align-items-start"
            onClick={onSelect}
        >
            <div className="ms-2 me-auto">
                <div className="fw-bold">{item.eventItem.title}</div>
                {item.eventItem.subtitle}
            </div>
            <span className={pillClass}>{item.eventGroupMeta.title}</span>
        </li>
    );
};
