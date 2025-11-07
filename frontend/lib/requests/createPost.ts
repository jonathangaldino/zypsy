import z from "zod";
import { Post, PostSchema } from "../types";

const CreatePostInputSchema = z.object({
  description: z.string().min(1, "Description is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

export type CreatePostInput = z.infer<typeof CreatePostInputSchema>;

export async function createPost(
  categoryId: string,
  data: CreatePostInput
): Promise<Post> {
  const JSONResponseSchema = PostSchema;

  // Using Zod validation for runtime type safety
  // Reference: https://kentcdodds.com/blog/using-fetch-with-type-script

  const response = await fetch(`http://localhost:9000/categories/${categoryId}/posts`, {
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
