/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { ITelemetryBaseLogger } from "@fluidframework/common-definitions";
import { TypedEventEmitter } from "@fluidframework/common-utils";
import { AttachState, ConnectionState } from "@fluidframework/container-definitions";
import { IFluidLoadable } from "@fluidframework/core-interfaces";
import {
    IFluidContainer,
    IFluidContainerEvents,
    LoadableObjectClass,
    LoadableObjectRecord,
} from "@fluidframework/fluid-static";
import { DebugLogger, PerformanceEvent, TelemetryLogger } from "@fluidframework/telemetry-utils";

/**
 * Base {@link IFluidContainer} implementation.
 *
 * @remarks
 *
 * Note: this implementation is not complete. Consumers who rely on {@link IFluidContainer.attach}
 * will need to utilize or provide a service-specific implementation of this type that implements that method.
 */
export class InstrumentedFluidContainer
    extends TypedEventEmitter<IFluidContainerEvents>
    implements IFluidContainer
{
    private readonly internal: IFluidContainer;
    private readonly logger: TelemetryLogger;

    constructor(internal: IFluidContainer, logger?: ITelemetryBaseLogger) {
        super();
        this.logger = this.createLogger(logger);
        this.internal = internal;
        this.internal.on("connected", this.connectedHandler);
        this.internal.on("disconnected", this.disconnectedHandler);
        this.internal.on("disposed", this.disposedHandler);
        this.internal.on("saved", this.savedHandler);
        this.internal.on("dirty", this.dirtyHandler);
    }

    private readonly connectedHandler = (): void => {
        this.logger?.sendTelemetryEvent({ eventName: "connected" });
        this.emit("connected");
    };

    private readonly disposedHandler = (): void => {
        this.logger?.sendTelemetryEvent({ eventName: "disposed" });
        this.emit("disposed");
    };

    private readonly disconnectedHandler = (): void => {
        this.logger?.sendTelemetryEvent({ eventName: "disconnected" });
        this.emit("disconnected");
    };

    private readonly savedHandler = (): void => {
        this.logger?.sendTelemetryEvent({ eventName: "saved" });
        this.emit("saved");
    };

    private readonly dirtyHandler = (): void => {
        this.logger?.sendTelemetryEvent({ eventName: "dirty" });
        this.emit("dirty");
    };

    /**
     * {@inheritDoc IFluidContainer.isDirty}
     */
    public get isDirty(): boolean {
        return this.internal.isDirty;
    }

    /**
     * {@inheritDoc IFluidContainer.attachState}
     */
    public get attachState(): AttachState {
        return this.internal.attachState;
    }

    /**
     * {@inheritDoc IFluidContainer.disposed}
     */
    public get disposed(): boolean {
        return this.internal.disposed;
    }

    /**
     * {@inheritDoc IFluidContainer.connectionState}
     */
    public get connectionState(): ConnectionState {
        return this.internal.connectionState;
    }

    /**
     * {@inheritDoc IFluidContainer.initialObjects}
     */
    public get initialObjects(): LoadableObjectRecord {
        return this.internal.initialObjects;
    }

    /**
     * Incomplete base implementation of {@link IFluidContainer.attach}.
     *
     * @remarks
     *
     * Note: this implementation will unconditionally throw.
     * Consumers who rely on this will need to utilize or provide a service specific implementation of this base type
     * that provides an implementation of this method.
     *
     * The reason is because externally we are presenting a separation between the service and the `FluidContainer`,
     * but internally this separation is not there.
     */
    public async attach(): Promise<string> {
        return PerformanceEvent.timedExecAsync(this.logger, { eventName: "attach" }, async () => {
            return this.internal.attach();
        });
    }

    /**
     * {@inheritDoc IFluidContainer.connect}
     */
    public async connect(): Promise<void> {
        return PerformanceEvent.timedExecAsync(this.logger, { eventName: "connect" }, async () => {
            return this.internal.connect?.();
        });
    }

    /**
     * {@inheritDoc IFluidContainer.connect}
     */
    public async disconnect(): Promise<void> {
        return PerformanceEvent.timedExecAsync(
            this.logger,
            { eventName: "disconnect" },
            async () => {
                return this.internal.disconnect?.();
            },
        );
    }

    /**
     * {@inheritDoc IFluidContainer.create}
     */
    public async create<T extends IFluidLoadable>(objectClass: LoadableObjectClass<T>): Promise<T> {
        return PerformanceEvent.timedExecAsync(this.logger, { eventName: "create" }, async () => {
            return this.internal.create<T>(objectClass);
        });
    }

    /**
     * {@inheritDoc IFluidContainer.dispose}
     */
    public dispose(): void {
        this.internal.dispose();
        this.internal.off("connected", this.connectedHandler);
        this.internal.off("disposed", this.disposedHandler);
        this.internal.off("disconnected", this.disconnectedHandler);
        this.internal.off("saved", this.savedHandler);
        this.internal.off("dirty", this.dirtyHandler);
    }

    private createLogger(logger?: ITelemetryBaseLogger): TelemetryLogger {
        return DebugLogger.mixinDebugLogger(
            "fluid:api:@fluidframework/fluid-static:FluidContainer",
            logger,
            {
                all: { azureClientVersion: "version" },
            },
        );
    }
}
