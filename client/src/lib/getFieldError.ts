
export type FieldError = {
  field: string;
  message: string;
};

export type FormState = {
  errors?: FieldError[];
} | null | undefined;

export const getFieldError = (state: FormState, fieldName: string): string | null => {
  return state?.errors?.find((err) => err.field === fieldName)?.message || null;
};
