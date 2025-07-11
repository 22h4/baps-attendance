"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Sparkles, Shield, Users } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { FadeIn } from "@/components/ui/fade-in"
import Image from "next/image"

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "teacher",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Welcome back! 🎉",
          description: "Login successful. Redirecting to dashboard...",
        })
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1000)
      } else {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          role: signupData.role,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Account Created! 🎉",
          description: "Please login with your credentials",
        })
        // Switch to login tab
        const loginTab = document.querySelector('[data-value="login"]') as HTMLElement
        loginTab?.click()
      } else {
        toast({
          title: "Signup Failed",
          description: data.error || "Failed to create account",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during signup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
        {/* Left Side - Branding */}
        <FadeIn className="hidden lg:block">
          <div className="text-center lg:text-left space-y-6 lg:space-y-8">
            <div className="flex items-center justify-center lg:justify-start space-x-3 sm:space-x-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl">
                <Image
                  src="/Baps_logo.svg"
                  alt="BAPS Logo"
                  width={48}
                  height={48}
                  className="w-10 h-10 sm:w-12 sm:h-12"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BAPS Attendance
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Smart Management System</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                Welcome to the Future of
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Attendance Management
                </span>
              </h2>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Experience seamless attendance tracking with our modern, intuitive platform designed for educational
                institutions.
              </p>

              <div className="grid gap-3 sm:gap-4">
                {[
                  { icon: Sparkles, title: "Smart Analytics", desc: "Real-time insights and reporting" },
                  { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security" },
                  { icon: Users, title: "User Friendly", desc: "Intuitive interface for everyone" },
                ].map((feature, index) => (
                  <FadeIn key={feature.title} delay={300 + index * 100}>
                    <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex-shrink-0">
                        <feature.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Right Side - Auth Form */}
        <FadeIn delay={200}>
          <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl">
            <CardHeader className="text-center pb-4 sm:pb-6">
              <div className="flex items-center justify-center space-x-2 mb-4 lg:hidden">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                  <Image
                    src="/Baps_logo.svg"
                    alt="BAPS Logo"
                    width={24}
                    height={24}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  />
                </div>
                <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  BAPS Attendance
                </CardTitle>
              </div>
              <CardTitle className="text-xl sm:text-2xl text-gray-900">Get Started</CardTitle>
              <p className="text-sm sm:text-base text-gray-600">Access your attendance management dashboard</p>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger
                    value="login"
                    data-value="login"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-gray-700 dark:text-gray-200 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-gray-700 dark:text-gray-200 font-medium">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Enter your password"
                          className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-colors pr-12"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                    <p className="font-medium mb-2 text-gray-900">Demo Credentials:</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-700">
                        <strong>Admin:</strong> admin@school.com / admin123
                      </p>
                      <p className="text-gray-700">
                        <strong>Teacher:</strong> teacher1@school.com / admin123
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-gray-700 dark:text-gray-200 font-medium">
                        Full Name
                      </Label>
                      <Input
                        id="signup-name"
                        type="text"
                        value={signupData.name}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                        className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 dark:text-gray-200 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-role" className="text-gray-700 dark:text-gray-200 font-medium">
                        Role
                      </Label>
                      <Select
                        value={signupData.role}
                        onValueChange={(value) => setSignupData((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 dark:text-white">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="teacher">Teacher</SelectItem>
                          <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-gray-700 dark:text-gray-200 font-medium">
                          Password
                        </Label>
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) => setSignupData((prev) => ({ ...prev, password: e.target.value }))}
                          placeholder="Password"
                          className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                          required
                          minLength={6}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password" className="text-gray-700 dark:text-gray-200 font-medium">
                          Confirm
                        </Label>
                        <Input
                          id="signup-confirm-password"
                          type={showPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm"
                          className="h-12 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-white dark:placeholder:text-gray-400 transition-colors"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <LoadingSpinner size="sm" />
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
