"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/assets/Logo";
import ChromeIcon from "@/assets/ChromeIcon";
import GithubIcon from "@/assets/GithubIcon";
import { signIn } from "next-auth/react";
import { FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);

  const signInClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    console.log(res);
  };

  return (
    <main className="w-full flex justify-center items-center h-[calc(100vh-30%)] pt-16 overflow-auto">
      <Card className="lg:w-[400px] w-4/5">
        <CardHeader>
          <CardTitle>
            <div className="flex flex-col justify-center items-center gap-5">
              <Logo className="lg:h-[50px] md:h-[40px] lg:w-[50px] md:w-[40px] h-[55px] w-[55px]" />
              <p className="text-center">Welcome Back</p>
              <div className="my-5 w-full flex justify-around items-center">
                <Button onClick={() => signIn("google")}>
                  <ChromeIcon />
                </Button>
                <Button onClick={() => signIn("github")}>
                  <GithubIcon />
                </Button>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Or already have an account? Proceed to login ith credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={signInClick}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="name@example.com" type="email" />
              </div>
              <div className="flex flex-col space-y-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="********" type="password" />
              </div>
            </div>
          </form>

          <div className="mt-3 mb-2">
            <Link
              href={`/forgot_password${
                formRef.current?.querySelector<HTMLInputElement>(
                  'input[name="email"]'
                ) &&
                `?email=${formRef.current?.querySelector<HTMLInputElement>(
                  'input[name="email"]'
                )}`
              }`}
              className="underline"
            >
              Forgot Password
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between flex-col md:flex-row gap-5">
          <Button
            className="w-full md:w-auto"
            variant="outline"
            onClick={() => router.push("/")}
          >
            Go to home
          </Button>
          <Button
            className="w-full md:w-auto"
            onClick={() => formRef.current?.submit()}
          >
            Sign in with credentials
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
