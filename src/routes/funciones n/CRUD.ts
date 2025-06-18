// proyectosDataRoutes.ts
import { Elysia, t } from "elysia";
import { ProyectoModel, ProyectoSchema } from "./model_proyecto";
import {
  AcademicosPorProyectoModel,
  AcademicosPorProyectoSchema,
} from "./model_academicos";

export const proyectosDataRoutes = new Elysia({ prefix: "/proyectos" })
  // GET All Proyectos with complete data
  .get(
    "/data",
    async () => {
      try {
        const proyectos = await ProyectoModel.getAll();
        return proyectos;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting proyectos: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting proyectos");
      }
    },
    {
      response: t.Array(ProyectoSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Get all proyectos with complete related data",
      },
    }
  )
  // GET Academicos por Proyecto (todos los proyectos con sus académicos)
  .get(
    "/academicosXProyecto",
    async () => {
      try {
        const academicosPorProyecto =
          await AcademicosPorProyectoModel.getAcademicosPorProyecto();
        return academicosPorProyecto;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error getting académicos por proyecto: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while getting académicos por proyecto"
        );
      }
    },
    {
      response: t.Array(AcademicosPorProyectoSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Get list of academic staff grouped by project",
      },
    }
  );
