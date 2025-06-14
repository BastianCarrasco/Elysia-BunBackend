import { Elysia } from 'elysia';
import { healthRoutes } from './health';
import { academicosRoutes } from './academicos';

export const routes = new Elysia()
  .get('/', () => 'Bun + Elysia API')
  .use(healthRoutes)
  .use(academicosRoutes); // <-- Añadimos las rutas académicas