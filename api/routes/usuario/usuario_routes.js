import { usuarios } from "../../server.js";

export default async function usuarioRoutes(fastify) {
  // Ruta GET: obtener todos los usuarios
  fastify.get("/usuarios", async (request, reply) => {
    return usuarios;
  });

  // Ruta POST: crear un nuevo usuario
  fastify.post("/usuarios", async (request, reply) => {
    const { nombre, apellido, email } = request.body;

    // Validación básica
    if (!nombre || !apellido || !email) {
      return reply.code(400).send({ error: "Faltan campos obligatorios" });
    }

    // Crear nuevo usuario
    const nuevoUsuario = {
      id_usuario: usuarios.length + 1,
      nombre,
      apellido,
      email,
    };

    usuarios.push(nuevoUsuario);
    return reply.code(201).send(nuevoUsuario);
  });
}
