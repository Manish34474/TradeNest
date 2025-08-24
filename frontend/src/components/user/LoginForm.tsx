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
import { Eye, EyeOff, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import useAuth from "@/hooks/useAuth";

const LOGIN_URL = "/auth/login";

export function LoginForm() {
  const { setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, pass }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const id = response.data.id;
      const username = response.data.username;
      const userEmail = response.data.email;
      const roles = response.data.roles;
      const accessToken = response.data.accessToken;

      setAuth({ id, username, email: userEmail, roles, accessToken });

      setEmail("");
      setPass("");

      navigate("/home");

      toast.success(`Welcome, ${username}`);
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error?.response) {
          toast.error("No Server Response");
        } else if (error.response?.status === 400) {
          toast.error("Missing Username or Password");
        } else if (error.response?.status === 401) {
          toast.error("Unauthorized");
        } else {
          toast.error("Oops!!! Something went wrong. Try again");
        }
      }
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
          Sign in to your account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your email and password to access your TradeNest account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="Enter your password"
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

          <div className="flex items-center justify-between">
            <Button
              variant="link"
              className="px-0 text-sm text-muted-foreground hover:text-muted-foreground/80 cursor-pointer"
            >
              Forgot password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-primary hover:bg-primary/90 text-secondary cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
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
            <Link to="/register">Sign up</Link>
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
}
