import { Elysia, t } from 'elysia';
import { EstatusSchema, EstatusModel } from './model';

export const estatusRoutes = new Elysia({ prefix: '/estatus' })
  // CREATE
  .post(
    '/',
    async ({ body }) => {
      const newEstatus = await EstatusModel.create({
        tipo: body.tipo ?? null  // Manejo explícito de null
      });
      return newEstatus;
    },
    {
      body: t.Object({
        tipo: t.Optional(t.String({ maxLength: 20 }))
      }),
      response: EstatusSchema,
      detail: {
        tags: ['Estatus'],
        description: 'Crear un nuevo estatus'
      }
    }
  )

  // READ ALL
  .get(
    '/',
    async () => {
      const estatusList = await EstatusModel.getAll();
      return estatusList;
    },
    {
      response: t.Array(EstatusSchema),
      detail: {
        tags: ['Estatus'],
        description: 'Obtener todos los estatus'
      }
    }
  )

  // READ ONE
  .get(
    '/:id',
    async ({ params: { id } }) => {
      const estatus = await EstatusModel.getById(Number(id));
      if (!estatus) {
        throw new Error('Estatus no encontrado');
      }
      return estatus;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: EstatusSchema,
      detail: {
        tags: ['Estatus'],
        description: 'Obtener un estatus por ID'
      }
    }
  )

  // UPDATE
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      const updatedEstatus = await EstatusModel.update(Number(id), {
        tipo: body.tipo ?? null  // Manejo explícito de null
      });
      if (!updatedEstatus) {
        throw new Error('Estatus no encontrado');
      }
      return updatedEstatus;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      body: t.Object({
        tipo: t.Optional(t.String({ maxLength: 20 }))
      }),
      response: EstatusSchema,
      detail: {
        tags: ['Estatus'],
        description: 'Actualizar un estatus existente'
      }
    }
  )

  // DELETE
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      const deleted = await EstatusModel.delete(Number(id));
      if (!deleted) {
        throw new Error('Estatus no encontrado');
      }
      return { message: 'Estatus eliminado correctamente' };
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: t.Object({
        message: t.String()
      }),
      detail: {
        tags: ['Estatus'],
        description: 'Eliminar un estatus'
      }
    }
  )

  // SEARCH
  .get(
    '/search/:tipo',
    async ({ params: { tipo } }) => {
      const estatusList = await EstatusModel.searchByType(tipo);
      return estatusList;
    },
    {
      params: t.Object({
        tipo: t.String()
      }),
      response: t.Array(EstatusSchema),
      detail: {
        tags: ['Estatus'],
        description: 'Buscar estatus por tipo'
      }
    }
  );