import {MatrixFilterSpace, MatrixFilterSpaceReference} from "./MatrixFilterSpace";
import {IdentificationEvents, IdentificationKey} from "./IdentificationKey";

export type MatrixFilterType =
  'DescriptiveTextAndImagesFilter'
  | 'TextOnlyFilter'
  | 'ColorFilter'
  | 'RangeFilter'
  | 'NumberFilter'
  | 'TaxonFilter';

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
    public isVisible: boolean = true, /* the visibility is true if all restrictions are met, and false if not all restrictions are met */
    public isRestricted: boolean = false,
    public weight: number = 1,
    public restrictions: Record<string, MatrixFilterRestriction> = {},
    public allowMultipleValues: boolean = false,
    public definition: object = {},
    public identificationKey: IdentificationKey,
  ) {
  }

  addSpace(space: MatrixFilterSpace) {
    space.filter = this
    this.space.push(space)
  }
}

export class DescriptiveTextAndImagesFilter extends MatrixFilter {
}

export class ColorFilter extends MatrixFilter {
}

export class RangeFilter extends MatrixFilter {
  public encodedSpace: number[] = []

  /**
   * We clean up the space identifier to only contain the filter uuid
   *
   * @param space
   */
  addSpace(space: MatrixFilterSpace) {
    space.spaceIdentifier = space.spaceIdentifier.split(':')[0]

    // register listener to update the space node mapping when the encoded space changes
    this.identificationKey.on(IdentificationEvents.beforeSpaceSelected, this.updateEncodedSpace.bind(this))
    this.identificationKey.on(IdentificationEvents.spaceInitialized, this.updateEncodedSpaceMapping.bind(this))
    super.addSpace(space);
  }

  updateEncodedSpace(event: IdentificationEvents, identificationKey: IdentificationKey, payload: {}): void {
    const { index, encodedSpace } = payload as { index: number, encodedSpace: number[] }
    if (identificationKey.spaces[index].spaceIdentifier !== this.uuid) {
      return
    }

    // update the internal encoded space and make sure the space becomes selectable
    this.encodedSpace = encodedSpace
    identificationKey.selectedSpaces[index] = 0
    this.updateEncodedSpaceMapping(event, identificationKey, index)
  }

  private updateEncodedSpaceMapping(_: IdentificationEvents, identificationKey: IdentificationKey, index: number): void {
    if (identificationKey.spaces[index].spaceIdentifier !== this.uuid) {
      return
    }

    const space = this.space[0]
    let newMapping = (new Array(identificationKey.children.length).fill(1));
    if (this.encodedSpace.length > 0) {
      newMapping = newMapping.map((_, nodeIndex) => {
        const filter = identificationKey.children[nodeIndex].space[space.spaceIdentifier]
        if (filter) {
          return filter.find((spaceRef: MatrixFilterSpaceReference) => {
            return (this.encodedSpace[0] >= spaceRef.encodedSpace[0]) &&
              (this.encodedSpace[0] <= spaceRef.encodedSpace[1])
          }) ? 1 : 0
        }

        return 0
      })
    }

    identificationKey.spaceNodeMapping[index] = newMapping
  }
}

export class NumberFilter extends MatrixFilter {
}

export class TextOnlyFilter extends MatrixFilter {
}

export class TaxonFilter extends MatrixFilter {
}

export const MatrixFilterClassMap = {
  DescriptiveTextAndImagesFilter: DescriptiveTextAndImagesFilter,
  ColorFilter: ColorFilter,
  RangeFilter: RangeFilter,
  NumberFilter: NumberFilter,
  TextOnlyFilter: TextOnlyFilter,
  TaxonFilter: TaxonFilter
};