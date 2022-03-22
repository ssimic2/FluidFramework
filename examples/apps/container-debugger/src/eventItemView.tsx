/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import { EventItem } from "./dataTypes";

export interface IEventItemViewProps {
    item: EventItem;
    onSelect: () => void;
}

export const EventItemView: React.FC<IEventItemViewProps> = (props: IEventItemViewProps) => {
    const { item, onSelect } = props;

    return (
        <div onClick={onSelect}>
            <span>{item.id} {item.title}</span>
        </div>
    );
};
