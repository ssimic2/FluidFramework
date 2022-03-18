/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";
import { IValueChanged } from "fluid-framework";

/**
 * ITimestampController describes the public API surface for our timstamp data object.
 */
export interface ITimestampController extends EventEmitter {
    /**
     * Get the timestamp
     */
    readonly value: number;

    /**
     * Update timestamp. Will cause a "timeChanged" event to be emitted.
     */
    updateTimestamp: () => void;

    /**
     * The timeChanged event will fire whenever someone updates the timestamp, either locally or remotely.
     */
    on(event: "timeChanged", listener: () => void): this;
}

// The data is stored in a key-value pair data object, so we'll use this key for storing the value.
const timstampValueKey = "timstampValue";

interface TimestampControllerProps {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    on(event: "valueChanged", listener: (args: IValueChanged) => void): this;
    off(event: "valueChanged", listener: (args: IValueChanged) => void): this;
}

/**
 * The TimestampController is our data object that implements the ITimestampController interface.
 */
export class TimestampController extends EventEmitter implements ITimestampController {
    public static initializeModel(props: TimestampControllerProps) {
        props.set(timstampValueKey, 1);
    }

    constructor(private readonly props: TimestampControllerProps) {
        super();
        // const value = this.props.get(timstampValueKey);
        // if (typeof value !== "number") {
        //     throw new Error("Model is incorrect - did you call TimestampController.initializeModel() to set it up?");
        // }
        this.props.on("valueChanged", (changed) => {
            //if (changed.key === timstampValueKey) {
                this.emit("timeChanged");
            //}
        });
    }

    public get value() {
        const value = this.props.get(timstampValueKey);
        if (typeof value !== "number") {
            throw new Error("Model is incorrect - did you call TimestampController.initializeModel() to set it up?");
        }
        return value;
    }

    public readonly updateTimestamp = () => {
        // const rollValue = Math.floor(Math.random() * 6) + 1;
        this.props.set(timstampValueKey, this.value + 1);
    };
}
