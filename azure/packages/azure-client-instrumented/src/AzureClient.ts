/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    AzureClient,
    AzureClientProps,
    AzureContainerServices,
} from "@fluidframework/azure-client";
// import { ITelemetryLogger } from "@fluidframework/telemetry-utils";
import { ITelemetryBaseLogger } from "@fluidframework/common-definitions";
import { IContainer } from "@fluidframework/container-definitions";
import { ContainerSchema, IFluidContainer } from "@fluidframework/fluid-static";
import { DebugLogger, PerformanceEvent, TelemetryLogger } from "@fluidframework/telemetry-utils";

import { InstrumentedAzureAudience } from "./AzureAudience";
import { InstrumentedFluidContainer } from "./FluidContainer";

/**
 * AzureClient provides the ability to have a Fluid object backed by the Azure Fluid Relay or,
 * when running with local tenantId, have it be backed by a local Azure Fluid Relay instance.
 */
export class InstrumentedAzureClient extends AzureClient {
    private readonly logger: TelemetryLogger;
    private readonly baseLogger: ITelemetryBaseLogger | undefined;

    /**
     * Creates a new client instance using configuration parameters.
     * @param props - Properties for initializing a new AzureClient instance
     */
    constructor(props: AzureClientProps, logger?: ITelemetryBaseLogger) {
        super(props);
        this.baseLogger = logger;
        this.logger = this.createLogger(logger);
    }

    /**
     * Creates a new detached container instance in the Azure Fluid Relay.
     * @param containerSchema - Container schema for the new container.
     * @returns New detached container instance along with associated services.
     */
    public async createContainer(containerSchema: ContainerSchema): Promise<{
        container: IFluidContainer;
        services: AzureContainerServices;
    }> {
        const r = await PerformanceEvent.timedExecAsync(
            this.logger,
            { eventName: "createContainer" },
            async () => {
                return super.createContainer(containerSchema);
            },
        );
        return {
            container: new InstrumentedFluidContainer(r.container, this.baseLogger),
            services: r.services,
        };
    }

    /**
     * Accesses the existing container given its unique ID in the Azure Fluid Relay.
     * @param id - Unique ID of the container in Azure Fluid Relay.
     * @param containerSchema - Container schema used to access data objects in the container.
     * @returns Existing container instance along with associated services.
     */
    public async getContainer(
        id: string,
        containerSchema: ContainerSchema,
    ): Promise<{
        container: IFluidContainer;
        services: AzureContainerServices;
    }> {
        const r = await PerformanceEvent.timedExecAsync(
            this.logger,
            { eventName: "getContainer" },
            async () => {
                return super.getContainer(id, containerSchema);
            },
        );
        return {
            container: new InstrumentedFluidContainer(r.container, this.baseLogger),
            services: r.services,
        };
    }

    protected getContainerServices(container: IContainer): AzureContainerServices {
        return {
            audience: new InstrumentedAzureAudience(container, this.baseLogger),
        };
    }

    private createLogger(logger?: ITelemetryBaseLogger): TelemetryLogger {
        return DebugLogger.mixinDebugLogger(
            "fluid:api:@fluidframework/azure-client:AzureClient",
            logger,
            {
                all: { azureClientVersion: "version" },
            },
        );
    }

    // #endregion
}
