// Importo la lista de usuarios desde el archivo server.js
import { usuarios } from "../../services/database.js";
import Type from "typebox";

// Exporto una función que define las rutas relacionadas con usuarios por su ID
export default async function usuarioIDRoutes(fastify) {
  fastify.put(
    "/:id_usuario",
    {
      schema: {
        summary: "Modificar usuarios",
        description: "Ruta para modificar usuarios ",
        tags: ["usuarios"],
        body: Type.Object({
          nombre: Type.String(),
          apellido: Type.String(),
          edad: Type.Number(),
        }),
        security: [{ bearerAuth: [] }],
      },
      preHandler: [fastify.authenticate],
    },

    async (req, reply) => {
      const id = Number(req.params.id_usuario);
      const { nombre, apellido, edad } = req.body;

      const usuarioCambiar = usuarios.find((u) => Number(u.id_usuario) === id);
      if (!usuarioCambiar)
        return reply.code(404).send({ error: "Usuario no encontrado" });

      usuarioCambiar.nombre = nombre;
      usuarioCambiar.apellido = apellido;
      usuarioCambiar.edad = edad;
      return reply.code(200).send(usuarioCambiar);
    }
  );

  fastify.delete(
    "/:id_usuario",
    {
      schema: {
        summary: "Eliminar usuarios",
        description: "Ruta para eliminar usuarios ",
        tags: ["usuarios"],
      },
    },
    async (req, reply) => {
      const id = Number(req.params.id_usuario);
      const index = usuarios.findIndex((u) => Number(u.id_usuario) === id);

      if (index === -1)
        return reply.code(404).send({ error: "Usuario no encontrado" });

      usuarios.splice(index, 1);
      return reply.code(204).send();
    }
  );

  fastify.get(
    "/:id_usuario",
    {
      schema: {
        summary: "Obtener un usuario",
        description: "Ruta para obtener usuario ",
        tags: ["usuarios"],
      },
    },
    async (req, reply) => {
      const id = Number(req.params.id_usuario);
      const usuario = usuarios.find((u) => Number(u.id_usuario) === id);
      if (!usuario)
        return reply.code(404).send({ error: "Usuario no encontrado" });
      return reply.code(200).send(usuario);
    }
  );
}
