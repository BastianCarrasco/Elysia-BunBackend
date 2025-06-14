import { Elysia } from 'elysia';
import { healthRoutes } from './health';
import { academicosRoutes } from './academicos/CRUD';
import {unidadesRoutes } from './ua/CRUD'

export const routes = new Elysia()
  .get('/', () => 'Bun + Elysia API')
  .use(healthRoutes)
  .use(academicosRoutes)
  .use(unidadesRoutes); // <-- Añadimos las rutas académicas