import { Search, ShoppingCart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
    return (
        <header className="bg-background border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo/Brand */}
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-primary">TradeNest</h1>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-2xl mx-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted h-4 w-4" />
                            <Input
                                type="search"
                                placeholder="Search products, brands, and more..."
                                className="w-full pl-10 pr-4 py-2 bg-input border-border focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {/* Profile Icon */}
                        <Button variant="ghost" size="icon" className="relative">
                            <User className="h-5 w-5 text-foreground" />
                            <span className="sr-only">User profile</span>
                        </Button>

                        {/* Cart with Total */}
                        <Button variant="ghost" size="sm" className="relative flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-foreground" />
                            <span className="text-sm font-medium text-foreground">$0.00</span>
                            {/* Cart item count badge */}
                            <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                            <span className="sr-only">Shopping cart</span>
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}