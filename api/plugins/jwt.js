import jwt from "@fastify/jwt";
import fastifyPlugin from "fastify-plugin";

export default fastifyPlugin(async function jwtPlugin(fastify) {
  const secret = process.env.JWT_SECRET || "claveSecreta";

  fastify.register(jwt, { secret });

  fastify.decorate("authenticate", async function (req, rep) {
    try {
      await req.jwtVerify();
    } catch (err) {
      rep.code(401).send({ error: "Token inválido o no proporcionado" });
    }
  });
});
