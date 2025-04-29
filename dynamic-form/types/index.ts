// Form response from API
export interface FormResponse {
  message: string
  form: {
    formTitle: string
    formId: string
    version: string
    sections: FormSection[]
  }
}

// Form section structure
export interface FormSection {
  sectionId: number
  title: string
  description: string
  fields: FormField[]
}

// Form field structure
export interface FormField {
  fieldId: string
  type: "text" | "tel" | "email" | "textarea" | "date" | "dropdown" | "radio" | "checkbox"
  label: string
  placeholder?: string
  required: boolean
  dataTestId: string
  validation?: {
    message: string
  }
  options?: Array<{
    value: string
    label: string
    dataTestId?: string
  }>
  maxLength?: number
  minLength?: number
}
