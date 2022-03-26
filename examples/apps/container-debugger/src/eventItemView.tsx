/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { ILogItem } from "./eventTransformer";

export interface IEventItemViewProps {
    item: ILogItem;
    onSelect: () => void;
}

export const EventItemView: React.FC<IEventItemViewProps> = (
    props: IEventItemViewProps,
) => {
    const { item, onSelect } = props;
    // const [pillClass, setPillClass] = useState<string>("badge rounded-pill");

    // useEffect(() => {
    //     const c = item.eventGroupMeta.color;
    //     if(c === "blue") {
    //         setPillClass("bg-primary");
    //     } else if(c === "gray") {
    //         setPillClass("bg-secondary");
    //     } else {
    //         setPillClass("bg-gray");
    //     }
    // }, [item]);

    let bgColor;
    const c = item.eventGroupMeta.color;
    if (c === "blue") {
        bgColor = "#9ec5fe";
    } else if (c === "purple") {
        bgColor = "#c29ffa";
    } else if (c === "pink") {
        bgColor = "#efadce";
    } else if (c === "red") {
        bgColor = "#f1aeb5";
    } else if (c === "orange") {
        bgColor = "#fecba1";
    } else if (c === "yellow") {
        bgColor = "#ffe69c";
    } else if (c === "green") {
        bgColor = "#a3cfbb";
    } else if (c === "cyran") {
        bgColor = "#9eeaf9";
    } else {
        bgColor = "#e9ecef";
    }

    const layerIndicatorStyle = {
        height: "20px",
        marginTop: "4px",
        width: "4px",
        backgroundColor: bgColor,
    };

    let badgeClass;
    const b = item.eventItem.badgeType;
    if (b === "warning") {
        badgeClass = "bg-warning";
    } else if (b === "danger") {
        badgeClass = "bg-danger";
    } else if (b === "success") {
        badgeClass = "bg-success";
    }

    const isSynthetic: boolean = item.eventItem.data.isTriggered;
    return (
        <li
            className="list-group-item d-flex justify-content-between align-items-start"
            style={isSynthetic ? {backgroundColor: "rgba(0,0,0,.03)"} : undefined}
            onClick={onSelect}
        >
            <div style={layerIndicatorStyle}></div>
            <div className="ms-2 me-auto">
                <h5>{item.eventItem.title}</h5>
                {item.eventItem.subtitle1 !== undefined ? (
                    <div>{item.eventItem.subtitle1}</div>
                ) : null}
                {item.eventItem.subtitle2 !== undefined ? (
                    <div>{item.eventItem.subtitle2}</div>
                ) : null}
            </div>
            {badgeClass !== undefined ? (
                <span className={`badge ${badgeClass}`}>
                    {item.eventItem.badgeText}
                </span>
            ) : null}
        </li>
    );
};
