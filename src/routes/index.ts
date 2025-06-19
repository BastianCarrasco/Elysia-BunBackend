import { Elysia } from "elysia";
import { healthRoutes } from "./health";
import { academicosRoutes } from "./academicos/CRUD";
import { unidadesRoutes } from "./ua/CRUD";
import { apoyoRoutes } from "./apoyo/CRUD";

import { cuestionarioRoutes } from "./cuestionario/CRUD";
import { respuestaCuestionarioRoutes } from "./respuestas_cuestionario/CRUD";
import { tagRoutes } from "./apoyo/detalles/CRUD";
import { estatusRoutes } from "./estatus/CRUD";
import { fondosRoutes } from "./fondos/CRUD";
import { instConvoRoutes } from "./inst_convo/CRUD";
import { kthRoutes } from "./kth/CRUD";
import { proyectoacademicoRoutes } from "./proyectoacademico/CRUD";
import { proyectoRoutes } from "./proyecto/CRUD";
import { tematicaRoutes } from "./tematica/CRUD";
import { tipoApoyoRoutes } from "./tipo_apoyo/CRUD";
import { tipoConvoRoutes } from "./tipo_convo/CRUD";
import { funcionesDataRoutes } from "./funciones n/CRUD";

export const routes = new Elysia()
  .use(academicosRoutes)
  .use(apoyoRoutes)

  .use(cuestionarioRoutes)
  .use(healthRoutes)
  .use(respuestaCuestionarioRoutes)
  .use(tagRoutes)
  .use(unidadesRoutes)
  .use(fondosRoutes)
  .use(instConvoRoutes)
  .use(kthRoutes)
  .use(proyectoRoutes)
  .use(proyectoacademicoRoutes)
  .use(tematicaRoutes)
  .use(tipoApoyoRoutes)
  .use(tipoConvoRoutes)
  .use(estatusRoutes)
  .use(funcionesDataRoutes);
