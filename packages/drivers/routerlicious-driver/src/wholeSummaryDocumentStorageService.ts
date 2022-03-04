/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { ITelemetryLogger } from "@fluidframework/common-definitions";
import {
    assert,
    IsoBuffer,
    stringToBuffer,
    Uint8ArrayToString,
} from "@fluidframework/common-utils";
import {
    IDocumentStorageService,
    ISummaryContext,
    IDocumentStorageServicePolicies,
 } from "@fluidframework/driver-definitions";
import {
    ICreateBlobResponse,
    ISnapshotTree,
    ISummaryBlob,
    ISummaryHandle,
    ISummaryTree,
    ITree,
    IVersion,
    SummaryObject,
    SummaryType,
} from "@fluidframework/protocol-definitions";
import {
    convertWholeFlatSummaryToSnapshotTreeAndBlobs,
    GitManager,
    ISummaryUploadManager,
    IWholeFlatSummary,
    WholeSummaryUploadManager,
} from "@fluidframework/server-services-client";
import { PerformanceEvent } from "@fluidframework/telemetry-utils";
import { ICache, InMemoryCache } from "./cache";
import { ISnapshotTreeVersion } from "./definitions";

const latestSnapshotId: string = "latest";

export class WholeSummaryDocumentStorageService implements IDocumentStorageService {
    private readonly summaryUploadManager: ISummaryUploadManager;
    private firstVersionsCall: boolean = true;

    public get repositoryUrl(): string {
        return "";
    }

    constructor(
        protected readonly id: string,
        protected readonly manager: GitManager,
        protected readonly logger: ITelemetryLogger,
        public readonly policies: IDocumentStorageServicePolicies = {},
        private readonly blobCache: ICache<ArrayBufferLike> = new InMemoryCache(),
        private readonly snapshotTreeCache: ICache<ISnapshotTreeVersion> = new InMemoryCache()) {
        this.summaryUploadManager = new WholeSummaryUploadManager(manager);
    }

    public async getVersions(versionId: string | null, count: number): Promise<IVersion[]> {
        if (versionId !== this.id && versionId) {
            // Blobs in this scenario will never have multiple versions, so return blobId as is
            return [{
                id: versionId,
                treeId: undefined!,
            }];
        }
        // If this is the first versions call for the document, we know we will want the latest summary.
        // Fetch latest summary, cache it, and return its id.
        if (this.firstVersionsCall && count === 1) {
            this.firstVersionsCall = false;
            const { id, snapshotTree } = await this.fetchAndCacheSnapshotTree(latestSnapshotId);
            return [{
                id,
                treeId: snapshotTree.id!,
            }];
        }

        // Otherwise, get the latest version of the document as normal.
        const id = versionId ? versionId : this.id;
        const commits = await PerformanceEvent.timedExecAsync(
            this.logger,
            {
                eventName: "getVersions",
                versionId: id,
                count,
            },
            async () => this.manager.getCommits(id, count),
        );
        return commits.map((commit) => ({
            date: commit.commit.author.date,
            id: commit.sha,
            treeId: commit.commit.tree.sha,
        }));
    }

    public async getSnapshotTree(version?: IVersion): Promise<ISnapshotTree | null> {
        let requestVersion = version;
        if (!requestVersion) {
            const versions = await this.getVersions(this.id, 1);
            if (versions.length === 0) {
                return null;
            }

            requestVersion = versions[0];
        }

        return (await this.fetchAndCacheSnapshotTree(requestVersion.id)).snapshotTree;
    }

    public async readBlob(blobId: string): Promise<ArrayBufferLike> {
        const cachedBlob = await this.blobCache.get(blobId);
        if (cachedBlob !== undefined) {
            return cachedBlob;
        }

        const blob = await PerformanceEvent.timedExecAsync(
            this.logger,
            {
                eventName: "readBlob",
                blobId,
            },
            async (event) => {
                const response = await this.manager.getBlob(blobId);
                event.end({
                    size: response.size,
                });
                return response;
            },
        );
        const bufferValue = stringToBuffer(blob.content, blob.encoding);

        await this.blobCache.put(blob.sha, bufferValue);

        return bufferValue;
    }

    public async uploadSummaryWithContext(summary: ISummaryTree, context: ISummaryContext): Promise<string> {
        const summaryHandle = await PerformanceEvent.timedExecAsync(
            this.logger,
            {
                eventName: "uploadSummaryWithContext",
            },
            async () => this.summaryUploadManager.writeSummaryTree(summary, context.ackHandle ?? "", "channel"),
        );
        return summaryHandle;
    }

    public async downloadSummary(handle: ISummaryHandle): Promise<ISummaryTree> {
        // throw new Error("NOT IMPLEMENTED!");
        const versions = await this.getVersions(this.id, 1);
        const requestVersion = versions[0];
        return await this.fetchSummaryTree(requestVersion.id);
    }

    public async write(tree: ITree, parents: string[], message: string, ref: string): Promise<IVersion> {
        throw new Error("NOT IMPLEMENTED!");
    }

    public async createBlob(file: ArrayBufferLike): Promise<ICreateBlobResponse> {
        const uint8ArrayFile = new Uint8Array(file);
        return PerformanceEvent.timedExecAsync(
            this.logger,
            {
                eventName: "createBlob",
                size: uint8ArrayFile.length,
            },
            async (event) => {
                const response = await this.manager.createBlob(
                    Uint8ArrayToString(
                        uint8ArrayFile, "base64"),
                    "base64").then((r) => ({ id: r.sha, url: r.url }));
                event.end({
                    blobId: response.id,
                });
                return response;
            },
        );
    }

