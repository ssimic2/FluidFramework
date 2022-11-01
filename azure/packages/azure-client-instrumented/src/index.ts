/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * A simple and powerful way to consume collaborative Fluid data with the Azure Fluid Relay.
 *
 * @packageDocumentation
 */

export { InstrumentedAzureClient as AzureClient } from "./AzureClient";
export {
    AzureAudience,
    AzureClientProps,
    AzureConnectionConfig,
    AzureConnectionConfigType,
    AzureContainerServices,
    AzureContainerVersion,
    AzureFunctionTokenProvider,
    AzureGetVersionsOptions,
    AzureLocalConnectionConfig,
    AzureMember,
    AzureRemoteConnectionConfig,
    AzureUser,
    IAzureAudience,
    ITelemetryBaseEvent,
    ITelemetryBaseLogger,
    ITokenClaims,
    ITokenProvider,
    ITokenResponse,
    IUser,
    ScopeType,
} from "@fluidframework/azure-client";
