import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Loading } from "@/components/user/Loading";
import { Link, useNavigate } from "react-router-dom";
import { ProductCard } from "@/components/user/ProductCard";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useCart from "@/hooks/useCart";

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

export default function ShopPage() {
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);

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
  }, [currentPage, limit]);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/20 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-muted-foreground">
            <Link to={"/home"} className="hover:text-primary cursor-pointer">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to={"/shop"} className="text-primary font-medium">
              Shop
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary mb-2">
                  All Products
                </h1>
                <p className="text-sm text-muted-foreground">
                  Showing 1-{Math.min(limit, totalProducts)} of {totalProducts}{" "}
                  results
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <Button
                    variant={limit === 12 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLimit(12)}
                  >
                    12
                  </Button>
                  <Button
                    variant={limit === 24 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLimit(24)}
                  >
                    24
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {isLoading ? (
                <Loading size="lg" className="col-span-full" />
              ) : products?.length === 0 || products === undefined ? (
                <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors duration-300">
                  No Categories Found
                </h3>
              ) : (
                products.map((product, index) => (
                  <ProductCard
                    key={index}
                    image={product.image.imageURL}
                    alt={product.alt}
                    name={product.productName}
                    category={product.productCategory.categoryName}
                    seller={product.seller.username}
                    stock={product.stock}
                    price={product.price}
                    actualPrice={product.actualPrice}
                    discount={product.discount}
                    onAddToCart={() => addToCart(product._id)}
                    onClick={() => navigate(`/product/${product.slug}`)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1 ? true : false}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      key={index}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  disabled={
                    currentPage === totalPages || totalPages === 0
                      ? true
                      : false
                  }
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
