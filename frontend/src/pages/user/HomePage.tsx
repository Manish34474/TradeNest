import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loading } from "@/components/user/Loading";
import { ProductCard } from "@/components/user/ProductCard";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useCart from "@/hooks/useCart";
import { isAxiosError } from "axios";
import { ArrowRight, ShoppingBag, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

export default function HomePage() {
  // get categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [topRated, setTopRated] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { addToCart } = useCart();

  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const getData = async () => {
      try {
        // get categories
        const catRes = await axiosPrivate.get("/category/all?page=1&limit=8", {
          signal: controller.signal,
        });
        setCategories(catRes.data.categories);

        // get deals
        const dealRes = await axiosPrivate.get("/product/all?page=1&limit=8", {
          signal: controller.signal,
        });
        setDeals(dealRes.data.products);

        // get top
        const topRes = await axiosPrivate.get("/product/all?page=1&limit=8", {
          signal: controller.signal,
        });
        setTopRated(topRes.data.products);
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.code === "ERR_CANCELED") {
            return;
          } else if (!error.response) {
            toast.error("No Server Response");
          } else if (error.response.status === 401) {
            toast.error("Unauthorized");
          } else {
            toast.error("Oops!!! Something went wrong. Try again");
          }
        }
      }
    };

    getData();

    setIsLoading(false);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="absolute inset-0 bg-black/20"></div>
        {/* <div className="absolute inset-0 bg-[url('/ecommerce-marketplace-hero.png')] bg-cover bg-center opacity-10"></div> */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover Amazing Products at TradeNest
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-primary-foreground/90">
              Your trusted marketplace for quality Tech Gadgets from verified
              sellers worldwide
            </p>
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-accent-foreground cursor-pointer"
              onClick={() => navigate("/shop")}
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular product categories and find exactly what
              you're looking for
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    onClick={() => navigate(`/category/${category.slug}`)}
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
                        <Button
                          className="w-full justify-between"
                          onClick={() => navigate(`/category/${category.slug}`)}
                        >
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
        </div>
      </section>

      {/* Deals You Can't Miss */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center flex-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Deals You Can't Miss
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Limited time offers with incredible discounts on top products
              </p>
            </div>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="ml-8 bg-transparent"
            >
              <Link to="/shop">
                View More Deals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <Loading size="sm" />
            ) : deals.length === 0 ? (
              <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors duration-300">
                No Categories Found
              </h3>
            ) : (
              deals.map((product, index) => (
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
        </div>
      </section>

      {/* Top Rated Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center flex-1">
              <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
                Top Rated Products
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Customer favorites with the highest ratings and reviews
              </p>
            </div>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="ml-8 bg-transparent"
            >
              <Link to="/shop">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              <Loading size="sm" />
            ) : topRated.length === 0 ? (
              <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors duration-300">
                No Categories Found
              </h3>
            ) : (
              deals.map((product, index) => (
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
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Why Choose TradeNest?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Verified Sellers
              </h3>
              <p className="text-muted-foreground">
                All our sellers are thoroughly vetted to ensure quality and
                reliability
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                Fast Shipping
              </h3>
              <p className="text-muted-foreground">
                Quick and reliable delivery to your doorstep worldwide
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">
                24/7 Support
              </h3>
              <p className="text-muted-foreground">
                Round-the-clock customer support for all your needs
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
