import { Taxon } from "./Taxon";
import { MatrixFilterSpace } from "./MatrixFilterSpace";


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

interface MatrixItemEventDataProperties {
  "uuid": string,
  "points": number,
  "maxPoints": number,
  "pointsPercentage": number,
}

interface MatrixItemEventData {
  "matrixItem": MatrixItemEventDataProperties
}

export class MatrixItem {

  DEBUG: boolean = false

  uuid: string
  name: string
  taxon: Taxon | null
  maxPoints: number

  isPossible: boolean

  points: number
  pointsPercentage: number

  matrixFilterSpaces: Record<string, Record<string, MatrixFilterSpace>>

  /**
   * {MATRIX_FILTER_UUID: { SPACE_IDENTIFIER : WEIGHT}}
   */
  activeMatchingMatrixFilterSpaces: Record<string, Record<string, number>>
  activeMismatchingMatrixFilterSpaces: Record<string, MatrixFilterSpace>

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

  addMatrixFilterSpace(matrixFilterSpace: MatrixFilterSpace): void {
    const matrixFilter = matrixFilterSpace.matrixFilter;

    if (!this.matrixFilterSpaces.hasOwnProperty(matrixFilter.uuid)) {
      this.matrixFilterSpaces[matrixFilter.uuid] = {};
    }

    this.matrixFilterSpaces[matrixFilter.uuid][matrixFilterSpace.spaceIdentifier] = matrixFilterSpace;
  }

  /**
   * if the user selects or deselects a space, points are recalculated
   * addMatchingMatrixFilterSpace and removeMatchingMatrixFilterSpace are called automatically
   * by the MatrixFilterSpace instance whoch has been seleced or deselected
   */
  addMatchingMatrixFilterSpace(matrixFilterSpace: MatrixFilterSpace): void {
    if (this.DEBUG == true) {
      console.log(`[MatrixItem] ${this.name} is adding space ${matrixFilterSpace.spaceIdentifier} of 
        ${matrixFilterSpace.matrixFilter.definition.filterType}`);
    }

    const matrixFilter = matrixFilterSpace.matrixFilter;

    if (!this.activeMatchingMatrixFilterSpaces.hasOwnProperty(matrixFilter.uuid)) {
      this.activeMatchingMatrixFilterSpaces[matrixFilter.uuid] = {};
    }

    this.activeMatchingMatrixFilterSpaces[matrixFilter.uuid][matrixFilterSpace.spaceIdentifier] = matrixFilter.weight;

    this.update();
  }

  removeMatchingMatrixFilterSpace(matrixFilterSpace: MatrixFilterSpace): void {

    if (this.DEBUG == true) {
      console.log(`[MatrixItem] ${this.name} is removing space ${matrixFilterSpace.spaceIdentifier} of 
        ${matrixFilterSpace.matrixFilter.definition.filterType}`);
    }

    const matrixFilter = matrixFilterSpace.matrixFilter;

    if (this.activeMatchingMatrixFilterSpaces.hasOwnProperty(matrixFilter.uuid)) {
      let matrixItemSpace = this.activeMatchingMatrixFilterSpaces[matrixFilter.uuid];

      if (matrixItemSpace.hasOwnProperty(matrixFilterSpace.spaceIdentifier)) {
        delete this.activeMatchingMatrixFilterSpaces[matrixFilter.uuid][matrixFilterSpace.spaceIdentifier];
      }

      if (Object.keys(this.activeMatchingMatrixFilterSpaces[matrixFilter.uuid]).length == 0) {
        delete this.activeMatchingMatrixFilterSpaces[matrixFilter.uuid];
      }
    }

    this.update();
  }

  update(): void {
    if (this.DEBUG == true) {
      console.log(`[MatrixItem] ${this.name}: updating points`);
    }

    this.points = this.calculatePoints();
    this.pointsPercentage = this.points / this.maxPoints;
    this.sendMatrixItemUpdateEvent();

    if (this.pointsPercentage == 1) {
      this.send100percentEvent();
    }
  }

  reset(): void {
    this.points = 0;

    this.activeMatchingMatrixFilterSpaces = {};
    this.activeMismatchingMatrixFilterSpaces = {};

    this.activate();
  }

  activate(): void {
    this.isPossible = true;

    // when a MatrixItem gets activated, MatrixFilterSpaces can become possible
    this.signalMatrixFilterSpaces();

    if (this.DEBUG == true) {
      console.log(`[MatrixItem] ${this.name}: sending activate-matrix-item event`);
    }

    const event_data = this.getEventData();

    // callback "matrixItemBecamePossible"

  }

  /**
   * Depending on which MatrixItems are possible or not, MatrixFilterSpaces are possible or not
   * Example: The MatrixItem "Oak Tree" became impossible. The space "round leaf edge" existed only
   * on the oak tree. The space "round leaf edge" does not exist on any other MatrixItem, so it is not a
   * possible space anymore.
   */
  signalMatrixFilterSpaces(): void {

    for (let matrixFilterUuid in this.matrixFilterSpaces) {
      let itemSpaces = this.matrixFilterSpaces[matrixFilterUuid];
      for (let spaceIdentifier in itemSpaces) {
        let matrixFilterSpace = itemSpaces[spaceIdentifier];

        if (this.isPossible == true) {
          matrixFilterSpace.addMatchingMatrixItem(this);
        }
        else {
          matrixFilterSpace.removeMatchingMatrixItem(this);
        }
      }
    }
  }

  calculatePoints(): number {
    let points = 0;

    for (let matrixFilterUuid in this.activeMatchingMatrixFilterSpaces) {

      for (let spaceIdentifier in this.activeMatchingMatrixFilterSpaces[matrixFilterUuid]) {
        let weight = this.activeMatchingMatrixFilterSpaces[matrixFilterUuid][spaceIdentifier];
        points = points + weight;
      }
    }

    if (this.DEBUG == true) {
      console.log(`[MatrixItem] ${this.name} total points: ${points}`);
    }

    return points;
  }

  /**
   * EVENTS
   */

  getEventData(): MatrixItemEventData {
    const eventData: MatrixItemEventData = {
      "matrixItem": {
        "uuid": this.uuid,
        "points": this.points,
        "maxPoints": this.maxPoints,
        "pointsPercentage": this.pointsPercentage,
      }
    };

    return eventData;
  }
  sendMatrixItemUpdateEvent(): void {

  }

  send100percentEvent(): void {

  }
}