/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { AzureUrlResolver } from "@fluidframework/azure-client/dist/AzureUrlResolver";
import {
    generateTestUser,
    InsecureTokenProvider,
} from "@fluidframework/test-client-utils";
import { IFluidResolvedUrl, IResolvedUrl, IUrlResolver } from "@fluidframework/driver-definitions";
import { configurableUrlResolver } from "@fluidframework/driver-utils";
import * as r11s from "@fluidframework/routerlicious-driver";
import { RouterliciousUrlResolver } from "@fluidframework/routerlicious-urlresolver";

export const latestVersionsId: string = "";
export let connectionInfo: any;

export let paramJWT: string;
export const paramAzureKey: string = "5f9d1943796b6d248041950aa2c1d7dc";

async function initializeAzure(resolvedUrl: IFluidResolvedUrl, tenantId: string) {
    connectionInfo = {
        server: resolvedUrl.endpoints.ordererUrl,
        tenantId,
        id: resolvedUrl.id,
    };
    
    console.log(`Connecting to Azure Fluid Relay: tenantId=${tenantId} id:${resolvedUrl.id}`);
    const user = generateTestUser();
    const tokenProvider = new InsecureTokenProvider(paramAzureKey, user);
    const r11sDocumentServiceFactory =
        new r11s.RouterliciousDocumentServiceFactory(tokenProvider, {
            enableWholeSummaryUpload: true,
        });
    return r11sDocumentServiceFactory.createDocumentService(resolvedUrl);
}

async function resolveUrl(url: string): Promise<IResolvedUrl | undefined> {
    const resolversList: IUrlResolver[] = [
        new RouterliciousUrlResolver(undefined, () => Promise.resolve(paramJWT), ""),
        new AzureUrlResolver(),
    ];
    const resolved = await configurableUrlResolver(resolversList, { url });
    return resolved;
}

export async function fluidFetchInit(urlStr: string) {
    console.log(`Connecting to URL: ${urlStr}`);
    const resolvedUrl = await resolveUrl(urlStr) as IFluidResolvedUrl;
    if (!resolvedUrl) {
        return Promise.reject(new Error(`Unknown URL ${urlStr}`));
    }
    const protocol = new URL(resolvedUrl.url).protocol;
    if (resolvedUrl.url.includes("fluidrelay.azure.com")) {
        const url = new URL(urlStr);
        const tenantId = url.searchParams.get("tenantId");
        if (tenantId === null) {
            throw new Error("Azure URL did not contain tenantId");
        }
        console.log(`Azure here we come`);
        return initializeAzure(resolvedUrl, tenantId);
    }
    return Promise.reject(new Error(`Unknown resolved protocol ${protocol}`));
}
