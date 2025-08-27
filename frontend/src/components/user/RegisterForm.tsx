import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eye, EyeOff, ShoppingBag, Store, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

const REGISTER_USER = "/user/register";

export function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [userType, setUserType] = useState("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        REGISTER_USER,
        JSON.stringify({ username, email, pass, userType }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setUsername("");
      setEmail("");
      setPass("");
      setUserType("buyer");

      navigate(`/verify/${email}`);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        if (!error.response) {
          toast.error("No Server Response");
        } else if (error.status === 400) {
          toast.error(error.response.data.message);
        } else if (error.status === 409) {
          toast.error("User with the email already exists. Use another email");
        } else {
          toast.error("Oops!!! Something went wrong. Try Again");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-accent/10 p-3 rounded-full">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Create your account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Join TradeNest and start your marketplace journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password (min. 6 characters)"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Account Type</Label>
            <RadioGroup
              value={userType}
              onValueChange={setUserType}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/5 transition-colors">
                <RadioGroupItem value="buyer" id="buyer" />
                <Label
                  htmlFor="buyer"
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Buyer</div>
                    <div className="text-xs text-muted-foreground">
                      Shop and purchase products
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-accent/5 transition-colors">
                <RadioGroupItem value="seller" id="seller" />
                <Label
                  htmlFor="seller"
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                >
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">Seller</div>
                    <div className="text-xs text-muted-foreground">
                      Sell your products
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{" "}
              <Button
                variant="link"
                className="px-0 text-primary hover:text-primary/80 h-auto"
              >
                Terms of Service
              </Button>{" "}
              and{" "}
              <Button
                variant="link"
                className="px-0 text-primary hover:text-primary/80 h-auto"
              >
                Privacy Policy
              </Button>
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-secondary cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          {"Already have an account? "}
          <Button
            variant="link"
            className="px-0 text-muted-foreground hover:text-muted-foreground/80"
          >
            <Link to="/">Sign in</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
