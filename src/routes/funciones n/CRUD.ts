// proyectosDataRoutes.ts
import { Elysia, t } from "elysia";
import { ProyectoModel, ProyectoSchema } from "./model_proyecto";
import {
  AcademicosPorProyectoModel,
  AcademicosPorProyectoSchema,
} from "./model_academicos";

import {
  ProyectoConAcademicos,
  ProyectoAcademicoSchema,
  ModelAcademicoXProyecto, // Import the new model
} from "./model_academicoXproyecto";

export const funcionesDataRoutes = new Elysia({ prefix: "/funciones" })
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
        tags: ["Funciones"],
        description:
          "Obtiene todos los proyectos con datos ya intersectados con sus tablas relacionadas",
        // === INFORMACIÓN DE LA TABLA ===
        table: {
          schema: ProyectoSchema, // Asocia el esquema de respuesta a la tabla
          name: "Proyectos Detallados", // Nombre de la tabla para la documentación
          description: "Listado completo de proyectos con sus relaciones", // Descripción de la tabla
        },
        // ==============================
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
        tags: ["Funciones"],
        description: "Get list of academic staff grouped by project",
        // === INFORMACIÓN DE LA TABLA ===
        table: {
          schema: AcademicosPorProyectoSchema, // Asocia el esquema de respuesta a la tabla
          name: "Académicos por Proyecto", // Nombre de la tabla para la documentación
          description: "Agrupación de académicos por cada proyecto", // Descripción de la tabla
        },
        // ==============================
      },
    }
  )
  // POST to create a new project with associated academics
  .post(
    "/crearProyectoConAcademicos",
    async ({ body }) => {
      try {
        const newProject = body as ProyectoConAcademicos;
        await ModelAcademicoXProyecto.crearProyectoConAcademicos(newProject);
        return { message: "Proyecto creado exitosamente con sus académicos." };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error creating project with academics: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while creating project with academics"
        );
      }
    },
    {
      body: ProyectoAcademicoSchema,
      detail: {
        tags: ["Funciones"],
        description: "Crea un nuevo proyecto y asocia académicos a él.",
        // === INFORMACIÓN DE LA TABLA ===
        table: {
          schema: ProyectoAcademicoSchema, // Asocia el esquema del cuerpo de la solicitud (input) a la tabla
          name: "Crear Proyecto con Académicos", // Nombre para la documentación (puede ser similar al endpoint)
          description:
            "Datos requeridos para crear un nuevo proyecto y asociar académicos", // Descripción de la tabla
        },
        // ==============================
      },
    }
  );
