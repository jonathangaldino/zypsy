import z from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  favorite: z.boolean(),
})

export type Category = z.infer<typeof CategorySchema>;

export const PostSchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string(),
  categories: z.array(z.string()),
})

export type Post = z.infer<typeof PostSchema>;
