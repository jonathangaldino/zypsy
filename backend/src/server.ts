import { routes } from "./routes.ts";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";

const fastify = Fastify({
  logger: true,
});

await fastify.register(swagger);
await fastify.register(swaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecificationClone: true,
});

await fastify.register(cors, {
  origin: "*",
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
});

routes.forEach((route) => fastify.route(route));

try {
  await fastify.ready();
  await fastify.listen({ port: 9000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
