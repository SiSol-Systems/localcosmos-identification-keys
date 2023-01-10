import {MatrixFilterSpace, MatrixFilterSpaceReference} from "./MatrixFilterSpace";
import {TaxonReference} from "./Taxon";
import {MatrixFilter, MatrixFilterClassMap, RangeFilter} from "./MatrixFilter";

// one event should cover one MatrixItem
// one event should cover one MatrixFilter
export enum IdentificationEvents {
  spaceInitialized = 'spaceInitialized',
  beforeSpaceSelected = 'beforeSpaceSelected',
  spaceSelected = 'spaceSelected',
  spaceDeselected = 'spaceDeselected',
}

interface IdentificationEventCallback {
  (eventType: string, identificationKey: IdentificationKey, ...payload: any): void;
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
  /**
   * A matrix that maps spaces to the nodes that they encode for. E.g. if the space "brown" for the filter "color" is
   * mapping to the nodes 1 and 2 but not node 3, the matrix will look like this (assuming there are 3 nodes in total):
   * [
   *  [1, 1, 0],
   *  // other spaces e.g. "red" come here...
   *  // also other spaces of other filters e.g. "small" for the filter "size"
   * ]
   *
   * Both row and column indices correspond to the order of the spaces and nodes in the respective arrays.
   */
  public spaceNodeMapping: (0 | 1)[][];

  /**
   * A 1 for each selected space, 0 for each deselected space. The index of the array corresponds to the index of the
   * space in the spaces array.
   */
  public selectedSpaces: (0 | 1)[];

  /**
   * List of all Spaces this key has. This is a flat list of all spaces of all filters.
   */
  public spaces: MatrixFilterSpace[] = [];

  /**
   * All nodes are either 1 or 0. 1 means the node is possible, 0 means the node is impossible.
   * The values get updated by the computePossibleValues method.
   */
  public possibleNodes: (0 | 1)[];

  /**
   * All spaces are either 1 or 0. 1 means the space is possible, 0 means the space is impossible.
   * The values get updated by the computePossibleValues method.
   */
  public possibleSpaces: (0 | 1)[];

  /**
   * A two-dimensional array that maps filters to the spaces that they are restricted. E.g.
   * [
   *  // first filter has no restrictions
   *  [],
   *
   *  // the second filter has one restriction.
   *  // It is only visible if the first space is selected
   *  [[0]],
   *
   *  // the third filter has two restrictions. Both spaces restricting this filter are within the same filter,
   *  // so this filter is only visible if the first OR second space is selected
   *  [[0, 1]],
   *
   *  // the fourth filter has two restrictions. It is only visible if the first space is selected AND the
   *  // fourth space is selected. This is because the two restrictions are in different filters.
   *  [[0], [3]],
   * ]
   */
  public filterVisibilityRestrictions: number[][][];

  /**
   * A flat list of filter indices. 1 if the filter is visible, 0 if the filter is not visible.
   */
  public visibleFilters: (0 | 1)[];

  /**
   * List of all child nodes that are currently possible. This is updated by the computeResults method.
   */
  public results: IdentificationKeyReference[] = [];

  /**
   * List of all child nodes that are currently impossible. This is updated by the computeResults method.
   */
  public impossibleResults: IdentificationKeyReference[] = [];

  /**
   * A simple mapping of the uuid of a node to the number of points it has.
   */
  public points: Record<string, number> = {};

  public matrixFilters: Record<string, MatrixFilter> = {}
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

    this.visibleFilters = (new Array(Object.keys(matrixFilters).length)).fill(1);
    Object.keys(matrixFilters).forEach((matrixFilterUuid, filterIndex) => {
      const matrixFilter = matrixFilters[matrixFilterUuid]
      const matrixFilterClass = MatrixFilterClassMap[matrixFilter.type];
      const filter = new matrixFilterClass(
        matrixFilter.uuid,
        filterIndex,
        matrixFilter.type,
        matrixFilter.name,
        matrixFilter.description,
        matrixFilter.weight,
        matrixFilter.restrictions,
        matrixFilter.allowMultipleValues,
        matrixFilter.definition || {},
        this,
      )

      if (Object.keys(matrixFilter.restrictions).length > 0) {
        this.visibleFilters[filterIndex] = 0;
      }

      if (matrixFilter.position) {
        filter.position = matrixFilter.position
      }

      matrixFilter.space?.forEach((space: MatrixFilterSpaceReference) => {
        const initializedSpace = this.createSpace(space, this.spaces.length)
        filter.addSpace(initializedSpace)
        this.spaces.push(initializedSpace)
      })

      this.matrixFilters[filter.uuid] = filter;
    });

