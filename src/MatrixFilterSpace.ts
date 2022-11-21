import { MatrixFilter } from "./MatrixFilter";
import { IdentificationTreeNode } from "./IdentificationTreeNode";

export interface MatrixFilterSpaceReference {
  spaceIdentifier: string,
  encodedSpace: any,
}


interface TreeNodeRegistry {
  [treeNodeUUID: string]: IdentificationTreeNode
}


export class MatrixFilterSpace {

  public isSelected: boolean
  public isPossible: boolean

  /**
   * notify all matchingTreeNodes if this space is selected, triggers updating their points
   */
  private matchingTreeNodes: TreeNodeRegistry = {} // static, maybe include the treeNoedUUIDs during build??

  /**
   * notify all mismatchingTreeNodes if this space is selected, triggers exclusion
   */
  private mismatchingTreeNodes: TreeNodeRegistry = {}// static, maybe include the treeNodeUUIDS during build??

  /**
   * if there are NO MORE possible treeNodes which contain this space, this space itself becomes impossible
   * initially all treeNodes are possible
   */
  public possibleMatchingTreeNodes: TreeNodeRegistry = {}

  /**
   * TreeNodes which are currently possible, but do not match this space. Those treeNodes become impossible when
   * this space is being selected.
   * This represents the impact of this space on the current identification key if this space becomes selected.
   * Features like "if you select this space, 10 treeNodes will be sorted out" require this representation.
   */
  public possibleMismatchingTreeNodes: TreeNodeRegistry = {}

  constructor(
    public spaceIdentifier: string,
    public encodedSpace: any,
    public imageUrl: string | null,
    public secondaryImageUrl: string | null,
    public matrixFilter: MatrixFilter,
  ) {
    this.isSelected = false;
    this.isPossible = true;

    this.matchingTreeNodes = matrixFilter?.treeNodes?.filter(treeNode => {
      return treeNode.space[this.matrixFilter.uuid]?.find(space => space.spaceIdentifier === this.spaceIdentifier);
    });

    this.possibleMatchingTreeNodes = { ...this.matchingTreeNodes };
  }

  /**
   * The user selects a certain MatrixFilterSpace in the frontend.
   */
  select(): void {
    if (this.isPossible) {
      this.isSelected = true;
      this.matrixFilter.onSelectSpace(this);

      // iterate over all treeNodes
      // treeNodes have to update Points
      Object.entries(this.matchingTreeNodes).forEach(([treeNodeUUID, treeNode]) => {
        treeNode.onSelectMatchingSpace(this);
      });

      // mismatching treeNodes become excluded
      Object.entries(this.mismatchingTreeNodes).forEach(([treeNodeUUID, treeNode]) => {
        treeNode.onSelectMismatchingSpace(this);
      });
    }
    else {
      throw new Error(`[MatrixFilterSpace] ${this.spaceIdentifier} of ${this.matrixFilter.name} cannot be selected because space.isPossible is false`);
    }
  }

  /**
   * The user deselects a certain MatrixFilterSpace in the frontend.
   */
  deselect(): void {
    if (this.isSelected) {
      this.isSelected = false;
      this.matrixFilter.onDeselectSpace(this);

      Object.entries(this.matchingTreeNodes).forEach(([treeNodeUUID, treeNode]) => {
        treeNode.onDeselectMatchingSpace(this);
      });

      // mismatching treeNodes become excluded
      Object.entries(this.mismatchingTreeNodes).forEach(([treeNodeUUID, treeNode]) => {
        treeNode.onDeselectMismatchingSpace(this);
      });

    }
  }

  /**
   * Event triggered once another space within the same MatrixFilter is selected
   * if a space gets delesected, it has to  be removed from identificationKey.selectedFilterSpaces
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
  onOtherSpaceDeselected(otherSpace: MatrixFilterSpace): void { }

  //onItemsChanged() {
  //  this.isPossible = !this.matchingTreeNodes.every(treeNode => !treeNode.isPossible);
  //}

  onMatchingTreeNodeChangedPossibility(treeNode: IdentificationTreeNode) {
    if (treeNode.isPossible === true) {
      this.possibleMatchingTreeNodes[treeNode.uuid] = treeNode;
    }
    else {
      delete this.possibleMatchingTreeNodes[treeNode.uuid];
    }
  }

  reset(): void {
    this.isSelected = true;
    this.isPossible = true;
    this.possibleMatchingTreeNodes = { ...this.matchingTreeNodes };
    this.possibleMismatchingTreeNodes = { ...this.mismatchingTreeNodes };
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