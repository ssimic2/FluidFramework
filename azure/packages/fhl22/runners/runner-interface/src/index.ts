import {
    IEvent,
    IEventProvider,
} from "@fluidframework/common-definitions";

export type RunnnerStatus = "notstarted" | "running" | "success" | "error";
export interface IRunnerStatus{
    status: RunnnerStatus;
    description?: string;
    details: unknown;
}

export interface IRunnerEvents extends IEvent {
    (event: "status", listener: (s: IRunnerStatus) => void): void;
    (event: "started" | "done", listener: () => void): void;
}

export interface IRunner extends IEventProvider<IRunnerEvents> {
    run(): Promise<unknown>;
    getStatus(): IRunnerStatus;
    stop(): void;
}
