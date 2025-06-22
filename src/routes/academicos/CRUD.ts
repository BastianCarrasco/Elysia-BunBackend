import { Elysia, t } from "elysia";
import {
  AcademicoModel,
  AcademicoSchema,
  FotoAcademicoSchema, // Importa el nuevo esquema de FotoAcademico
} from "./model"; // Asegúrate de que el path sea correcto a tu archivo model.ts

export const academicosRoutes = new Elysia({ prefix: "/academicos" })
  // === Rutas para Académicos ===

  // Obtener todos los académicos
  .get(
    "/",
    async () => {
      return await AcademicoModel.getAll();
    },
    {
      detail: {
        tags: ["Académicos"],
        description: "Obtiene todos los registros académicos",
        responses: {
          200: { description: "Lista de académicos obtenida exitosamente" },
        },
      },
    }
  )

  // Obtener un académico por ID
  .get(
    "/:id",
    async ({ params: { id }, set }) => {
      const academico = await AcademicoModel.getById(Number(id));
      if (!academico) {
        set.status = 404;
        return { error: "Académico no encontrado" };
      }
      return academico;
    },
    {
      params: t.Object({ id: t.Numeric() }),
      detail: {
        tags: ["Académicos"],
        description: "Obtiene un académico específico por ID",
        responses: {
          200: { description: "Académico encontrado" },
          404: { description: "Académico no encontrado" },
        },
      },
    }
  )

  .get(
    "/fotos-global", // Puedes elegir un path diferente, por ejemplo, '/all-fotos'
    async () => {
      return await AcademicoModel.getAllFotos();
    },
    {
      detail: {
        tags: ["Fotos de Académicos"],
        description:
          "Obtiene todas las fotos de todos los académicos. ¡Advertencia: puede devolver una gran cantidad de datos!",
        responses: {
          200: {
            description: "Lista de todas las fotos obtenida exitosamente",
          },
        },
      },
    }
  )

  // Crear nuevo académico
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const nuevoAcademico = await AcademicoModel.create(body);
        set.status = 201;
        return nuevoAcademico;
      } catch (error) {
        set.status = 400;
        return {
          error: "Error al insertar académico",
          details: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    {
      body: t.Omit(AcademicoSchema, ["id_academico"]),
      detail: {
        tags: ["Académicos"],
        description: "Crea un nuevo registro académico",
        responses: {
          201: { description: "Académico creado exitosamente" },
          400: { description: "Datos inválidos" },
        },
      },
    }
  )

  // Actualizar académico (PUT - completo)
  .put(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        const actualizado = await AcademicoModel.update(Number(id), body);
        if (!actualizado) {
          set.status = 404;
          return { error: "Académico no encontrado" };
        }
        return actualizado;
      } catch (error) {
        set.status = 400;
        return {
          error: "Error al actualizar académico",
          details: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Omit(AcademicoSchema, ["id_academico"]),
      detail: {
        tags: ["Académicos"],
        description: "Actualiza completamente un académico",
        responses: {
          200: { description: "Académico actualizado exitosamente" },
          400: { description: "Datos inválidos" },
          404: { description: "Académico no encontrado" },
        },
      },
    }
  )

  // Actualizar parcialmente académico (PATCH)
  .patch(
    "/:id",
    async ({ params: { id }, body, set }) => {
      try {
        const actualizado = await AcademicoModel.update(Number(id), body);
        if (!actualizado) {
          set.status = 404;
          return { error: "Académico no encontrado" };
        }
        return actualizado;
      } catch (error) {
        set.status = 400;
        return {
          error: "Error al actualizar académico",
          details: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      body: t.Partial(t.Omit(AcademicoSchema, ["id_academico"])),
      detail: {
        tags: ["Académicos"],
        description: "Actualiza parcialmente un académico",
        responses: {
          200: { description: "Académico actualizado exitosamente" },
          400: { description: "Datos inválidos" },
          404: { description: "Académico no encontrado" },
        },
      },
    }
  )

  // Eliminar académico
  .delete(
    "/:id",
    async ({ params: { id }, set }) => {
      const eliminado = await AcademicoModel.delete(Number(id));
      if (!eliminado) {
        set.status = 404;
        return { error: "Académico no encontrado" };
      }
      set.status = 200; // Opcional: indicar 204 No Content si no se devuelve cuerpo
      return { success: true, message: "Académico eliminado correctamente" };
    },
    {
      params: t.Object({ id: t.Numeric() }),
      detail: {
        tags: ["Académicos"],
        description: "Elimina un académico",
        responses: {
          200: { description: "Académico eliminado exitosamente" },
          404: { description: "Académico no encontrado" },
        },
      },
    }
  )

  // Búsqueda de académicos (opcional)
  .get(
    "/buscar/:termino",
    async ({ params: { termino } }) => {
      const resultados = await AcademicoModel.searchByName(termino);
      return resultados.length > 0
        ? resultados
        : { message: "No se encontraron académicos con ese criterio" };
    },
    {
      params: t.Object({ termino: t.String() }),
      detail: {
        tags: ["Académicos"],
        description: "Busca académicos por nombre o apellido",
        responses: {
          200: { description: "Resultados de búsqueda" },
        },
      },
    }
  )

  // === Rutas para Fotos de Académicos ===
  // Nota: Estas rutas están anidadas bajo /academicos/:id

  // Obtener todas las fotos de un académico
  .get(
    "/:id/fotos",
    async ({ params: { id }, set }) => {
      const id_academico = Number(id);
      const academicoExiste = await AcademicoModel.getById(id_academico);
      if (!academicoExiste) {
        set.status = 404;
        return { error: "Académico no encontrado" };
      }

      const fotos = await AcademicoModel.getFotosByAcademicoId(id_academico);
      return fotos;
    },
    {
      params: t.Object({ id: t.Numeric() }),
      detail: {
        tags: ["Fotos de Académicos"],
        description: "Obtiene todas las fotos de un académico específico",
        responses: {
          200: { description: "Lista de fotos obtenida exitosamente" },
          404: { description: "Académico no encontrado" },
        },
      },
    }
  )

  // Obtener una foto específica de un académico (por id_imagen)
  .get(
    "/:id/fotos/:fotoId",
    async ({ params: { id, fotoId }, set }) => {
      const id_academico = Number(id);
      const id_imagen = Number(fotoId);

      const academicoExiste = await AcademicoModel.getById(id_academico);
      if (!academicoExiste) {
        set.status = 404;
        return { error: "Académico no encontrado" };
      }

      const foto = await AcademicoModel.getFotoById(id_imagen);

      // Verificamos que la foto exista y pertenezca a este académico
      if (!foto || foto.id_academico !== id_academico) {
        set.status = 404;
        return { error: "Foto no encontrada para este académico" };
      }
      return foto;
    },
    {
      params: t.Object({
        id: t.Numeric(),
        fotoId: t.Numeric(),
      }),
      detail: {
        tags: ["Fotos de Académicos"],
        description:
          "Obtiene una foto específica de un académico por su ID de foto",
        responses: {
          200: { description: "Foto encontrada" },
          404: { description: "Académico o foto no encontrada" },
        },
      },
    }
  )

  // Añadir una nueva foto a un académico
  .post(
    "/:id/fotos",
    async ({ params: { id }, body, set }) => {
      const id_academico = Number(id);
      const academicoExiste = await AcademicoModel.getById(id_academico);
      if (!academicoExiste) {
        set.status = 404;
        return { error: "Académico no encontrado" };
      }

      try {
        const nuevaFoto = await AcademicoModel.createFoto({
          id_academico,
          // Asegúrate de que 'body' contenga 'foto' (Buffer o null) y 'link' (string o null)
          // Usamos 'body' directamente, que ya fue validado por Elysia en 'body: FotoAcademicoSchema.omit...'
          foto: body.foto || null,
          link: body.link || null,
        });
        set.status = 201;
        return nuevaFoto;
      } catch (error) {
        console.error("Error al añadir foto:", error);
        set.status = 400;
        return {
          error: "Error al añadir foto al académico",
          details: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    {
      params: t.Object({ id: t.Numeric() }),
      // t.Partial para permitir que uno de los campos (foto o link) sea opcional
      body: t.Partial(t.Omit(FotoAcademicoSchema, ["id_academico"])),
      detail: {
        tags: ["Fotos de Académicos"],
        description: "Añade una nueva foto a un académico",
        responses: {
          201: { description: "Foto añadida exitosamente" },
          400: { description: "Datos inválidos" },
          404: { description: "Académico no encontrado" },
        },
      },
    }
  )

  // Actualizar una foto de un académico (parcialmente)
  .patch(
    "/:id/fotos/:fotoId",
    async ({ params: { id, fotoId }, body, set }) => {
      const id_academico = Number(id);
      const id_imagen = Number(fotoId);

      const academicoExiste = await AcademicoModel.getById(id_academico);
      if (!academicoExiste) {
        set.status = 404;
        return { error: "Académico no encontrado" };
      }

      const fotoExistente = await AcademicoModel.getFotoById(id_imagen);
      // Verificamos que la foto exista y pertenezca al académico correcto
      if (!fotoExistente || fotoExistente.id_academico !== id_academico) {
        set.status = 404;
        return { error: "Foto no encontrada para este académico" };
      }

      try {
        const actualizado = await AcademicoModel.updateFoto(id_imagen, body);
        if (!actualizado) {
          // Esto no debería ocurrir si fotoExistente fue encontrado
          set.status = 500;
          return { error: "Error inesperado al actualizar foto" };
        }
        return actualizado;
      } catch (error) {
        set.status = 400;
        return {
          error: "Error al actualizar foto",
          details: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
        fotoId: t.Numeric(),
      }),
      body: t.Partial(
        t.Omit(FotoAcademicoSchema, ["id_academico", "id_imagen"])
      ),
      detail: {
        tags: ["Fotos de Académicos"],
        description: "Actualiza parcialmente una foto de un académico",
        responses: {
          200: { description: "Foto actualizada exitosamente" },
          400: { description: "Datos inválidos" },
          404: { description: "Académico o foto no encontrada" },
        },
      },
    }
  )

  // Eliminar una foto de un académico
  .delete(
    "/:id/fotos/:fotoId",
    async ({ params: { id, fotoId }, set }) => {
      const id_academico = Number(id);
      const id_imagen = Number(fotoId);

      const academicoExiste = await AcademicoModel.getById(id_academico);
      if (!academicoExiste) {
        set.status = 404;
        return { error: "Académico no encontrado" };
      }

      const fotoExistente = await AcademicoModel.getFotoById(id_imagen);
      // Verificamos que la foto exista y pertenezca al académico correcto
      if (!fotoExistente || fotoExistente.id_academico !== id_academico) {
        set.status = 404;
        return { error: "Foto no encontrada para este académico" };
      }

      const eliminado = await AcademicoModel.deleteFoto(id_imagen);
      if (!eliminado) {
        // Esto no debería ocurrir si la fotoExistente fue encontrada y validada
        set.status = 500;
        return { error: "Error inesperado al eliminar foto" };
      }
      set.status = 200; // Opcional: 204 No Content
      return { success: true, message: "Foto eliminada correctamente" };
    },
    {
      params: t.Object({
        id: t.Numeric(),
        fotoId: t.Numeric(),
      }),
      detail: {
        tags: ["Fotos de Académicos"],
        description: "Elimina una foto específica de un académico",
        responses: {
          200: { description: "Foto eliminada exitosamente" },
          404: { description: "Académico o foto no encontrada" },
        },
      },
    }
  );
