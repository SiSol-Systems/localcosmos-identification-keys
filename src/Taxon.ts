import { Image } from "./Image";
import { MatrixFilter } from "./MatrixFilter";

export interface TaxonImageSet {
  taxonProfileImages: Image[]
  nodeImages: Image[]
  taxonImages: Image[]
}

export interface TraitValue {
  encodedSpace: string
  imageUrl: string
}

export interface Trait {
  matrixFilter: MatrixFilter
  values: TraitValue[]
}

export interface TaxonText {
  taxonTextType: string
  shortText: string,
  shortTextKey: string
  longText: string
  longTextKey: string
}

export interface Taxon {
  nameUuid: string,
  taxonNuid: string,
  taxonAuthor: string,
  taxonSource: string,
  taxonLatname: string,
  vernacular: { [locale: string]: string }
  allVernacularNames: { [locale: string]: string }
  nodeNames: string[]
  nodeDecisionRules: any // todo: unknown
  traits: Trait[]
  texts: TaxonText[],
  images: TaxonImageSet
  synonyms: string[]
  gbifNubKey: string
  // templateContents: unknown // todo: unknown
}


export interface TaxonReference {
  nameUuid: string
  taxonSource: string
  taxonLatname: string
  taxonAuthor: string
  vernacularNames: { [locale: string]: string }
  alternativeVernacularNames: { [locale: string]: string }
  images: TaxonImageSet
}