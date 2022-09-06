import { 
  MatrixFilterSpace,
  MatrixFilterSpaceDefinition,
  MatrixFilterSpaceConstructor
} from "./MatrixFilterSpace";
import { MatrixItem } from "./MatrixItem";

export enum MatrixFilterTypes {
  DescriptiveTextAndImagesFlter = "DescriptiveTextAndImagesFilter",
  TextOnlyFilter = "TextOnlyFilter",
  ColorFilter = "ColorFilter",
  RangeFilter = "RangeFilter",
  NumberFilter = "NumberFilter",
  TaxonFilter = "TaxonFilter"
}

export interface MatrixFilterDefinition {
  name: string,
  type: MatrixFilterTypes,
  weight: number,
  allowMultipleValues: boolean
}


export class MatrixFilter {

  uuid: string

  definition: MatrixFilterDefinition

  isVisible: boolean

  matrixFilterSpaceClass: MatrixFilterSpaceConstructor
  matrixFilterSpaces: Record<string, MatrixFilterSpace>
  matrixItems: Record<string, MatrixItem>
  activeMatrixItems: Record<string, MatrixItem>

  constructor(uuid: string, definition: MatrixFilterDefinition) {
    this.uuid = uuid;
    this.isVisible = true;
    this.definition = definition;

    this.matrixFilterSpaces = {};
    this.matrixItems = {};
    this.activeMatrixItems = {};

    this.matrixFilterSpaceClass = MatrixFilterSpace;

  }

  /**
   * MATRIX FILTER SPACE MANAGEMENT
   * MatrixFilterSpaces are added when reading the MatrixItems
   */

  // return b64 encoded space_identifier
  // space is the parsed space from JSON.parse
  getSpaceIdentifier(spaceDefinition: MatrixFilterSpaceDefinition): string {
    throw new Error("[MatrixFilter] subclasses require a getSpaceIdentifier method");
  }

  getSpaceIdentifierFromStr(space: string): string {
    throw new Error("[MatrixFilter] subclasses require a getSpaceIdentifierFromStr method");
  }

  parseSpaceStr(space: string){
    throw new Error("[MatrixFilter] subclasses require a parseSpaceStr method");
  }

  getSpaceFromSpaceIdentifier(spaceIdentifier: string): MatrixFilterSpace {
    throw new Error("[MatrixFilter] subclasses require a getSpaceFromSpaceIdentifier method");
  }

  addMatrixFilterSpace(spaceDefinition: MatrixFilterSpaceDefinition): MatrixFilterSpace {
    const spaceIdentifier = this.getSpaceIdentifier(spaceDefinition);
    let matrixFilterSpace: MatrixFilterSpace;

    if (!(spaceIdentifier in this.matrixFilterSpaces)){
      matrixFilterSpace = new this.matrixFilterSpaceClass(this, spaceIdentifier);
      this.matrixFilterSpaces[spaceIdentifier] = matrixFilterSpace;
    }
    else {
      matrixFilterSpace = this.matrixFilterSpaces[spaceIdentifier];
    }

    return matrixFilterSpace;
  }
}