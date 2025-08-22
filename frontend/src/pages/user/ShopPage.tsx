import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Star, ChevronDown, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function ShopPage() {
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  const allProducts = [
    // Deals Products
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      originalPrice: 199.99,
      salePrice: 79.99,
      discount: 60,
      image: "/wireless-headphones.png",
      rating: 4.5,
      reviews: 1250,
      category: "Electronics",
      isOnSale: true,
    },
    {
      id: 2,
      name: "Smart Fitness Watch",
      originalPrice: 299.99,
      salePrice: 149.99,
      discount: 50,
      image: "/smartwatch-lifestyle.png",
      rating: 4.3,
      reviews: 890,
      category: "Electronics",
      isOnSale: true,
    },
    {
      id: 3,
      name: "Premium Coffee Maker",
      originalPrice: 249.99,
      salePrice: 124.99,
      discount: 50,
      image: "/modern-coffee-maker.png",
      rating: 4.7,
      reviews: 567,
      category: "Home & Garden",
      isOnSale: true,
    },
    {
      id: 4,
      name: "Gaming Mechanical Keyboard",
      originalPrice: 159.99,
      salePrice: 79.99,
      discount: 50,
      image: "/gaming-keyboard.png",
      rating: 4.6,
      reviews: 2100,
      category: "Electronics",
      isOnSale: true,
    },
    {
      id: 5,
      name: "4K Webcam",
      originalPrice: 129.99,
      salePrice: 64.99,
      discount: 50,
      image: "/4k-webcam.png",
      rating: 4.4,
      reviews: 780,
      category: "Electronics",
      isOnSale: true,
    },
    {
      id: 6,
      name: "Portable Power Bank",
      originalPrice: 79.99,
      salePrice: 39.99,
      discount: 50,
      image: "/portable-power-bank.png",
      rating: 4.2,
      reviews: 1450,
      category: "Electronics",
      isOnSale: true,
    },
    {
      id: 7,
      name: "Wireless Charging Pad",
      originalPrice: 49.99,
      salePrice: 24.99,
      discount: 50,
      image: "/wireless-charger.png",
      rating: 4.1,
      reviews: 920,
      category: "Electronics",
      isOnSale: true,
    },
    {
      id: 8,
      name: "Bluetooth Speaker",
      originalPrice: 89.99,
      salePrice: 44.99,
      discount: 50,
      image: "/bluetooth-speaker.png",
      rating: 4.5,
      reviews: 1680,
      category: "Electronics",
      isOnSale: true,
    },
    // Top Rated Products
    {
      id: 9,
      name: "Premium Laptop Stand",
      price: 89.99,
      image: "/laptop-stand.png",
      rating: 4.9,
      reviews: 3200,
      category: "Electronics",
      isTopRated: true,
    },
    {
      id: 10,
      name: "Ergonomic Office Chair",
      price: 299.99,
      image: "/ergonomic-office-chair.png",
      rating: 4.8,
      reviews: 2850,
      category: "Home & Garden",
      isTopRated: true,
    },
    {
      id: 11,
      name: "Professional Camera Lens",
      price: 599.99,
      image: "/camera-lens.png",
      rating: 4.9,
      reviews: 1950,
      category: "Electronics",
      isTopRated: true,
    },
    {
      id: 12,
      name: "Smart Home Hub",
      price: 149.99,
      image: "/smart-home-hub.png",
      rating: 4.8,
      reviews: 2400,
      category: "Electronics",
      isTopRated: true,
    },
    {
      id: 13,
      name: "Organic Skincare Set",
      price: 79.99,
      image: "/skincare-products-display.png",
      rating: 4.9,
      reviews: 1750,
      category: "Fashion",
      isTopRated: true,
    },
    // Additional Products
    {
      id: 14,
      name: "Running Shoes",
      price: 129.99,
      image: "/running-shoes-on-track.png",
      rating: 4.4,
      reviews: 890,
      category: "Sports",
    },
    {
      id: 15,
      name: "Cookbook Collection",
      price: 39.99,
      image: "/cookbook-collection.png",
      rating: 4.6,
      reviews: 450,
      category: "Books",
    },
    {
      id: 16,
      name: "Car Phone Mount",
      price: 24.99,
      image: "/placeholder-45rwf.png",
      rating: 4.3,
      reviews: 1200,
      category: "Automotive",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/20 py-3 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center text-sm text-muted-foreground">
            <span className="hover:text-primary cursor-pointer">Home</span>
            <span className="mx-2">/</span>
            <span className="text-primary font-medium">All Products</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            {/* Category Filter */}
            {/* Category Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-primary mb-4">
                Filter By Category
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="all-categories" defaultChecked />
                  <label
                    htmlFor="all-categories"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All Categories
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="electronics" />
                  <label
                    htmlFor="electronics"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Electronics
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="fashion" />
                  <label
                    htmlFor="fashion"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Fashion
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="home-garden" />
                  <label
                    htmlFor="home-garden"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Home & Garden
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="sports" />
                  <label
                    htmlFor="sports"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sports
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="books" />
                  <label
                    htmlFor="books"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Books
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="automotive" />
                  <label
                    htmlFor="automotive"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Automotive
                  </label>
                </div>
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-8">
              <h3 className="font-semibold text-primary mb-4">
                Filter By Price
              </h3>
              <div className="space-y-4">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  min={0}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Price: ${priceRange[0]}</span>
                  <span>— ${priceRange[1]}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                >
                  FILTER
                </Button>
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-8">
              <button className="flex items-center justify-between w-full text-left">
                <h3 className="font-semibold text-primary">Color</h3>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-primary mb-2">
                  All Products
                </h1>
                <p className="text-sm text-muted-foreground">
                  Showing 1-{Math.min(itemsPerPage, allProducts.length)} of{" "}
                  {allProducts.length} results
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <Button
                    variant={itemsPerPage === 12 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setItemsPerPage(12)}
                  >
                    12
                  </Button>
                  <Button
                    variant={itemsPerPage === 24 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setItemsPerPage(24)}
                  >
                    24
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {allProducts.slice(0, itemsPerPage).map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isOnSale && (
                        <Badge className="absolute top-2 left-2 bg-primary text-white">
                          -{product.discount}%
                        </Badge>
                      )}
                      {product.isTopRated && (
                        <Badge className="absolute top-2 left-2 bg-primary text-white">
                          HOT
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-primary">
                          {product.rating}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({product.reviews})
                        </span>
                      </div>
                      <div className="mb-2">
                        {product.isOnSale ? (
                          <span className="text-muted-foreground text-sm">
                            ✓ In stock
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            ✓ In stock
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-primary">
                          ${product.salePrice}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                      <Button className="w-full" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
