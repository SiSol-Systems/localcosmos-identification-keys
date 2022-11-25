import {MatrixFilter, MatrixFilterClassMap, RangeFilter} from "./MatrixFilter";
import { TaxonReference } from "./Taxon";
import { MatrixFilterSpace, MatrixFilterSpaceReference } from "./MatrixFilterSpace";

export enum IdentificationEvents {
  childrenUpdated = 'childrenUpdated',
  filterUpdated = 'filterUpdated',
  matrixFilterUpdate = "matrixFilterUpdate",
  matrixFilterBecameVisible = "matrixFilterBecameVisible",
  matrixFilterBecameInvisible = "matrixFilterBecameInvisible",
  spaceBecameImpossible = "spaceBecameImpossible",
  spaceBecamePossible = "spaceBecamePossible",
  matrixItemUpdate = "matrixItemUpdate",
  matrixItem100percent = "matrixItem100percent",
  childrenUpdated = "childrenUpdated",
}

export class IdentificationKeyReference {
  constructor(
      public uuid: string,
      public nodeType: 'node' | 'result',
      public imageUrl: string,
      public space: Record<string, MatrixFilterSpaceReference[]>,
      public maxPoints: number,
      public isVisible: boolean,
      public name: string,
      public decisionRule: string,
      public taxon: TaxonReference | null,
      public factSheets: any[], // todo: missing type info
      public slug: string,
  ) {}
  
}

interface IdentificationEventCallback {
  (eventType: string): void;
}

export enum NodeTypes {
  node = "node",
  result = "result",
}

export enum IdentificationModes {
  fluid = "fluid",
  strict = "strict",
}

export interface IdentificationKeyReference {
  uuid: string
  nodeType: NodeTypes
  imageUrl: string
  space: Record<string, MatrixFilterSpaceReference[]>,
  maxPoints: number
  isVisible: boolean
  name: string
  decisionRule: string
  taxon: TaxonReference | null
  factSheets: any[] // todo: missing type info
  slug: string
}

export class IdentificationKey {

  public matrixFilters: Record<string, MatrixFilter> = {}

  public filteredChildren: IdentificationKeyReference[] = []

  public selectedFilterSpaces: { [filterUuid: string]: MatrixFilterSpace } = {}

  private listeners: Record<string, Function[]> = {}

  constructor(
    public name: string,
    public taxon: TaxonReference | null,
    public children: IdentificationKeyReference[],
    public identificationMode: IdentificationModes,
    public childrenCount: number,
    public factSheets: any[], // todo: missing type info
    public slug: string,
    public overviewImage: string,
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
        filter.position = matrixFilter.position
      }

      if (matrixFilter.type === 'RangeFilter') {
        (filter as RangeFilter).setEncodedSpace((matrixFilter as any).encodedSpace)
      }

      matrixFilter.space?.forEach((space: MatrixFilterSpaceReference) => {
        filter.createSpace(space)
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
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  /**
   * Unregister a callback for an event
   *
   * @param event
   * @param callback
   */
  off(event: IdentificationEvents, callback: Function): void {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(f => f !== callback)
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
      callback.call(callback, event, this, ...payload)
    })
  }

  /**
   * This method is automatically called when a space of one of this IdentificationKeys MatrixFilters is selected.
   * It can also be called manually.
   */
  onSelectSpace(filter: MatrixFilter, space: MatrixFilterSpace): void {
    this.selectedFilterSpaces[filter.uuid] = space
    this.calculateUpdates()
  }

  /**
   * This method is automatically called when a space of one of this IdentificationKeys MatrixFilters is deselected.
   * It can also be called manually.
   */
  onDeselectSpace(filter: MatrixFilter, _space: MatrixFilterSpace): void {
    delete this.selectedFilterSpaces[filter.uuid]
    this.calculateUpdates()
  }

  calculateUpdates(): void {
    this.calculateFilteredChildren();
    this.calculateFilteredMatrixFilters();
  }

  /**
   * Sets the visibility of all children based on which filter spaces are selected
   * @private
   */
  private calculateFilteredChildren() {
    this.children.forEach(child => {
      child.isVisible = true
      for (const filterId in this.selectedFilterSpaces) {
        // check if the filter has a space encoded for this item:
        if (filterId in child.space) {
          if (!this.matrixFilters[filterId].isIdentificationKeyVisible(this.selectedFilterSpaces[filterId], child)) {
            child.isVisible = false
            break
          }
        }
      }
    })

    this.notifyListeners(IdentificationEvents.childrenUpdated, this.children)
  }

  /**
   * Sets the visibility of all filters based on which filter spaces are selected
   * @private
   */
  private calculateFilteredMatrixFilters(): void {
    Object.values(this.matrixFilters).forEach(filter => {
      filter.isVisible = true
      for (const filterId in this.selectedFilterSpaces) {
        // check if the filter has a space encoded for this item:
        if (filterId in filter.space) {
          if (!this.matrixFilters[filterId].isMatrixFilterVisible(this.selectedFilterSpaces[filterId], filter)) {
            filter.isVisible = false
            break
          }
        }
      }

      filter.onItemsChanged()
    })
    this.notifyListeners(IdentificationEvents.filterUpdated, this.matrixFilters)
  }

  get visibleChildren(): IdentificationKeyReference[] {
    return Object.values(this.children).filter(child => child.isVisible);
  }
}