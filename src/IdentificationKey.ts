import { IdentificationTreeNode } from "./IdentificationTreeNode";
import { MatrixFilter, MatrixFilterClassMap, RangeFilter } from "./MatrixFilter";
import { TaxonReference } from "./Taxon";
import { MatrixFilterSpace, MatrixFilterSpaceReference } from "./MatrixFilterSpace";

// one event should cover one MatrixItem
// one event should cover one MatrixFilter
export enum IdentificationEvents {
  childrenUpdated = "childrenUpdated",
  filterUpdated = "filterUpdated",
}

export enum IdentificationModes {
  fluid = "fluid",
  strict = "strict",
}

interface IdentificationEventCallback {
  (eventType: string): void;
}

/**
 * The identification key (matrix) on one level of the identification tree
 */
export class IdentificationKey {

  public matrixFilters: Record<string, MatrixFilter> = {}

  //public filteredChildren: IdentificationTreeNode[] = []

  // more than one space of a MatrixFilter can be selected at the same time, if Matrixfilter.allowMultipleValues == true
  public selectedFilterSpaces: { [spaceIdentifier: string]: MatrixFilterSpace } = {}

  private listeners: Record<string, Function[]> = {}

  constructor(
    public name: string,
    public taxon: TaxonReference | null,
    public children: IdentificationTreeNode[],
    public identificationMode: IdentificationModes,
    public childrenCount: number,
    public factSheets: any[], // todo: missing type info
    public slug: string,
    matrixFilters: Record<string, MatrixFilter>,
  ) {

    for (const matrixFilterUuid in matrixFilters) {
      const matrixFilter = matrixFilters[matrixFilterUuid];
      const matrixFilterClass = MatrixFilterClassMap[matrixFilter.type];
      const filter = new matrixFilterClass(
        matrixFilter.uuid,
        matrixFilter.type,
        matrixFilter.name,
        matrixFilter.description,
        matrixFilter.isVisible,
        matrixFilter.isRestricted,
        matrixFilter.weight,
        matrixFilter.restrictions,
        matrixFilter.allowMultipleValues,
        this,
      )

      if (matrixFilter.position) {
        filter.position = matrixFilter.position;
      }

      if (matrixFilter.type === 'RangeFilter') {
        (filter as RangeFilter).setEncodedSpace((matrixFilter as any).encodedSpace);
      }

      matrixFilter.space?.forEach((space: MatrixFilterSpaceReference) => {
        filter.createSpace(space);
      })

      this.matrixFilters[matrixFilterUuid] = filter;
    }
  }

  /**
   * Register a callback for an identification event
   *
   * @param event
   * @param callback
   */
  on(event: IdentificationEvents, callback: Function): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Unregister a callback for an event
   *
   * @param event
   * @param callback
   */
  off(event: IdentificationEvents, callback: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(f => f !== callback);
    }
  }

  /**
   * Notifies all registered listeners for a given event.
   *
   * @param event
   * @param payload optional payload for the event
   * @private
   */
  notifyListeners(event: IdentificationEvents, ...payload: any[]) {
    (this.listeners[event] || []).forEach(callback => {
      callback.call(callback, event, this, ...payload);
    })
  }

  /**
   * This method is automatically called when a space of one of this IdentificationKeys MatrixFilters is selected.
   * It can also be called manually.
   */
  onSelectSpace(space: MatrixFilterSpace): void {

    // add space to this.selectedFilterSpaces if it is not yet present
    this.selectedFilterSpaces[space.spaceIdentifier] = space;

    this.calculateUpdates();
  }

  /**
   * This method is automatically called when a space of one of this IdentificationKeys MatrixFilters is deselected.
   * It can also be called manually.
   */
  onDeselectSpace(space: MatrixFilterSpace): void {
    delete this.selectedFilterSpaces[space.spaceIdentifier];
    this.calculateUpdates();
  }

  calculateUpdates(): void {
    this.calculateFilteredChildren();
    this.calculateFilteredMatrixFilters();
  }

  /**
   * Propagates selection of spaces to treeNodes, which then decide if they are possible or not
   * @private
   */
  private calculateFilteredChildren() {
    this.children.forEach(treeNode => {
      Object.entries(this.selectedFilterSpaces).forEach(([spaceIdentifier, selectedSpace]) => {

        if (spaceIdentifier in treeNode.space) {
          treeNode.onSelectMatchingSpace(selectedSpace);
        }
        else {
          treeNode.onSelectMismatchingSpace(selectedSpace);
        }
      });
    })

    this.notifyListeners(IdentificationEvents.childrenUpdated, this.children)
  }

  /**
   * Sets the possibility of all filter spaces based on which filter spaces are selected
   * AND based on which treeNodes are still possible
   * @private
   */
  private calculateFilteredMatrixFilters(): void {
    Object.values(this.matrixFilters).forEach(filter => {
      filter.isVisible = true;
      for (const filterId in this.selectedFilterSpaces) {
        // check if the filter has a space encoded for this item:
        if (filterId in filter.space) {
          if (!this.matrixFilters[filterId].isMatrixFilterVisible(this.selectedFilterSpaces[filterId], filter)) {
            filter.isVisible = false;
            break;
          }
        }
      }

      filter.onItemsChanged()
    })
    this.notifyListeners(IdentificationEvents.filterUpdated, this.matrixFilters);
  }

  get possibleChildren(): IdentificationTreeNode[] {
    return Object.values(this.children).filter(treeNode => treeNode.isPossible);
  }


  reset(): void {
    this.children.forEach(treeNode => {
      treeNode.reset();
    });

    Object.entries(this.matrixFilters).forEach(([filterId, matrixFilter]) => {
      matrixFilter.reset();
    });
  }

}