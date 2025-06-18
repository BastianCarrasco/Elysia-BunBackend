import { Elysia, t } from "elysia";
import { ProyectoModel, ProyectoSchema } from "./model";

export const proyectoRoutes = new Elysia({ prefix: "/proyectos" })

  // READ ALL - GET /proyectos
  .get(
    "/crudo",
    async () => {
      try {
        return await ProyectoModel.getAll();
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
        description: "Get all proyectos with related data",
      },
    }
  )

  // READ ONE - GET /proyectos/:id
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

  // READ BY STATUS - GET /proyectos/status/:statusId
  .get(
    "/status/:statusId",
    async ({ params: { statusId } }) => {
      try {
        const proyectos = await ProyectoModel.getByStatus(Number(statusId));
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
        statusId: t.Numeric(),
      }),
      response: t.Array(ProyectoSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Get proyectos filtered by status ID",
      },
    }
  )

  // READ BY CONVOCATORIA NAME - GET /proyectos/convocatoria/:nombre
  .get(
    "/convocatoria/:nombre",
    async ({ params: { nombre } }) => {
      try {
        const proyectos = await ProyectoModel.getByConvocatoria(nombre);
        return proyectos;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error getting proyectos by convocatoria: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while getting proyectos by convocatoria"
        );
      }
    },
    {
      params: t.Object({
        nombre: t.String(),
      }),
      response: t.Array(ProyectoSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Get proyectos filtered by convocatoria name",
      },
    }
  )

  // SEARCH BY NAME - GET /proyectos/search?name=value
  .get(
    "/search",
    async ({ query: { name } }) => {
      try {
        return await ProyectoModel.searchByName(name);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error searching proyectos: ${error.message}`);
        }
        throw new Error("Unknown error occurred while searching proyectos");
      }
    },
    {
      query: t.Object({
        name: t.String(),
      }),
      response: t.Array(ProyectoSchema),
      detail: {
        tags: ["Proyectos"],
        description: "Search proyectos by name",
      },
    }
  )

  // UPDATE - PUT /proyectos/:id
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
      body: t.Partial(t.Omit(ProyectoSchema, ["id_proyecto"])),
      response: ProyectoSchema,
      detail: {
        tags: ["Proyectos"],
        description: "Update an existing proyecto",
      },
    }
  )

  // CREATE - POST /proyectos
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
      body: t.Omit(ProyectoSchema, ["id_proyecto"]),
      response: ProyectoSchema,
      detail: {
        tags: ["Proyectos"],
        description: "Create a new proyecto",
      },
    }
  )

  // DELETE - DELETE /proyectos/:id
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
