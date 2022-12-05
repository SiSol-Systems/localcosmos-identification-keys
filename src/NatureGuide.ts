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
        public tree: { [uuid: string]: IdentificationKey },
    ) {}

    getIdentificationKey (nodeId: string ): IdentificationKey {
        if (this.tree[nodeId]) {
            const node = this.tree[nodeId];
            return new IdentificationKey(
              node.name,
              node.taxon,
              node.children,
              node.identificationMode,
              node.childrenCount,
              node.factSheets,
              node.slug,
              node.overviewImage,
              node.matrixFilters,
            )
        }
    
        return null;
    }
}