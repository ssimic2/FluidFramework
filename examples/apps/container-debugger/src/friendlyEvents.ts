/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventItem, EventItemType } from "./dataTypes";

/**
 * Event transformer
 */
 export class FriendlyEvents {
    public convertContainerLoadStart(id: string, data: any): EventItem {
        return {
            id,
            type: EventItemType.IncommingOp,
            title: `Container load kicked off.`,
            data,
        };
    }

    public convertContainerConnecting(id: string, data: any): EventItem {
        return {
            id,
            type: EventItemType.IncommingOp,
            title: `Container state change: connecting.`,
            data,
        };
    }

    public getEventItem(id: string, data: any): EventItem {
        // if(data.eventName === "fluid:telemetry:Container:Load_start") {
        //     return this.convertContainerLoadStart(id, data);
        // } else if(data.eventName === "fluid:telemetry:Container:ConnectionStateChange_Connecting") {
        //     return this.convertContainerConnecting(id, data);
        // } else if(data.eventName === "fluid:telemetry:RouterliciousDriver:readBlob_end") {
        //     return {
        //         id,
        //         type: EventItemType.IncommingOp,
        //         title: "RouterliciousDriver Read Blob",
        //         data,
        //     };
        // } else {
        //     return {
        //         id,
        //         type: EventItemType.IncommingOp,
        //         title: `${data.eventName}`,
        //         subtitle: `${data.containerId}`,
        //         data,
        //     };
        // }
        return {
            id,
            type: EventItemType.IncommingOp,
            title: `${data.eventName}`,
            subtitle: `${data.containerId}`,
            data,
        };
    }
}
