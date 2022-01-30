/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { Uint8ArrayToString,unreachableCase} from "@fluidframework/common-utils";
import { AttachmentTreeEntry, BlobTreeEntry, TreeTreeEntry } from "@fluidframework/protocol-base";
import * as api from "@fluidframework/protocol-definitions";

/**
 * Converts ISummaryTree to ITree format.
 * @param summaryTree - summary tree in ISummaryTree format
 */
 export function convertSummaryTreeToSnapshotITree( summaryTree: api.ISummaryTree ): api.ITree {
        const entries: api.ITreeEntry[] = [];
        const protocolSummary = summaryTree.tree[".protocol"] as api.ISummaryTree;
        const appSummary = summaryTree.tree[".app"] as api.ISummaryTree;
        const adaptSumaryTree = protocolSummary && appSummary;
        const allSummaryEntries = adaptSumaryTree ? [
                ...Object.entries(protocolSummary.tree), 
                ...Object.entries(appSummary.tree)
            ] : Object.entries(summaryTree.tree)

        for (const [key, value] of allSummaryEntries) {
            const k  = adaptSumaryTree && ["attributes"].includes(key) ? `.${key}` : key
            switch (value.type) {
                case api.SummaryType.Blob: {
                    let parsedContent: string;
                    let encoding: "utf-8" | "base64" = "utf-8";
                    if (typeof value.content === "string") {
                        parsedContent = value.content;
                    } else {
                        parsedContent = Uint8ArrayToString(value.content, "base64");
                        encoding = "base64";
                    }
                    entries.push(new BlobTreeEntry(k, parsedContent, encoding));
                    break;
                }

                case api.SummaryType.Tree: {
                    entries.push(new TreeTreeEntry(k, convertSummaryTreeToSnapshotITree(value)));
                    break;
                }

                case api.SummaryType.Attachment: {
                    entries.push(new AttachmentTreeEntry(k, value.id));
                    break;
                }

                case api.SummaryType.Handle: {
                    throw new Error("Should not have Handle type in summary tree");
                }

                default:
                    unreachableCase(value, "Unexpected summary tree type");
            }
        }
        return {
            entries,
            unreferenced: summaryTree.unreferenced,
        };
}