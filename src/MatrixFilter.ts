import { MatrixFilterSpace, MatrixFilterSpaceReference } from "./MatrixFilterSpace";
import { MatrixItem } from "./MatrixItem";
import { IdentificationKey, IdentificationKeyReference } from "./IdentificationKey";
import {ref} from "../../.nuxt/imports";

export type MatrixFilterType = 'DescriptiveTextAndImagesFilter' | 'TextOnlyFilter' | 'ColorFilter' | 'RangeFilter' | 'NumberFilter' | 'TaxonFilter';

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
    public name: string = '',
    public description: string | null = '',
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
   * Returns true if the given space matches a given item reference
   *
   * @param space
   * @param identificationKey
   */
  isIdentificationKeyVisible(space: MatrixFilterSpace, identificationKey: IdentificationKeyReference): boolean {
    const spaceReference = identificationKey.space[this.uuid]?.find((spaceRef: MatrixFilterSpaceReference) => {
      return spaceRef.spaceIdentifier === space.spaceIdentifier
    })
    return !!spaceReference && this.spaceMatchesReference(space, spaceReference)
  }

  /**
   * Checks if a space matches the reference in a MatrixItem.
   * Might be overwritten in subclasses to perform different calculations.
   *
   * @param space
   * @param reference
   */
  spaceMatchesReference(space: MatrixFilterSpace, reference: MatrixFilterSpaceReference): boolean {
    return space.spaceIdentifier === reference.spaceIdentifier &&
        space.encodedSpace === reference.encodedSpace;
  }

  /**
   * todo: add type definition
   * @param spaceDefinition
   */
  createSpace(spaceDefinition: any): MatrixFilterSpace {
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
export class ColorFilter extends MatrixFilter {
  spaceMatchesReference(space: MatrixFilterSpace, reference: MatrixFilterSpaceReference): boolean {
    // in the case of color filters the encoded space is an array of numbers describing the color as rgba,
    // so we compare elementwise:
    return space.spaceIdentifier === reference.spaceIdentifier &&
        space.encodedSpace.every((color: number, i: number) => color === reference.encodedSpace[i])
  }
}
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