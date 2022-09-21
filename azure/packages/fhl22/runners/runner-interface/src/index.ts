import {
    IEvent,
    IEventProvider,
} from "@fluidframework/common-definitions";

export interface IRunnerEvents extends IEvent {
    (event: "status" | "error", listener: (s: string) => void): void;
    (event: "done", listener: () => void): void;
}

export interface IRunner extends IEventProvider<IRunnerEvents> {
    run(): Promise<unknown>;
    stop(): void;
}
