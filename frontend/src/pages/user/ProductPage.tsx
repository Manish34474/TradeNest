"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { Loading } from "@/components/user/Loading";
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

export default function ProductPage() {
  const axiosPrivate = useAxiosPrivate();

  const { updateCart } = useCart();

  const params = useParams();
  const productSlug = params.slug as string;
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);

    const getProducts = async () => {
      try {
        const response = await axiosPrivate.get(`/product/${productSlug}`, {
          signal: controller.signal,
        });
        setProduct(response.data);
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
  }, [params]);

  //   const nextImage = () => {
  //     setSelectedImageIndex((prev) => (prev + 1) % product.image.imageURL.length);
  //   };

  //   const prevImage = () => {
  //     setSelectedImageIndex(
  //       (prev) =>
  //         (prev - 1 + product.image.imageURL.length) %
  //         product.image.imageURL.length
  //     );
  //   };

  return (
    <div className="min-h-screen bg-background">
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loading size="lg" />
        </div>
      ) : product ? (
        <>
          {/* Breadcrubm */}
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/home" className="hover:text-foreground">
                Home
              </Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-foreground">
                Shop
              </Link>
              <span>/</span>
              <Link
                to={`/category/${product.productCategory.slug}`}
                className="hover:text-foreground"
              >
                {product.productCategory.categoryName}
              </Link>
              <span>/</span>
              <span className="text-primary font-medium">
                {product.productName}
              </span>
            </nav>
          </div>

          <div className="container mx-auto px-4 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="relative max-h-[600px] max-w-[600px] aspect-square bg-gray-50 rounded-lg overflow-hidden">
                  <img
                    src={product.image.imageURL}
                    alt={product.alt}
                    className="h-full w-full object-contain"
                  />
                  {product.discount && (
                    <Badge className="absolute top-4 left-4 bg-primary">
                      -{product.discount}%
                    </Badge>
                  )}
                  <Badge className="absolute top-4 right-4 bg-primary">
                    HOT
                  </Badge>

                  {/* Image Navigation */}
                  {/* {product.image.imageURL.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )} */}
                </div>

                {/* Thumbnail Images */}
                {/* <div className="flex gap-2 overflow-x-auto">
              <img
                src={product.image.imageURL || "/placeholder.svg"}
                alt={product.alt}
                width={80}
                height={80}
                className="object-cover w-full h-full"
              />
            </div> */}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {product.productName}
                  </h1>
                  {/* <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.rating} size="md" />
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </span>
              </div> */}

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-primary">
                      £{product.actualPrice.toLocaleString()}
                    </span>
                    {product.price && (
                      <span className="text-xl text-muted-foreground line-through">
                        £{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    {product.stock > 0 ? (
                      <Badge variant="outline" className="text-primary">
                        ✓ In Stock ({product.stock})
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-primary">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">
                    Features and Specifications
                  </h3>
                  <ul className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="font-medium">Quantity:</label>
                    <div className="flex items-center border rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <span className="px-4 py-2 min-w-[60px] text-center">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity === product.stock}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 w-max"
                      size="lg"
                      disabled={product.stock > 0 ? false : true}
                      onClick={() => updateCart(product._id, quantity)}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary" />
                    <span className="text-sm">
                      Free shipping on orders over ₹999
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-sm">2 year warranty included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-primary" />
                    <span className="text-sm">30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
