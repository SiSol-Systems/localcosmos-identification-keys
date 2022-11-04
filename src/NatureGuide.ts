import {IdentificationKey} from "./IdentificationKey";

export enum LocalCosmosModules {
    TaxonProfiles = "TaxonProfiles",
    FactSheets = "FactSheets",
}

export interface ResultAction {
    feature: LocalCosmosModules,
    uuid: string,
}

export interface NatureGuideOptions {
    resultAction: ResultAction
}

export class NatureGuide {
    public tree: { [uuid: string]: IdentificationKey } = {}

    constructor(
        public uuid: string,
        public version: number,
        public options: NatureGuideOptions,
        public globalOptions: any, // todo: missing type info
        public name: string,
        public crossLinks: any, // todo: missing type info
        public startNodeUuid: string,
        public isMulticontent: boolean,
        public slugs: Record<string, string>,
        tree: { [uuid: string]: IdentificationKey },
    ) {
        for (const key in tree) {
            this.tree[key] = new IdentificationKey(
                tree[key].name,
                tree[key].taxon,
                tree[key].children,
                tree[key].identificationMode,
                tree[key].childrenCount,
                tree[key].factSheets,
                tree[key].slug,
                tree[key].matrixFilters,
            )
        }
    }

    getIdentificationKey (nodeId: string ): IdentificationKey {
        return this.tree[nodeId] || null
    }
}