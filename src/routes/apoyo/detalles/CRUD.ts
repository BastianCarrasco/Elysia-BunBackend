import { Elysia, t } from 'elysia';
import { TagSchema, TagModel } from './model';

export const tagRoutes = new Elysia({ prefix: '/tags' })
  // CREATE
  .post(
    '/',
    async ({ body }) => {
      const newTag = await TagModel.create(body);
      return newTag;
    },
    {
      body: t.Omit(TagSchema, ['id_apoyo']),
      response: TagSchema,
      detail: {
        tags: ['Tags'],
        description: 'Crear un nuevo tag'
      }
    }
  )

  // READ ALL
  .get(
    '/',
    async () => {
      const tags = await TagModel.getAll();
      return tags;
    },
    {
      response: t.Array(TagSchema),
      detail: {
        tags: ['Tags'],
        description: 'Obtener todos los tags'
      }
    }
  )

  // READ ONE
  .get(
    '/:id',
    async ({ params: { id } }) => {
      const tag = await TagModel.getById(Number(id));
      if (!tag) {
        throw new Error('Tag no encontrado');
      }
      return tag;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: TagSchema,
      detail: {
        tags: ['Tags'],
        description: 'Obtener un tag por ID'
      }
    }
  )

  // UPDATE
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      const updatedTag = await TagModel.update(Number(id), body);
      if (!updatedTag) {
        throw new Error('Tag no encontrado');
      }
      return updatedTag;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      body: t.Partial(t.Omit(TagSchema, ['id_apoyo'])),
      response: TagSchema,
      detail: {
        tags: ['Tags'],
        description: 'Actualizar un tag existente'
      }
    }
  )

  // DELETE
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      const deleted = await TagModel.delete(Number(id));
      if (!deleted) {
        throw new Error('Tag no encontrado');
      }
      return { message: 'Tag eliminado correctamente' };
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: t.Object({
        message: t.String()
      }),
      detail: {
        tags: ['Tags'],
        description: 'Eliminar un tag'
      }
    }
  )

  // SEARCH
  .get(
    '/search/:tag',
    async ({ params: { tag } }) => {
      const tags = await TagModel.searchByTag(tag);
      return tags;
    },
    {
      params: t.Object({
        tag: t.String()
      }),
      response: t.Array(TagSchema),
      detail: {
        tags: ['Tags'],
        description: 'Buscar tags por texto'
      }
    }
  );