import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors"; // Correctly import the Elysia CORS plugin
import { routes } from "./routes";
import { createConfig } from "./lib/config";

// Initial configuration
const app = new Elysia();
const config = createConfig(app);

// Configure CORS first, before Swagger and routes
app.use(
  cors({
    origin: true, // Esto permite dinámicamente el origen de la solicitud
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    // Remueve credentials: true a menos que realmente lo necesites
    exposedHeaders: ["Content-Length"], // Opcional: headers que quieres exponer
  })
);

// Swagger only in development, after CORS
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

// Register routes after CORS and Swagger
app.use(routes).listen(config.PORT);

console.log(`🦊 Elysia running at ${app.server?.hostname}:${app.server?.port}`);
console.log(
  `📚 Swagger docs: http://${app.server?.hostname}:${app.server?.port}/docs`
);
