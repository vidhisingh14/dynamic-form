"use client"

import { useState } from "react"
import LoginForm from "@/components/login-form"
import DynamicForm from "@/components/dynamic-form"
import { CheckCircle2 } from "lucide-react"
import type { FormResponse } from "@/types"

export default function Home() {
  // State for managing login and form data
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState({ roll: "", name: "" })
  const [formData, setFormData] = useState<FormResponse | null>(null)
  const [formDone, setFormDone] = useState(false)

  // Handle successful login
  const handleLogin = (roll: string, name: string, form: FormResponse) => {
    console.log("User logged in:", roll, name)
    setUser({ roll, name })
    setFormData(form)
    setLoggedIn(true)
    setFormDone(false)
  }

  // Handle form completion
  const handleFormDone = () => {
    setLoggedIn(false)
    setFormDone(true)
    // TODO: Maybe clear form data here?
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dynamic Form Generator</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">A multi-section form with dynamic validation</p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {!loggedIn ? (
          <>
            {formDone && (
              <div className="mb-8 p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 rounded-lg flex items-center shadow-sm">
                <CheckCircle2 className="h-5 w-5 mr-3 flex-shrink-0" />
                <p>Form submitted successfully! You can log in again to submit another form.</p>
              </div>
            )}
            <div className="bg-white dark:bg-gray-950 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
              <div className="p-6 sm:p-10 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Enter your roll number and name to access the form system.
                </p>
              </div>
              <div className="px-6 py-8 sm:px-10">
                <LoginForm onSuccess={handleLogin} />
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-950 rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h2>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Roll Number: {user.roll}</p>
            </div>
            <div className="p-6 sm:p-8">
              {formData && <DynamicForm formData={formData} onComplete={handleFormDone} />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Dynamic Form Generator &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
