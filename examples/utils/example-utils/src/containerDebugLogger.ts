/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    ITelemetryBaseEvent,
    ITelemetryBaseLogger,
} from "@fluidframework/common-definitions";
import { performance } from "@fluidframework/common-utils";
import {
    TelemetryLogger,
    MultiSinkLogger,
    ChildLogger,
    ITelemetryLoggerPropertyBags,
} from "@fluidframework/telemetry-utils";

type ContainerStateFunction = (id: string) => any;
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
    private readonly debuggerPopup: Window | null;

    private readonly containerStateFun?: ContainerStateFunction;
    private readonly constainerStateTriggers?: string[];

    public static create(
        namespace: string,
        properties?: ITelemetryLoggerPropertyBags,
        containerStateFun?: ContainerStateFunction,
        constainerStateTriggers?: string[],
    ): TelemetryLogger {
        return new ContainerDebugLogger(
            properties,
            containerStateFun,
            constainerStateTriggers,
        );
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
        multiSinkLogger.addLogger(
            ContainerDebugLogger.create(
                namespace,
                this.tryGetBaseLoggerProps(baseLogger),
            ),
        );
        multiSinkLogger.addLogger(ChildLogger.create(baseLogger, namespace));

        return multiSinkLogger;
    }

    private static tryGetBaseLoggerProps(baseLogger?: ITelemetryBaseLogger) {
        if (baseLogger instanceof TelemetryLogger) {
            return (
                baseLogger as any as {
                    properties: ITelemetryLoggerPropertyBags;
                }
            ).properties;
        }
        return undefined;
    }

    constructor(
        properties?: ITelemetryLoggerPropertyBags,
        containerStateFun?: ContainerStateFunction,
        constainerStateTriggers?: string[],
    ) {
        super(undefined, properties);

        this.containerStateFun = containerStateFun;
        this.constainerStateTriggers = constainerStateTriggers;
        // Kick Off another node process running our (Shell UI) App
        const popupParams = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=0,height=0,left=-1000,top=-1000`;
        this.debuggerPopup = window.open(
            "http://localhost:8080/",
            "Container Debugger",
            popupParams,
        );
    }

    /**
     * Send an event to debug loggers
     *
     * @param event - the event to send
     */
    public send(event: ITelemetryBaseEvent): void {
        console.log("Container Debug Logger event -----", event);

        const index = event.eventName.lastIndexOf(
            TelemetryLogger.eventNamespaceSeparator,
        );
        const name = event.eventName.substring(index + 1);
        const stack = event.stack ?? "";
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
        this.debuggerPopup?.postMessage(payload, "http://localhost:8080/");

        if (
            this.containerStateFun &&
            this.constainerStateTriggers &&
            this.constainerStateTriggers.includes(event.eventName)
        ) {
            const docId = event.docId as string;
            this.containerStateFun(docId).then((result: any) => {
                const e = {
                    eventName: "fluid:telemetry:Container:summary",
                    isTriggered: true,
                    containerId: event.docId,
                    docId: event.docId,
                    containerInfo: result,
                };
                this.debuggerPopup?.postMessage(
                    JSON.stringify(e),
                    "http://localhost:8080/",
                );
            });
        } else {
            console.log(" cant find my function");
        }
    }
}
