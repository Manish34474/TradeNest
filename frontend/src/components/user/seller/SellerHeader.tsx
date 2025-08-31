import { Menu, Search, User } from "lucide-react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import useAuth from "@/hooks/useAuth";

type AsideProps = {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function SellerHeader({ setSidebarOpen }: AsideProps) {
    const { auth } = useAuth();

    return (
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-4 w-4" />
                </Button>

                <div className="relative w-96 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search products, orders, customers..." className="pl-10" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="default">
                    <User className="h-5 w-5 text-foreground" />
                    <span className="text-sm">{auth.username}</span>
                </Button>
            </div>
        </header>
    )
}