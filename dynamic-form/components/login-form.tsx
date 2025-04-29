"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, LogIn, Loader2 } from "lucide-react"
import type { FormResponse } from "@/types"

// API URLs
const API_URL = "https://dynamic-form-generator-9rl7.onrender.com"
const CREATE_USER_URL = `${API_URL}/create-user`
const GET_FORM_URL = `${API_URL}/get-form`

interface LoginFormProps {
  onSuccess: (roll: string, name: string, formData: FormResponse) => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [roll, setRoll] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!roll || !name) {
      setError("Please enter both roll number and name")
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Register user with API
      const createResp = await fetch(CREATE_USER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: roll, name }),
      })

      const createData = await createResp.json()

      // Handle user already exists case
      if (!createResp.ok) {
        if (createData.message?.includes("User already exists")) {
          // This is fine, continue to get form
          console.log("User exists, fetching form...")
        } else {
          throw new Error(createData.message || "Failed to register")
        }
      }

      // Get form data
      const formResp = await fetch(`${GET_FORM_URL}?rollNumber=${roll}`)

      if (!formResp.ok) {
        const formError = await formResp.json()
        throw new Error(formError.message || "Couldn't get form")
      }

      const formData = await formResp.json()
      onSuccess(roll, name, formData)
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="roll" className="text-sm font-medium">
            Roll Number
          </Label>
          <Input
            id="roll"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            placeholder="Enter your roll number"
            required
            data-testid="roll-number-input"
            className="transition-all focus:ring-2 focus:ring-blue-500/40"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            data-testid="name-input"
            className="transition-all focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border border-red-200 dark:border-red-900">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        disabled={loading}
        data-testid="login-button"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Logging in...
          </>
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </>
        )}
      </Button>
    </form>
  )
}
