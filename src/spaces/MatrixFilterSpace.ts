import { MatrixFilter } from "../matrix-filters/MatrixFilter";
import { MatrixItem } from "../MatrixItem";

export interface MatrixFilterSpaceDefinition { }

interface MatrixFilterSpaceEventData {

}

export class MatrixFilterSpace {

  DEBUG: boolean = false

  spaceIdentifier: string
  matrixFilter: MatrixFilter

  restricts: Record<string, MatrixFilter>

  matchingMatrixItems: Record<string, MatrixItem>
  mismatchingMatrixItems: Record<string, MatrixItem>
  activeMatchingMatrixItems: Record<string, MatrixItem>

  isSelected: boolean
  isPossible: boolean

  constructor(matrixFilter: MatrixFilter, spaceIdentifier: string) {

    this.spaceIdentifier = spaceIdentifier;
    this.matrixFilter = matrixFilter;

    this.restricts = {};

    this.matchingMatrixItems = {};
    this.mismatchingMatrixItems = {};
    this.activeMatchingMatrixItems = {};

    this.isSelected = false;
    this.isPossible = true;

  }

  /**
   * The visibility of MatrixFilters can depend on the selection of MatrixFilterSpaces
   * A MatrixFilterSpace has to be aware of those MatrixFilters.
   */
  registerRestrictedMatrixFilter(restrictedMatrixFilter: MatrixFilter): void {
    this.restricts[restrictedMatrixFilter.uuid] = restrictedMatrixFilter;
  }

  /**
   * MatrixItems ("Species") have a set of matching MatrixFilterSpaces. A MatrixFilterSpace has to be aware of the
   * MatrixItems it matches or mismatches. Mismatches are important for the mode exclusion criterion ("strict").
   */
  registerMatchingMatrixItem(matrixItem: MatrixItem): void {
    this.matchingMatrixItems[matrixItem.uuid] = matrixItem;
    // initially all MatrixItems are possible
    this.activeMatchingMatrixItems[matrixItem.uuid] = matrixItem;
  }

  registerMismatchingMatrixItem(matrixItem: MatrixItem): void {
    this.mismatchingMatrixItems[matrixItem.uuid] = matrixItem;
  }

  addMatchingMatrixItem(matrixItem: MatrixItem): void {

    if (this.DEBUG == true) {
      console.log(`[MatrixFilterSpace] ${this.matrixFilter.definition.filterType} 
        ${this.spaceIdentifier} now adds MatrixItem ${matrixItem.name} to activeMatchingMatrixItems`);
    }

    let isInitiallyPossible = this.isPossible;

    if (!this.activeMatchingMatrixItems.hasOwnProperty(matrixItem.uuid)) {
      this.activeMatchingMatrixItems[matrixItem.uuid] = matrixItem;
    }

    this.isPossible = true;

    if (isInitiallyPossible == false) {
      this.sendBecamePossibleEvent();
    }

  }

  removeMatchingMatrixItem(matrixItem: MatrixItem) {
    if (this.DEBUG == true) {
      console.log(`[MatrixFilterSpace] ${this.matrixFilter.definition.filterType} ${this.spaceIdentifier}
        now is removing MatrixItem ${matrixItem.name} from activeMatchingMatrixItems`);
    }

    let isInitiallyPossible = this.isPossible;

    if (this.activeMatchingMatrixItems.hasOwnProperty(matrixItem.uuid)) {
      delete this.activeMatchingMatrixItems[matrixItem.uuid];
    }

    let isPossible = this.calculatePossibility();

    if (isPossible == false) {
      this.isPossible = false;
      if (isInitiallyPossible == true) {
        this.sendBecameImpossibleEvent();
      }
    }
  }

  calculatePossibility(): Boolean {
    let isPossible = Object.keys(this.activeMatchingMatrixItems).length == 0 ? false : true;
    return isPossible;
  }

  /**
   * The user selects a certain MatrixFilterSpace in the frontend.
   */
  select(): void {
    this.isSelected = true;

    // work restrictions
    this.signalRestrictedMatrixFilters();

    // notify matrix items
    this.signalMatrixItems();
  }

  deselect(): void {
    this.isSelected = false;
  }

  setToPossible(): void {
    this.isPossible = true;
  }

  setToImpossible(): void {
    this.isPossible = false;
  }

  getEventData(): MatrixFilterSpaceEventData {
    return {};
  }

  /**
   * If a MatrixFilterSpace is activated or deactivated, the MatrixFilters which are restricted by it have to be notified.
   */
  signalRestrictedMatrixFilters(): void {

  }

  signalMatrixItems(): void {

  }

  sendBecamePossibleEvent(): void {

  }

  sendBecameImpossibleEvent(): void {

  }
}

export type MatrixFilterSpaceConstructor = new (...args: ConstructorParameters<typeof MatrixFilterSpace>) => MatrixFilterSpace;
