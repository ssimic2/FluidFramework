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
          tenantId: "tenantId",
          tokenProvider: new AzureFunctionTokenProvider(
              "https://ssazuretokengen.azurewebsites.net/api/GetFrsToken",
              {
                  userId: "test-user",
                  userName: "Test User",
              }
          ),
          orderer: "https://alfred.westus2.fluidrelay.azure.com",
          storage: "https://historian.westus2.fluidrelay.azure.com",
      }
    : {
          tenantId: "tenantId",
          tokenProvider: new InsecureTokenProvider(
              "tenantKey",
              userConfig
          ),
          orderer: "https://alfred.westus2.fluidrelay.azure.com",
          storage: "https://historian.westus2.fluidrelay.azure.com",
      };
