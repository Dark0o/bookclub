"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    // Call the verify-email API
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);

        if (response.redirected) {
          // The API redirects on success/failure
          // Extract status from redirect URL
          const url = new URL(response.url);
          const verified = url.searchParams.get("verified");
          const error = url.searchParams.get("error");

          if (verified === "true") {
            setStatus("success");
            setMessage("Your email has been verified successfully!");
          } else if (error) {
            setStatus("error");
            setMessage(getErrorMessage(error));
          }
        }
      } catch (err) {
        setStatus("error");
        setMessage("Failed to verify email. Please try again.");
      }
    };

    verifyEmail();
  }, [searchParams]);

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "missing-token":
        return "No verification token provided.";
      case "invalid-token":
        return "Invalid or expired verification token.";
      case "verification-failed":
        return "Email verification failed. Please try again.";
      default:
        return "An error occurred during verification.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-4">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="text-xl font-semibold">Verifying your email...</h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full bg-green-100 w-16 h-16 flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-900">
                Email Verified!
              </h2>
              <p className="text-gray-600">{message}</p>
              <Button onClick={() => router.push("/")} className="w-full">
                Go to Login
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full bg-red-100 w-16 h-16 flex items-center justify-center mx-auto">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-900">
                Verification Failed
              </h2>
              <p className="text-gray-600">{message}</p>
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/")}
                  className="w-full"
                  variant="outline"
                >
                  Go to Login
                </Button>
                <p className="text-sm text-gray-500">
                  Need help? Contact support.
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
