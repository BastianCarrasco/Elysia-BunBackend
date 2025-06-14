import { Elysia, t } from "elysia";
import { KTHModel, KTHSchema } from "./model";

export const kthRoutes = new Elysia({ prefix: "/kth" })
  // CREATE - POST /kth
  .post(
    "/",
    async ({ body }) => {
      try {
        const newKTH = await KTHModel.create(body);
        return newKTH;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating KTH: ${error.message}`);
        }
        throw new Error("Unknown error occurred while creating KTH");
      }
    },
    {
      body: t.Omit(KTHSchema, ["id_kth"]),
      detail: {
        tags: ["KTH"],
        description: "Create a new KTH entry",
      },
    }
  )

  // READ ALL - GET /kth
  .get(
    "/",
    async () => {
      try {
        return await KTHModel.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting KTH entries: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting KTH entries");
      }
    },
    {
      detail: {
        tags: ["KTH"],
        description: "Get all KTH entries",
      },
    }
  )

  // READ ONE - GET /kth/:id
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const kth = await KTHModel.getById(Number(id));
        if (!kth) {
          throw new Error("KTH entry not found");
        }
        return kth;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting KTH entry: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting KTH entry");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["KTH"],
        description: "Get a specific KTH entry by ID",
      },
    }
  )

  // READ by Project ID - GET /kth/project/:projectId
  .get(
    "/project/:projectId",
    async ({ params: { projectId } }) => {
      try {
        const kth = await KTHModel.getByProjectId(Number(projectId));
        if (!kth) {
          throw new Error("KTH entry not found for this project");
        }
        return kth;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting KTH entry: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting KTH entry");
      }
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      detail: {
        tags: ["KTH"],
        description: "Get KTH entry by project ID",
      },
    }
  )

  // UPDATE - PUT /kth/:id
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        const updatedKTH = await KTHModel.update(Number(id), body);
        if (!updatedKTH) {
          throw new Error("KTH entry not found");
        }
        return updatedKTH;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error updating KTH entry: ${error.message}`);
        }
        throw new Error("Unknown error occurred while updating KTH entry");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Partial(t.Omit(KTHSchema, ["id_kth"])),
      detail: {
        tags: ["KTH"],
        description: "Update a KTH entry by ID",
      },
    }
  )

  // DELETE - DELETE /kth/:id
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const success = await KTHModel.delete(Number(id));
        if (!success) {
          throw new Error("KTH entry not found");
        }
        return { message: "KTH entry deleted successfully" };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error deleting KTH entry: ${error.message}`);
        }
        throw new Error("Unknown error occurred while deleting KTH entry");
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["KTH"],
        description: "Delete a KTH entry by ID",
      },
    }
  );

// DELETE by Project ID - DELETE /kth/project/:projectIdP
//   .delete(
//     "/project/:projectId",
//     async ({ params: { projectId } }) => {
//       try {
//         const success = await KTHModel.deleteByProjectId(Number(projectId));
//         if (!success) {
//           throw new Error("KTH entry not found for this project");
//         }
//         return { message: "KTH entry deleted successfully" };
//       } catch (error) {
//         if (error instanceof Error) {
//           throw new Error(`Error deleting KTH entry: ${error.message}`);
//         }
//         throw new Error("Unknown error occurred while deleting KTH entry");
//       }
//     },
//     {
//       params: t.Object({
//         projectId: t.Numeric(),
//       }),
//       detail: {
//         tags: ["KTH"],
//         description: "Delete KTH entry by project ID",
//       },
//     }
//   );
