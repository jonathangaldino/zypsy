import z from "zod";
import { Category, CategorySchema, Post, PostSchema } from "../types";

export async function getPostsByCategoryId(categoryId: string): Promise<Array<Post>> {
  const JSONResponseSchema = z.array(PostSchema)

  // Using Zod validation for runtime type safety
  // Reference: https://kentcdodds.com/blog/using-fetch-with-type-script

  const response = await fetch(`http://localhost:9000/categories/${categoryId}/posts`, {
    headers: {
      "Content-Type": "application/json",
    }
  })

  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    throw new Error("Failed to parse JSON response");
  }

  const { data, error } = JSONResponseSchema.safeParse(json);

  if (error) {
    throw new Error("Validation errors.");
  }

  // Simulate network latency for development
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return data;
}
