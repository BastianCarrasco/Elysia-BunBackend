import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors"; // Importa el módulo CORS
import { routes } from "./routes";
import { createConfig } from "./lib/config";

// Configuración inicial
const app = new Elysia();
const config = createConfig(app);

app.use(
  cors({
    origin: true, // Permite TODOS los orígenes
    methods: "*", // Permite TODOS los métodos HTTP
    allowedHeaders: "*", // Permite TODAS las cabeceras
    credentials: true, // Permite credenciales
  })
);

// Swagger solo en desarrollo
if (config.ENVIRONMENT === "development") {
  app.use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "API Proyectos I+D - Bun + Elysia",
          version: "1.0.0",
          description: "API para gestión de datos académicos",
        },
        tags: [
          { name: "Health", description: "Health checks del sistema" },
          { name: "Académicos", description: "Gestión de datos de académicos" },
        ],
        components: {
          schemas: {
            Academico: {
              type: "object",
              properties: {
                id_academico: { type: "number", example: 103 },
                nombre: { type: "string", example: "ABDON" },
                email: {
                  type: "string",
                  format: "email",
                  example: "abdon.cifuentes@pucv.cl",
                },
                a_materno: { type: "string", example: "VALENZUELA" },
                a_paterno: { type: "string", example: "CIFUENTES" },
              },
            },
            Unidad_Academica: {
              type: "object",
              properties: {
                id_unidad: { type: "number", example: 103 },
                nombre: { type: "string", example: "Ing Civil Mecanica" },
              },
            },
          },
        },
      },
    })
  );
}

// Registrar rutas
app.use(routes).listen(config.PORT);

console.log(`🦊 Elysia running at ${app.server?.hostname}:${app.server?.port}`);
console.log(
  `📚 Swagger docs: http://${app.server?.hostname}:${app.server?.port}/docs`
);
