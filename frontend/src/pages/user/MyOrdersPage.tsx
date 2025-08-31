"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Package, Calendar, CreditCard, X, Truck, CheckCircle, Clock, XCircle, ShoppingBag, ArrowRight } from "lucide-react"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { Link } from "react-router-dom"
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

interface Order {
    _id: string;
    totalAmount: number;
    phone: number;
    address: string;
    orderDate: Date;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    orderItems: OrderItems[];
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case "pending":
            return <Clock className="h-4 w-4" />
        case "processing":
            return <Package className="h-4 w-4" />
        case "shipped":
            return <Truck className="h-4 w-4" />
        case "delivered":
            return <CheckCircle className="h-4 w-4" />
        case "cancelled":
            return <XCircle className="h-4 w-4" />
        default:
            return <Clock className="h-4 w-4" />
    }
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case "pending":
            return "secondary"
        case "processing":
            return "default"
        case "shipped":
            return "default"
        case "delivered":
            return "default"
        case "cancelled":
            return "destructive"
        default:
            return "secondary"
    }
}

const canCancelOrder = (status: string, paymentStatus: string) => {
    return (
        (status === "Pending" || status === "Processing") && (paymentStatus === "Pending")
    )
}

export function MyOrdersPage() {
    const axiosPrivate = useAxiosPrivate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        const fetchOrder = async () => {
            try {
                const response = await axiosPrivate.get("/order/myorders");
                console.log(response.data);
                setOrders(response.data.order);
            } catch (error) {
                if (isAxiosError(error)) {
                    if (!error.response) {
                        toast.error("No Server Response");
                    } else if (error.response.status === 401) {
                        toast.error("Unauthorized");
                    } else {
                        toast.error("Oops!!! Something went wrong. Try again");
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

    // const handleCancelOrder = (orderId: string) => {
    //     setOrders((prevOrders) =>
    //         prevOrders.map((order) =>
    //             order.id === orderId ? { ...order, status: "cancelled", paymentStatus: "refunded" } : order,
    //         ),
    //     )
    // }

    if (orders === undefined || orders === null || orders.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="bg-card py-4 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center text-sm text-muted-foreground">
                            <Link
                                to="/home"
                                className="hover:text-foreground cursor-pointer transition-colors"
                            >
                                Home
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-foreground font-medium">Orders</span>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="mb-8">
                        <ShoppingBag className="h-32 w-32 text-muted-foreground mx-auto mb-6" />
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            Your Order Item is Empty
                        </h1>
                        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                            Discover amazing products and start building your perfect
                            collection.
                        </p>
                        <Button size="lg" asChild>
                            <Link to="/shop">
                                Start Shopping
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
                    <p className="text-muted-foreground">Track and manage your order history</p>
                </div>

                <div className="space-y-6">
                    {isLoading ? <Loading size="lg" /> :
                        orders.map((order, index) => {
                            return (
                                (
                                    <Card key={index} className="border border-border">
                                        <CardHeader className="pb-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <CardTitle className="text-lg">Order {order._id}</CardTitle>
                                                    <Badge variant={getStatusVariant(order.orderStatus)} className="flex items-center gap-1 capitalize">
                                                        {getStatusIcon(order.orderStatus)}
                                                        {order.orderStatus}
                                                    </Badge>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-foreground">${order.totalAmount}</p>
                                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="space-y-4">
                                            {/* Order Items */}
                                            <div className="space-y-2">
                                                <h4 className="font-medium text-foreground">Items Ordered</h4>
                                                {order.orderItems.map((item, index) => (
                                                    <div key={index} className="flex justify-between items-center py-2">
                                                        <div className="flex-1">
                                                            <p className="font-medium text-foreground">{item.productId ? item.productId.productName : "Product Unavailable"}</p>
                                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                        </div>
                                                        <p className="font-medium text-foreground">${item.productId ? item.productId.actualPrice.toFixed(2) : "Price Unavailable"}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <Separator />

                                            {/* Payment Status */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-sm font-medium text-foreground">Payment Status:</span>
                                                </div>
                                                <Badge
                                                    variant={
                                                        order.paymentStatus === "completed"
                                                            ? "default"
                                                            : order.paymentStatus === "pending"
                                                                ? "secondary"
                                                                : "destructive"
                                                    }
                                                    className="capitalize"
                                                >
                                                    {order.paymentStatus}
                                                </Badge>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 pt-4">
                                                {canCancelOrder(order.orderStatus, order.paymentStatus) && (
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="destructive" size="sm" className="flex items-center gap-1">
                                                                <X className="h-3 w-3" />
                                                                Cancel Order
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to cancel order {order._id}?
                                                                    {order.paymentStatus === "Paid" &&
                                                                        " Your payment will be refunded within 3-5 business days."}
                                                                    {order.paymentStatus === "pending" && " Your pending payment will be cancelled."}
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Keep Order</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    // onClick={() => handleCancelOrder(order.id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Cancel Order
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            )
                        })
                    }
                </div >
            </div >
        </div >
    )
}
