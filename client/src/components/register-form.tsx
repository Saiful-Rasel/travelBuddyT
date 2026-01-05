"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { registerUser } from "@/service/auth/registerUser";
import { getFieldError } from "@/lib/getFieldError";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
    if (state && state.success) {
      toast.success("Register User successfully");
      router.push("/login");
    }
  }, [state, router]);

  return (
    <form action={formAction} className="w-full max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800  rounded-xl shadow-md transition-colors duration-300">
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Name + Location */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Full Name */}
            <Field className="flex-1">
              <FieldLabel htmlFor="fullName" className="text-gray-900 dark:text-gray-100">
                Full Name
              </FieldLabel>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              {getFieldError(state, "fullName") && (
                <FieldDescription className="text-red-600 dark:text-red-400">
                  {getFieldError(state, "fullName")}
                </FieldDescription>
              )}
            </Field>

            {/* Current Location */}
            <Field className="flex-1">
              <FieldLabel htmlFor="currentLocation" className="text-gray-900 dark:text-gray-100">
                Current Location
              </FieldLabel>
              <Input
                id="currentLocation"
                name="currentLocation"
                type="text"
                placeholder="123 Main St"
                className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              {getFieldError(state, "currentLocation") && (
                <FieldDescription className="text-red-600 dark:text-red-400">
                  {getFieldError(state, "currentLocation")}
                </FieldDescription>
              )}
            </Field>
          </div>

          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email" className="text-gray-900 dark:text-gray-100">
              Email
            </FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {getFieldError(state, "email") && (
              <FieldDescription className="text-red-600 dark:text-red-400">
                {getFieldError(state, "email")}
              </FieldDescription>
            )}
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password" className="text-gray-900 dark:text-gray-100">
              Password
            </FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
            {getFieldError(state, "password") && (
              <FieldDescription className="text-red-600 dark:text-red-400">
                {getFieldError(state, "password")}
              </FieldDescription>
            )}
          </Field>
        </div>

        {/* Submit */}
        <FieldGroup className="mt-6">
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-500 dark:hover:bg-blue-400 text-white transition-colors duration-300"
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <FieldDescription className="px-6 text-center text-gray-700 dark:text-gray-300 mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign in
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default RegisterForm;
