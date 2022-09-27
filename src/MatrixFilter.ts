import { MatrixFilterSpace } from "./MatrixFilterSpace";
import { MatrixItem } from "./MatrixItem";
import { IdentificationKey, IdentificationKeyReference } from "./IdentificationKey";

export type MatrixFilterType = 'DescriptiveTextAndImagesFilter' | 'TextOnlyFilter' | 'ColorFilter' | 'RangeFilter' | 'NumberFilter' | 'TaxonFilter';

export interface MatrixFilterDefinition {
  name: string,
  weight: number,
  allowMultipleValues: boolean
}

interface MatrixFilterRestriction {
  encodedSpace: string
  spaceId: string
}

export class MatrixFilter {
  public space: MatrixFilterSpace[] = []
  matrixItems: Record<string, MatrixItem>
  activeMatrixItems: Record<string, MatrixItem>

  constructor(
    public uuid: string,
    public type: MatrixFilterType,
    public definition: MatrixFilterDefinition,
    public name: string = '',
    public description: string | null = '',
    public isMultispace: boolean = false, // todo: difference between this and allowMultipleValues
    public isVisible: boolean = true,
    public isRestricted: boolean = false,
    public weight: number = 1,
    public restrictions: Record<string, MatrixFilterRestriction> = {},
    public allowMultipleValues: boolean = false,
    public identificationKey: IdentificationKey,
  ) {
    this.matrixItems = {};
    this.activeMatrixItems = {};
  }

  /**
   * Triggered by a space once it is selected or can be manually called.
   *
   * This will inform other spaces in this Filter as well as the IdentificationKey for this filter
   * @param space
   */
  onSelectSpace (space: MatrixFilterSpace): void {
    this.identificationKey.onSelectSpace(this, space)
    this.space.forEach((ownSpace: MatrixFilterSpace) => {
      if (space.spaceIdentifier !== ownSpace.spaceIdentifier) {
        ownSpace.onOtherSpaceSelected(space)
      }
    })
  }

  /**
   * Triggered by a space once it is deselected or can be manually called.
   *
   * This will inform other spaces in this Filter as well as the IdentificationKey for this filter
   * @param space
   */
  onDeselectSpace (space: MatrixFilterSpace): void {
    this.identificationKey.onDeselectSpace(this, space)
    this.space.forEach((ownSpace: MatrixFilterSpace) => {
      if (space.spaceIdentifier !== ownSpace.spaceIdentifier) {
        ownSpace.onOtherSpaceDeselected(space)
      }
    })
  }

  /**
   * Returns true if this space includes the given item
   * @param space
   * @param identificationKey
   * @private
   */
  isIdentificationKeyVisible(space: MatrixFilterSpace, identificationKey: IdentificationKeyReference) {
    // todo: do we overwrite this in subclasses?
    return identificationKey.space[this.uuid] &&
        space.encodedSpace === identificationKey.space[this.uuid][0];
  }

  /**
   * todo: add type definition
   * @param spaceDefinition
   */
  createSpace(spaceDefinition: any) {
    const space = new MatrixFilterSpace(
        spaceDefinition.spaceIdentifier,
        spaceDefinition.encodedSpace,
        spaceDefinition.imageUrl,
        spaceDefinition.secondaryImageUrl,
        this
    )
    this.space.push(space)

    return space
  }
}

export class DescriptiveTextAndImagesFilter extends MatrixFilter {}
export class ColorFilter extends MatrixFilter {}
export class RangeFilter extends MatrixFilter {}
export class NumberFilter extends MatrixFilter {}
export class TextOnlyFilter extends MatrixFilter {}
export class TaxonFilter extends MatrixFilter {}

export const MatrixFilterClassMap = {
  DescriptiveTextAndImagesFilter: DescriptiveTextAndImagesFilter,
  ColorFilter: ColorFilter,
  RangeFilter: RangeFilter,
  NumberFilter: NumberFilter,
  TextOnlyFilter: TextOnlyFilter,
  TaxonFilter: TaxonFilter
};