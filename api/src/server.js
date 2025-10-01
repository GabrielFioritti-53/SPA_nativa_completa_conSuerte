import Fastify from "fastify";

const server = Fastify({
  logger: true,
});

try {
  await server.listen({ host: "::", port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
