import fastifyWebsocket from "@fastify/websocket";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async (fastify) => {
  fastify.register(fastifyWebsocket);
});
