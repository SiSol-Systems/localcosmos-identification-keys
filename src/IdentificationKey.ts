export enum IdentificationEvents {
  done = "done",
  pointsUpdate = "pointsUpdate",
  matrixFilterBecameVisible = "matrixFilterBecameVisible",
  matrixFilterBecameInvisible = "matrixFilterBecameInvisible",
  valueBecameImpossible = "valueBecameImpossible",
  valueBecamePossible = "valueBecamePossible",
}

interface IdentificationEventCallback {
  (eventType: string): void;
}


export enum IdentificationModes {
  ranking = "ranking",
  exclustionCriterion = "exclusionCriterion"
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

export interface IdentificationKeyData {
  items: [],
  matrixFilters: []
}

export class IdentificationKey {

  identificationKeyData: IdentificationKeyData

  constructor(identificationKeyData: IdentificationKeyData, settings: IdentificationSettings) {
    this.identificationKeyData = identificationKeyData;
  }

  setData() {

  }

  on(event: IdentificationEvents): void {

  }

  off(event: IdentificationEvents): void {

  }

  selectValue(): void {

  }

  unSelectValue(): void {

  }

  reset(): void { }


}