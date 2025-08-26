import { Button } from "../ui/button";
import {
    Package,
    ShoppingCart,
    Users,
    X,
    Home,
    Settings,
    LogOut,
} from "lucide-react"
import { Badge } from "../ui/badge";


const sidebarItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: ShoppingCart, label: "Orders", badge: "12" },
    { icon: Package, label: "Products" },
    { icon: Users, label: "Customers" },
    { icon: Users, label: "Sellers" },
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout" },
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
                    {sidebarItems.map((item, index) => (
                        <li key={index}>
                            <Button
                                variant={item.active ? "default" : "ghost"}
                                className={`w-full justify-start gap-3 ${item.active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}

                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                                {item.badge && (
                                    <Badge className="ml-auto">
                                        {item.badge}
                                    </Badge>
                                )}
                            </Button>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )
}