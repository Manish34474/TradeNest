import {
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const statsCards = [
    {
        title: "Total Revenue",
        value: "$45,231.89",
        change: "+20.1%",
        icon: DollarSign,
        trend: "up",
    },
    {
        title: "Orders",
        value: "2,350",
        change: "+180.1%",
        icon: ShoppingCart,
        trend: "up",
    },
    {
        title: "Products",
        value: "12,234",
        change: "+19%",
        icon: Package,
        trend: "up",
    },
    {
        title: "Active Users",
        value: "573",
        change: "+201",
        icon: Users,
        trend: "up",
    },
]

const recentOrders = [
    { id: "#3210", customer: "Olivia Martin", email: "olivia.martin@email.com", amount: "$42.25", status: "Shipped" },
    { id: "#3209", customer: "Jackson Lee", email: "jackson.lee@email.com", amount: "$74.99", status: "Processing" },
    { id: "#3208", customer: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "$99.99", status: "Shipped" },
    { id: "#3207", customer: "William Kim", email: "will@email.com", amount: "$39.95", status: "Pending" },
    { id: "#3206", customer: "Sofia Davis", email: "sofia.davis@email.com", amount: "$19.99", status: "Shipped" },
]

export function AdminDashboard() {
    return (
        <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back! Here's what's happening with your store today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsCards.map((stat, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <TrendingUp className="mr-1 h-3 w-3 text-primary" />
                                    {stat.change} from last month
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>You have {recentOrders.length} orders this week.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentOrders.map((order, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage
                                                src={`/diverse-customers.png?height=36&width=36&query=customer ${order.customer}`}
                                                alt={order.customer}
                                            />
                                            <AvatarFallback>
                                                {order.customer
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">{order.customer}</p>
                                            <p className="text-sm text-muted-foreground">{order.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{order.amount}</p>
                                            <p className="text-xs text-muted-foreground">{order.id}</p>
                                        </div>
                                        <Badge
                                            variant={
                                                order.status === "Shipped"
                                                    ? "default"
                                                    : order.status === "Processing"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
