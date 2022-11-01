/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { AzureAudience } from "@fluidframework/azure-client";
import { ITelemetryBaseLogger } from "@fluidframework/common-definitions";
import { IContainer } from "@fluidframework/container-definitions";
import { IMember } from "@fluidframework/fluid-static";
import { DebugLogger, TelemetryLogger } from "@fluidframework/telemetry-utils";

import { IAzureAudience } from "./interfaces";

/**
 * Azure-specific {@link @fluidframework/fluid-static#ServiceAudience} implementation.
 *
 */
export class InstrumentedAzureAudience extends AzureAudience implements IAzureAudience {
    private readonly logger: TelemetryLogger;

    constructor(container: IContainer, logger?: ITelemetryBaseLogger) {
        super(container);
        this.logger = this.createLogger(logger);
        super.on("memberAdded", this.memberAddedHandler);
        super.on("memberRemoved", this.memberRemovedHandler);
        super.on("membersChanged", this.membersChangedHandler);
    }

    private readonly memberAddedHandler = (clientId: string, member: IMember): void => {
        this.logger?.sendTelemetryEvent({ eventName: "memberAdded", clientId });
    };

    private readonly memberRemovedHandler = (clientId: string, member: IMember): void => {
        this.logger?.sendTelemetryEvent({ eventName: "memberRemoved", clientId });
    };

    private readonly membersChangedHandler = (): void => {
        this.logger?.sendTelemetryEvent({ eventName: "membersChanged" });
    };

    private createLogger(logger?: ITelemetryBaseLogger): TelemetryLogger {
        return DebugLogger.mixinDebugLogger(
            "fluid:api:@fluidframework/azure-client:AzureAudience",
            logger,
            {
                all: { azureClientVersion: "version" },
            },
        );
    }
}
