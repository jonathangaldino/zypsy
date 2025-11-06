import z from "zod";
import { Category, CategorySchema, Post, PostSchema } from "../types";

export async function getPostsByCategoryId(categoryId: string): Promise<Array<Post>> {
  const JSONResponseSchema = z.array(PostSchema)

  // This is not the usual typing for a request that I like to follow.
  // I tend to use something similar to: https://kentcdodds.com/blog/using-fetch-with-type-script
  // Instead of just typing it - I validate with Zod - which protects us from errors during runtime errors

  const response = await fetch(`http://localhost:9000/categories/${categoryId}/posts`, {
    headers: {
      "Content-Type": "application/json",
    }
  })

  let json: unknown;
  try {
    json = await response.json();
  } catch (error) {
    // Just in case we need to have control over the error
    throw new Error("Failed to parse JSON response");
  }

  const { data, error } = JSONResponseSchema.safeParse(json);

  if (error) {
    // Great way of returning zod errors from the validation -> UI can show errors
    throw new Error("Validation errors.");
  }

  // Activate this to simulate request isLoading
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // runtime safe 
  return data;
}
