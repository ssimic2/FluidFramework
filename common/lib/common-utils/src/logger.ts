/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    ITelemetryBaseEvent,
    ITelemetryBaseLogger,
    ITelemetryErrorEvent,
    ITelemetryGenericEvent,
    ITelemetryLogger,
    ITelemetryPerformanceEvent,
} from "@fluidframework/common-definitions";


/**
 * General-use event.Strongly typed events that consumers can understand and act on.
 */
 export interface ITelemetryGeneraUseEventBase extends ITelemetryGenericEvent {
    packageName: string;
    className: string;
    docId?: string;
    clientId?: string;
}
/**
 * General use API event. Generated to log a request received by your API.
 */
 export interface ITelemetryGeneralUseApiEvent extends ITelemetryGeneraUseEventBase {
    duration: number;
    apiName: string;
    status?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
}

/**
 * General use Error event. Typically represents an exception that causes an operation to fail.
 */
export interface ITelemetryGeneralUseErrorEvent extends ITelemetryGeneraUseEventBase {
    apiName?: string;
    duration: number;
    exceptionType: string; // Todo: should be typed
    errorCode: string; //
    message: string;
    severityLevel: string; //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stackTrace?: any;
}

/**
 * General use dependency event. Represents a call from your app to an external service or storage.
 */
export interface ITelemetryGeneralUseDepenencyEvent extends ITelemetryGeneraUseEventBase {
    apiName?: string;
    duration: number;
    exceptionType: string; // Todo: should be typed
    errorCode: string; //
    message: string;
    severityLevel: string; //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stackTrace?: any;
}

/**
 * General use API event, capturing event firing on your class.
 * (Need a better name)
 */
export interface ITelemetryGeneralUseClassEvent extends ITelemetryGeneraUseEventBase {
    eventName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any;
}

export type ITelemetryGeneralUseEvent =
    | ITelemetryGeneralUseClassEvent
    | ITelemetryGeneralUseDepenencyEvent
    | ITelemetryGeneralUseErrorEvent
    | ITelemetryGeneralUseClassEvent;

/**
 * Null logger
 * It can be used in places where logger instance is required, but events should be not send over.
 * @deprecated BaseTelemetryNullLogger has been moved to the \@fluidframework/telemetry-utils package.
 */
export class BaseTelemetryNullLogger implements ITelemetryBaseLogger {
    /**
     * Send an event with the logger
     *
     * @param event - the event to send
     */
    public send(event: ITelemetryBaseEvent, skipPropPrep?: boolean): void {
        return;
    }
}

/**
 * Null logger
 * It can be used in places where logger instance is required, but events should be not send over.
 * @deprecated TelemetryNullLogger has been moved to the \@fluidframework/telemetry-utils package.
 */
export class TelemetryNullLogger implements ITelemetryLogger {
    public send(event: ITelemetryBaseEvent, skipPropPrep?: boolean): void {}
    public sendTelemetryEvent(event: ITelemetryGenericEvent, error?: any): void {}
    public sendErrorEvent(event: ITelemetryErrorEvent, error?: any): void {}
    public sendPerformanceEvent(event: ITelemetryPerformanceEvent, error?: any): void {}
    // public sendGeneralUseEvent(event: ITelemetryGeneralUseEvent, error?: any): void {}
}
