"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/axios"
import { useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Link from "next/link"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
       await api.post("/api/register", {
        email,
        name,
        password,
      })

      toast.success("Registration successful! Redirecting to login...")

      setName("")
      setEmail("")
      setPassword("")

      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            error?: string;
          };
        };
        request?: unknown;
        message?: string;
      };
      console.error("Registration error:", err)

      let errorMessage = "Registration failed. Please try again."

      if (err.response) {
        errorMessage = err.response.data?.error || errorMessage
      } else if (err.request) {
        errorMessage =
          "Network error: Unable to connect to server. Please check if the server is running."
      } else {
        errorMessage = err.message || errorMessage
      }

      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto text-white">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Card className="bg-black border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Register your Account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your Name, Email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name" className="text-gray-300">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-black border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black border-gray-600 text-white placeholder-gray-500 focus:ring-blue-500"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              already have an account?{" "}
              <Link href="/" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
