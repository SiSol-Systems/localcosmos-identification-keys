import { MatrixFilterSpace, MatrixFilterSpaceReference } from "./MatrixFilterSpace";
import { IdentificationKey, IdentificationKeyReference } from "./IdentificationKey";

export type MatrixFilterType = 'DescriptiveTextAndImagesFilter' | 'TextOnlyFilter' | 'ColorFilter' | 'RangeFilter' | 'NumberFilter' | 'TaxonFilter';

interface MatrixFilterRestriction {
  spaceIdentifier: string
  encodedSpace: string
}

export class MatrixFilter {
  public space: MatrixFilterSpace[] = []
  public position: number = 1
  public items: IdentificationKeyReference[] = []

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
    this.items = identificationKey?.children?.filter(child => child.space[this.uuid])
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

  onItemsChanged (): void {
    this.space.forEach(space => space.onItemsChanged())
  }

  /**
   * Returns true if the given space matches a given item reference
   *
   * @param space
   * @param identificationKey
   */
  isIdentificationKeyVisible(space: MatrixFilterSpace, identificationKey: IdentificationKeyReference): boolean {
    const spaceId = space.spaceIdentifier.split(':')[0]
    const spaceReferences = identificationKey.space[this.uuid]?.filter((spaceRef: MatrixFilterSpaceReference) => {
      // Space-Identifiers have the format of <filter-uuid>:<space-id>. For most filters we can match this fully
      // and compare their encoded space. Unfortunately this does not work for RangeFilters because their <space-id>
      // is encoding a range of allowed values. This means we only filter out spaces for the same filter here and let
      // the filter decide on its own how to handle further comparisons:
      return spaceRef.spaceIdentifier.split(':')[0] === spaceId
    })
    return spaceReferences.every(ref => this.spaceMatchesReference(space, ref))
  }

  /**
   * Returns true if the given space matches the given filter
   *
   * @param space
   * @param filter
   */
  isMatrixFilterVisible(space: MatrixFilterSpace, filter: MatrixFilter) {
    const spaceId = space.spaceIdentifier.split(':')[0]
    return !!filter.restrictions[spaceId] && this.spaceMatchesReference(space, filter.restrictions[spaceId])
  }

  /**
   * Checks if a space matches the reference in a MatrixItem.
   * Might be overwritten in subclasses to perform different calculations.
   *
   * @param space
   * @param reference
   */
  spaceMatchesReference(space: MatrixFilterSpace, reference: MatrixFilterSpaceReference | MatrixFilterRestriction): boolean {
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
  /**
   * in the case of color filters the encoded space is an array of numbers describing the color as rgba,
   * so we compare elementwise
   *
   * @param space
   * @param reference
   */
  spaceMatchesReference(space: MatrixFilterSpace, reference: MatrixFilterSpaceReference): boolean {
    return space.spaceIdentifier === reference.spaceIdentifier &&
        space.encodedSpace.every((color: number, i: number) => color === reference.encodedSpace[i])
  }
}
export class RangeFilter extends MatrixFilter {
  public encodedSpace: number[] = []
  private currentValue: { min: number, max: number } | null = null
  private currentSpace: MatrixFilterSpace | null = null

  setEncodedSpace(encodedSpace: number[]): void {
    this.encodedSpace = encodedSpace
  }

  /**
   * because RangeFilter has no spaces as a list we pass the selected space as a dynamic version.
   *
   * @param range
   */
  selectSpace(range: { min: number, max: number }) {
    if (this.currentValue?.min === range.min && this.currentValue?.max === range.max) {
      return
    }

    const hash = btoa(`[${range.min},${range.max}]`)
    const space = new MatrixFilterSpace(
        `${this.uuid}:${hash}`,
        [range.min, range.max],
        null,
        null,
        this,
    )

    if (this.currentSpace) {
      this.onDeselectSpace(this.currentSpace)
    }
    this.onSelectSpace(space)
    this.currentSpace = space
    this.currentValue = range
  }

  /**
   * Range filters are a little strange. They encode the space they want to match inside the encodedSpace and inside
   * the spaceIdentifier. This means we cant relly on the ID here for comparison. E.g. a filter with range [1, 10], and
   * a selected space of [2, 5] should match references with a space of [1, 4] or [4, 8] but not for [6, 8].
   *
   * @param space
   * @param reference
   */
  spaceMatchesReference(space: MatrixFilterSpace, reference: MatrixFilterSpaceReference): boolean {
    return (space.encodedSpace[1] >= reference.encodedSpace[0]) &&
        (space.encodedSpace[0] <= reference.encodedSpace[1])
  }
}
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