import React, { useEffect, useState } from "react"
import {
    Package,
    TrendingUp,
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
import { Badge } from "@/components/ui/badge"
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
import useAuth from "@/hooks/useAuth"
import { Loading } from "@/components/user/Loading"
import { Textarea } from "@/components/ui/textarea"

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

interface ProductForm {
    id?: string;
    productName: string;
    alt: string;
    productCategory: string;
    seller: string;
    description: string;
    specifications: string[];
    price: string;
    discount: string;
    stock: string;
    image: string;
};

export function SellerProductsPage() {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [limit, setLimit] = useState(12)
    const [isLoading, setIsLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);

    const [isAddProductOpen, setIsAddProductOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [productForm, setProductForm] = useState<ProductForm>({
        productName: "",
        alt: "",
        productCategory: "",
        description: "",
        seller: "",
        specifications: [""],
        price: "",
        discount: "",
        stock: "",
        image: ""
    })
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>();
    const [addUpdate, setAddUpdate] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);

        const getProducts = async () => {
            try {
                // get products
                const response = await axiosPrivate.get(
                    `/product/all?page=${currentPage}&limit=${limit}`,
                    {
                        signal: controller.signal,
                    }
                );
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
                setTotalProducts(response.data.totalProducts);

                // get categories
                const catRes = await axiosPrivate.get(
                    `/category/all?page=${currentPage}&limit=0`,
                    {
                        signal: controller.signal,
                    }
                );
                setCategories(catRes.data.categories);

                if (selectedCategory != "all") {
                    const selRes = await axiosPrivate.get(`/category/${selectedCategory}?page=${currentPage}&limit=${limit}`,
                        {
                            signal: controller.signal,
                        }
                    );
                    setProducts(selRes.data.products);
                    setTotalPages(selRes.data.totalPages);
                    setCurrentPage(selRes.data.currentPage);
                    setTotalProducts(selRes.data.totalProducts);
                }
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

        getProducts();

        return () => {
            controller.abort();
        };
    }, [currentPage, limit, selectedCategory, addUpdate]);

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.productName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch
    })

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddUpdate(true);

        const formData = new FormData();
        formData.append("productName", productForm.productName);
        formData.append("alt", productForm.alt);
        formData.append("discount", productForm.discount);
        formData.append("price", productForm.price);
        formData.append("productCategory", productForm.productCategory);
        formData.append("description", productForm.description);
        formData.append("stock", productForm.stock);

        // specs must be stringified so backend can JSON.parse()
        formData.append("specifications", JSON.stringify(productForm.specifications));

        if (imageFile) {
            formData.append("image", imageFile); // 👈 this is the file
        }

        try {
            await axiosPrivate.post('/product/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Product Added Successfully');
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

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product)
        setProductForm({
            id: product._id,
            productName: product.productName,
            alt: product.alt,
            discount: product.discount.toString(),
            price: product.price.toString(),
            productCategory: product.productCategory._id,
            seller: auth.id as string,
            description: product.description,
            specifications: product.specifications,
            stock: product.stock.toString(),
            image: product.image.imageURL,
        });
        setImagePreview(product.image.imageURL)
        setIsAddProductOpen(true)
    }

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddUpdate(true);

        console.log(productForm);

        const formData = new FormData();
        formData.append("id", productForm.id as string);
        formData.append("productName", productForm.productName);
        formData.append("alt", productForm.alt);
        formData.append("discount", productForm.discount);
        formData.append("price", productForm.price);
        formData.append("productCategory", productForm.productCategory);
        formData.append("description", productForm.description);
        formData.append("stock", productForm.stock);

        // specs must be stringified so backend can JSON.parse()
        formData.append("specifications", JSON.stringify(productForm.specifications));

        if (imageFile) {
            formData.append("image", imageFile); // 👈 this is the file
        }

        try {
            await axiosPrivate.put('/product/update', formData, {
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

    const handleDeleteProduct = async (slug: string) => {
        setDeleting(true);

        try {
            await axiosPrivate.delete(`/product/delete/${slug}`);
            toast.success("Product Deleted Successfully");

            setProducts((prev) => prev.filter((product) => product.slug !== slug));

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
                setProductForm({ ...productForm, image: result })
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview("")
        setProductForm({ ...productForm, image: "" })
    }

    const addSpecification = () => {
        setProductForm({
            ...productForm,
            specifications: [...productForm.specifications, ""],
        })
    }

    const updateSpecification = (index: number, value: string) => {
        const newSpecs = [...productForm.specifications]
        newSpecs[index] = value
        setProductForm({
            ...productForm,
            specifications: newSpecs,
        })
    }

    const removeSpecification = (index: number) => {
        if (productForm.specifications.length > 1) {
            const newSpecs = productForm.specifications.filter((_, i) => i !== index)
            setProductForm({
                ...productForm,
                specifications: newSpecs,
            })
        }
    }

    const resetForm = () => {
        setProductForm({
            productName: "",
            alt: "",
            discount: "",
            price: "",
            productCategory: "",
            seller: "",
            description: "",
            specifications: [""],
            stock: "",
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
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">Manage your product inventory and catalog.</p>
                </div>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => resetForm()}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                            <DialogDescription>
                                {editingProduct ? "Update the product details below." : "Fill in the product details below."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="productName" className="text-right">
                                    Product Name
                                </Label>
                                <Input
                                    id="productName"
                                    value={productForm.productName}
                                    onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
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
                                    value={productForm.alt}
                                    onChange={(e) => setProductForm({ ...productForm, alt: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Image alt text for accessibility"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="productCategory" className="text-right">
                                    Category
                                </Label>
                                <Select
                                    value={productForm.productCategory}
                                    onValueChange={(value) => setProductForm({ ...productForm, productCategory: value })}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {
                                            categories.map((cat, index) => {
                                                return (
                                                    <SelectItem key={index} value={cat._id}>{cat.categoryName}</SelectItem>
                                                )
                                            })
                                        }
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label htmlFor="description" className="text-right pt-2">
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    className="col-span-3"
                                    placeholder="Enter product description"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-4 items-start gap-4">
                                <Label className="text-right pt-2">Specifications</Label>
                                <div className="col-span-3 space-y-2">
                                    {productForm.specifications.map((spec, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input
                                                value={spec}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateSpecification(index, e.target.value)}
                                                placeholder={`Specification ${index + 1}`}
                                                className="flex-1"
                                            />
                                            {productForm.specifications.length > 1 && (
                                                <Button type="button" variant="outline" size="sm" onClick={() => removeSpecification(index)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSpecification}
                                        className="w-full bg-transparent"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Specification
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="price" className="text-right">
                                    Price
                                </Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={productForm.price}
                                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                    className="col-span-3"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="discount" className="text-right">
                                    Discount (%)
                                </Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={productForm.discount}
                                    onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                                    className="col-span-3"
                                    placeholder="0"
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="stock" className="text-right">
                                    Stock
                                </Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={productForm.stock}
                                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                    className="col-span-3"
                                    placeholder="0"
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
                                                alt={productForm.alt}
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
                                {editingProduct ? "Update Product" : "Add Product"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {filteredProducts.length !== products.length && `${filteredProducts.length} filtered`}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.filter((p) => p.stock <= 5).length}</div>
                        <p className="text-xs text-muted-foreground">Items with 5 or less in stock</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{categories.length}</div>
                        <p className="text-xs text-muted-foreground">Product categories</p>
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
                    Showing 1-{Math.min(limit, totalProducts)} of {totalProducts}{" "}
                    results
                </p>
            </div>

            {isLoading === true ? <Loading size="lg" /> :
                filteredProducts.length === 0 ? (
                    <Card className="p-8 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No products found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchTerm || selectedCategory !== "all"
                                ? "Try adjusting your search or filter criteria."
                                : "Get started by adding your first product."}
                        </p>
                        {!searchTerm && selectedCategory === "all" && (
                            <Button onClick={() => resetForm()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Product
                            </Button>
                        )}
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="aspect-square relative">
                                    <img
                                        src={product.image.imageURL}
                                        alt={product.alt}
                                        className="w-full h-full object-cover"
                                    />
                                    <Badge
                                        className="absolute top-2 right-2"
                                        variant={"default"}
                                    >
                                        -{product.discount}%
                                    </Badge>
                                    <Badge
                                        className="absolute top-2 left-2"
                                        variant={product.stock > 5 ? "default" : "destructive"}
                                    >
                                        {product.stock > 5 ? "Active" : "Low Stock"}
                                    </Badge>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.productName}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">{product.productCategory.categoryName}</p>
                                    <div className="flex items-center justify-start gap-2 mb-3">
                                        <span className="text-sm font-bold">Seller: </span>
                                        <span className="text-sm">{product.seller.username}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold">${product.actualPrice.toFixed(2)}</span>
                                            <span className="text-xs line-through">${product.price.toFixed(2)}</span>
                                        </div>
                                        <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditProduct(product)}
                                            className="flex-1"
                                            disabled={auth.id != product.seller._id}
                                        >
                                            <Edit className="h-3 w-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDeleteProduct(product.slug)}
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
