import React, { useEffect, useState } from "react"
import {
    Package,
    BarChart3,
    Plus,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Search,
    Upload,
    X,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAxiosPrivate from "@/hooks/useAxiosPrivate"
import { isAxiosError } from "axios"
import { toast } from "sonner"
import { Loading } from "@/components/user/Loading"

interface Category {
    _id: string;
    image: {
        imageURL: string;
        public_id: string;
    };
    alt: string;
    categoryName: string;
    slug: string;
}

interface CategoryForm {
    id?: string;
    image: string;
    alt: string;
    categoryName: string;
};

export function AdminCategoriesPage() {
    const axiosPrivate = useAxiosPrivate();

    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12)
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalCategories, setTotalCategories] = useState(0);

    const [isAddProductOpen, setIsAddProductOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [categoryForm, setCategoryForm] = useState<CategoryForm>({
        image: "",
        alt: "",
        categoryName: "",
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>();
    const [addUpdate, setAddUpdate] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        const getCategories = async () => {
            try {
                // get categories
                const catRes = await axiosPrivate.get(
                    `/category/all?page=${currentPage}&limit=0`,
                    {
                        signal: controller.signal,
                    }
                );
                setCategories(catRes.data.categories);
                setTotalPages(catRes.data.totalPages);
                setCurrentPage(catRes.data.currentPage);
                setTotalCategories(catRes.data.totalCategories);
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

        getCategories();

        return () => {
            controller.abort();
        };
    }, [currentPage, limit, selectedCategory, addUpdate]);

    const filteredCategories = categories.filter((category) => {
        const matchesSearch =
            category.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch
    })

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddUpdate(true);

        const formData = new FormData();
        formData.append("categoryName", categoryForm.categoryName);
        formData.append("alt", categoryForm.alt);

        if (imageFile) {
            formData.append("image", imageFile); // 👈 this is the file
        }

        console.log(formData);

        try {
            await axiosPrivate.post('/category/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Category Added Successfully');
            resetForm()
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.code === "ERR_CANCELED") {
                    return;
                } else if (!error.response) {
                    toast.error("No Server Response");
                } else if (error.response.status === 401) {
                    toast.error("Unauthorized");
                } else if (error.response.status === 400) {
                    toast.error(error.message);
                } else {
                    toast.error(error.message);
                }
            }
        } finally {
            setAddUpdate(false);
        }
    }

    const handleEditProduct = (category: Category) => {
        setEditingProduct(category)
        setCategoryForm({
            id: category._id,
            categoryName: category.categoryName,
            alt: category.alt,
            image: category.image.imageURL,
        });
        setImagePreview(category.image.imageURL)
        setIsAddProductOpen(true);
    }

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddUpdate(true);

        const formData = new FormData();
        formData.append("id", categoryForm.id as string);
        formData.append("categoryName", categoryForm.categoryName);
        formData.append("alt", categoryForm.alt);

        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            await axiosPrivate.put('/category/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Product Updated Successfully');
            resetForm()
        } catch (error) {
            if (isAxiosError(error)) {
                if (error.code === "ERR_CANCELED") {
                    return;
                } else if (!error.response) {
                    toast.error("No Server Response");
                } else if (error.response.status === 401) {
                    toast.error("Unauthorized");
                } else if (error.response.status === 400) {
                    toast.error(error.message);
                } else {
                    toast.error(error.message);
                }
            }
        } finally {
            setAddUpdate(false);
        }
    }

    const handleDeleteProduct = async (id: string) => {
        setDeleting(true);

        try {
            await axiosPrivate.delete(`/category/delete/${id}`);
            toast.success("Product Deleted Successfully");

            setCategories((prev) => prev.filter((product) => product._id !== id));

        } catch (error) {
            if (isAxiosError(error)) {
                if (error.code === "ERR_CANCELED") {
                    return;
                } else if (!error.response) {
                    toast.error("No Server Response");
                } else if (error.response.status === 401) {
                    toast.error("Unauthorized");
                } else if (error.response.status === 400) {
                    toast.error("Cannot delete category. Product exists under this category");
                } else {
                    toast.error(error.message);
                }
            }
        } finally {
            setDeleting(false);
        }
    }

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setImageFile(file)
            const reader = new FileReader()
            reader.onload = (e) => {
                const result: string = e.target?.result as string;
                setImagePreview(result)
                setCategoryForm({ ...categoryForm, image: result })
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview("")
        setCategoryForm({ ...categoryForm, image: "" })
    }

    const resetForm = () => {
        setCategoryForm({
            categoryName: "",
            alt: "",
            image: "",
        })
        setImagePreview("")
        setImageFile(null)
        setEditingProduct(null)
        setIsAddProductOpen(false)
    }

    return (
        <main className="flex-1 overflow-y-scroll p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">Manage your categories inventory and catalog.</p>
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Edit Category" : "Add New Category"}</DialogTitle>
                            <DialogDescription>
                                {editingProduct ? "Update the category details below." : "Fill in the category details below."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="productName" className="text-right">
                                    Category Name
                                </Label>
                                <Input
                                    id="productName"
                                    value={categoryForm.categoryName}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, categoryName: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="alt" className="text-right">
                                    Alt Text
                                </Label>
                                <Input
                                    id="alt"
                                    value={categoryForm.alt}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, alt: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Image alt text for accessibility"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="image" className="text-right pt-2">
                                    Image
                                </Label>
                                <div className="col-span-3 space-y-3">
                                    {imagePreview && (
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt={categoryForm.alt}
                                                className="w-24 h-24 object-cover rounded-lg border"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                                onClick={removeImage}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById("image")?.click()}
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            {imagePreview ? "Change Image" : "Upload Image"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button onClick={editingProduct ? handleUpdateProduct : handleAddProduct} disabled={addUpdate ? true : false}>
                                {editingProduct ? "Update Category" : "Add Category"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categories.length}</div>
                        <p className="text-xs text-muted-foreground">Categories</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                        className="pl-10"
                    />
                </div>
                <Select
                    value={selectedCategory}
                    onValueChange={(value) => {
                        setSelectedCategory(value)
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={"all"}>
                            All Categories
                        </SelectItem>
                        {categories.map((category, index) => (
                            <SelectItem key={index} value={category.slug}>
                                {category.categoryName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="itemsPerPage">Items per page:</Label>
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
                <p className="text-sm text-muted-foreground">
                    Showing 1-{Math.min(limit, totalCategories)} of {totalCategories}{" "}
                    results
                </p>
            </div>

            {isLoading === true ? <Loading size="lg" /> :
                filteredCategories.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Category found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || selectedCategory !== "all"
                                ? "Try adjusting your search or filter criteria."
                                : "Get started by adding your first Category."}
                        </p>
                        {!searchTerm && selectedCategory === "all" && (
                            <Button onClick={() => resetForm()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Category
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredCategories.map((category, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-square relative">
                                    <img
                                        src={category.image.imageURL}
                                        alt={category.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{category.categoryName}</h3>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditProduct(category)}
                                            className="flex-1"
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteProduct(category._id)}
                                            className="flex-1 hover:bg-destructive hover:text-destructive-foreground"
                                            disabled={deleting}
                                        >
                                            <Trash2 className="h-3 w-3 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            let page
                            if (totalPages <= 5) {
                                page = i + 1
                            } else if (currentPage <= 3) {
                                page = i + 1
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i
                            } else {
                                page = currentPage - 2 + i
                            }

                            return (
                                <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCurrentPage(page)}
                                    className="w-8 h-8 p-0"
                                >
                                    {page}
                                </Button>
                            )
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </main>
    )
}
