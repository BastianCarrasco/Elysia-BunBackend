import { Elysia, t } from "elysia";
import { TematicaModel, TematicaSchema } from "./model";

export const tematicaRoutes = new Elysia({ prefix: "/tematicas" })
  // CREATE - POST /tematicas
  .post(
    "/",
    async ({ body }) => {
      try {
        const newTematica = await TematicaModel.create(body);
        return newTematica;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating tematica: ${error.message}`);
        }
        throw new Error("Unknown error occurred while creating tematica");
      }
    },
    {
      body: t.Omit(TematicaSchema, ["id_tematica"]),
      detail: {
        tags: ["Tematicas"],
        description: "Create a new tematica",
      },
    }
  )

  // READ ALL - GET /tematicas
  .get(
    "/",
    async () => {
      try {
        return await TematicaModel.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting tematicas: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting tematicas");
      }
    },
    {
      detail: {
        tags: ["Tematicas"],
        description: "Get all tematicas",
      },
    }
  )

  // READ ONE - GET /tematicas/:id
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const tematica = await TematicaModel.getById(Number(id));
        if (!tematica) {
          throw new Error("Tematica not found");
        }
        return tematica;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting tematica: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting tematica");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Tematicas"],
        description: "Get a specific tematica by ID",
      },
    }
  )

  // SEARCH - GET /tematicas/search?name=value
  .get(
    "/search",
    async ({ query: { name } }) => {
      try {
        return await TematicaModel.searchByName(name);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error searching tematicas: ${error.message}`);
        }
        throw new Error("Unknown error occurred while searching tematicas");
      }
    },
    {
      query: t.Object({
        name: t.String(),
      }),
      detail: {
        tags: ["Tematicas"],
        description: "Search tematicas by name",
      },
    }
  )

  // UPDATE - PUT /tematicas/:id
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        const updatedTematica = await TematicaModel.update(Number(id), body);
        if (!updatedTematica) {
          throw new Error("Tematica not found");
        }
        return updatedTematica;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error updating tematica: ${error.message}`);
        }
        throw new Error("Unknown error occurred while updating tematica");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Partial(t.Omit(TematicaSchema, ["id_tematica"])),
      detail: {
        tags: ["Tematicas"],
        description: "Update a tematica by ID",
      },
    }
  )

  // DELETE - DELETE /tematicas/:id
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const success = await TematicaModel.delete(Number(id));
        if (!success) {
          throw new Error("Tematica not found");
        }
        return { message: "Tematica deleted successfully" };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error deleting tematica: ${error.message}`);
        }
        throw new Error("Unknown error occurred while deleting tematica");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["Tematicas"],
        description: "Delete a tematica by ID",
      },
    }
  );
