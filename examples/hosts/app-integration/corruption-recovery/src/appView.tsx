/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useEffect, useState } from "react";

import { Alert, Button, Stack } from "react-bootstrap";

import { TimestampController } from "./controller";
import { RollbackAgent, RollbackStatus } from "./RollbackAgent";

export interface IAppViewProps {
    updateCounter: () => Promise<void>;
    forceCorruption: () => Promise<void>;
    recoverContainer: () => Promise<void>;
    timestampController: TimestampController;
    rollbackAgent: RollbackAgent;
}

export const AppView: React.FC<IAppViewProps> = (props: IAppViewProps) => {
    const {
        updateCounter,
        forceCorruption,
        recoverContainer,
        timestampController,
        rollbackAgent,
    } = props;

    const [timestamp, setTimestamp] = useState<number>(
        timestampController.value
    );

    const [rollbackStatus, setRollbackStatus] = useState<RollbackStatus>(
        rollbackAgent.getRecoveryStatus
    );

    useEffect(() => {
        const timestampHandler = () => {
            setTimestamp(timestampController.value);
        };
        timestampController.on("timeChanged", timestampHandler);
        return () => {
            timestampController.off("timeChanged", timestampHandler);
        };
    }, [timestampController]);

    useEffect(() => {
        const statusChange = () => {
            setRollbackStatus(rollbackAgent.getRecoveryStatus);
        };
        rollbackAgent.on("rollbackInfoChanged", statusChange);
        return () => {
            rollbackAgent.off("rollbackInfoChanged", statusChange);
        };
    }, [timestampController]);

    const showAlert =
        rollbackStatus.isContainerCorrupted ||
        rollbackStatus.isContainerRecovered;
    const alertVariant = rollbackStatus.isContainerRecovered
        ? "success"
        : "danger";
    const alertMsg = rollbackStatus.isContainerRecovered
        ? "Document was Recovered"
        : "Document Corrupted";

    return (
        <div className="col-md-12 text-center">
            {showAlert ? (
                <Alert variant={alertVariant}>{alertMsg}</Alert>
            ) : (
                <div style={{ marginBottom: 40 }} />
            )}

            <Stack gap={5}>
                <div>
                    <h2>My data - Counter:</h2>
                    <div style={{ marginBottom: 10, fontSize: 40 }}>
                        {timestamp}
                    </div>

                    <Button
                        className="btn btn-secondary"
                        onClick={updateCounter}
                    >
                        Update Counter
                    </Button>
                </div>

                <div>
                    <Button
                        className="btn btn-danger"
                        onClick={forceCorruption}
                    >
                        Force Corruption
                    </Button>
                    <Button
                        className="btn btn-primary"
                        onClick={recoverContainer}
                        // disabled={true}
                    >
                        Recover Container
                    </Button>
                </div>

                <div
                    className="col-md-6 center"
                    style={{ margin: "auto", marginTop: 48 }}
                >
                    <h5 style={{ marginBottom: 24 }}> Original Container </h5>
                    <table className="table table table-striped">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Id</td>
                                <td>{rollbackStatus.originalContainerId}</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Is Corrupted</td>
                                <td>
                                    {rollbackStatus.isContainerCorrupted.toString()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    className="col-md-6 center"
                    style={{ margin: "auto", marginTop: 48 }}
                >
                    <h5 style={{ marginBottom: 24 }}> Recovered Container </h5>
                    <table className="table table table-striped">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <th scope="row">1</th>
                                <td>Id</td>
                                <td>{rollbackStatus.recoveredContainerId}</td>
                            </tr>
                            <tr>
                                <th scope="row">2</th>
                                <td>Recovery Status</td>
                                <td>{rollbackStatus.recoveryStatus}</td>
                            </tr>
                            <tr>
                                <th scope="row">3</th>
                                <td>Recovery Log</td>
                                <td>{rollbackStatus.recoveryLog}</td>
                            </tr>
                            <tr>
                                <th scope="row">4</th>
                                <td>Recovered by Client</td>
                                <td>{rollbackStatus.recoveredBy}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Stack>
        </div>
    );
};
