import { MatrixFilter } from "./MatrixFilter";
import { MatrixItem } from "./MatrixItem";

export interface MatrixFilterSpaceDefinition {}

interface MatrixFilterSpaceEventData {

}

export class MatrixFilterSpace {

  spaceIdentifier: string
  matrixFilter: MatrixFilter

  restricts: Record<string, MatrixFilter>
  matchingMatrixItems: Record<string, MatrixItem>
  mismatchingMatrixItems: Record<string, MatrixItem>

  isActive: boolean
  isPossible: boolean

  constructor(matrixFilter: MatrixFilter, spaceIdentifier: string) {

    this.spaceIdentifier = spaceIdentifier;
    this.matrixFilter = matrixFilter;

    this.restricts = {};
    this.matchingMatrixItems = {};
    this.mismatchingMatrixItems = {};

    this.isActive = false;
    this.isPossible = true;

  }

  /**
   * The visibility of MatrixFilters can depend on the selection of MatrixFilterSpaces
   * A MatrixFilterSpace has to be aware of those MatrixFilters.
   */
  registerRestrictedMatrixFilter(): void {

  }

  /**
   * MatrixItems ("Species") have a set of matching MatrixFilterSpaces. A MatrixFilterSpace has to be aware of the
   * MatrixItems it matches or mismatches. Mismatches are important for the mode exclusion criterion.
   */
  registerMatchingMatrixItem(): void {

  }

  registerMismatchingMatrixItem(): void {

  }

  activate(): void {
    this.isActive = true;
  }

  deactivate(): void {
    this.isActive = false;
  }

  setToPossible(): void {
    this.isPossible = true;
  }

  setToImpossible(): void {
    this.isPossible = false;
  }

  change(): void { }

  getEventData(): MatrixFilterSpaceEventData {
    return {};
  }

  /**
   * If a MatrixFilterSpace is activated or deactivated, the MatrixFilters which are restricted by it have to be notified.
   */
  signalRestrictedMatrixFilters(): void { }

  signalMatrixItems(): void { }

  sendPossibleEvent(): void {

  }

  sendImpossibleEvent(): void {

  }
}

export type MatrixFilterSpaceConstructor = new (...args: ConstructorParameters<typeof MatrixFilterSpace>) => MatrixFilterSpace;