    this.spaceNodeMapping = this.spaces.map(space => {
      return (new Array(children.length).fill(0)).map((_, nodeIndex) => {
        const splits = space.spaceIdentifier.split(':', 1)
        const filter = children[nodeIndex].space[splits[0]]
        if (filter) {
          return filter.find(reference => reference.spaceIdentifier === space.spaceIdentifier) ? 1 : 0
        }

        return 0
      })
    });

    this.selectedSpaces = (new Array(this.spaces.length)).fill(0);
    this.possibleNodes = (new Array(children.length)).fill(1);
    this.possibleSpaces = (new Array(this.spaces.length)).fill(1);

    this.filterVisibilityRestrictions = Object.values(this.matrixFilters).map(filter => {
      return Object.values(filter.restrictions).map(restriction => {
        return restriction.map(space => {
          return this.findSpaceIndex(space as MatrixFilterSpace)
        })
      })
    })

    this.computeResults();
    this.spaces.forEach((_, index) => {
      this.notifyListeners(IdentificationEvents.spaceInitialized, index)
    })
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

  public computePossibleValues () {
    this.possibleNodes = this.children.map((_, nodeIndex) => {
      return this.spaces.reduce((a, b, spaceIndex) => {
        return a && (this.spaceNodeMapping[spaceIndex][nodeIndex] === 1 && this.selectedSpaces[spaceIndex] === 1 || this.selectedSpaces[spaceIndex] === 0)
      }, true) ? 1 : 0
    })
    this.possibleSpaces = this.spaces.map((_, spaceIndex) => {
      return this.selectedSpaces[spaceIndex] === 1 || this.children.reduce((a, b, nodeIndex) => {
        return a || (this.spaceNodeMapping[spaceIndex][nodeIndex] === 1 && this.possibleNodes[nodeIndex] === 1)
      }, false) ? 1 : 0
    })

    this.points = Object.fromEntries(this.children.map((node, index) => [
      node.uuid,
      this.spaces.reduce((a, b, spaceIndex) => {
        return a + (this.spaceNodeMapping[spaceIndex][index] === 1 && this.selectedSpaces[spaceIndex] === 1 ? this.spaces[spaceIndex].points : 0)
      }, 0)
    ]));

    this.visibleFilters = Object.values(this.matrixFilters).map((filter, index) => {
      return this.filterVisibilityRestrictions[index].every(r => r.some(v => this.selectedSpaces[v] === 1)) ? 1 : 0
    })

    this.computeResults();
  }

  public computeResults () {
    this.results = this.sortNodes(this.children.filter((_, index) => this.possibleNodes[index] === 1))
    this.impossibleResults = this.sortNodes(this.children.filter((_, index) => this.possibleNodes[index] === 0))
  }

  createSpace(spaceDefinition: MatrixFilterSpaceReference, index: number): MatrixFilterSpace {
    return new MatrixFilterSpace(spaceDefinition, this, index)
  }

  private sortNodes(nodes: IdentificationKeyReference[]) {
    return nodes.sort((a, b) => {
      return ((this.points[b.uuid] || 0) / b.maxPoints) - ((this.points[a.uuid] || 0) / a.maxPoints)
    })
  }

  /***
   * Select Space:
   * To select a space we flip the value in `selectedSpaces` to 1 and compute the follow-up matrices
   */
  public selectSpace (index: number, encodedSpace: any = null) {
    this.notifyListeners(IdentificationEvents.beforeSpaceSelected, { index, encodedSpace });

    if (this.selectedSpaces[index] === 1 || this.possibleSpaces[index] === 0) {
      return
    }

    this.selectedSpaces[index] = 1;
    this.computePossibleValues();
    this.notifyListeners(IdentificationEvents.spaceSelected, { index, encodedSpace });
  }

  public deselectSpace (index: number, encodedSpace: any = null) {
    if (this.selectedSpaces[index] === 0) {
      return
    }
    this.selectedSpaces[index] = 0;
    this.computePossibleValues();
    this.notifyListeners(IdentificationEvents.spaceDeselected, { index, encodedSpace });
  }

  public findSpaceIndex (space: MatrixFilterSpace) {
    return this.spaces.findIndex(s => s.spaceIdentifier === space.spaceIdentifier)
  }

}