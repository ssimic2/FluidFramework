/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { assert, IsoBuffer, stringToBuffer, Uint8ArrayToString, unreachableCase } from "@fluidframework/common-utils";
import { getGitType } from "@fluidframework/protocol-base";
import { ISnapshotTree, ISummaryBlob, SummaryObject, SummaryType } from "@fluidframework/protocol-definitions";
import {
    ISummaryTree,
    IWholeSummaryTree,
    WholeSummaryTreeValue,
    IWholeSummaryTreeBaseEntry,
    WholeSummaryTreeEntry,
    IEmbeddedSummaryHandle,
    IWholeFlatSummaryTree,
    IWholeFlatSummary,
    INormalizedWholeSummary,
} from "./storageContracts";

/**
 * Convert a list of nodes to a tree path.
 * If a node is empty (blank) it will be removed.
 * If a node's name begins and/or ends with a "/", it will be removed.
 * @param nodeNames - node names in path
 */
export const buildTreePath = (...nodeNames: string[]): string =>
    nodeNames
        .map((nodeName) => nodeName.replace(/^\//, "").replace(/\/$/, ""))
        .filter((nodeName) => !!nodeName)
        .join("/");

/**
 * Converts the summary tree to a whole summary tree to be uploaded. Always upload full whole summary tree.
 * @param parentHandle - Handle of the last uploaded summary or detach new summary.
 * @param tree - Summary Tree which will be converted to whole summary tree to be uploaded.
 * @param path - Current path of node which is getting evaluated.
 */
export function convertSummaryTreeToWholeSummaryTree(
    parentHandle: string | undefined,
    tree: ISummaryTree,
    path: string = "",
    rootNodeName: string = "",
): IWholeSummaryTree {
    const wholeSummaryTree: IWholeSummaryTree = {
        type: "tree",
        entries: [] as WholeSummaryTreeEntry[],
    };

    const keys = Object.keys(tree.tree);
    for (const key of keys) {
        const summaryObject = tree.tree[key];

        let id: string | undefined;
        let value: WholeSummaryTreeValue | undefined;
        let unreferenced: true | undefined;

        const currentPath = path === ""
            ? buildTreePath(rootNodeName, key)
            : buildTreePath(path, key);
        switch (summaryObject.type) {
            case SummaryType.Tree: {
                const result = convertSummaryTreeToWholeSummaryTree(
                    parentHandle,
                    summaryObject,
                    currentPath,
                    rootNodeName,
                );
                value = result;
                unreferenced = summaryObject.unreferenced || undefined;
                break;
            }
            case SummaryType.Blob: {
                if (typeof summaryObject.content === "string") {
                    value = {
                        type: "blob",
                        content: summaryObject.content,
                        encoding: "utf-8",
                    };
                } else {
                    value = {
                        type: "blob",
                        content: Uint8ArrayToString(summaryObject.content, "base64"),
                        encoding: "base64",
                    };
                }
                break;
            }
            case SummaryType.Handle: {
                const handleValue = summaryObject as IEmbeddedSummaryHandle;
                if (handleValue.embedded) {
                    id = summaryObject.handle;
                } else {
                    if (!parentHandle) {
                        throw Error("Parent summary does not exist to reference by handle.");
                    }
                    id = buildTreePath(parentHandle, rootNodeName, summaryObject.handle);
                }
                break;
            }
            case SummaryType.Attachment: {
                id = summaryObject.id;
                break;
            }
            default: {
                unreachableCase(summaryObject, `Unknown type: ${(summaryObject as any).type}`);
            }
        }

        const baseEntry: IWholeSummaryTreeBaseEntry = {
            path: encodeURIComponent(key),
            type: getGitType(summaryObject),
        };

        let entry: WholeSummaryTreeEntry;

        if (value) {
            assert(id === undefined, 0x0ad /* "Snapshot entry has both a tree value and a referenced id!" */);
            entry = {
                value,
                unreferenced,
                ...baseEntry,
            };
        } else if (id) {
            entry = {
                ...baseEntry,
                id,
            };
        } else {
            throw new Error(`Invalid tree entry for ${summaryObject.type}`);
        }

        wholeSummaryTree.entries.push(entry);
    }

    return wholeSummaryTree;
}

/**
 * Build a tree heirarchy from a flat tree.
 *
 * @param flatTree - a flat tree
 * @returns the heirarchical tree
 */
function buildHeirarchy(flatTree: IWholeFlatSummaryTree): ISnapshotTree {
    const lookup: { [path: string]: ISnapshotTree } = {};
    // Root tree id will be used to determine which version was downloaded.
    const root: ISnapshotTree = { id: flatTree.id, blobs: {}, trees: {}, commits: {}};
    lookup[""] = root;

    for (const entry of flatTree.entries) {
        // Strip the .app/ path from app tree entries such that they are stored under root.
        const entryPath = entry.path.replace(/^\.app\//, "");
        const lastIndex = entryPath.lastIndexOf("/");
        const entryPathDir = entryPath.slice(0, Math.max(0, lastIndex));
        const entryPathBase = entryPath.slice(lastIndex + 1);

        // The flat output is breadth-first so we can assume we see tree nodes prior to their contents
        const node = lookup[entryPathDir];

        // Add in either the blob or tree
        if (entry.type === "tree") {
            const newTree: ISnapshotTree = { blobs: {}, commits: {}, trees: {}, unreferenced: entry.unreferenced };
            node.trees[decodeURIComponent(entryPathBase)] = newTree;
            lookup[entryPath] = newTree;
        } else if (entry.type === "blob") {
            node.blobs[decodeURIComponent(entryPathBase)] = entry.id;
        } else {
            throw new Error(`Unknown entry type!!`);
        }
    }

    return root;
}

/**
 * Converts existing IWholeFlatSummary to snapshot tree, blob array, and sequence number.
 *
 * @param flatSummary - flat summary
 */
export function convertWholeFlatSummaryToSnapshotTreeAndBlobs(
    flatSummary: IWholeFlatSummary,
): INormalizedWholeSummary {
    const blobs = new Map<string, ArrayBuffer>();
    if (flatSummary.blobs) {
        flatSummary.blobs.forEach((blob) => {
            blobs.set(blob.id, stringToBuffer(blob.content, blob.encoding ?? "utf-8"));
        });
    }
    const flatSummaryTree = flatSummary.trees && flatSummary.trees[0];
    const sequenceNumber = flatSummaryTree?.sequenceNumber;
    const snapshotTree = buildHeirarchy(flatSummaryTree);

    return {
        blobs,
        snapshotTree,
        sequenceNumber,
    };
}

export function convertWholeFlatSummaryToSummaryTree(
    flatSummary: IWholeFlatSummary,
): ISummaryTree {
    const {blobs, snapshotTree} = convertWholeFlatSummaryToSnapshotTreeAndBlobs(flatSummary);
    return convertSnapshotTreeToSummaryTree(snapshotTree, blobs);
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



export function addBlobToSummary(summary: ISummaryTree, key: string, content: string | Uint8Array): void {
    const blob: ISummaryBlob = {
        type: SummaryType.Blob,
        content,
    };
    summary.tree[key] = blob;
}

export class SummaryTreeBuilder {
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
