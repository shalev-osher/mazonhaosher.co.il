import { z } from "zod";

// Email validation schema
export const emailSchema = z
  .string()
  .min(1, "נא להזין כתובת מייל")
  .email("כתובת מייל לא תקינה")
  .max(255, "כתובת מייל ארוכה מדי");

// Israeli phone validation schema (accepts 05X, 07X formats)
export const phoneSchema = z
  .string()
  .min(1, "נא להזין מספר טלפון")
  .regex(
    /^0(5[0-9]|7[0-9])[0-9]{7}$/,
    "מספר טלפון לא תקין (נדרש פורמט ישראלי: 05X או 07X)"
  );

// Optional phone schema for newsletter
export const optionalPhoneSchema = z
  .string()
  .regex(/^0(5[0-9]|7[0-9])[0-9]{7}$/, "מספר טלפון לא תקין")
  .optional()
  .or(z.literal(""));

// Name validation schema (Hebrew, English, spaces, hyphens, apostrophes)
export const nameSchema = z
  .string()
  .min(2, "השם קצר מדי")
  .max(100, "השם ארוך מדי")
  .regex(
    /^[\u0590-\u05FFa-zA-Z\s\-']+$/,
    "השם יכול להכיל רק אותיות, רווחים ומקפים"
  );

// Address validation schema
export const addressSchema = z
  .string()
  .min(3, "הכתובת קצרה מדי")
  .max(200, "הכתובת ארוכה מדי");

// City validation schema
export const citySchema = z
  .string()
  .min(2, "שם העיר קצר מדי")
  .max(50, "שם העיר ארוך מדי");

// Review text validation schema
export const reviewTextSchema = z
  .string()
  .max(500, "הביקורת ארוכה מדי (מקסימום 500 תווים)")
  .optional()
  .or(z.literal(""));

// Notes validation schema
export const notesSchema = z
  .string()
  .max(500, "ההערות ארוכות מדי (מקסימום 500 תווים)")
  .optional()
  .or(z.literal(""));

// Newsletter subscription schema
export const newsletterSchema = z
  .object({
    email: emailSchema.optional().or(z.literal("")),
    phone: optionalPhoneSchema,
  })
  .refine((data) => data.email || data.phone, {
    message: "נא להזין מייל או טלפון",
  });

// Checkout form schema
export const checkoutFormSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: addressSchema,
  city: citySchema,
  notes: notesSchema,
});

// Review form schema
export const reviewFormSchema = z.object({
  cookieName: z.string().min(1, "נא לבחור עוגיה"),
  rating: z.number().min(1, "נא לדרג את העוגיה").max(5),
  reviewText: reviewTextSchema,
});

// Helper function to get validation error message
export const getValidationError = (error: unknown): string | null => {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || "שגיאה בנתונים";
  }
  return null;
};
