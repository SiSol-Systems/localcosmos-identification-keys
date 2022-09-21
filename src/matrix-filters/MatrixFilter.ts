import { MatrixFilterSpace } from "../spaces/MatrixFilterSpace";
import { MatrixItem } from "../MatrixItem";
import {IdentificationKey, IdentificationKeyReference} from "../IdentificationKey";
// import { DescriptiveTextAndImagesFilter } from "./DescriptiveTextAndImagesFilter";
// import { ColorFilter } from "./ColorFilter";
// import { RangeFilter } from "./RangeFilter";
// import { NumberFilter } from "./NumberFilter";
// import { TextOnlyFilter } from "./TextOnlyFilter";
// import { TaxonFilter } from "./TaxonFilter";
// export const MatrixFilterClassMap = {
//   DescriptiveTextAndImagesFilter: DescriptiveTextAndImagesFilter,
//   ColorFilter: ColorFilter,
//   RangeFilter: RangeFilter,
//   NumberFilter: NumberFilter,
//   TextOnlyFilter: TextOnlyFilter,
//   TaxonFilter: TaxonFilter
// };

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
    public description: string = '',
    public isMultispace: boolean = false,
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
    for(const spaceId in this.space) {
      if (space.spaceIdentifier !== spaceId) {
        this.space[spaceId].onOtherSpaceSelected(space)
      }
    }
  }

  /**
   * Triggered by a space once it is deselected or can be manually called.
   *
   * This will inform other spaces in this Filter as well as the IdentificationKey for this filter
   * @param space
   */
  onDeselectSpace (space: MatrixFilterSpace): void {
    this.identificationKey.onDeselectSpace(this, space)
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