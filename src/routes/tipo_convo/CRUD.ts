import { Elysia, t } from "elysia";
import { TipoConvoModel, TipoConvoSchema } from "./model";

export const tipoConvoRoutes = new Elysia({ prefix: "/tipo-convo" })
  // CREATE - POST /tipo-convo
  .post(
    "/",
    async ({ body }) => {
      try {
        const newTipoConvo = await TipoConvoModel.create(body);
        return newTipoConvo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating tipo convo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while creating tipo convo");
      }
    },
    {
      body: t.Omit(TipoConvoSchema, ["id"]),
      detail: {
        tags: ["TipoConvo"],
        description: "Create a new tipo convo",
      },
    }
  )

  // READ ALL - GET /tipo-convo
  .get(
    "/",
    async () => {
      try {
        return await TipoConvoModel.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting tipo convos: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting tipo convos");
      }
    },
    {
      detail: {
        tags: ["TipoConvo"],
        description: "Get all tipo convos",
      },
    }
  )

  // READ ONE - GET /tipo-convo/:id
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const tipoConvo = await TipoConvoModel.getById(Number(id));
        if (!tipoConvo) {
          throw new Error("Tipo convo not found");
        }
        return tipoConvo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting tipo convo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting tipo convo");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["TipoConvo"],
        description: "Get a specific tipo convo by ID",
      },
    }
  )

  // SEARCH - GET /tipo-convo/search?name=value
  .get(
    "/search",
    async ({ query: { name } }) => {
      try {
        return await TipoConvoModel.searchByName(name);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error searching tipo convos: ${error.message}`);
        }
        throw new Error("Unknown error occurred while searching tipo convos");
      }
    },
    {
      query: t.Object({
        name: t.String(),
      }),
      detail: {
        tags: ["TipoConvo"],
        description: "Search tipo convos by name",
      },
    }
  )

  // UPDATE - PUT /tipo-convo/:id
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        const updatedTipoConvo = await TipoConvoModel.update(Number(id), body);
        if (!updatedTipoConvo) {
          throw new Error("Tipo convo not found");
        }
        return updatedTipoConvo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error updating tipo convo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while updating tipo convo");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Partial(t.Omit(TipoConvoSchema, ["id"])),
      detail: {
        tags: ["TipoConvo"],
        description: "Update a tipo convo by ID",
      },
    }
  )

  // DELETE - DELETE /tipo-convo/:id
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const success = await TipoConvoModel.delete(Number(id));
        if (!success) {
          throw new Error("Tipo convo not found");
        }
        return { message: "Tipo convo deleted successfully" };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error deleting tipo convo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while deleting tipo convo");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["TipoConvo"],
        description: "Delete a tipo convo by ID",
      },
    }
  );
