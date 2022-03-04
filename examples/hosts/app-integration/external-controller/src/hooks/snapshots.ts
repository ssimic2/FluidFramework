import { useEffect, useState } from "react";
import { IDocumentService } from "@fluidframework/driver-definitions";

import {
  convertSnapshotTreeToSummaryTree
} from "@fluidframework/runtime-utils";

import { ISnapshotTree, IVersion } from "@fluidframework/protocol-definitions";

import { fluidFetchInit } from "./../fluidFetchInit";
import {
  fluidFetchSnapshotVersions,
  fetchBlobsFromVersion,
} from "./../fluidFetchSnapshot";

export function useDocumentService(
  fluidUrl: string,
  tenantId: string,
  containerId: string
) {
  const [docService, setDocService] = useState<IDocumentService | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchData = async () => {
      const docService = await fluidFetchInit(
        `${fluidUrl}&tenantId=${tenantId}&containerId=${containerId}`
      );
      setDocService(docService);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  }, [containerId, fluidUrl, tenantId]);

  return docService;
}

export function useSnapshotVersions(docService?: IDocumentService) {
  const [snapshotVersions, setSnapshotVersions] = useState<
    IVersion[] | undefined
  >(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fluidFetchSnapshotVersions(docService);
      setSnapshotVersions(data);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchData();
  }, [docService]);

  return snapshotVersions;
}

export function useSnapshot(docService?: IDocumentService, version?: IVersion) {
  const [snapshotTree, setSnapshotTree] = useState<ISnapshotTree | null>(null);

  useEffect(() => {
    const fetchData = async (s: IDocumentService, v: IVersion) => {
      const tree = await fetchBlobsFromVersion(s, v);
      console.log("a-----", version, tree)
      if(tree) {
        console.log("SummaryTree-----", convertSnapshotTreeToSummaryTree(tree))
      }
      
      setSnapshotTree(tree);
    };
    if (version && docService) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetchData(docService, version);
    }
  }, [docService, version]);

  return snapshotTree;
}