    private async fetchAndCacheSnapshotTree(versionId: string): Promise<ISnapshotTreeVersion> {
        const cachedSnapshotTreeVersion = await this.snapshotTreeCache.get(versionId);
        if (cachedSnapshotTreeVersion !== undefined) {
            return { id: cachedSnapshotTreeVersion.id, snapshotTree: cachedSnapshotTreeVersion.snapshotTree };
        }

        const wholeFlatSummary = await PerformanceEvent.timedExecAsync(
            this.logger,
            {
                eventName: "getWholeFlatSummary",
                treeId: versionId,
            },
            async (event) => {
                const response = await this.manager.getSummary(versionId);
                event.end({
                    size: response.trees[0]?.entries.length,
                });
                return response;
            },
        );
        const normalizedWholeSummary = convertWholeFlatSummaryToSnapshotTreeAndBlobs(wholeFlatSummary);
        const wholeFlatSummaryId: string = wholeFlatSummary.id;
        const snapshotTreeId = normalizedWholeSummary.snapshotTree.id;
        assert(snapshotTreeId !== undefined, 0x275 /* "Root tree should contain the id" */);
        const snapshotTreeVersion = { id: wholeFlatSummaryId , snapshotTree: normalizedWholeSummary.snapshotTree };

        const cachePs: Promise<any>[] = [
            this.snapshotTreeCache.put(
                snapshotTreeId,
                snapshotTreeVersion,
            ),
            this.initBlobCache(normalizedWholeSummary.blobs),
        ];
        if (snapshotTreeId !== versionId) {
            // versionId could be "latest". When summarizer checks cache for "latest", we want it to be available.
            // TODO: For in-memory cache, <latest,snapshotTree> will be a shared pointer with <snapshotId,snapshotTree>,
            // However, for something like Redis, this will cache the same value twice. Alternatively, could we simply
            // cache with versionId?
            cachePs.push(this.snapshotTreeCache.put(
                versionId,
                snapshotTreeVersion,
            ));
        }

        await Promise.all(cachePs);

        return snapshotTreeVersion;
    }

    private async fetchSummaryTree(versionId: string): Promise<ISummaryTree> {
        const wholeFlatSummary = await PerformanceEvent.timedExecAsync(
            this.logger,
            {
                eventName: "getWholeFlatSummary",
                treeId: versionId,
            },
            async (event) => {
                const response = await this.manager.getSummary(versionId);
                event.end({
                    size: response.trees[0]?.entries.length,
                });
                return response;
            },
        );
        return this.convertWholeFlatSummaryToSummaryTree(wholeFlatSummary);
    }

    private async initBlobCache(blobs: Map<string, ArrayBuffer>): Promise<void> {
        const blobCachePutPs: Promise<void>[] = [];
        blobs.forEach((value, id) => {
            blobCachePutPs.push(this.blobCache.put(id, value));
        });
        await Promise.all(blobCachePutPs);
    }

    private convertWholeFlatSummaryToSummaryTree(
        flatSummary: IWholeFlatSummary,
    ): ISummaryTree {
        const {blobs, snapshotTree} = convertWholeFlatSummaryToSnapshotTreeAndBlobs(flatSummary);
        return convertSnapshotTreeToSummaryTree(snapshotTree, blobs);
    }
}

export const bufferToString = (blob: ArrayBufferLike, encoding: string): string =>
    IsoBuffer.from(blob).toString(encoding);

export function convertSnapshotTreeToSummaryTree(
    snapshot: ISnapshotTree,
    blobs: Map<string, ArrayBuffer>
    ): ISummaryTree {
    assert(Object.keys(snapshot.commits).length === 0,
        0x19e /* "There should not be commit tree entries in snapshot" */);

    const builder = new SummaryTreeBuilder();
    for (const [path, id] of Object.entries(snapshot.blobs)) {
        const blob = blobs.get(id);
        if (blob !== undefined) {
            builder.addBlob(path, bufferToString(blob, "utf-8"));
        }
    }

    for (const [key, tree] of Object.entries(snapshot.trees)) {
        const subtree = convertSnapshotTreeToSummaryTree(tree, blobs);
        builder.add(key, subtree);
    }

    const summaryTree = builder.getSummaryTree();
    summaryTree.unreferenced = snapshot.unreferenced;
    return summaryTree;
}

function addBlobToSummary(summary: ISummaryTree, key: string, content: string | Uint8Array): void {
    const blob: ISummaryBlob = {
        type: SummaryType.Blob,
        content,
    };
    summary.tree[key] = blob;
}
class SummaryTreeBuilder {
    private attachmentCounter: number = 0;

    public get summary(): ISummaryTree {
        return {
            type: SummaryType.Tree,
            tree: { ...this.summaryTree },
        };
    }

    private readonly summaryTree: { [path: string]: SummaryObject } = {};

    public addBlob(key: string, content: string | Uint8Array): void {
        // Prevent cloning by directly referencing underlying private properties
        addBlobToSummary(
            {
                type: SummaryType.Tree,
                tree: this.summaryTree,
            }, key, content);
    }

    public addHandle(
        key: string,
        handleType: SummaryType.Tree | SummaryType.Blob | SummaryType.Attachment,
        handle: string): void
    {
        this.summaryTree[key] = {
            type: SummaryType.Handle,
            handleType,
            handle,
        };
    }

    public add(key: string, summary: ISummaryTree): void {
        this.summaryTree[key] = summary;
    }

    public addAttachment(id: string) {
        this.summaryTree[this.attachmentCounter++] = { id, type: SummaryType.Attachment };
    }

    public getSummaryTree(): ISummaryTree {
        return this.summary;
    }
}
