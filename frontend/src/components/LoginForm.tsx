import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"
import { Link } from "react-router-dom"

export function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Simulate login process
        setTimeout(() => {
            if (email === "demo@tradenest.com" && password === "password") {
                // Success - in a real app, redirect to dashboard
                console.log("Login successful")
            } else {
                setError("Invalid email or password. Please try again.")
            }
            setIsLoading(false)
        }, 1000)
    }

    return (
        <Card className="w-full shadow-lg">
            <CardHeader className="space-y-1 text-center">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-accent/10 p-3 rounded-full">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Enter your email and password to access your TradeNest account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11 pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4 text-muted" /> : <Eye className="h-4 w-4 text-muted" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <Button variant="link" className="px-0 text-sm text-muted-foreground hover:text-muted-foreground/80 cursor-pointer">
                            Forgot password?
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-secondary cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing in..." : "Sign in"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                    {"Already have an account? "}
                    <Button variant="link" className="px-0 text-muted-foreground hover:text-muted-foreground/80">
                        <Link to="/register">Sign up</Link>
                    </Button>
                </p>
            </CardFooter>
        </Card>
    )
}