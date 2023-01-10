import { MatrixFilterSpace } from "./MatrixFilterSpace";
import { TaxonReference } from "./Taxon";

export enum NodeTypes {
  node = "node",
  result = "result",
}

interface MatrixFilterSpaceRegistry {
  [spaceIdentifier: string] : MatrixFilterSpace
}

/**
 * A node in the identification tree
 */
export class IdentificationTreeNode {

  constructor(
    public uuid: string,
    public nodeType: NodeTypes,
    public imageUrl: string,
    public space: Record<string, MatrixFilterSpace[]>,
    public maxPoints: number,
    public isPossible: boolean,
    public name: string,
    public decisionRule: string,
    public taxon: TaxonReference | null,
    public factSheets: any[], // todo: missing type info
    public slug: string,
  ) {
  }
}