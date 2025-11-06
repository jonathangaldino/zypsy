import { v4 as uuidv4 } from 'uuid';
import type { FastifySchema, RouteOptions } from 'fastify';
import { getCollection, setCollection } from './db.ts';

export interface CrudRoute extends RouteOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  schema: FastifySchema;
  handler: (request: any, reply: any) => Promise<any> | any;
}

export const createCrudRoute = (
  collectionName: string,
  schema: object,
  creationSchema: object
): CrudRoute[] => {
  const listRoute: CrudRoute = {
    method: 'GET',
    url: `/${collectionName}`,
    schema: {
      response: {
        200: {
          type: 'array',
          items: schema,
        },
      },
    },
    handler: async () => getCollection(collectionName as any),
  };

  const getRoute: CrudRoute = {
    method: 'GET',
    url: `/${collectionName}/:id`,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: `id of ${collectionName} to get`,
          },
        },
      },
      response: {
        200: schema,
      },
    },
    handler: async (request) => {
      const items = await getCollection(collectionName as any);
      const item = items.find((item: any) => item.id === request.params.id);
      if (!item) {
        throw new Error('Not found');
      }
      return item;
    },
  };

  const createRoute: CrudRoute = {
    method: 'POST',
    url: `/${collectionName}`,
    schema: {
      body: creationSchema,
      response: {
        200: schema,
      },
    },
    handler: async (request) => {
      const items = await getCollection(collectionName as any);
      const newItem = {
        id: uuidv4(),
        ...request.body,
      };
      items.push(newItem);
      await setCollection(collectionName as any, items);
      return newItem;
    },
  };

  const updateRoute: CrudRoute = {
    method: 'PUT',
    url: `/${collectionName}/:id`,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: `id of ${collectionName} to update`,
          },
        },
      },
      body: creationSchema,
      response: {
        200: schema,
      },
    },
    handler: async (request) => {
      const items = await getCollection(collectionName as any);
      const index = items.findIndex((item: any) => item.id === request.params.id);
      if (index === -1) {
        throw new Error('Not found');
      }
      const updatedItem = {
        id: request.params.id,
        ...request.body,
      };
      items[index] = updatedItem;
      await setCollection(collectionName as any, items);
      return updatedItem;
    },
  };

  const deleteRoute: CrudRoute = {
    method: 'DELETE',
    url: `/${collectionName}/:id`,
    schema: {
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: `id of ${collectionName} to delete`,
          },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
          },
        },
      },
    },
    handler: async (request) => {
      const items = await getCollection(collectionName as any);
      const index = items.findIndex((item: any) => item.id === request.params.id);
      if (index === -1) {
        throw new Error('Not found');
      }
      items.splice(index, 1);
      await setCollection(collectionName as any, items);
      return { success: true };
    },
  };

  return [listRoute, getRoute, createRoute, updateRoute, deleteRoute];
};
