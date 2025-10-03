import Type from "typebox";
import { usuarios } from "../services/database.js";

export default async function rutasLogin(fastify, opts) {
  fastify.post(
    "/register",
    {
      schema: {
        summary: "Registrar un usuario",
        description: "Ruta para registrar un usuario",
        tags: ["login"],
        body: Type.Object({
          nombre: Type.String(),
          apellido: Type.String(),
          email: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { nombre, apellido, email, password } = request.body;

      const existe = usuarios.find((u) => u.nombre === nombre);
      if (existe) {
        return reply.code(400).send({ error: "Usuario ya existe" });
      }

      const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre,
        apellido,
        email,
        password,
      };

      usuarios.push(nuevoUsuario);

      return {
        message: "Usuario registrado correctamente",
        usuario: nuevoUsuario,
      };
    }
  );

  fastify.post(
    "/login",
    {
      schema: {
        summary: "Login de usuario",
        description: "Ruta para loguear un usuario",
        tags: ["login"],
        body: Type.Object({
          nombre: Type.String(),
          password: Type.String(),
        }),
      },
    },
    async (request, reply) => {
      const { nombre, password } = request.body;

      const usuario = usuarios.find(
        (u) => u.nombre === nombre && u.password === password
      );

      if (!usuario) {
        return reply.code(401).send({ error: "Credenciales inválidas" });
      }

      const token = fastify.jwt.sign(
        { id: usuario.id, nombre: usuario.nombre, roles: usuario.roles },
        { expiresIn: "8h" }
      );

      return { token };
    }
  );
}
