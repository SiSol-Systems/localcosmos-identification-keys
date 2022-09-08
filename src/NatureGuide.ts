import { TaxonReference } from "./Taxon";
import { MatrixFilter } from "./MatrixFilter";

export interface ResultAction {
    id: number
    uuid: string
    model: string // todo: missing type info
    action: string // todo: missing type info
    appLabel: string
}

export interface NatureGuideOptions {
    resultAction: ResultAction
}

export interface NatureGuideTreeNodeReference {
    id: number
    uuid: string
    metaNodeId: number
    nodeType: 'node' | 'result' // todo: any more?
    imageUrl: string
    space: any // todo: missing type info
    maxPoints: number
    isVisible: boolean
    name: string
    decisionRule: string
    taxon: TaxonReference | null
    factSheets: any[] // todo: missing type info
}

export interface NatureGuideTreeNode {
    name: string
    taxon: TaxonReference | null
    children: NatureGuideTreeNodeReference[]
    matrixFilters: { [uuid: string]: MatrixFilter }
    identificationMode: 'fluid' | 'strict' // todo: any more?
    childrenCount: number
}

export interface NatureGuide {
    uuid: string
    version: number
    options: NatureGuideOptions
    globalOptions: any // todo: missing type info
    name:  string
    tree: { [uuid: string]: NatureGuideTreeNode }
    crossLinks: any // todo: missing type info
    startNodeUuid: string
    isMulticontent: boolean
}
