import { Elysia, t } from 'elysia';
import { InstConvoModel, InstConvoSchema } from './model';

export const instConvoRoutes = new Elysia({ prefix: '/inst-convo' })
  // CREATE
  .post(
    '/',
    async ({ body }) => {
      try {
        const newInstConvo = await InstConvoModel.create(body);
        return newInstConvo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error creating institution: ${error.message}`);
        }
        throw new Error('Unknown error occurred while creating institution');
      }
    },
    {
      body: t.Omit(InstConvoSchema, ['id']),
      detail: {
        tags: ['Institutions'],
        description: 'Create a new institution',
      },
    }
  )

  // READ ALL
  .get(
    '/',
    async () => {
      try {
        return await InstConvoModel.getAll();
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting institutions: ${error.message}`);
        }
        throw new Error('Unknown error occurred while getting institutions');
      }
    },
    {
      detail: {
        tags: ['Institutions'],
        description: 'Get all institutions',
      },
    }
  )

  // READ ONE
  .get(
    '/:id',
    async ({ params: { id } }) => {
      try {
        const instConvo = await InstConvoModel.getById(Number(id));
        if (!instConvo) {
          throw new Error('Institution not found');
        }
        return instConvo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error getting institution: ${error.message}`);
        }
        throw new Error('Unknown error occurred while getting institution');
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ['Institutions'],
        description: 'Get a specific institution by ID',
      },
    }
  )

  // UPDATE
  .put(
    '/:id',
    async ({ params: { id }, body }) => {
      try {
        const updatedInstConvo = await InstConvoModel.update(Number(id), body);
        if (!updatedInstConvo) {
          throw new Error('Institution not found');
        }
        return updatedInstConvo;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error updating institution: ${error.message}`);
        }
        throw new Error('Unknown error occurred while updating institution');
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: t.Partial(t.Omit(InstConvoSchema, ['id'])),
      detail: {
        tags: ['Institutions'],
        description: 'Update an institution by ID',
      },
    }
  )

  // DELETE
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      try {
        const success = await InstConvoModel.delete(Number(id));
        if (!success) {
          throw new Error('Institution not found');
        }
        return { message: 'Institution deleted successfully' };
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error deleting institution: ${error.message}`);
        }
        throw new Error('Unknown error occurred while deleting institution');
      }
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      detail: {
        tags: ['Institutions'],
        description: 'Delete an institution by ID',
      },
    }
  )

  // SEARCH
  .get(
    '/search',
    async ({ query: { nombre } }) => {
      try {
        return await InstConvoModel.searchByName(nombre);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Error searching institutions: ${error.message}`);
        }
        throw new Error('Unknown error occurred while searching institutions');
      }
    },
    {
      query: t.Object({
        nombre: t.String(),
      }),
      detail: {
        tags: ['Institutions'],
        description: 'Search institutions by name',
      },
    }
  );