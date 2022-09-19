import { 
  MatrixFilterSpace,
  MatrixFilterSpaceDefinition,
  MatrixFilterSpaceConstructor
} from "../spaces/MatrixFilterSpace";
import { MatrixItem } from "../MatrixItem";

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
  filterType: MatrixFilterTypes,
  weight: number,
  allowMultipleValues: boolean
}

export class MatrixFilter {

  uuid: string

  definition: MatrixFilterDefinition

  name: string
  description: string

  isMultispace: boolean
  isVisible: boolean
  isRestricted: boolean

  weight: number
  restrictions: any // unknown
  allowMultipleValues: boolean

  matrixFilterSpaceClass: MatrixFilterSpaceConstructor
  matrixFilterSpaces: Record<string, MatrixFilterSpace>
  matrixItems: Record<string, MatrixItem>
  activeMatrixItems: Record<string, MatrixItem>

  constructor(uuid: string, definition: MatrixFilterDefinition) {
    this.uuid = uuid;

    this.name = '';
    this.description = '';

    this.isMultispace = false;
    this.isVisible = true;
    this.isRestricted = false;
    this.definition = definition;

    this.weight = 1;
    this.allowMultipleValues = false;

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