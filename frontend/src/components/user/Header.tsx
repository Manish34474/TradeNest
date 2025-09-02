import {
  ShoppingCart,
  User,
  LogOut,
  Package,
  UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/useLogout";
import useCart from "@/hooks/useCart";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

export function Header() {

  const { auth } = useAuth();

  const logout = useLogout();
  const navigate = useNavigate();

  const { totalItems, totalPrice } = useCart();

  const signout = async () => {
    await logout();
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to={'/'} className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-primary">TradeNest</h1>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5 text-foreground" />
                  <span className="sr-only">User profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {
                  auth.roles.includes(949) ? <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem> : auth.roles.includes(747) ? <DropdownMenuItem onClick={() => navigate('/seller/dashboard')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem> : <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                }
                <DropdownMenuItem onClick={() => navigate('/myorders')}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Orders</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={signout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart with Total */}
            <Button
              variant="ghost"
              size="sm"
              className="relative flex items-center gap-2"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                £ {totalPrice}
              </span>
              {/* Cart item count badge */}
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
              <span className="sr-only">Shopping cart</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
