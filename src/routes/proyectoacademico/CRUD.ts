import { Elysia, t } from "elysia";
import { ProyectoacademicoModel, ProyectoacademicoSchema } from "./model";

export const proyectoacademicoRoutes = new Elysia({
  prefix: "/proyectoacademico",
})
  // CREATE - POST /proyectoacademico
  .post(
    "/",
    async ({ body }) => {
      try {
        const newProyectoacademico = await ProyectoacademicoModel.create(body);
        return newProyectoacademico;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating proyectoacademico: ${error.message}`);
        }
        throw new Error(
          "Unknown error occurred while creating proyectoacademico"
        );
      }
    },
    {
      body: t.Omit(ProyectoacademicoSchema, ["id"]),
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Create a new proyectoacademico relationship",
      },
    }
  )

  // READ ALL - GET /proyectoacademico
  .get(
    "/",
    async () => {
      try {
        return await ProyectoacademicoModel.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error getting proyectoacademico relationships: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while getting proyectoacademico relationships"
        );
      }
    },
    {
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Get all proyectoacademico relationships",
      },
    }
  )

  // READ ONE - GET /proyectoacademico/:id
  .get(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const proyectoacademico = await ProyectoacademicoModel.getById(
          Number(id)
        );
        if (!proyectoacademico) {
          throw new Error("Proyectoacademico relationship not found");
        }
        return proyectoacademico;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error getting proyectoacademico relationship: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while getting proyectoacademico relationship"
        );
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Get a specific proyectoacademico relationship by ID",
      },
    }
  )

  // READ BY PROJECT - GET /proyectoacademico/project/:projectId
  .get(
    "/project/:projectId",
    async ({ params: { projectId } }) => {
      try {
        const relaciones = await ProyectoacademicoModel.getByProjectId(
          Number(projectId)
        );
        return relaciones;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error getting proyectoacademico relationships by project: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while getting proyectoacademico relationships by project"
        );
      }
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Get proyectoacademico relationships by project ID",
      },
    }
  )

  // READ BY ACADEMICO - GET /proyectoacademico/academico/:academicoId
  .get(
    "/academico/:academicoId",
    async ({ params: { academicoId } }) => {
      try {
        const relaciones = await ProyectoacademicoModel.getByAcademicoId(
          Number(academicoId)
        );
        return relaciones;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error getting proyectoacademico relationships by academico: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while getting proyectoacademico relationships by academico"
        );
      }
    },
    {
      params: t.Object({
        academicoId: t.Numeric(),
      }),
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Get proyectoacademico relationships by academico ID",
      },
    }
  )

  // READ JEFES - GET /proyectoacademico/jefes
  .get(
    "/jefes",
    async () => {
      try {
        return await ProyectoacademicoModel.getJefes();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting jefes: ${error.message}`);
        }
        throw new Error("Unknown error occurred while getting jefes");
      }
    },
    {
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Get all project leaders (jefes)",
      },
    }
  )

  // UPDATE - PUT /proyectoacademico/:id
  .put(
    "/:id",
    async ({ params: { id }, body }) => {
      try {
        const updatedProyectoacademico = await ProyectoacademicoModel.update(
          Number(id),
          body
        );
        if (!updatedProyectoacademico) {
          throw new Error("Proyectoacademico relationship not found");
        }
        return updatedProyectoacademico;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error updating proyectoacademico relationship: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while updating proyectoacademico relationship"
        );
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Partial(t.Omit(ProyectoacademicoSchema, ["id"])),
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Update a proyectoacademico relationship by ID",
      },
    }
  )

  // DELETE - DELETE /proyectoacademico/:id
  .delete(
    "/:id",
    async ({ params: { id } }) => {
      try {
        const success = await ProyectoacademicoModel.delete(Number(id));
        if (!success) {
          throw new Error("Proyectoacademico relationship not found");
        }
        return {
          message: "Proyectoacademico relationship deleted successfully",
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error deleting proyectoacademico relationship: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while deleting proyectoacademico relationship"
        );
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Delete a proyectoacademico relationship by ID",
      },
    }
  )

  // DELETE BY PROJECT - DELETE /proyectoacademico/project/:projectId
  .delete(
    "/project/:projectId",
    async ({ params: { projectId } }) => {
      try {
        const success = await ProyectoacademicoModel.deleteByProjectId(
          Number(projectId)
        );
        if (!success) {
          throw new Error(
            "No proyectoacademico relationships found for this project"
          );
        }
        return {
          message: "Proyectoacademico relationships deleted successfully",
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error deleting proyectoacademico relationships: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while deleting proyectoacademico relationships"
        );
      }
    },
    {
      params: t.Object({
        projectId: t.Numeric(),
      }),
      detail: {
        tags: ["ProyectoAcademico"],
        description: "Delete all proyectoacademico relationships for a project",
      },
    }
  )

  // DELETE BY ACADEMICO - DELETE /proyectoacademico/academico/:academicoId
  .delete(
    "/academico/:academicoId",
    async ({ params: { academicoId } }) => {
      try {
        const success = await ProyectoacademicoModel.deleteByAcademicoId(
          Number(academicoId)
        );
        if (!success) {
          throw new Error(
            "No proyectoacademico relationships found for this academico"
          );
        }
        return {
          message: "Proyectoacademico relationships deleted successfully",
        };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(
            `Error deleting proyectoacademico relationships: ${error.message}`
          );
        }
        throw new Error(
          "Unknown error occurred while deleting proyectoacademico relationships"
        );
      }
    },
    {
      params: t.Object({
        academicoId: t.Numeric(),
      }),
      detail: {
        tags: ["ProyectoAcademico"],
        description:
          "Delete all proyectoacademico relationships for an academico",
      },
    }
  );
