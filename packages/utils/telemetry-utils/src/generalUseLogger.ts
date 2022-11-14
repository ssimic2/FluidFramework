/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { ITelemetryLogger } from "@fluidframework/common-definitions";

import {
    ITelemetryGeneralUseApiEvent,
    ITelemetryGeneralUseEvent,
} from "./logger";

/**
 * Helper class for general-use logs
 */
export class GeneralUseLogger {
    protected constructor(
        private readonly packageName: string,
        private readonly className: string,
        private readonly logger: ITelemetryLogger,
    ) {}

    public async logApiCall<T>(
        apiName: string,
        eventName: string,
        callback: (event: ITelemetryGeneralUseApiEvent) => Promise<T>,
        docId?: string,
        clientId?: string,
        details?: any,
    ) {
        const event: ITelemetryGeneralUseApiEvent = {
            type: "api",
            genUse: true,
            duration: 0,
            category: "performance",
            eventName,
            packageName: this.packageName,
            className: this.className,
            apiName,
            docId,
            clientId,
            details,
        };

        const startMark = `${event.eventName}-start`;
        this.performanceStart(event, startMark);

        try {
            const startTime = performance.now();
            const ret = await callback(event);
            event.duration = this.duration(startTime);
            this.performanceEnd(event, startMark);
            return ret;
        } catch (error) {
            this.performanceCancel(event);
            throw error;
        }
    }

    /* TODO */
    public async logServiceCall<T>() {}
    /* TODO */
    public async logErrorl<T>() {}
    /* TODO */
    public async logEvent<T>() {}

    private duration(startTime: number) { return performance.now() - startTime; }

    private performanceStart(
        event: ITelemetryGeneralUseEvent,
        startMark: string,
    ) {
        this.reportEvent(event, "start");
        if (
            typeof window === "object" &&
            window != null &&
            window.performance
        ) {
            window.performance.mark(startMark);
        }
    }

    private performanceEnd(
        event: ITelemetryGeneralUseEvent,
        startMark: string,
    ) {
        this.reportEvent(event, "end");
        if (
            typeof window === "object" &&
            window != null &&
            window.performance
        ) {
            const endMark = `${event.eventName}-end`;
            window.performance.mark(endMark);
            window.performance.measure(
                `${event.eventName}`,
                startMark,
                endMark,
            );
        }
    }

    private performanceCancel(event: ITelemetryGeneralUseEvent) {
        this.reportEvent(event, "cancel");
    }

    /**
     * Report the event, if it hasn't already been reported.
     */
    private reportEvent(
        event: ITelemetryGeneralUseEvent,
        eventNameSuffix?: string,
        error?: any,
    ) {
        if (eventNameSuffix) {
            event.eventName = `${event.eventName}_${eventNameSuffix}`;
        }
        this.logger.sendGeneralUseEvent(event, error);
    }
}
