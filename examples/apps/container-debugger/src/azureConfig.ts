/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import {
    AzureFunctionTokenProvider,
    AzureConnectionConfig,
    // LOCAL_MODE_TENANT_ID,
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

export const connectionConfig: AzureConnectionConfig = useAzure
    ? {
          tenantId: "1e298c52-acdc-49ad-baf7-b2516d555fe7",
          tokenProvider: new AzureFunctionTokenProvider(
              "https://ssazuretokengen.azurewebsites.net/api/GetFrsToken",
              {
                  userId: "test-user",
                  userName: "Test User",
              },
          ),
          orderer: "https://alfred.westus2.fluidrelay.azure.com",
          storage: "https://historian.westus2.fluidrelay.azure.com",
      }
    : {
          tenantId: "1e298c52-acdc-49ad-baf7-b2516d555fe7",
          tokenProvider: new InsecureTokenProvider(
              "5f9d1943796b6d248041950aa2c1d7dc",
              userConfig,
          ),
          orderer: "https://alfred.westus2.fluidrelay.azure.com",
          storage: "https://historian.westus2.fluidrelay.azure.com",
      };
