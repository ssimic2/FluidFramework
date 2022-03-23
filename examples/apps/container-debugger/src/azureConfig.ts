/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    AzureFunctionTokenProvider,
    AzureConnectionConfig,
    LOCAL_MODE_TENANT_ID,
} from "@fluidframework/azure-client";
import {
    generateTestUser,
    InsecureTokenProvider,
} from "@fluidframework/test-client-utils";

// Define the server we will be using and initialize Fluid
const useAzure = process.env.FLUID_CLIENT === "azure";

const user = generateTestUser();

const userConfig = {
    id: user.id,
    name: user.name,
};

const azureUser = {
    userName: "TestUser",
    userId: "test-user",
};

export const connectionConfig: AzureConnectionConfig = useAzure
    ? {
          tenantId: "1e298c52-acdc-49ad-baf7-b2516d555fe7",
        tokenProvider: new AzureFunctionTokenProvider("https://sonaliazfunc.azurewebsites.net/api/GetFrsToken",
            azureUser),
        orderer: "https://alfred.westus2.fluidrelay.azure.com",
        storage: "https://historian.westus2.fluidrelay.azure.com",
      }
    : {
          tenantId: LOCAL_MODE_TENANT_ID,
          tokenProvider: new InsecureTokenProvider("fooBar", userConfig),
          orderer: "http://localhost:7070",
          storage: "http://localhost:7070",
      };
