import { MatrixFilter } from "../matrix-filters/MatrixFilter";
import { MatrixItem } from "../MatrixItem";
import {IdentificationKeyReference} from "../IdentificationKey";

export interface MatrixFilterSpaceDefinition { }

interface MatrixFilterSpaceEventData {

}

export class MatrixFilterSpace {
  isSelected: boolean
  isPossible: boolean

  constructor(
      public spaceIdentifier: string,
      public encodedSpace: string,
      public imageUrl: string,
      public secondaryImageUrl: string,
      public matrixFilter: MatrixFilter,
  ) {
    this.isSelected = false;
    this.isPossible = true;
  }

  /**
   * The user selects a certain MatrixFilterSpace in the frontend.
   */
  select(): void {
    if (this.isPossible) {
      this.isSelected = true;
      this.matrixFilter.onSelectSpace(this);
    }
  }

  /**
   * The user deselects a certain MatrixFilterSpace in the frontend.
   */
  deselect(): void {
    if (this.isSelected) {
      this.isSelected = false;
      this.matrixFilter.onDeselectSpace(this);
    }
  }

  /**
   * Event triggered once another space within the same MatrixFilter is selected
   *
   * @param otherSpace
   */
  onOtherSpaceSelected (otherSpace: MatrixFilterSpace): void {
    if (!this.matrixFilter.isMultispace) {
      this.isSelected = false;
    }
    // todo: is this correct? should it become possible again after de-selection?
    this.isPossible = false
  }
}
