export interface FrontendUserContentImage {
  RESOLVED_URLS: { '1x': string, '2x': string, '3x': string },
}

export interface FactSheetContent {
  key: string
  type: 'image' | 'multi-image' | 'text'
  format?: 'layoutable-full' | 'layoutable-simple'
  widget?: 'TextInput' | 'TextArea'
  label: string
}

export interface FactSheetContentWithValue extends FactSheetContent {
  value?: string | FrontendUserContentImage[] | FrontendUserContentImage
}

export interface TemplateContent {
  title: string
  slug: string
  contents: Record<string, FactSheetContentWithValue>
}

export interface FactSheetTemplate extends TemplateContent {
  version: number
  templateFileName: string
  templateName: string
  templateUrl: string
  contents: Record<string, FactSheetContent>
}
