import { useEffect, useState } from "react"
import {
    Package,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import useAuth from "@/hooks/useAuth"
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

const orderStatuses = ["Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"]
const paymentStatuses = ["Pending", "Paid", "Failed", "Refunded"]

export function OrdersPage() {
    const { auth } = useAuth();

    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedOrder, setSelectedOrder] = useState<Order>();
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    const axiosPrivate = useAxiosPrivate();

    const [orders, setOrders] = useState<Order[]>([]);
    const [limit, setLimit] = useState(12)
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        const fetchOrder = async () => {
            try {
                const response = await axiosPrivate.get(`/order/orders?page=${currentPage}&limit=${limit}`);
                console.log(response.data.orders);
                setOrders(response.data.orders);
                setTotalPages(response.data.totalPages);
                setTotalOrders(response.data.totalOrders);
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
    }, [limit, currentPage]);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order)
        setIsViewDialogOpen(true)
    }

    const handleEditOrder = (order: Order) => {
        setEditingOrder(order)
        setIsEditDialogOpen(true)
    }

    const handleUpdateOrder = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axiosPrivate.put(`/order/update`, JSON.stringify({ orderId: editingOrder?._id, orderStatus: editingOrder?.orderStatus, paymentStatus: editingOrder?.paymentStatus }));

            setIsEditDialogOpen(false)
            setEditingOrder(null);

            toast.success('Order status updated successfully');
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
    }

    const handleDeleteOrder = async (orderId: string) => {
        setIsLoading(true);
        try {
            await axiosPrivate.delete(`/order/delete/${orderId}`);
            toast.success('Order deleted successfully');
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
    }

    const getStatusBadgeVariant = (status: string, type: "order" | "payment") => {
        if (type === "order") {
            switch (status) {
                case "Delivered":
                    return "default"
                case "Shipped":
                    return "secondary"
                case "Processing":
                    return "outline"
                case "Confirmed":
                    return "outline"
                case "Cancelled":
                    return "destructive"
                default:
                    return "outline"
            }
        } else {
            switch (status) {
                case "Paid":
                    return "default"
                case "Pending":
                    return "secondary"
                case "Failed":
                    return "destructive"
                case "Refunded":
                    return "outline"
                default:
                    return "outline"
            }
        }
    }

    return (
        <div className="flex-1 overflow-y-scroll p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
                    <p className="text-muted-foreground">Manage and track all customer orders</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                        <p className="text-xs text-muted-foreground">All time orders</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {orders.filter((o) => o.orderStatus === "Processing" || o.orderStatus === "Shipped").length}
                        </div>
                        <p className="text-xs text-muted-foreground">Awaiting fulfillment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Delivered Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.filter((o) => o.orderStatus === "Delivered").length}</div>
                        <p className="text-xs text-muted-foreground">Successfully completed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">From all orders</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-1 items-center space-x-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search orders, customers, products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">Show:</span>
                            <Select
                                value={limit.toString()}
                                onValueChange={(value) => {
                                    setLimit(Number.parseInt(value))
                                    setCurrentPage(1)
                                }}
                            >
                                <SelectTrigger className="w-20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="12">12</SelectItem>
                                    <SelectItem value="24">24</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Seller</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Order Status</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {
                                isLoading ?
                                    <TableRow>
                                        <TableCell colSpan={1} className="text-center py-8">
                                            <Loading />
                                        </TableCell>
                                    </TableRow> :
                                    <TableBody>
                                        {orders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={9} className="text-center py-8">
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <Package className="h-8 w-8 text-muted-foreground" />
                                                        <p className="text-muted-foreground">No orders found</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            orders.map((order, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{order._id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <div>
                                                                <p className="text-sm font-medium">{order.userId ? order.userId.username : "User Not Available"}</p>
                                                                <p className="text-xs text-muted-foreground">{order.userId ? order.userId.email : "Email not available"}</p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="text-sm font-medium">{auth.username}</p>
                                                            <p className="text-xs text-muted-foreground">{auth.email}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-medium">${order.totalAmount.toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(order.orderStatus, "order")}>{order.orderStatus}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={getStatusBadgeVariant(order.paymentStatus, "payment")}>
                                                            {order.paymentStatus}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View Details
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit Status
                                                                </DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleDeleteOrder(order._id)} className="text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete Order
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                            }
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing 1-{Math.min(limit, totalOrders)} of {totalOrders}{" "}
                                results
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                    <ChevronsLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: totalPages }, (_, i) => {
                                        const pageNumber = i + 1;
                                        return (
                                            <Button
                                                key={pageNumber}
                                                variant={currentPage === pageNumber ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className="w-8 h-8 p-0"
                                            >
                                                {pageNumber}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(totalPages)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronsRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* View Order Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>Complete information about order {selectedOrder?._id}</DialogDescription>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Order ID</Label>
                                    <p className="text-sm text-muted-foreground">{selectedOrder._id}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Order Date</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(selectedOrder.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Customer</Label>
                                    <p className="text-sm text-muted-foreground">{selectedOrder.userId.username}</p>
                                    <p className="text-xs text-muted-foreground">{selectedOrder.userId.email}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Seller</Label>
                                    <p className="text-sm text-muted-foreground">{auth.username}</p>
                                    <p className="text-xs text-muted-foreground">{auth.email}</p>
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Product Details</Label>
                                {
                                    selectedOrder.orderItems.map((item, index) => {
                                        return (
                                            <div key={index} className="flex flex-col mb-2">
                                                <p className="text-sm text-muted-foreground">{item.productId.productName}</p>
                                                <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                                            </div>
                                        )
                                    })
                                }
                            </div>

                            <div>
                                <Label className="text-sm font-medium">Shipping Address</Label>
                                <p className="text-sm text-muted-foreground">{selectedOrder.address}</p>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">Amount</Label>
                                    <p className="text-sm font-bold">${selectedOrder.totalAmount.toFixed(2)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Order Status</Label>
                                    <Badge variant={getStatusBadgeVariant(selectedOrder.orderStatus, "order")}>
                                        {selectedOrder.orderStatus}
                                    </Badge>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Payment Status</Label>
                                    <Badge variant={getStatusBadgeVariant(selectedOrder.paymentStatus, "payment")}>
                                        {selectedOrder.paymentStatus}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Order Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Order Status</DialogTitle>
                        <DialogDescription>Update the order and payment status for {editingOrder?._id}</DialogDescription>
                    </DialogHeader>
                    {editingOrder && (
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="orderStatus">Order Status</Label>
                                <Select
                                    value={editingOrder.orderStatus}
                                    onValueChange={(value) => setEditingOrder({ ...editingOrder, orderStatus: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orderStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="paymentStatus">Payment Status</Label>
                                <Select
                                    value={editingOrder.paymentStatus}
                                    onValueChange={(value) => setEditingOrder({ ...editingOrder, paymentStatus: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => handleUpdateOrder(e)}>Update Order</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
