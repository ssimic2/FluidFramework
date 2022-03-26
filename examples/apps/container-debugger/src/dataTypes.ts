/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
export interface ContainerInfo {
    id: string;
    connected: boolean
    dirty: boolean
}

export enum EventItemType {
    IncommingOp = 1,
    OutgoingOp,
    Snapshot,
    ContainerEvent,
}

export interface EventItem {
    id: string
    type: EventItemType
    title: string
    badgeText?: string,
    badgeType?: string
    subtitle1?: string,
    subtitle2?: string
    data: any
}
