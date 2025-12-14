/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import z from "zod";

const registerUserValidationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  currentLocation: z.string().min(1, "Location is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerUser = async (
  _currentState: any,
  formData: any
): Promise<any> => {
  try {
    const validateData = {
      fullName: formData.get("fullName"),
      currentLocation: formData.get("currentLocation"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validatesData = registerUserValidationSchema.safeParse(validateData);

    if (!validatesData.success) {
      return {
        success: false,
        errors: validatesData.error.issues.map((issue) => {
          return {
            field: issue.path[0],
            message: issue.message,
          };
        }),
      };
    }

    const registerData = {
      fullName: formData.get("fullName"),
      currentLocation: formData.get("currentLocation"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const newFormData = new FormData();
    newFormData.append("data", JSON.stringify(registerData));
    const res = await fetch(`http://localhost:8000/api/user/register`, {
      method: "POST",
      body: newFormData,
    });
    

    const data = await res.json();

    return data;
  } catch (error) {
    return {
      success: false,
      errors: [{ field: "server", message: "Unexpected error occurred" }],
    };
  }
};
