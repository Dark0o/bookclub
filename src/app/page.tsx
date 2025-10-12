"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "login-email") {
      setLoginEmail(e.target.value);
    } else if (e.target.id === "login-password") {
      setLoginPassword(e.target.value);
    }
  };
  console.log(loginEmail, loginPassword);

  const login = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    } else {
      console.error("Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">BookClub</h1>
          <p className="text-gray-600 mt-2">
            Connect with readers, discover great books
          </p>
        </div>

        {/* Auth Card */}
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Sign up or log in to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      onChange={(e) => handleChange(e)}
                      value={loginEmail}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      onChange={(e) => handleChange(e)}
                      value={loginPassword}
                    />
                  </div>

                  <Button onClick={login} className="w-full">
                    Log In
                  </Button>
                </TabsContent>
              </TabsContent>

              <TabsContent value="signup">
                <TabsContent value="signup">
                  <TabsContent value="signup" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="johndoe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Name (optional)</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                      />
                    </div>

                    <Button className="w-full">Create Account</Button>
                  </TabsContent>
                </TabsContent>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
