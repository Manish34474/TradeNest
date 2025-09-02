import {
    Package,
    ShoppingCart,
    Users,
    PoundSterlingIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { useEffect, useState } from "react"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { Loading } from "@/components/user/Loading"

interface Product {
    _id: string;
    image: {
        imageURL: string;
        public_id: string;
    };
    alt: string;
    productName: string;
    slug: string;
    productCategory: {
        _id: string;
        categoryName: string;
        slug: string;
    };
    seller: {
        _id: string;
        username: string;
    };
    description: string;
    specifications: string[];
    price: number;
    discount: number;
    actualPrice: number;
    stock: number;
}

interface OrderItems {
    totalPrice: number;
    quantity: number;
    productId: Product;
}

interface User {
    username: string;
    email: string;
}

interface Order {
    _id: string;
    userId: User;
    totalAmount: number;
    phone: number;
    address: string;
    orderDate: Date;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    orderItems: OrderItems[];
}

interface Stats {
    totalRevenue: string;
    totalActiveUsers: string;
    totalOrders: string;
    totalProducts: string;
}

export function SellerDashboard() {
    const axiosPrivate = useAxiosPrivate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [stats, setStats] = useState<Stats>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        const fetchOrder = async () => {
            try {
                const response = await axiosPrivate.get(`/order/orders?limit=5`);
                setOrders(response.data.orders);

                const statRes = await axiosPrivate.get(`/order/stats`);
                setStats(statRes.data);
            } catch (error) {
                if (isAxiosError(error)) {
                    if (error.code === "ERR_CANCELED") {
                        return;
                    } else if (!error.response) {
                        toast.error("No Server Response");
                    } else if (error.response.status === 401) {
                        toast.error("Unauthorized");
                    } else {
                        toast.error(error.message);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrder();

        return () => {
            controller.abort();
        };
    }, [])

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
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <PoundSterlingIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalRevenue}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalOrders}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalProducts}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.totalActiveUsers}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isLoading ? <Loading /> :
                                orders.map((order, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <p className="text-sm font-medium leading-none">{order.userId.username}</p>
                                                <p className="text-sm text-muted-foreground">{order.userId.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-sm font-medium">{order.totalAmount}</p>
                                                <p className="text-xs text-muted-foreground">{order._id}</p>
                                            </div>
                                            <Badge
                                                variant={
                                                    order.orderStatus === "Shipped"
                                                        ? "default"
                                                        : order.orderStatus === "Processing"
                                                            ? "secondary"
                                                            : "outline"
                                                }
                                            >
                                                {order.orderStatus}
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
