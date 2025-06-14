import { Elysia, t } from "elysia";
import { TipoApoyoModel, TipoApoyoSchema } from "./model";

export const tipoApoyoRoutes = new Elysia({ prefix: "/tipo-apoyo" })
  // CREATE - POST /tipo-apoyo
  .post(
    "/",
    async ({ body }) => {
      try {
        const newTipoApoyo = await TipoApoyoModel.create(body);
        return newTipoApoyo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating tipo apoyo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while creating tipo apoyo");
      }
    },
    {
      body: t.Omit(TipoApoyoSchema, ["id_tipo_apoyo"]),
      detail: {
        tags: ["TipoApoyo"],
        description: "Create a new tipo apoyo",
      },
    }
  )

  // READ ALL - GET /tipo-apoyo
  .get(
    "/",
    async () => {
      try {
        return await TipoApoyoModel.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting tipos apoyo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting tipos apoyo");
      }
    },
    {
      detail: {
        tags: ["TipoApoyo"],
        description: "Get all tipos apoyo",
      },
    }
  )

  // READ ONE - GET /tipo-apoyo/:id
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const tipoApoyo = await TipoApoyoModel.getById(Number(id));
        if (!tipoApoyo) {
          throw new Error("Tipo apoyo not found");
        }
        return tipoApoyo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting tipo apoyo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting tipo apoyo");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["TipoApoyo"],
        description: "Get a specific tipo apoyo by ID",
      },
    }
  )

  // SEARCH - GET /tipo-apoyo/search?tipo=value
  .get(
    "/search",
    async ({ query: { tipo } }) => {
      try {
        return await TipoApoyoModel.searchByTipo(tipo);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error searching tipos apoyo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while searching tipos apoyo");
      }
    },
    {
      query: t.Object({
        tipo: t.String(),
      }),
      detail: {
        tags: ["TipoApoyo"],
        description: "Search tipos apoyo by tipo",
      },
    }
  )

  // UPDATE - PUT /tipo-apoyo/:id
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        const updatedTipoApoyo = await TipoApoyoModel.update(Number(id), body);
        if (!updatedTipoApoyo) {
          throw new Error("Tipo apoyo not found");
        }
        return updatedTipoApoyo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error updating tipo apoyo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while updating tipo apoyo");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Partial(t.Omit(TipoApoyoSchema, ["id_tipo_apoyo"])),
      detail: {
        tags: ["TipoApoyo"],
        description: "Update a tipo apoyo by ID",
      },
    }
  )

  // DELETE - DELETE /tipo-apoyo/:id
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const success = await TipoApoyoModel.delete(Number(id));
        if (!success) {
          throw new Error("Tipo apoyo not found");
        }
        return { message: "Tipo apoyo deleted successfully" };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error deleting tipo apoyo: ${error.message}`);
        }
        throw new Error("Unknown error occurred while deleting tipo apoyo");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["TipoApoyo"],
        description: "Delete a tipo apoyo by ID",
      },
    }
  );
