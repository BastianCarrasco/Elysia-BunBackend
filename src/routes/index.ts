// src/routes/index.ts (o routes.ts)

import { Elysia } from "elysia";

// Importaciones ordenadas alfabéticamente
import { academicosRoutes } from "./academicos/CRUD";
import { apoyoRoutes } from "./apoyo/CRUD";
import { cuestionarioRoutes } from "./cuestionario/CRUD";
import { estadisticasroutes } from "./Estadisticas/CRUD"; // Corregida la "E" mayúscula para consistencia si el archivo es "Estadisticas"
import { estatusRoutes } from "./estatus/CRUD";
import { fondosRoutes } from "./fondos/CRUD";
import { funcionesDataRoutes } from "./funciones n/CRUD";
import { healthRoutes } from "./health";
import { instConvoRoutes } from "./inst_convo/CRUD";
import { kthRoutes } from "./kth/CRUD";
import { proyectoRoutes } from "./proyecto/CRUD";
import { proyectoacademicoRoutes } from "./proyectoacademico/CRUD";
import { respuestaCuestionarioRoutes } from "./respuestas_cuestionario/CRUD";
import { tagRoutes } from "./apoyo/detalles/CRUD";
import { tematicaRoutes } from "./tematica/CRUD";
import { tipoApoyoRoutes } from "./tipo_apoyo/CRUD";
import { tipoConvoRoutes } from "./tipo_convo/CRUD";
import { unidadesRoutes } from "./ua/CRUD";

export const routes = new Elysia()
  // Uso de rutas ordenado alfabéticamente
  .use(academicosRoutes)
  .use(apoyoRoutes)
  .use(cuestionarioRoutes)
  .use(estadisticasroutes)
  .use(estatusRoutes)
  .use(fondosRoutes)
  .use(funcionesDataRoutes)
  .use(healthRoutes)
  .use(instConvoRoutes)
  .use(kthRoutes)
  .use(proyectoRoutes)
  .use(proyectoacademicoRoutes)
  .use(respuestaCuestionarioRoutes)
  .use(tagRoutes)
  .use(tematicaRoutes)
  .use(tipoApoyoRoutes)
  .use(tipoConvoRoutes)
  .use(unidadesRoutes);
