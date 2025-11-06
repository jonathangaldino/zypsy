import { omit } from 'lodash-es';
import { createCrudRoute, type CrudRoute } from './utils.ts';
import { getCollection, type Post } from './db.ts';
import type { FastifyRequest } from 'fastify';

interface CategoryParams {
  id: string;
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
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', description: 'date of creation' },
            categories: { type: 'array', items: { type: 'string' }, description: 'id of tags' },
          },
        },
      },
    },
  },
  handler: async (request: FastifyRequest<{ Params: CategoryParams }>): Promise<Post[]> => {
    const posts = await getCollection('posts');
    return posts.filter((post) => post.categories?.includes(request.params.id));
  },
};

export const routes: CrudRoute[] = [...categoryRoutes, listPostsRoute];
