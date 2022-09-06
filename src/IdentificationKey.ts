import { MatrixFilterDefinition } from "./MatrixFilter";
import { DescriptiveTextAndImagesFilter } from "./matrix-filters/DescriptiveTextAndImagesFilter";
import { ColorFilter } from "./matrix-filters/ColorFilter";
import { RangeFilter } from "./matrix-filters/RangeFilter";
import { NumberFilter } from "./matrix-filters/NumberFilter";
import { TextOnlyFilter } from "./matrix-filters/TextOnlyFilter";
import { TaxonFilter } from "./matrix-filters/TaxonFilter";

export enum IdentificationEvents {
  done = "done",
  pointsUpdate = "pointsUpdate",
  matrixFilterBecameVisible = "matrixFilterBecameVisible",
  matrixFilterBecameInvisible = "matrixFilterBecameInvisible",
  spaceBecameImpossible = "spaceBecameImpossible",
  spaceBecamePossible = "spaceBecamePossible",
}

type MatrixFilterType = typeof DescriptiveTextAndImagesFilter | typeof ColorFilter | typeof RangeFilter | typeof NumberFilter | typeof TextOnlyFilter | typeof TaxonFilter;

type MatrixFilterTypeMap = {
  [key: string]: MatrixFilterType;
};

const MatrixFilterClassMap: MatrixFilterTypeMap = {
  DescriptiveTextAndImagesFilter: DescriptiveTextAndImagesFilter,
  ColorFilter: ColorFilter,
  RangeFilter: RangeFilter,
  NumberFilter: NumberFilter,
  TextOnlyFilter: TextOnlyFilter,
  TaxonFilter: TaxonFilter
};

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
  matrixFilters: Record<string, MatrixFilterDefinition>
}

export class IdentificationKey {

  identificationKeyData: IdentificationKeyData

  constructor(identificationKeyData: IdentificationKeyData, settings: IdentificationSettings) {
    this.identificationKeyData = identificationKeyData;

    this.activateData();
  }

  activateData() {
    const matrixFilterDefinitions = this.identificationKeyData["matrixFilters"];

    for (let matrixFilterUuid in matrixFilterDefinitions) {
      let matrixFilterDefinition = matrixFilterDefinitions[matrixFilterUuid];
      let MatrixFilterClass = MatrixFilterClassMap[matrixFilterDefinition.type];
    }
  }

  on(event: IdentificationEvents): void {

  }

  off(event: IdentificationEvents): void {

  }

  selectValue(): void {

  }

  unSelectValue(): void {

  }

  evaluate(): void {

  }

  reset(): void { }


}