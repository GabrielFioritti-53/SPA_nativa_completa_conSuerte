// Importo Fastify para crear el servidor
import Fastify from "fastify";

// Importo las rutas para manejar usuarios
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fastifyAutoload from "@fastify/autoload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Creo el servidor de Fastify con logging activado
const fastify = Fastify({ logger: true });
fastify.register(fastifyAutoload, {
  dir: join(__dirname, "plugins"),
});
// Registro las rutas definidas en otros archivos
fastify.register(fastifyAutoload, {
  dir: join(__dirname, "routes"),
});
/* fastify.register(fastifyAutoload, {
  dir: join(__dirname, "routes", "usuarios_id"),
}); */

/* const dir = join(__dirname, "plugins");
console.log({ dir }); */

// Arranco el servidor en el puerto 3000
try {
  await fastify.listen({ port: 3000, host: "::" });
  console.log("API corriendo en http://localhost:3000/usuarios");
} catch (err) {
  // Si hay error al iniciar el servidor, lo muestro en consola y cierro el proceso
  fastify.log.error(err);
  process.exit(1);
}
