import { MatrixFilter, MatrixFilterClassMap } from "./MatrixFilter";
import { TaxonReference } from "./Taxon";
import {MatrixFilterSpace, MatrixFilterSpaceReference} from "./MatrixFilterSpace";

export enum IdentificationEvents {
  matrixFilterUpdate = "matrixFilterUpdate",
  matrixFilterBecameVisible = "matrixFilterBecameVisible",
  matrixFilterBecameInvisible = "matrixFilterBecameInvisible",
  spaceBecameImpossible = "spaceBecameImpossible",
  spaceBecamePossible = "spaceBecamePossible",
  matrixItemUpdate = "matrixItemUpdate",
  matrixItem100percent = "matrixItem100percent",
  childrenUpdated = 'childrenUpdated'
}

interface IdentificationEventCallback {
  (eventType: string): void;
}

export enum IdentificationModes {
  ranking = "ranking",
  exclustionCriterion = "exclusionCriterion"
}

export interface IdentificationKeyReference {
  uuid: string
  nodeType: 'node' | 'result' // todo: any more?
  imageUrl: string
  space: Record<string, MatrixFilterSpaceReference[]>,
  maxPoints: number
  isVisible: boolean
  name: string
  decisionRule: string
  taxon: TaxonReference | null
  factSheets: any[] // todo: missing type info
}

export interface IdentificationSettings {
  mode: IdentificationModes,
  done: IdentificationEventCallback,
  pointsUpdate: IdentificationEventCallback,
  matrixFilterBecameVisible: IdentificationEventCallback,
  matrixFilterBecameInvisible: IdentificationEventCallback,
  valueBecameImpossible: IdentificationEventCallback,
  valueBecamePossible: IdentificationEventCallback
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
    public identificationMode: 'fluid' | 'strict',
    public childrenCount: number,
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
      matrixFilter.space.forEach(space => {
        filter.createSpace(space)
      })

      this.matrixFilters[matrixFilterUuid] = filter;
    }
    this.calculateFilteredChildren();
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
    this.calculateFilteredChildren()
  }

  /**
   * This method is automatically called when a space of one of this IdentificationKeys MatrixFilters is deselected.
   * It can also be called manually.
   */
  onDeselectSpace(filter: MatrixFilter, space: MatrixFilterSpace): void {
    delete this.selectedFilterSpaces[filter.uuid]
    this.calculateFilteredChildren()
  }

  /**
   * Updates `filteredChildren` by iterating over all selected filters and removing items that don't match selected filters
   * @private
   */
  private calculateFilteredChildren() {
    this.filteredChildren = this.children;
    Object.entries(this.selectedFilterSpaces).forEach(([filterId, space]) => {
      this.filteredChildren = this.filteredChildren.filter(child => {
        // check if the filter has a space encoded for this item:
        if (filterId in child.space) {
          return this.matrixFilters[filterId].isIdentificationKeyVisible(space, child)
        }

        // keep children where this filter does not apply
        return true
      })
    })
    this.notifyListeners(IdentificationEvents.childrenUpdated, this.filteredChildren)
  }
}