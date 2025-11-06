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

  // This is not the usual typing for a request that I like to follow.
  // I tend to use something similar to: https://kentcdodds.com/blog/using-fetch-with-type-script
  // Instead of just typing it - I validate with Zod - which protects us from errors during runtime errors

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
    // Just in case we need to have control over the error
    throw new Error("Failed to parse JSON response");
  }

  const { data: validatedData, error } = JSONResponseSchema.safeParse(json);

  if (error) {
    // Great way of returning zod errors from the validation -> UI can show errors
    throw new Error("Validation errors.");
  }

  // Activate this to simulate request isLoading
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // runtime safe
  return validatedData;
}
