import { Taxon } from "./Taxon";
import { MatrixFilterSpaceConstructor } from "./MatrixFilterSpace";


enum NodeTypes {
  node = "node",
  result = "result"
}


export interface MatrixItemDefinition {
  id: number,
  name: string,
  uuid: string,
  space: any,
  taxon: Taxon | null,
  imageUrl: string | null,
  nodeType: NodeTypes,
  isVisible: boolean,
  maxPoints: number,
  metaNodeId: number,
  decisionRule: string | null
}

export class MatrixItem {

  uuid: string
  name: string
  taxon: Taxon | null
  maxPoints: number

  isPossible: boolean

  points: number
  pointsPercentage: number

  matrixFilterSpaces: Record<string, MatrixFilterSpaceConstructor>

  activeMatchingMatrixFilterSpaces: Record<string, MatrixFilterSpaceConstructor>
  activeMismatchingMatrixFilterSpaces: Record<string, MatrixFilterSpaceConstructor>

  constructor(definition: MatrixItemDefinition) {
    this.uuid = definition["uuid"];
    this.name = definition["name"];
    this.taxon = definition["taxon"];

    this.maxPoints = definition["maxPoints"];

    this.isPossible = true;

    this.points = 0;
    this.pointsPercentage = 0;

    this.matrixFilterSpaces = {};

    this.activeMatchingMatrixFilterSpaces = {};
    this.activeMismatchingMatrixFilterSpaces = {};

  }

  addMatrixFilterSpace(): void {

  }

  calculatePoints(): void {

  }
}