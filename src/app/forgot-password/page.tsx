import { Card } from "@/components/ui/card";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Forgot Password</h1>
            <p className="text-gray-600 mt-2">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </Card>
    </div>
  );
}
