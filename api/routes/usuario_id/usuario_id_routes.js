// Importo la lista de usuarios desde el archivo server.js
import { usuarios } from "../../server.js";

// Exporto una función que define las rutas relacionadas con usuarios por su ID
export default async function usuarioIDRoutes(fastify) {
  // Ruta GET: obtener un usuario por su id
  fastify.get("/usuarios/:id_usuario", async (request, reply) => {
    // Convierto el parámetro recibido en la URL a número
    const id_usuario = Number(request.params.id_usuario);

    // Busco el usuario en el array de usuarios
    const usuario = usuarios.find((u) => u.id_usuario === id_usuario);

    // Si no existe, devuelvo un error 404
    if (!usuario) {
      return reply.code(404).send({ error: "Usuario no encontrado" });
    }

    // Si lo encuentro, lo devuelvo como respuesta
    return usuario;
  });

  // Ruta PUT: actualizar un usuario por su id
  fastify.put("/usuarios/:id_usuario", async (request, reply) => {
    const id_usuario = Number(request.params.id_usuario);

    // Busco el índice del usuario en el array
    const index = usuarios.findIndex((u) => u.id_usuario === id_usuario);

    // Si no existe, devuelvo un error 404
    if (index === -1) {
      return reply.code(404).send({ error: "Usuario no encontrado" });
    }

    // Reemplazo el usuario viejo con uno nuevo (mantengo el id y actualizo con lo que viene en el body)
    usuarios[index] = { id_usuario, ...request.body };

    // Devuelvo el usuario actualizado
    return usuarios[index];
  });

  // Ruta DELETE: eliminar un usuario por su id
  fastify.delete("/usuarios/:id_usuario", async (request, reply) => {
    const id_usuario = Number(request.params.id_usuario);

    // Busco el índice del usuario en el array
    const index = usuarios.findIndex((u) => u.id_usuario === id_usuario);

    // Si no existe, devuelvo error 404
    if (index === -1) {
      return reply.code(404).send({ error: "Usuario no encontrado" });
    }

    // Elimino el usuario del array
    usuarios.splice(index, 1);

    // Devuelvo un mensaje confirmando la eliminación
    return { message: "Usuario eliminado" };
  });
}
