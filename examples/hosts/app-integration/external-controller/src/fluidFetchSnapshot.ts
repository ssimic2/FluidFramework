import {
    IDocumentService,
} from "@fluidframework/driver-definitions";
import {
    IVersion,
} from "@fluidframework/protocol-definitions";

export async function fluidFetchSnapshotVersions(
    documentService?: IDocumentService,
    saveDir?: string,
    ) {

    // --local mode - do not connect to storage.
    // For now, bail out early.
    // In future, separate download from analyzes parts and allow offline analyzes
    if (!documentService) {
        return;
    }

    const storage = await documentService.connectToStorage();
    return await storage.getVersions(null, 100);
}

export async function fetchBlobsFromVersion(documentService: IDocumentService, version?: IVersion) {
    const storage = await documentService.connectToStorage();
    const tree = storage.getSnapshotTree(version);
    if (!tree) {
        return Promise.reject(new Error("Failed to load snapshot tree"));
    }
    return tree;
}


export async function fetchSummaryFromVersion(documentService: IDocumentService, version?: IVersion) {
    const storage = await documentService.connectToStorage();

    const handle = {
        type: 3 as 3,
        handleType: 1 as 1,
        handle: "somestring"
    }

    const tree = storage.downloadSummary(handle);
    if (!tree) {
        return Promise.reject(new Error("Failed to load snapshot tree"));
    }
    return tree;
}
