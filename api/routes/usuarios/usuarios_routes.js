import Type from "typebox";
import { usuarios } from "../../services/database.js";

export default async function rutasUsuario(fastify, opts) {
  fastify.get(
    "/",
    {
      schema: {
        summary: "Obtener usuarios",
        description: "Ruta para obtener usuarios ",
        tags: ["usuarios"],
        security: [{ bearerAuth: [] }],
      },
    },

    async (req, reply) => {
      return reply.code(200).send(usuarios);
    }
  );

  fastify.post(
    "/",
    {
      schema: {
        summary: "Crear usuarios",
        description: "Ruta para crear usuarios ",
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
      const maxId = usuarios.reduce(
        (m, u) => Math.max(m, Number(u.id_usuario || 0)),
        0
      );
      const nuevoId = maxId + 1;

      const { nombre, apellido, edad } = req.body;
      const nuevousuario = { nombre, apellido, edad, id_usuario: nuevoId };
      usuarios.push(nuevousuario);
      return reply.code(201).send(nuevousuario);
    }
  );
}
