import fastifyFormbody from "@fastify/formbody";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function formBody(fastify) {
  fastify.register(fastifyFormbody);
});
