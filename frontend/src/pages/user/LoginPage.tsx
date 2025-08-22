import { LoginForm } from "@/components/user/LoginForm"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">TradeNest</h1>
                    <p className="text-muted-foreground text-sm">Welcome back to your marketplace</p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}