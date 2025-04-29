"use client"

import { useState, useEffect } from "react"
import type { FormResponse } from "@/types"
import { Button } from "@/components/ui/button"
import FormFieldRenderer from "@/components/form-field-renderer"
import { useForm, FormProvider } from "react-hook-form"
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react"

interface DynamicFormProps {
  formData: FormResponse
  onComplete: () => void
}

export default function DynamicForm({ formData, onComplete }: DynamicFormProps) {
  // Form state
  const [sectionIdx, setSectionIdx] = useState(0)
  const [allValues, setAllValues] = useState<Record<string, any>>({})
  const [submitting, setSubmitting] = useState(false)

  // Get current section data
  const sections = formData.form.sections
  const currentSection = sections[sectionIdx]
  const isLastSection = sectionIdx === sections.length - 1

  // Calculate progress
  const progress = Math.round(((sectionIdx + 1) / sections.length) * 100)

  // Setup form with default values
  const getDefaults = () => {
    const defaults: Record<string, any> = {}

    // Set default values based on field type
    currentSection.fields.forEach((field) => {
      if (field.type === "checkbox") {
        defaults[field.fieldId] = false
      } else {
        defaults[field.fieldId] = ""
      }
    })

    return defaults
  }

  const methods = useForm({
    mode: "onChange",
    defaultValues: getDefaults(),
  })

  // Reset form when section changes
  useEffect(() => {
    // console.log("Section changed, resetting form")
    methods.reset(getDefaults())
  }, [sectionIdx])

  const { handleSubmit, formState } = methods
  const { isValid } = formState

  // Handle section submission
  const onSectionSubmit = async (data: Record<string, any>) => {
    // Update stored values
    const newValues = { ...allValues, ...data }
    setAllValues(newValues)

    if (isLastSection) {
      // Handle final submission
      setSubmitting(true)

      try {
        // Log form data to console as required
        console.log("FORM SUBMITTED:", newValues)

        // Show confirmation
        alert("Form submitted successfully! Check console for form data.")

        // Return to login
        onComplete()
      } catch (err) {
        console.error("Submit error:", err)
        alert("Error submitting form. Please try again.")
      } finally {
        setSubmitting(false)
      }
    } else {
      // Move to next section
      setSectionIdx((prev) => prev + 1)
    }
  }

  // Go to previous section
  const prevSection = () => {
    if (sectionIdx > 0) {
      setSectionIdx((prev) => prev - 1)
    }
  }

  return (
    <div className="w-full">
      {/* Form header and progress */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{formData.form.formTitle}</h2>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span>Form ID: {formData.form.formId}</span>
          <span>Version: {formData.form.version}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-1">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            Section {sectionIdx + 1} of {sections.length}
          </span>
          <span>{progress}% Complete</span>
        </div>
      </div>

      {/* Section content */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{currentSection.title}</h3>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{currentSection.description}</p>
        </div>

        <div className="p-6">
          <FormProvider {...methods}>
            <form id="section-form" onSubmit={handleSubmit(onSectionSubmit)} className="space-y-6">
              {currentSection.fields.map((field) => (
                <FormFieldRenderer key={field.fieldId} field={field} />
              ))}
            </form>
          </FormProvider>
        </div>

        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevSection}
            disabled={sectionIdx === 0 || submitting}
            data-testid="prev-button"
            className="transition-all"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            type="submit"
            form="section-form"
            disabled={!isValid || submitting}
            data-testid={isLastSection ? "submit-button" : "next-button"}
            className={`transition-all ${isLastSection ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : isLastSection ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit
              </>
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Section indicators */}
      <div className="mt-8 flex justify-center">
        <div className="flex space-x-2">
          {sections.map((_, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium transition-all ${
                idx === sectionIdx
                  ? "bg-blue-600 text-white shadow-md"
                  : idx < sectionIdx
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
