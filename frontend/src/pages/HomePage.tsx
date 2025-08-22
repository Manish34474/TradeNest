import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ShoppingBag, Smartphone, Home, Car, Shirt, Book, ShoppingCart, Star } from "lucide-react"

export default function HomePage() {
    const categories = [
        {
            name: "Electronics",
            icon: Smartphone,
            image: "/modern-electronics-gadgets.png",
            description: "Latest gadgets and tech",
        },
        {
            name: "Fashion",
            icon: Shirt,
            image: "/placeholder-zfevj.png",
            description: "Trendy clothing & accessories",
        },
        {
            name: "Home & Garden",
            icon: Home,
            image: "/home-decor-furniture-garden-tools.png",
            description: "Furniture & home decor",
        },
        {
            name: "Automotive",
            icon: Car,
            image: "/automotive-accessories.png",
            description: "Car parts & accessories",
        },
        {
            name: "Books",
            icon: Book,
            image: "/books-literature-education.png",
            description: "Books & educational materials",
        },
        {
            name: "Sports",
            icon: ShoppingBag,
            image: "/assorted-fitness-gear.png",
            description: "Sports & fitness equipment",
        },
    ];

    const dealsProducts = [
        {
            id: 1,
            name: "Wireless Bluetooth Headphones",
            originalPrice: 199.99,
            salePrice: 79.99,
            discount: 60,
            image: "/wireless-headphones.png",
            rating: 4.5,
            reviews: 1250,
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
        },
    ];

    const topRatedProducts = [
        {
            id: 9,
            name: "Premium Laptop Stand",
            price: 89.99,
            image: "/laptop-stand.png",
            rating: 4.9,
            reviews: 3200,
        },
        {
            id: 10,
            name: "Ergonomic Office Chair",
            price: 299.99,
            image: "/ergonomic-office-chair.png",
            rating: 4.8,
            reviews: 2850,
        },
        {
            id: 11,
            name: "Professional Camera Lens",
            price: 599.99,
            image: "/camera-lens.png",
            rating: 4.9,
            reviews: 1950,
        },
        {
            id: 12,
            name: "Smart Home Hub",
            price: 149.99,
            image: "/smart-home-hub.png",
            rating: 4.8,
            reviews: 2400,
        },
    ];

    return (
        <>
            <Header />
            <div className="min-h-screen bg-background">
                {/* Hero Banner */}
                <section className="relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                    <div className="absolute inset-0 bg-black/20"></div>
                    {/* <div className="absolute inset-0 bg-[url('/ecommerce-marketplace-hero.png')] bg-cover bg-center opacity-10"></div> */}
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl lg:text-6xl font-bold mb-6">Discover Amazing Products at TradeNest</h1>
                            <p className="text-xl lg:text-2xl mb-8 text-primary-foreground/90">
                                Your trusted marketplace for quality Tech Gadgets from verified sellers worldwide
                            </p>
                            <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-accent-foreground cursor-pointer">
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
                            <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Popular Categories</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Explore our most popular product categories and find exactly what you're looking for
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category, index) => {
                                const IconComponent = category.icon
                                return (
                                    <Card
                                        key={index}
                                        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-accent/50"
                                    >
                                        <CardContent className="p-0">
                                            <div className="relative overflow-hidden rounded-t-lg">
                                                <img
                                                    src={category.image || "/placeholder.svg"}
                                                    alt={category.name}
                                                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 bg-muted-foreground/10 rounded-lg group-hover:bg-muted-foreground/20 transition-colors duration-300">
                                                        <IconComponent className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-primary group-hover:text-primary/80 transition-colors duration-300">
                                                        {category.name}
                                                    </h3>
                                                </div>
                                                <p className="text-muted-foreground mb-4">{category.description}</p>
                                                <Button
                                                    className="w-full justify-between"
                                                >
                                                    Explore Category
                                                    <ArrowRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Deals You Can't Miss */}
                <section className="py-16 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <div className="text-center flex-1">
                                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Deals You Can't Miss</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Limited time offers with incredible discounts on top products
                                </p>
                            </div>
                            <Button size="lg" variant="outline" asChild className="ml-8 bg-transparent">
                                <a href="/shop">
                                    View More Deals
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {dealsProducts.map((product) => (
                                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            <Badge className="absolute top-2 left-2 bg-primary text-white">
                                                -{product.discount}%
                                            </Badge>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-1 mb-2">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium text-primary">{product.rating}</span>
                                                <span className="text-sm text-muted-foreground">({product.reviews})</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-muted-foreground text-sm">✓ In stock</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg font-bold text-primary">${product.salePrice}</span>
                                                <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span>
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
                    </div>
                </section>

                {/* Top Rated Products */}
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-12">
                            <div className="text-center flex-1">
                                <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">Top Rated Products</h2>
                                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                    Customer favorites with the highest ratings and reviews
                                </p>
                            </div>
                            <Button size="lg" variant="outline" asChild className="ml-8 bg-transparent">
                                <a href="/shop">
                                    View All Products
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topRatedProducts.map((product) => (
                                <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                                    <CardContent className="p-0">
                                        <div className="relative overflow-hidden rounded-t-lg">
                                            <img
                                                src={product.image || "/placeholder.svg"}
                                                alt={product.name}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            <Badge className="absolute top-2 left-2 bg-primary text-white">
                                                HOT
                                            </Badge>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-primary mb-2 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-1 mb-2">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="text-sm font-medium text-primary">{product.rating}</span>
                                                <span className="text-sm text-muted-foreground">({product.reviews})</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-muted-foreground text-sm">✓ In stock</span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-lg font-bold text-primary">${product.price}</span>
                                                {/* <span className="text-sm text-muted-foreground line-through">${product.originalPrice}</span> */}
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
                    </div>
                </section>

                {/* Trust Signals */}
                <section className="py-16 bg-muted/30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-primary mb-4">Why Choose TradeNest?</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-primary mb-2">Verified Sellers</h3>
                                <p className="text-muted-foreground">
                                    All our sellers are thoroughly vetted to ensure quality and reliability
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-primary mb-2">Fast Shipping</h3>
                                <p className="text-muted-foreground">Quick and reliable delivery to your doorstep worldwide</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Smartphone className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold text-primary mb-2">24/7 Support</h3>
                                <p className="text-muted-foreground">Round-the-clock customer support for all your needs</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    )
}
