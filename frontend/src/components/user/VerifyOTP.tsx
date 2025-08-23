import { useState } from "react";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "@/api/axios";
import { toast } from "sonner";
import { isAxiosError } from "axios";

const VERIFY_OTP = "/user/verify";

export function VerifyOtpForm() {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const params = useParams();
  const email = params.email;

  const navigate = useNavigate();

  // Start countdown timer
  useState(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(VERIFY_OTP, JSON.stringify({ email, otp }), {
        headers: { "Content-Type": "application/json" },
      });

      setOtp("");
      navigate(`/`);

      toast.success("Congralutations. User Registered Successfully");
    } catch (error) {
      if (isAxiosError(error)) {
        if (!error.response) {
          toast.error("No Server Response");
        } else if (error.status === 400) {
          toast.error("Expired/Invalid OTP");
        } else {
          toast.error("Oops!!! Something went wrong. Try Again");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(60);

    try {
      // Simulate resend API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("OTP resent");

      // Restart countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error("Failed to resend OTP. Please try again.");
      setCanResend(true);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">
          Verify Your Account
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We've sent a 6-digit verification code to your email address{" "}
          <q className="font-bold">{params.email}</q>. Please enter it below to
          continue.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-center block">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={isLoading || otp.length !== 6}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground hover:text-muted-foreground/80"
              onClick={handleResendOtp}
              disabled={!canResend}
            >
              {canResend ? "Resend OTP" : `Resend in ${countdown}s`}
            </Button>
          </div>
        </CardContent>
      </form>

      <CardFooter className="flex justify-center">
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-foreground"
        >
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
