import { Button } from "../ui/button";
import {
    Package,
    ShoppingCart,
    Users,
    X,
    Home,
    Settings,
    LogOut,
    PackageOpen,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom";


const sidebarItems = [
    { icon: Home, label: "Dashboard", link: "/admin/dashboard" },
    { icon: ShoppingCart, label: "Orders", link: "/admin/orders" },
    { icon: PackageOpen, label: "Categories", link: "/admin/categories" },
    { icon: Package, label: "Products", link: "/admin/products" },
    { icon: Users, label: "Customers", link: "/admin/customers" },
    { icon: Users, label: "Sellers", link: "/admin/sellers" },
    { icon: Settings, label: "Settings", link: "/admin/settings" },
    { icon: LogOut, label: "Logout", link: "/admin/logout" },
]

type AsideProps = {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Aside({ sidebarOpen, setSidebarOpen }: AsideProps) {

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
        >
            <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
                <h1 className="text-xl font-bold text-sidebar-foreground">Admin Panel</h1>
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <nav className="mt-6 px-3">
                <ul className="space-y-2">
                    {sidebarItems.map((item, index) => {
                        const location = useLocation();
                        const isActive = location.pathname === item.link ? true : false;
                        return (
                            <Link to={item.link} key={index}>
                                <Button
                                    variant={isActive ? "default" : "ghost"}
                                    className={`w-full justify-start gap-3 ${isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}

                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </Button>
                            </Link>
                        )
                    })}
                </ul>
            </nav>
        </div>
    )
}