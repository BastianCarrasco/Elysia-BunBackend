import { Elysia } from "elysia";
import { healthRoutes } from "./health";
import { academicosRoutes } from "./academicos/CRUD";
import { unidadesRoutes } from "./ua/CRUD";
import { apoyoRoutes } from "./apoyo/CRUD";
import {convocatoriaRoutes} from "./convocatoria/CRUD"
import { cuestionarioRoutes } from "./cuestionario/CRUD";
import { respuestaCuestionarioRoutes } from "./respuestas_cuestionario/CRUD";

export const routes = new Elysia()

  .use(healthRoutes)
  .use(academicosRoutes)
  .use(unidadesRoutes)
  .use(convocatoriaRoutes)
  .use(cuestionarioRoutes)
  .use(respuestaCuestionarioRoutes)

  .use(apoyoRoutes); // <-- Añadimos las rutas académicas
