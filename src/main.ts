import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { routes } from "./routes";
import { createConfig } from "./lib/config";

const app = new Elysia();
const config = createConfig(app);

// Configuración CORS completa y corregida
app.use(
  cors({
    origin: true, // Permite cualquier origen dinámicamente
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposeHeaders: ["Content-Length", "X-Request-ID"], // Corregido: exposeHeaders en lugar de exposedHeaders
    credentials: false, // Importante mantener en false cuando se usa origin *
    maxAge: 86400, // Preflight cache por 24 horas
  })
);

// Manejo explícito de solicitudes OPTIONS
app.options("*", ({ set }) => {
  set.headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
    "Access-Control-Max-Age": "86400",
  };
});

// Configuración de Swagger solo en desarrollo
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

// Middleware final para asegurar headers CORS en todas las respuestas
app.on("afterHandle", ({ set }) => {
  set.headers["Access-Control-Allow-Origin"] = "*";
  set.headers["Vary"] = "Origin";
});

// Registrar rutas principales
app.use(routes);

// Iniciar servidor
app.listen(config.PORT);

console.log(
  `🦊 Servidor Elysia ejecutándose en ${app.server?.hostname}:${app.server?.port}`
);
console.log(
  `📚 Documentación Swagger: http://${app.server?.hostname}:${app.server?.port}/docs`
);
