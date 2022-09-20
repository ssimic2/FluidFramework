import {
    IEvent,
    IEventProvider,
} from "@fluidframework/common-definitions";

export interface IRunnerEvents extends IEvent {
    (event: "status" | "error" | "done", listener: () => void): void;
}

export interface IRunner extends IEventProvider<IRunnerEvents> {
    run(): Promise<void>;
    stop(): void;
}
