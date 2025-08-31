import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <div className="text-center space-y-8 max-w-lg">
                <div className="space-y-4">
                    <div className="text-9xl font-bold text-primary/30 select-none">404</div>
                    <h1 className="text-4xl font-bold text-foreground text-balance">Oops! Page Not Found</h1>
                    <p className="text-lg text-muted-foreground text-balance leading-relaxed">
                        We can't seem to find the page you're looking for. Don't worry, it happens to the best of us!
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <div className="text-4xl">🔍</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="px-8">
                            <Link to="/">Take Me Home</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
