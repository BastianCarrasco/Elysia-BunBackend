import { Elysia, t } from "elysia";
import { ProyectosDataModel, ProyectosDataSchema } from "./model_proyecto";

export const proyectosDataRoutes = new Elysia({ prefix: "/proyectos-data" })
  // GET All Proyectos with complete data
  .get(
    "/",
    async () => {
      try {
        const proyectos = await ProyectosDataModel.getAll();
        return proyectos;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting proyectos data: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting proyectos data");
      }
    },
    {
      response: t.Array(ProyectosDataSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Get all proyectos with complete related data",
      },
    }
  )

  // GET Single Proyecto by ID with complete data
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const proyecto = await ProyectosDataModel.getById(Number(id));
        if (!proyecto) {
          throw new Error("Proyecto not found");
        }
        return proyecto;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting proyecto data: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting proyecto data");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      response: ProyectosDataSchema,
      detail: {
        tags: ["Proyectos"],
        description: "Get a specific proyecto with complete related data by ID",
      },
    }
  );
