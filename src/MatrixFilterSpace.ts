import { MatrixFilter } from "./MatrixFilter";

export interface MatrixFilterSpaceReference {
  spaceIdentifier: string
  encodedSpace: string
}

export class MatrixFilterSpace {
  isSelected: boolean
  isPossible: boolean

  constructor(
      public spaceIdentifier: string,
      public encodedSpace: string,
      public imageUrl: string | null,
      public secondaryImageUrl: string | null,
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
    if (!this.matrixFilter.allowMultipleValues) {
      this.isSelected = false;
    }
    // todo: is this correct?
    this.isPossible = false
  }

  /**
   * Event triggered once another space within the same MatrixFilter is deselected
   *
   * @param otherSpace
   */
  onOtherSpaceDeselected (otherSpace: MatrixFilterSpace): void {
    this.isPossible = true
  }
}
