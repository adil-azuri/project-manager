"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api } from "@/lib/axios"
import { useState } from "react"

import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post("/api/login", {
        email,
        password,
      })

      toast.success("Login successful! Redirecting to dashboard...")

      if (response.data && response.data.data) {
        localStorage.setItem("userData", JSON.stringify(response.data.data))
      }

      setEmail("")
      setPassword("")

      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 2000)

    } catch (error: any) {
      console.error("Login error:", error)

      let errorMessage = "Login failed. Please try again."

      if (error.response) {
        errorMessage = error.response.data?.error || error.response.data?.message || errorMessage
      } else if (error.request) {
        errorMessage = "Network error: Unable to connect to server."
      } else {
        errorMessage = error.message || errorMessage
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
          <CardTitle className="text-white">Login to your Account</CardTitle>
          <CardDescription className="text-gray-400">
            Enter your Email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
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
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
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
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="underline underline-offset-4">
                Register
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
