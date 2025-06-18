import { Elysia, t } from "elysia";
import { ProyectoModel, ProyectoSchema } from "./model_proyecto";

export const proyectosDataRoutes = new Elysia({ prefix: "/proyectos" })
  // GET All Proyectos with complete data
  .get(
    "/",
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

  // GET Single Proyecto by ID with complete data
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const proyecto = await ProyectoModel.getById(Number(id));
        if (!proyecto) {
          throw new Error("Proyecto not found");
        }
        return proyecto;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting proyecto: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting proyecto");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      response: ProyectoSchema,
      detail: {
        tags: ["Proyectos"],
        description: "Get a specific proyecto with complete related data by ID",
      },
    }
  )

  // GET Proyectos by Status
  .get(
    "/estatus/:status",
    async ({ params: { status } }) => {
      try {
        const proyectos = await ProyectoModel.getByStatus(status);
        return proyectos;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error getting proyectos by status: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while getting proyectos by status"
        );
      }
    },
    {
      params: t.Object({
        status: t.String(),
      }),
      response: t.Array(ProyectoSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Get proyectos filtered by status",
      },
    }
  )

  // GET Proyectos by Convocatoria
  // .get(
  //   "/convocatoria/:id",
  //   async ({ params: { id } }) => {
  //     try {
  //       const proyectos = await ProyectoModel.getByConvocatoria(Number(id));
  //       return proyectos;
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         throw new Error(
  //           `Error getting proyectos by convocatoria: ${error.message}`
  //         );
  //       }
  //       throw new Error(
  //         "Unknown error occurred while getting proyectos by convocatoria"
  //       );
  //     }
  //   },
  //   {
  //     params: t.Object({
  //       id: t.Numeric(),
  //     }),
  //     response: t.Array(ProyectoSchema),
  //     detail: {
  //       tags: ["Proyectos"],
  //       description: "Get proyectos filtered by convocatoria ID",
  //     },
  //   }
  // )

  // SEARCH Proyectos by Name
  .get(
    "/search/:name",
    async ({ params: { name } }) => {
      try {
        const proyectos = await ProyectoModel.searchByName(name);
        return proyectos;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error searching proyectos: ${error.message}`);
        }
        throw new Error("Unknown error occurred while searching proyectos");
      }
    },
    {
      params: t.Object({
        name: t.String(),
      }),
      response: t.Array(ProyectoSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Search proyectos by name",
      },
    }
  )

  // CREATE New Proyecto
  .post(
    "/",
    async ({ body }) => {
      try {
        const newProyecto = await ProyectoModel.create(body);
        return newProyecto;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating proyecto: ${error.message}`);
        }
        throw new Error("Unknown error occurred while creating proyecto");
      }
    },
    {
      body: ProyectoSchema,
      response: ProyectoSchema,
      detail: {
        tags: ["Proyectos"],
        description: "Create a new proyecto",
      },
    }
  )

  // UPDATE Proyecto
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        const updatedProyecto = await ProyectoModel.update(Number(id), body);
        if (!updatedProyecto) {
          throw new Error("Proyecto not found");
        }
        return updatedProyecto;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error updating proyecto: ${error.message}`);
        }
        throw new Error("Unknown error occurred while updating proyecto");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: ProyectoSchema,
      response: ProyectoSchema,
      detail: {
        tags: ["Proyectos"],
        description: "Update an existing proyecto",
      },
    }
  )

  // DELETE Proyecto
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const success = await ProyectoModel.delete(Number(id));
        if (!success) {
          throw new Error("Proyecto not found");
        }
        return { message: "Proyecto deleted successfully" };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error deleting proyecto: ${error.message}`);
        }
        throw new Error("Unknown error occurred while deleting proyecto");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      response: t.Object({
        message: t.String(),
      }),
      detail: {
        tags: ["Proyectos"],
        description: "Delete a proyecto by ID",
      },
    }
  );
