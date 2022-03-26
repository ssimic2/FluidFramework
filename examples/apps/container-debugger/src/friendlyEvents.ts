/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventItem, EventItemType } from "./dataTypes";

export interface FriendlyEventType {
    title: string;
    badgeType?: string;
    badgeTitle?: string;
    fields1?: string[],
    fields2?: string[],
    note1?: string,
    note2?: string,
}

const friendlyTypes = new Map<string, FriendlyEventType>([
    [
        "fluid:telemetry:Container:Load_start",
        {
            title: "Container load kicked off.",
        },
    ],
    [
        "fluid:telemetry:Container:Attach_end",
        {
            title: "Container was attached",
            fields1: ["containerAttachState"],
            note2: "Note: We still dont't have client ID!",
        },
    ],
    [
        "fluid:telemetry:Container:ConnectionStateChange_Connecting",
        {
            title: "Container state changed",
            badgeType: "warning",
            badgeTitle: "connecting",
            fields1: ["from"],
            fields2: ["connectionInitiationReason"],
        },
    ],
    [
        "fluid:telemetry:Container:ConnectionStateChange_Connected",
        {
            title: "Container state changed",
            badgeType: "success",
            badgeTitle: "connected",
            fields1: ["from", "connectionMode"],
            fields2: ["clientId"],
        },
    ],
    [
        "fluid:telemetry:Container:ConnectionStateChange_Disconnected",
        {
            title: "Container state changed",
            badgeType: "danger",
            badgeTitle: "disconnected",
            fields1: ["from", "reason"],
        },
    ],
    [
        "fluid:telemetry:Container:noWaitOnDisconnected",
        { title: "Waiting on container to disconnect", fields1: ["shouldClientJoinWrite"] },
    ],
    [
        "fluid:telemetry:RouterliciousDriver:getDeltas_end",
        { title: "Driver got delta ops", fields1: ["from", "to", "count"] },
    ],
    [
        "fluid:telemetry:Container:OpsSentOnReconnect",
        { title: "Container sent ops on reconnect", fields1:["count"]},
    ],
    [
        "fluid:telemetry:RouterliciousDriver:readBlob_end",
        {
            title: "Driver: Completed blob read",
            fields1:["blobId"],
            fields2:["size"],
        },
    ],
    [
        "fluid:telemetry:RouterliciousDriver:getVersions_end",
        { title: "Retreived snapshot versions", fields1:["docId", "count"] },
    ],
    [
        "fluid:telemetry:RouterliciousDriver:getSnapshotTree_end",
        { title: "Retreived snapshot", fields1:["treeId"] },
    ],
    [
        "fluid:telemetry:OpPerf:OpProcessed",
        {
            title: "Op Processed",
            fields1:["msgType"],
            fields2:["sequenceNumber", "localMessage"],
        },
    ],
    [
        "fluid:telemetry:Container:ContainerClose",
        {
            title: "Container Closed",
            fields1:["docId"],
        },
    ],
    [
        "fluid:telemetry:ContainerRuntimeDisposed",
        {
            title: "Container Runtime Disposed",
            fields1:["docId"],
            fields2:["lastSequenceNumber"],
        },
    ],
    [
        "fluid:telemetry:Container:summary",
        {
            title: "Retreived Container Summary",
            note1: "This is local synthetic event",
        },
    ],
]);

/**
 * Event transformer
 */
export class FriendlyEvents {
    public getEventItem(id: string, data: any): EventItem {
        const fitem = friendlyTypes.get(data.eventName);
        const subtitle1 = fitem?.fields1?.reduce((acc, key) => {
            const val = data[key];
            return `${acc}   ${key}: ${val}`;
        }, "");
        const subtitle2 = fitem?.fields2?.reduce((acc, key) => {
            const val = data[key];
            return `${acc}   ${key}: ${val}`;
        }, "");
        return {
            id,
            type: EventItemType.IncommingOp,
            title: fitem?.title ?? data.eventName,
            badgeText: fitem?.badgeTitle,
            badgeType: fitem?.badgeType,
            subtitle1: subtitle1?.trim() ?? (fitem?.note1 ?? `${data.containerId}`),
            subtitle2: subtitle2?.trim() ?? fitem?.note2,
            data,
        };
    }
}
