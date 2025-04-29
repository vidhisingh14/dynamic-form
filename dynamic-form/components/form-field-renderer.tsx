"use client"

import type { FormField } from "@/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFormContext } from "react-hook-form"
import { FormField as RhfFormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Calendar, Mail, Phone, Type, AlignLeft } from "lucide-react"

interface FieldProps {
  field: FormField
}

export default function FormFieldRenderer({ field }: FieldProps) {
  const { control } = useFormContext()

  // Setup validation rules
  const rules: any = {
    required: field.required ? `${field.label} is required` : false,
  }

  // Add length validations if specified
  if (field.minLength) {
    rules.minLength = {
      value: field.minLength,
      message: `Min ${field.minLength} characters required`,
    }
  }

  if (field.maxLength) {
    rules.maxLength = {
      value: field.maxLength,
      message: `Max ${field.maxLength} characters allowed`,
    }
  }

  // Add custom validation message if provided
  if (field.validation?.message) {
    rules.validate = (val: any) => {
      if (field.required && (!val || val.length === 0)) {
        return field.validation!.message
      }
      return true
    }
  }

  // Get icon for field type
  const getIcon = () => {
    switch (field.type) {
      case "email":
        return <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      case "tel":
        return <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      case "textarea":
        return <AlignLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      case "date":
        return <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      default:
        return <Type className="h-4 w-4 text-gray-500 dark:text-gray-400" />
    }
  }

  // Render different field types
  switch (field.type) {
    case "text":
    case "tel":
    case "email":
      return (
        <RhfFormField
          control={control}
          name={field.fieldId}
          rules={rules}
          defaultValue=""
          render={({ field: f }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center space-x-2">
                {getIcon()}
                <span>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...f}
                  data-testid={field.dataTestId}
                  className="transition-all focus:ring-2 focus:ring-blue-500/40"
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      )

    case "textarea":
      return (
        <RhfFormField
          control={control}
          name={field.fieldId}
          rules={rules}
          defaultValue=""
          render={({ field: f }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center space-x-2">
                <AlignLeft className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={field.placeholder}
                  {...f}
                  data-testid={field.dataTestId}
                  className="min-h-[120px] transition-all focus:ring-2 focus:ring-blue-500/40"
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      )

    case "date":
      return (
        <RhfFormField
          control={control}
          name={field.fieldId}
          rules={rules}
          defaultValue=""
          render={({ field: f }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </span>
              </FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...f}
                  data-testid={field.dataTestId}
                  className="transition-all focus:ring-2 focus:ring-blue-500/40"
                />
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      )

    case "dropdown":
      return (
        <RhfFormField
          control={control}
          name={field.fieldId}
          rules={rules}
          defaultValue=""
          render={({ field: f }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <Select onValueChange={f.onChange} value={f.value || ""}>
                <FormControl>
                  <SelectTrigger
                    data-testid={field.dataTestId}
                    className="transition-all focus:ring-2 focus:ring-blue-500/40"
                  >
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options?.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} data-testid={opt.dataTestId}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      )

    case "radio":
      return (
        <RhfFormField
          control={control}
          name={field.fieldId}
          rules={rules}
          defaultValue=""
          render={({ field: f }) => (
            <FormItem className="space-y-3">
              <FormLabel>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={f.onChange}
                  value={f.value || ""}
                  data-testid={field.dataTestId}
                  className="space-y-2"
                >
                  {field.options?.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center space-x-2 rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <RadioGroupItem
                        value={opt.value}
                        id={`${field.fieldId}-${opt.value}`}
                        data-testid={opt.dataTestId}
                        className="border-gray-300 text-blue-600"
                      />
                      <Label htmlFor={`${field.fieldId}-${opt.value}`} className="cursor-pointer">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      )

    case "checkbox":
      return (
        <RhfFormField
          control={control}
          name={field.fieldId}
          rules={rules}
          defaultValue={false}
          render={({ field: f }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <FormControl>
                <Checkbox
                  checked={f.value || false}
                  onCheckedChange={f.onChange}
                  data-testid={field.dataTestId}
                  className="border-gray-300 text-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium cursor-pointer">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </FormLabel>
              </div>
              <FormMessage className="text-sm font-medium text-red-500" />
            </FormItem>
          )}
        />
      )

    default:
      // Fallback for unsupported field types
      return <div>Unsupported field type: {field.type}</div>
  }
}
