import { Elysia } from "elysia";
import { swagger } from '@elysiajs/swagger';

const app = new Elysia()
  // Configuración de Swagger
  .use(
    swagger({
      path: '/docs',  // Ruta para acceder a la UI de Swagger
      documentation: {
        info: {
          title: 'Mi API Elysia',
          version: '1.0.0',
          description: 'Documentación de mi API'
        },
        tags: [  // Opcional: agrupación de endpoints
          { name: 'App', description: 'Endpoints generales' }
        ]
      }
    })
  )
  // Tus rutas
  .get("/", () => "Hello Elysia", {
    detail: {
      tags: ['App'],  // Asocia este endpoint al tag 'App'
      summary: 'Saludo inicial',
      description: 'Devuelve un saludo de bienvenida',
      responses: {
        200: { description: 'Saludo exitoso' }
      }
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📄 Swagger docs available at http://${app.server?.hostname}:${app.server?.port}/docs`);