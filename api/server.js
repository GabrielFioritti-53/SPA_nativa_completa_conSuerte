// Importo Fastify para crear el servidor
import Fastify from "fastify";

// Importo el plugin CORS para permitir que el frontend (localhost:4000) se comunique con esta API
import cors from "@fastify/cors";

// Importo las rutas para manejar usuarios
import usuarioRoutes from "./routes/usuario/usuario_routes.js";
import usuarioIDRoutes from "./routes/usuario_id/usuario_id_routes.js";

// Defino un array en memoria con usuarios (esto hace de "base de datos" temporal)
export const usuarios = [
  {
    id_usuario: 1,
    nombre: "Gabriel",
    apellido: "Fioritti",
    email: "fiorittigabriel@gmail.com",
  },
  {
    id_usuario: 2,
    nombre: "Paula",
    apellido: "Tomas",
    email: "tomasannapaula@gmail.com",
  },
];

// Creo el servidor de Fastify con logging activado
const fastify = Fastify({ logger: true });

fastify.get("/", async (request, reply) => {
  return {
    message: "API de Usuarios funcionando",
    endpoints: {
      getAll: "GET /usuarios",
      getById: "GET /usuarios/:id",
      create: "POST /usuarios",
      update: "PUT /usuarios/:id",
      delete: "DELETE /usuarios/:id",
    },
  };
});

// Registro el plugin de CORS para que el frontend (que corre en el puerto 4000) pueda hacer peticiones a esta API
await fastify.register(cors, {
  origin: "http://localhost:4000", // Acepta peticiones solo desde este origen
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
});

// Registro las rutas definidas en otros archivos
await fastify.register(usuarioRoutes); // Rutas generales de usuarios
await fastify.register(usuarioIDRoutes); // Rutas para usuarios por ID

// Arranco el servidor en el puerto 3000
try {
  await fastify.listen({ port: 3000, host: "::" });
  console.log("API corriendo en http://localhost:3000/usuarios");
} catch (err) {
  // Si hay error al iniciar el servidor, lo muestro en consola y cierro el proceso
  fastify.log.error(err);
  process.exit(1);
}
