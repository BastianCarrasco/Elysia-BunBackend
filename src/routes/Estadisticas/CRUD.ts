// src/routes/estadisticas_routes.ts
// Nota: He renombrado el archivo para reflejar que contendrá varias estadísticas
import { Elysia, t } from "elysia";
// Asumiendo que 'model' ahora es un archivo que exporta ambos modelos y esquemas,
// o que has creado un archivo 'index.ts' en una carpeta 'models' que los re-exporta.
// Si los modelos están en archivos separados (ej. AcademicosXUnidadModel.ts, ProyectosPorProfesorModel.ts),
// entonces la importación debería ser algo como:
// import { AcademicosXUnidadModel, AcademicosXUnidadSchema } from "../models/AcademicosXUnidadModel";
// import { ProyectosPorProfesorModel, ProyectosPorProfesorSchema } from "../models/ProyectosPorProfesorModel";
import {
  AcademicosXUnidadModel,
  AcademicosXUnidadSchema,
  ProyectosPorProfesorModel,
  ProyectosPorProfesorSchema,
} from "./model"; // <--- Ajusta esta ruta si es necesario

export const estadisticasroutes = new Elysia({
  prefix: "/estadisticas", // Cambiado el prefijo para ser más general
})
  // Endpoint 1: Académicos por Unidad
  .get(
    "/academicos-por-unidad", // Ruta específica para este endpoint
    async ({ set }) => {
      try {
        const data = await AcademicosXUnidadModel.getAll();
        return data;
      } catch (error) {
        console.error("Error al obtener Académicos por Unidad:", error);
        set.status = 500;
        return { message: "Error interno del servidor al obtener los datos." };
      }
    },
    {
      response: {
        200: t.Array(AcademicosXUnidadSchema),
        500: t.Object({
          message: t.String(),
        }),
      },
      detail: {
        tags: ["Estadísticas"],
        summary: "Obtener el total de académicos por unidad académica",
        description:
          "Retorna una lista de unidades académicas con el número total de profesores/académicos asignados a cada una.",
      },
    }
  )

  // Endpoint 2: Proyectos por Profesor
  .get(
    "/proyectos-por-profesor", // Nueva ruta específica para este endpoint
    async ({ set }) => {
      try {
        const data = await ProyectosPorProfesorModel.getAll();
        return data;
      } catch (error) {
        console.error("Error al obtener Proyectos por Profesor:", error);
        set.status = 500;
        return { message: "Error interno del servidor al obtener los datos." };
      }
    },
    {
      response: {
        200: t.Array(ProyectosPorProfesorSchema), // Tipo de respuesta para éxito
        500: t.Object({
          // Tipo de respuesta para error
          message: t.String(),
        }),
      },
      detail: {
        tags: ["Estadísticas"], // Puedes mantener la misma etiqueta o crear una nueva si quieres
        summary: "Obtener el número de proyectos por cada profesor/académico",
        description:
          "Retorna una lista de profesores/académicos con el número total de proyectos en los que participan.",
      },
    }
  );
