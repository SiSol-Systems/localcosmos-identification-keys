export interface FrontendUserContentImage {
  RESOLVED_URLS: { '1x': string, '2x': string, '3x': string },
}

export interface FactSheetContent {
  key: string
  type: 'image' | 'multi-image' | 'text'
  format?: 'layoutable-full' | 'layoutable-simple'
}

export interface FactSheetContentWithValue extends FactSheetContent {
  value?: string | FrontendUserContentImage[] | FrontendUserContentImage
}

export interface FactSheet {
  title: string
  slug: string
  contents: Record<string, FactSheetContentWithValue>
}

export interface FactSheetTemplate extends FactSheet {
  templateName: string
  templateUrl: string
  contents: Record<string, FactSheetContent>
}
