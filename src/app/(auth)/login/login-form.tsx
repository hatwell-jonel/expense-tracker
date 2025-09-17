"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Mail, Phone } from "lucide-react"

const countryCodes = [
    { code: "ph", numberCode: "+63", country: "Philippines" }
]

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("email")
    const [countryCode, setCountryCode] = useState("ph")
    const [phoneNumber, setPhoneNumber] = useState("")

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => setIsLoading(false), 2000)
    }

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => setIsLoading(false), 2000)
    }

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        // Simulate API call
        setTimeout(() => setIsLoading(false), 2000)
    }

    const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "") // remove non-numeric characters
        setPhoneNumber(value)
    }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-foreground">Sign In</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Choose your preferred sign-in method
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Sign-In */}
        <Button
          variant="outline"
          className="w-full bg-transparent text-foreground"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        {/* Email/Phone Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2 cursor-pointer">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center gap-2 cursor-pointer">
              <Phone className="h-4 w-4" />
              Phone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" required className="w-full" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex justify-end">
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Button type="submit" className="w-full text-base" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In with Email"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4">
            <form onSubmit={handlePhoneLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number</Label>
                <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-border pr-3">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                        <SelectTrigger className="border-0 bg-transparent p-0 h-auto focus:ring-0 focus:ring-offset-0">
                            <div className="flex items-center gap-1">
                            <span className="text-base">
                                {countryCodes.find((c) => c.code === countryCode)?.code!}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">({countryCodes.find((c) => c.code === countryCode)?.numberCode})</span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {countryCodes.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                                <span className="flex items-center gap-2">
                                {/* <span>{country.flag}</span> */}
                                <span>{country.code}</span>
                                <span className="text-muted-foreground text-xs">{country.country}</span>
                                </span>
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        value={phoneNumber}
                        onChange={handlePhoneInput}
                        required
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        className="h-12 pl-30 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-colors"
                    />
                 
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-base"
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
