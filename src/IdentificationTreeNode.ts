import { MatrixFilterSpace } from "./MatrixFilterSpace";
import { TaxonReference } from "./Taxon";

export enum NodeTypes {
  node = "node",
  result = "result",
}

interface MatrixFilterSpaceRegistry {
  [spaceIdentifier: string] : MatrixFilterSpace
}

/**
 * A node in the identification tree
 */
export class IdentificationTreeNode {

  // sum of points of matching selected spaces
  public currentPoints: number = 0

  // sum of points of mismatching selected spaces
  public currentAntiPoints: number = 0

  /**
   * Static represenation of spaces that match this TreeNode
   * If a space has no more possible matching TreeNodes, it becomes impossible
   * Notify all TreeNode.matchingSpaces if TreeNode.isPossible changed.
   * With this registry the TreeNode knows which spaces it has to notify.
   */
  private matchingSpaces: MatrixFilterSpaceRegistry = {} // static

  /**
   * A representation of the current space selection situation, relevant fo this TreeNode.
   * This makes calculating points and antiPoints of this TreeNode possible.
   * Whether a space matches or mismatches a TeeNode is considered a boolean value. There is no "no opinion" option.
   * Although one mismatch is enough to determine if a TreeNode is excluded, the mismatching spaces as a set enables
   * a more detailed evaluation and might lead to the possibility of correcting selection/observation errors made by the end user.
   */
  private matchingSelectedSpaces: MatrixFilterSpaceRegistry = {}
  private mismatchingSelectedSpaces: MatrixFilterSpaceRegistry = {}

  constructor(
    public uuid: string,
    public nodeType: NodeTypes,
    public imageUrl: string,
    public space: Record<string, MatrixFilterSpace[]>,
    public maxPoints: number,
    public isPossible: boolean,
    public name: string,
    public decisionRule: string,
    public taxon: TaxonReference | null,
    public factSheets: any[], // todo: missing type info
    public slug: string,
  ) {
  }

  // the (de)Selection of matching spaces has no influence on this.isPossible.
  // A matching space cannot be an exclusion criterion
  onSelectMatchingSpace(space: MatrixFilterSpace): void {
    this.matchingSelectedSpaces[space.spaceIdentifier] = space;
    this.calculatePoints();
  }

  onDeselectMatchingSpace(space: MatrixFilterSpace): void {
    delete this.matchingSelectedSpaces[space.spaceIdentifier];
    this.calculatePoints();
  }


  // only the (de)Selection of mismatching spaces influences this.isPossible
  onSelectMismatchingSpace(space: MatrixFilterSpace): void {
    this.mismatchingSelectedSpaces[space.spaceIdentifier] = space;
    this.calculatePoints();
    this.calculatePossibility();
  }

  onDeselectMismatchingSpace(space: MatrixFilterSpace): void {
    delete this.mismatchingSelectedSpaces[space.spaceIdentifier];
    this.calculatePoints();
    this.calculatePossibility();
  }

  calculatePoints(): void {

    var points: number = 0;
    var antiPoints: number = 0;

    Object.entries(this.matchingSelectedSpaces).forEach(
      ([spaceIdentifier, matchingSpace]) => {
        points += matchingSpace.matrixFilter.weight;
      }
    );

    Object.entries(this.mismatchingSelectedSpaces).forEach(
      ([spaceIdentifier, mismatchingSpace]) => {
        antiPoints += mismatchingSpace.matrixFilter.weight;
      }
    );

    this.currentPoints = points;
    this.currentAntiPoints = antiPoints;
  }

  calculatePossibility(): void {

    const wasPossible = this.isPossible;

    var isPossible: boolean = true;
    if (Object.keys(this.mismatchingSelectedSpaces).length > 0) {
      isPossible = false;
    }

    this.isPossible = isPossible;

    // notify matching spaces if this.isPossible has changed
    if (wasPossible != this.isPossible){
      Object.entries(this.matchingSpaces).forEach(([spaceIdentifier, space]) => {
        space.onMatchingTreeNodeChangedPossibility(this);
      });
    }
  }

  reset(): void {
    this.currentPoints = 0;
    this.currentAntiPoints = 0;
    this.matchingSelectedSpaces = {};
    this.mismatchingSelectedSpaces = {};
  }

}