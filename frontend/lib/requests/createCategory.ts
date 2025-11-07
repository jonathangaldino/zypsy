import z from "zod";
import { Category, CategorySchema } from "../types";

const CreateCategoryInputSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  favorite: z.boolean(),
});

export type CreateCategoryInput = z.infer<typeof CreateCategoryInputSchema>;

export async function createCategory(
  data: CreateCategoryInput
): Promise<Category> {
  const JSONResponseSchema = CategorySchema;

  // Using Zod validation for runtime type safety
  // Reference: https://kentcdodds.com/blog/using-fetch-with-type-script

  const response = await fetch(`http://localhost:9000/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    throw new Error("Failed to parse JSON response");
  }

  const { data: validatedData, error } = JSONResponseSchema.safeParse(json);

  if (error) {
    throw new Error("Validation errors.");
  }

  return validatedData;
}
