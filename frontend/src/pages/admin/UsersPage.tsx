"use client"

import { useEffect, useState } from "react"
import { Search, Trash2, MoreHorizontal, UserPlus, ChevronsRight, ChevronRight, ChevronLeft, ChevronsLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { DropdownMenuLabel, DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { Loading } from "@/components/user/Loading"

interface roles {
    user: number;
    admin?: number;
    seller?: number;
}

interface User {
    _id: string;
    username: string;
    email: string;
    roles: roles;
    createdAt: string;
}

export function UsersPage() {
    const axiosPrivate = useAxiosPrivate();

    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getUsers = async () => {
        const controller = new AbortController();
        setIsLoading(true);

        try {
            const response = await axiosPrivate.get(`/user/all?page=${currentPage}&limit=${limit}`,
                {
                    signal: controller.signal,
                }
            );

            console.log(response.data.users);

            setUsers(response.data.users);
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
            setTotalUsers(response.data.totalUsers);
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

        return () => {
            controller.abort();
        };
    }

    useEffect(() => {
        getUsers();
    }, [currentPage, limit]);

    // Filter users based on search and status
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesSearch;
    })

    const handleDeleteUser = async (email: string) => {
        setIsLoading(true);
        try {
            await axiosPrivate.delete(`/user/delete/${email}`);
            toast.success('User Deleted Successfully');
            getUsers();
        } catch (error) {
            if (isAxiosError(error)) {
                if (!error.response) {
                    toast.error("No Server Response");
                } else if (error.response.status === 401) {
                    toast.error("Unauthorized");
                } else {
                    toast.error("Oops!!! something went wrong try again");
                }
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex-1 overflow-y-scroll p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Users</h2>
                    <p className="text-muted-foreground">Manage your platform users and their accounts</p>
                </div>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">All registered users</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Show:</span>
                            <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
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
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    isLoading ? <Loading /> :
                                        filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <div className="text-muted-foreground">
                                                        {searchTerm
                                                            ? "No users found matching your criteria"
                                                            : "No users found"}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <div>
                                                                <div className="font-medium">{user.username}</div>
                                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={"outline"}>
                                                            {user.roles.admin ? "Admin" : user.roles.seller ? "Seller" : "User"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem onClick={() => handleDeleteUser(user.email)} className="text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete User
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing 1-{Math.min(limit, totalUsers)} of {totalUsers}{" "}
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
        </div>
    )
}
