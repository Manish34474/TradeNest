import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Star,
  Truck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useCart from "@/hooks/useCart";

export default function CartPage() {
  const { cart, totalPrice, addToCart, updateCart, removeFromCart } = useCart();

  const cartItems = cart?.cartItem;

  if (cartItems === undefined || cartItems === null || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-card py-4 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link
                to="/"
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Shopping Cart</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="mb-8">
            <ShoppingBag className="h-32 w-32 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Discover amazing products and start building your perfect
              collection.
            </p>
            <Button size="lg" asChild>
              <Link to="/shop">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card py-4 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link
                to="/"
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Shopping Cart</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ShoppingBag className="h-4 w-4 text-foreground" />
              <span className="font-medium">{cartItems.length} items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          <div className="xl:col-span-3 space-y-6">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-muted px-6 py-4 border-b">
                  <h1 className="text-2xl font-bold text-foreground">
                    Your Cart
                  </h1>
                </div>

                <div className="p-6 space-y-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className={`${index > 0 ? "pt-6 border-t" : ""}`}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="relative group">
                          <img
                            src={
                              item.productId.image.imageURL ||
                              "/placeholder.svg"
                            }
                            alt={item.productId.productName}
                            className="w-full md:w-32 h-32 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                {item.productId.productName}
                              </h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">
                                    4.3
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    (100 reviews)
                                  </span>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {item.productId.productName}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.productId._id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col">
                                <span className="text-xl font-bold text-foreground">
                                  £ {item.productId.actualPrice.toFixed(2)}
                                </span>
                                {item.productId.price >
                                  item.productId.actualPrice && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    £ {item.productId.price.toFixed(2)}
                                  </span>
                                )}
                              </div>
                              {item.productId.price >
                                item.productId.actualPrice && (
                                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Save £{" "}
                                  {(
                                    item.productId.price -
                                    item.productId.actualPrice
                                  ).toFixed(2)}
                                </Badge>
                              )}
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded-lg overflow-hidden">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateCart(
                                      item.productId._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={item.quantity <= 1}
                                  className="h-10 w-10 hover:bg-muted"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addToCart(item.productId._id)}
                                  className="h-10 w-10 hover:bg-muted"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-foreground">
                                  £{" "}
                                  {(
                                    item.productId.actualPrice * item.quantity
                                  ).toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Subtotal
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-0">
                <div className="bg-muted px-6 py-4 border-b">
                  <h2 className="text-xl font-bold text-foreground">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span className="font-medium">
                      £ {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">
                      <span className="text-green-600 font-semibold">Free</span>
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-foreground">
                      £ {totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <Button
                    className="w-full py-6 text-base font-semibold"
                    asChild
                  >
                    <Link to="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Delivery Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Free shipping on all orders</p>
                      <p className="text-muted-foreground">
                        Standard delivery: 2-5 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">Easy returns within 30 days</p>
                      <p className="text-muted-foreground">
                        No questions asked return policy
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
