import z from "zod";
import { Category, CategorySchema } from "../types";

// Define the input schema for updating a category
const UpdateCategoryInputSchema = z.object({
  name: z.string().optional(),
  favorite: z.boolean().optional(),
});

export type UpdateCategoryInput = z.infer<typeof UpdateCategoryInputSchema>;

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryInput
): Promise<Category> {
  const JSONResponseSchema = CategorySchema;

  // Using Zod validation for runtime type safety
  // Reference: https://kentcdodds.com/blog/using-fetch-with-type-script

  const response = await fetch(`http://localhost:9000/categories/${categoryId}`, {
    method: "PUT",
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

  // Simulate network latency for development
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return validatedData;
}
