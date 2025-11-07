import { omit } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { createCrudRoute, type CrudRoute } from './utils.ts';
import { getCollection, setCollection, type Post } from './db.ts';
import type { FastifyRequest } from 'fastify';

interface CategoryParams {
  id: string;
}

interface CreatePostBody {
  description: string;
  date: string;
}

const categorySchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    favorite: { type: 'boolean' },
  },
};
const categoryCreationSchema = omit(categorySchema, ['properties.id']);
const categoryRoutes = createCrudRoute('categories', categorySchema, categoryCreationSchema);

const postSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    description: { type: 'string' },
    date: { type: 'string', description: 'date of creation' },
    categories: { type: 'array', items: { type: 'string' }, description: 'id of categories' },
  },
};

const listPostsRoute: CrudRoute = {
  method: 'GET',
  url: '/categories/:id/posts',
  schema: {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'id of category to get posts for',
        },
      },
    },
    response: {
      200: {
        type: 'array',
        items: postSchema,
      },
    },
  },
  handler: async (request: FastifyRequest<{ Params: CategoryParams }>): Promise<Post[]> => {
    const posts = await getCollection('posts');
    return posts.filter((post) => post.categories?.includes(request.params.id));
  },
};

const createPostRoute: CrudRoute = {
  method: 'POST',
  url: '/categories/:id/posts',
  schema: {
    params: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'id of category to add post to',
        },
      },
    },
    body: {
      type: 'object',
      required: ['description', 'date'],
      properties: {
        description: { type: 'string' },
        date: { type: 'string', description: 'date of creation (e.g., 2024-01-24)' },
      },
    },
    response: {
      200: postSchema,
    },
  },
  handler: async (request: FastifyRequest<{ Params: CategoryParams; Body: CreatePostBody }>): Promise<Post> => {
    const categoryId = request.params.id;

    // Validate date format (YYYY-MM-DD) and that it's a valid date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(request.body.date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    // Validate it's an actual valid date
    const parsedDate = new Date(request.body.date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date value');
    }

    // Verify category exists
    const categories = await getCollection('categories');
    const categoryExists = categories.some((cat) => cat.id === categoryId);

    if (!categoryExists) {
      throw new Error('Category not found');
    }

    // Create new post
    const newPost: Post = {
      id: uuidv4(),
      description: request.body.description,
      date: request.body.date,
      categories: [categoryId],
    };

    // Add to posts collection
    const posts = await getCollection('posts');
    posts.push(newPost);
    await setCollection('posts', posts);

    return newPost;
  },
};

export const routes: CrudRoute[] = [...categoryRoutes, listPostsRoute, createPostRoute];
