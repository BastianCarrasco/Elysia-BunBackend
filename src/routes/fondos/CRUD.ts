import { Elysia, t } from 'elysia';
import { FondoModel, FondoSchema } from './model';

export const fondosRoutes = new Elysia({ prefix: '/fondos' })
  // CREATE - POST /fondos
  .post(
    '/',
    async ({ body }) => {
      try {
        const newFondo = await FondoModel.create(body);
        return newFondo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating fondo: ${error.message}`);
        }
        throw new Error('Unknown error occurred while creating fondo');
      }
    },
    {
      body: t.Omit(FondoSchema, ['id']),
      detail: {
        tags: ['Fondos'],
        description: 'Create a new fondo',
      },
    }
  )

  // READ ALL - GET /fondos
  .get(
    '/',
    async () => {
      try {
        return await FondoModel.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting fondos: ${error.message}`);
        }
        throw new Error('Unknown error occurred while getting fondos');
      }
    },
    {
      detail: {
        tags: ['Fondos'],
        description: 'Get all fondos',
      },
    }
  )

  // READ ONE - GET /fondos/:id
  .get(
    '/:id',
    async ({ params: { id } }) => {
      try {
        const fondo = await FondoModel.getById(Number(id));
        if (!fondo) {
          throw new Error('Fondo not found');
        }
        return fondo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting fondo: ${error.message}`);
        }
        throw new Error('Unknown error occurred while getting fondo');
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ['Fondos'],
        description: 'Get a specific fondo by ID',
      },
    }
  )

  // UPDATE - PUT /fondos/:id
  .put(
    '/:id',
    async ({ params: { id }, body }) => {
      try {
        const updatedFondo = await FondoModel.update(Number(id), body);
        if (!updatedFondo) {
          throw new Error('Fondo not found');
        }
        return updatedFondo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error updating fondo: ${error.message}`);
        }
        throw new Error('Unknown error occurred while updating fondo');
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Partial(t.Omit(FondoSchema, ['id'])),
      detail: {
        tags: ['Fondos'],
        description: 'Update a fondo by ID',
      },
    }
  )

  // DELETE - DELETE /fondos/:id
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      try {
        const success = await FondoModel.delete(Number(id));
        if (!success) {
          throw new Error('Fondo not found');
        }
        return { message: 'Fondo deleted successfully' };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error deleting fondo: ${error.message}`);
        }
        throw new Error('Unknown error occurred while deleting fondo');
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ['Fondos'],
        description: 'Delete a fondo by ID',
      },
    }
  )

  // SEARCH - GET /fondos/search?nombre=value
  .get(
    '/search',
    async ({ query: { nombre } }) => {
      try {
        return await FondoModel.searchByName(nombre);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error searching fondos: ${error.message}`);
        }
        throw new Error('Unknown error occurred while searching fondos');
      }
    },
    {
      query: t.Object({
        nombre: t.String(),
      }),
      detail: {
        tags: ['Fondos'],
        description: 'Search fondos by name',
      },
    }
  );