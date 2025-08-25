import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Loading } from "@/components/user/Loading";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

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

export default function Categories() {
  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(12);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const getCategories = async () => {
      try {
        // get categories
        const response = await axiosPrivate.get(
          `/category/all?limit=${limit}&page=${currentPage}`,
          {
            signal: controller.signal,
          }
        );
        setCategories(response.data.categories);

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

    getCategories();

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
            <Link to={"/shop"} className="hover:text-primary cursor-pointer">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <Link
              to={"/categories"}
              className="text-primary cursor-pointer font-medium"
            >
              Categories
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
                <Loading size="sm" className="col-span-full" />
              ) : categories.length === 0 ? (
                <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors duration-300">
                  No Categories Found
                </h3>
              ) : (
                categories.map((category, index) => {
                  return (
                    <Card
                      key={index}
                      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-accent/50"
                      onClick={() => navigate(`/categories/${category.slug}`)}
                    >
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <img
                            src={category.image.imageURL || "/placeholder.svg"}
                            alt={category.alt}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-2">
                            {/* <div className="p-2 bg-muted-foreground/10 rounded-lg group-hover:bg-muted-foreground/20 transition-colors duration-300">
                          <IconComponent className="h-5 w-5 text-primary" />
                        </div> */}
                            <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors duration-300">
                              {category.categoryName}
                            </h3>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            {category.categoryName}
                          </p>
                          <Button className="w-full justify-between">
                            Explore Category
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
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
