import {MatrixFilterSpace, MatrixFilterSpaceReference} from "./MatrixFilterSpace";
import {TaxonReference} from "./Taxon";
import {MatrixFilter, MatrixFilterClassMap, RangeFilter} from "./MatrixFilter";

export enum IdentificationEvents {
  spaceSelected = 'spaceSelected',
  spaceDeselected = 'spaceDeselected',
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
  public spaceNodeMapping: number[][];
  public selectedSpaces: number[];

  public spaces: MatrixFilterSpace[] = [];
  public possibleNodes: number[];
  public possibleSpaces: number[];

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
    for (const matrixFilterUuid in matrixFilters) {
      const matrixFilter = matrixFilters[matrixFilterUuid]
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
        const initializedSpace = this.createSpace(space, this.spaces.length)
        filter.space.push(initializedSpace)
        this.spaces.push(initializedSpace)
      })

      this.matrixFilters[filter.uuid] = filter;
    }

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
    this.possibleNodes = (new Array(children.length)).fill(1)
    this.possibleSpaces = (new Array(this.spaces.length)).fill(1)
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
  }

  createSpace(spaceDefinition: MatrixFilterSpaceReference, index: number): MatrixFilterSpace {
    return new MatrixFilterSpace(spaceDefinition, this, index)
  }

  /***
   * Select Space:
   * To select a space we flip the value in `selectedSpaces` to 1 and compute the follow up matrices
   */
  public selectSpace (index: number) {
    if (this.selectedSpaces[index] === 1 || this.possibleSpaces[index] === 0) {
      return
    }
    this.selectedSpaces[index] = 1;
    this.notifyListeners(IdentificationEvents.spaceSelected, this.spaces[index]);
    /* for points:
    for (let i = 0; i < nodes.length; i++) {
      if (spaces[index].matchesNode(nodes[i])) {
        nodes[i].points += spaces[index].points;
      }
    }
    */
    this.computePossibleValues();
  }

  public deselectSpace (index: number) {
    if (this.selectedSpaces[index] === 0) {
      return
    }
    this.selectedSpaces[index] = 0;
    this.notifyListeners(IdentificationEvents.spaceDeselected, this.spaces[index]);
    /* for points:
    for (let i = 0; i < nodes.length; i++) {
      if (spaces[index].matchesNode(nodes[i])) {
        nodes[i].points -= spaces[index].points;
      }
    }
    */
    this.computePossibleValues();
  }

  public findSpaceIndex (space: MatrixFilterSpace) {
    return this.spaces.findIndex(s => s.spaceIdentifier === space.spaceIdentifier)
  }
}