import { MatrixFilter } from "./MatrixFilter";
import {IdentificationKeyReference} from "./IdentificationKey";

export interface MatrixFilterSpaceReference {
  spaceIdentifier: string
  encodedSpace: any
}

export class MatrixFilterSpace {
  public isSelected: boolean
  public isPossible: boolean
  public items: IdentificationKeyReference[] = []

  constructor(
      public spaceIdentifier: string,
      public encodedSpace: any,
      public imageUrl: string | null,
      public secondaryImageUrl: string | null,
      public matrixFilter: MatrixFilter,
  ) {
    this.isSelected = false;
    this.isPossible = true;
    this.items = matrixFilter?.items?.filter(ref => {
      return ref.space[this.matrixFilter.uuid]?.find(space => space.spaceIdentifier === this.spaceIdentifier)
    })
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
  onOtherSpaceSelected(otherSpace: MatrixFilterSpace): void {
    if (!this.matrixFilter.allowMultipleValues) {
      this.isSelected = false;
    }
  }

  /**
   * Event triggered once another space within the same MatrixFilter is deselected
   *
   * @param otherSpace
   */
  onOtherSpaceDeselected(otherSpace: MatrixFilterSpace): void {}

  onItemsChanged () {
    this.isPossible = !this.items.every(item => !item.isVisible)
  }
}

export class DescriptiveTextAndImagesFilterSpace extends MatrixFilterSpace {}
export class ColorFilterSpace extends MatrixFilterSpace {}
export class TextOnlyFilterSpace extends MatrixFilterSpace {}
export class TaxonFilterSpace extends MatrixFilterSpace {}

export const MatrixFilterSpaceClassMap = {
  DescriptiveTextAndImagesFilterSpace: DescriptiveTextAndImagesFilterSpace,
  ColorFilterSpace: ColorFilterSpace,
  TextOnlyFilterSpace: TextOnlyFilterSpace,
  TaxonFilterSpace: TaxonFilterSpace,
};