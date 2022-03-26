/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventItem } from "./dataTypes";
import {FriendlyEvents} from "./friendlyEvents";

export interface IEventGroupMeta {
    title: string;
    color: string;
    filterOut: boolean;
}

export interface IEventGroup {
    meta: IEventGroupMeta;
    eventNames: string[]
}

export interface IEventTrasformerProperties {
    eventGroups: IEventGroup[];
}

const defaultMeta = {
    title: "Telemetry",
    color: "#cccccc",
    filterOut: false,
};

export interface ILogItem {
    eventItem: EventItem;
    eventGroupMeta: IEventGroupMeta
}

/**
 * Event transformer
 */
 export class EventTransformer {
    /**
     * @param properties - Base properties
     */
     private readonly eventProperties?: IEventTrasformerProperties;
     private readonly friendlyEvents: FriendlyEvents;

    public static create(
        properties?: IEventTrasformerProperties,
    ): EventTransformer {
        return new EventTransformer(properties);
    }

    constructor(properties?: IEventTrasformerProperties) {
        this.eventProperties = properties;
        this.friendlyEvents = new FriendlyEvents();
    }

    public findPropertyGroup(eventName: string): IEventGroup | undefined {
        if(!this.eventProperties) {
            return;
        }

        for(const eventGroup of this.eventProperties.eventGroups) {
            for(const item of eventGroup.eventNames) {
                if(eventName.startsWith(item)) {
                    return eventGroup;
                }
            }
        }
    }

    public getGroupData(eventName: string): IEventGroupMeta {
        const group = this.findPropertyGroup(eventName);
        return group ? group.meta : defaultMeta;
    }

    public getLogItem(id: string, data: any): ILogItem | undefined {
        const groupData = this.getGroupData(data.eventName);
        if(groupData.filterOut) {
            return;
        }

        return {
            eventGroupMeta: groupData,
            eventItem: this.friendlyEvents.getEventItem(id, data),
        };
    }
}
