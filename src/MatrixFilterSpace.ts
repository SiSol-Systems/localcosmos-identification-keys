import {IdentificationKey} from "./IdentificationKey";
import {MatrixFilter} from "./MatrixFilter";

export interface MatrixFilterSpaceReference {
  spaceIdentifier: string,
  encodedSpace: any,
}

interface TreeNodeRegistry {
  [treeNodeUUID: string]: IdentificationTreeNode
}


export class MatrixFilterSpace {
  public spaceIdentifier: string = ''
  public encodedSpace: any = null

  public filter: MatrixFilter | null = null;

  constructor(
    initializer: MatrixFilterSpace | MatrixFilterSpaceReference,
    public identificationKey: IdentificationKey,
    public index: number
  ) {
    Object.assign(this, initializer)
    if (!initializer.spaceIdentifier) {
      throw new Error('SpaceIdentifier is required');
    }
  }

  get isSelected(): boolean {
    return this.identificationKey.selectedSpaces[this.index] === 1;
  }

  get isPossible(): boolean {
    return this.identificationKey.possibleSpaces[this.index] === 1;
  }

  get points (): number {
    // todo: custom space weight might be added later
    return this.filter?.weight || 0
  }

}

export class DescriptiveTextAndImagesFilterSpace extends MatrixFilterSpace { }
export class ColorFilterSpace extends MatrixFilterSpace { }
export class TextOnlyFilterSpace extends MatrixFilterSpace { }
export class TaxonFilterSpace extends MatrixFilterSpace { }

export const MatrixFilterSpaceClassMap = {
  DescriptiveTextAndImagesFilterSpace: DescriptiveTextAndImagesFilterSpace,
  ColorFilterSpace: ColorFilterSpace,
  TextOnlyFilterSpace: TextOnlyFilterSpace,
  TaxonFilterSpace: TaxonFilterSpace,
}