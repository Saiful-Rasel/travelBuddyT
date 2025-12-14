"use client";

// import { registerPatient } from "@/services/auth/registerPatient";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
// import InputFieldError from "./shared/InputFieldError";
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
  }, [state,router]);
  return (
    <form action={formAction}>
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Name */}
          <div className="flex gap-2">
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
              />
              {getFieldError(state, "fullName") && (
                <FieldDescription className="text-red-600">
                  {getFieldError(state, "fullName")}
                </FieldDescription>
              )}
            </Field>
            {/* Address */}
            <Field>
              <FieldLabel htmlFor="currentLocation">
                Current Location
              </FieldLabel>
              <Input
                id="currentLocation"
                name="currentLocation"
                type="text"
                placeholder="123 Main St"
              />
              {getFieldError(state, "currentLocation") && (
                <FieldDescription className="text-red-600">
                  {getFieldError(state, "currentLocation")}
                </FieldDescription>
              )}
            </Field>
          </div>
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
            />
            {getFieldError(state, "email") && (
              <FieldDescription className="text-red-600">
                {getFieldError(state, "email")}
              </FieldDescription>
            )}
          </Field>
          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" name="password" type="password" />
            {getFieldError(state, "password") && (
              <FieldDescription className="text-red-600">
                {getFieldError(state, "password")}
              </FieldDescription>
            )}
          </Field>
        </div>
        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>

            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
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
