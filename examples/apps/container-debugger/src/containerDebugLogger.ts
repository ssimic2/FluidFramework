/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    ITelemetryBaseEvent,
    ITelemetryBaseLogger,
} from "@fluidframework/common-definitions";
import { performance } from "@fluidframework/common-utils";
import { TelemetryLogger, MultiSinkLogger, ChildLogger, ITelemetryLoggerPropertyBags } from "@fluidframework/telemetry-utils";

/**
 * Implementation of debug logger
 */
export class ContainerDebugLogger extends TelemetryLogger {
    /**
     * Create debug logger - all events are output to debug npm library
     * @param namespace - Telemetry event name prefix to add to all events
     * @param properties - Base properties to add to all events
     * @param propertyGetters - Getters to add additional properties to all events
     */
    public static create(
        namespace: string,
        properties?: ITelemetryLoggerPropertyBags,
    ): TelemetryLogger {
        console.log("create debugger", namespace);


        // TODO: Kick Off another node process running our (Shell UI) App

        return new ContainerDebugLogger(properties);
    }

    /**
     * Mix in debug logger with another logger.
     * Returned logger will output events to both newly created debug logger, as well as base logger
     * @param namespace - Telemetry event name prefix to add to all events
     * @param properties - Base properties to add to all events
     * @param propertyGetters - Getters to add additional properties to all events
     * @param baseLogger - Base logger to output events (in addition to debug logger being created). Can be undefined.
     */
    public static mixinDebugLogger(
        namespace: string,
        baseLogger?: ITelemetryBaseLogger,
        properties?: ITelemetryLoggerPropertyBags,
    ): TelemetryLogger {
        console.log("mixinDebugLogger debugger", namespace);
        if (!baseLogger) {
            return ContainerDebugLogger.create(namespace, properties);
        }

        const multiSinkLogger = new MultiSinkLogger(undefined, properties);
        multiSinkLogger.addLogger(ContainerDebugLogger.create(namespace, this.tryGetBaseLoggerProps(baseLogger)));
        multiSinkLogger.addLogger(ChildLogger.create(baseLogger, namespace));

        return multiSinkLogger;
    }

    private static tryGetBaseLoggerProps(baseLogger?: ITelemetryBaseLogger) {
        if(baseLogger instanceof TelemetryLogger) {
            return (baseLogger as any as {properties: ITelemetryLoggerPropertyBags}).properties;
        }
        return undefined;
    }

    constructor(
        properties?: ITelemetryLoggerPropertyBags,
    ) {
        super(undefined, properties);
    }

    /**
     * Send an event to debug loggers
     *
     * @param event - the event to send
     */
    public send(event: ITelemetryBaseEvent): void {
        console.log("Container Debug Logger event -----", event);

        const index = event.eventName.lastIndexOf(TelemetryLogger.eventNamespaceSeparator);
        const name = event.eventName.substring(index + 1);
        const stack = event.stack ? event.stack : "";
        let tick = "";
        tick = `tick=${TelemetryLogger.formatTick(performance.now())}`;

        let payload: string;
        try {
            payload = JSON.stringify(event);
        } catch (error) {
            event.error = undefined;
            payload = JSON.stringify(event);
        }

        if (payload === "{}") {
            payload = "";
        }

        console.log(`CDL: ${name} ${payload} ${tick} ${stack}`);

        // TODO: Send message to our Shell App via IPC

    }
}
