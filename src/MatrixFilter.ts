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
  }

  addSpace(space: MatrixFilterSpace) {
    space.filter = this
    this.space.push(space)
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

  setEncodedSpace(encodedSpace: number[]): void {
    this.encodedSpace = encodedSpace
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