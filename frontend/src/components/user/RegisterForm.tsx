import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Eye, EyeOff, ShoppingBag, Store, User } from "lucide-react"
import { Link } from "react-router-dom"

export function RegisterForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [userType, setUserType] = useState("buyer")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Basic validation
        if (!name || !email || !password) {
            setError("Please fill in all required fields.")
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.")
            setIsLoading(false)
            return
        }

        // Simulate registration process
        setTimeout(() => {
            console.log("Registration successful", { name, email, userType })
            setIsLoading(false)
            // In a real app, redirect to dashboard or login
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
                <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
                <CardDescription className="text-muted-foreground">Join TradeNest and start your marketplace journey</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="h-11"
                        />
                    </div>

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
                                placeholder="Create a password (min. 6 characters)"
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

                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Account Type</Label>
                        <RadioGroup value={userType} onValueChange={setUserType} className="grid grid-cols-2 gap-4">
                            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/5 transition-colors">
                                <RadioGroupItem value="buyer" id="buyer" />
                                <Label htmlFor="buyer" className="flex items-center space-x-2 cursor-pointer flex-1">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium text-sm">Buyer</div>
                                        <div className="text-xs text-muted-foreground">Shop and purchase products</div>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/5 transition-colors">
                                <RadioGroupItem value="seller" id="seller" />
                                <Label htmlFor="seller" className="flex items-center space-x-2 cursor-pointer flex-1">
                                    <Store className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium text-sm">Seller</div>
                                        <div className="text-xs text-muted-foreground">Sell your products</div>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            id="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground">
                            I agree to the{" "}
                            <Button variant="link" className="px-0 text-primary hover:text-primary/80 h-auto">
                                Terms of Service
                            </Button>{" "}
                            and{" "}
                            <Button variant="link" className="px-0 text-primary hover:text-primary/80 h-auto">
                                Privacy Policy
                            </Button>
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-primary hover:bg-primary/90 text-secondary cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Creating account..." : "Create account"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                    {"Already have an account? "}
                    <Button variant="link" className="px-0 text-muted-foreground hover:text-muted-foreground/80">
                        <Link to="/">Sign in</Link>
                    </Button>
                </p>
            </CardFooter>
        </Card>
    )
}
