import fastifyCors from "@fastify/cors";
import fastifyPlugin from "fastify-plugin";

// Registro el plugin de CORS para que el frontend (que corre en el puerto 4000) pueda hacer peticiones a esta API
export default fastifyPlugin(async function cors(fastify, opts) {
  fastify.register(fastifyCors, {
    origin: "http://localhost:4000", // Acepta peticiones solo desde este origen
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  });
});
