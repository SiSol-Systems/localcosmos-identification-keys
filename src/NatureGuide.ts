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

export class NatureGuide {
    uuid: string
    version: number
    options: NatureGuideOptions
    globalOptions: any // todo: missing type info
    name:  string
    tree: { [uuid: string]: NatureGuideTreeNode }
    crossLinks: any // todo: missing type info
    startNodeUuid: string
    isMulticontent: boolean

    constructor(options: {
        uuid: string
        version: number
        options: NatureGuideOptions
        globalOptions: any
        name:  string
        tree: { [uuid: string]: NatureGuideTreeNode }
        crossLinks: any
        startNodeUuid: string
        isMulticontent: boolean
    }) {
        this.uuid = options.uuid
        this.version = options.version
        this.options = options.options
        this.globalOptions = options.globalOptions
        this.name = options.name
        this.tree = options.tree
        this.crossLinks = options.crossLinks
        this.startNodeUuid = options.startNodeUuid
        this.isMulticontent = options.isMulticontent
    }

    getTreeNode (nodeId: string ) {
        return this.tree[nodeId] || null
    }

    getFilteredChildren (nodeId: string) {
        // for now return all children of a node, till we implemented filters
        return this.tree[nodeId].children
    }
}