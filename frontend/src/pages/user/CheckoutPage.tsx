import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "sonner";
import { isAxiosError } from "axios";

export default function CheckoutPage() {
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [street, setStreet] = useState<string>();
  const [city, setCity] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [isLoading, setIsLoading] = useState(false);

  const { cart, totalPrice } = useCart();
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const cartItems = cart?.cartItem;

  const handlePlaceOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const address = (((street as string) + city) as string) + "Country";

      await axiosPrivate.post(
        "/order/place",
        JSON.stringify({ phoneNumber, address, paymentMethod })
      );

      toast.success("Order Placed Successfully");
      navigate("/myorder");
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          toast.error("No Server Response");
        } else if (error.response.status === 401) {
          toast.error("Unauthorized");
        } else {
          toast.error("Oops!!! Something went wrong. Try again");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (
    cartItems?.length === 0 ||
    cartItems === undefined ||
    cartItems === null
  ) {
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
              <Link
                to={"/cart"}
                className="hover:text-foreground cursor-pointer transition-colors"
              >
                Shopping Cart
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">Order</span>
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-foreground hover:text-muted-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Checkout</h1>
          <p className="text-muted-foreground mt-2">
            Complete your order securely
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="username" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter email address"
                    className="h-11"
                    value={auth.username as string}
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    className="h-11"
                    value={auth.email as string}
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number"
                    className="h-11"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter street address"
                    className="h-11"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      className="h-11"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      className="h-11"
                      value={"England"}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="Card" id="Card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Credit/Debit Card</span>
                        <div className="flex space-x-2">
                          <Badge variant="outline">Visa</Badge>
                          <Badge variant="outline">Mastercard</Badge>
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50">
                    <RadioGroupItem value="Cash" id="Cash" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <span className="font-medium">Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === "Card" && (
                  <div className="mt-6 space-y-4 p-4 bg-muted rounded-lg">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="h-11"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="h-11"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="h-11" />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-sm sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={
                            item.productId.image.imageURL || "/placeholder.svg"
                          }
                          alt={item.productId.productName}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <Badge className="absolute -top-2 -right-2 text-xs">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-foreground truncate">
                          {item.productId.productName}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-lg font-bold text-foreground">
                            £ {item.productId.actualPrice.toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            £ {item.productId.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({cartItems.length} items)
                    </span>
                    <span className="font-medium">
                      £ {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-foreground">
                      £ {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center text-green-700">
                    <Shield className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      Secure 256-bit SSL encryption
                    </span>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="mt-6 flex items-start space-x-2">
                  <Checkbox id="terms" />
                  <Label
                    htmlFor="terms"
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-foreground hover:underline"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-foreground hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                {/* Place Order Button */}
                <Button
                  className="w-full mt-6 h-12 font-semibold disabled:cursor-not-allowed cursor-pointer"
                  onClick={(e) => handlePlaceOrder(e)}
                  disabled={isLoading ? true : false}
                >
                  {isLoading
                    ? "Placing Order ..."
                    : `Place Order - £ ${totalPrice.toLocaleString()}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
