import { Elysia, t } from 'elysia';
import { CuestionarioModel, CuestionarioSchema } from './model';

export const cuestionarioRoutes = new Elysia({ prefix: '/cuestionarios' })
  // CREATE - Crear nuevo cuestionario
  .post(
    '/',
    async ({ body }) => {
      const nuevoCuestionario = await CuestionarioModel.create(body);
      return nuevoCuestionario;
    },
    {
      body: t.Omit(CuestionarioSchema, ['id_cuestionario']),
      response: CuestionarioSchema,
      detail: {
        tags: ['Cuestionarios'],
        description: 'Crear un nuevo cuestionario'
      }
    }
  )

  // READ ALL - Obtener todos los cuestionarios
  .get(
    '/',
    async () => {
      const cuestionarios = await CuestionarioModel.getAll();
      return cuestionarios;
    },
    {
      response: t.Array(CuestionarioSchema),
      detail: {
        tags: ['Cuestionarios'],
        description: 'Obtener todos los cuestionarios'
      }
    }
  )

  // READ ONE - Obtener un cuestionario por ID
  .get(
    '/:id',
    async ({ params: { id } }) => {
      const cuestionario = await CuestionarioModel.getById(Number(id));
      if (!cuestionario) {
        throw new Error('Cuestionario no encontrado');
      }
      return cuestionario;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: CuestionarioSchema,
      detail: {
        tags: ['Cuestionarios'],
        description: 'Obtener un cuestionario por su ID'
      }
    }
  )

  // UPDATE - Actualizar un cuestionario
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      const cuestionarioActualizado = await CuestionarioModel.update(
        Number(id),
        body
      );
      if (!cuestionarioActualizado) {
        throw new Error('Cuestionario no encontrado');
      }
      return cuestionarioActualizado;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      body: t.Partial(t.Omit(CuestionarioSchema, ['id_cuestionario'])),
      response: CuestionarioSchema,
      detail: {
        tags: ['Cuestionarios'],
        description: 'Actualizar un cuestionario existente'
      }
    }
  )

  // DELETE - Eliminar un cuestionario
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      const eliminado = await CuestionarioModel.delete(Number(id));
      if (!eliminado) {
        throw new Error('Cuestionario no encontrado');
      }
      return { message: 'Cuestionario eliminado correctamente' };
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: t.Object({
        message: t.String()
      }),
      detail: {
        tags: ['Cuestionarios'],
        description: 'Eliminar un cuestionario'
      }
    }
  )

  // BÚSQUEDA - Buscar cuestionarios por pregunta
  .get(
    '/buscar/:pregunta',
    async ({ params: { pregunta } }) => {
      const cuestionarios = await CuestionarioModel.searchByQuestion(pregunta);
      return cuestionarios;
    },
    {
      params: t.Object({
        pregunta: t.String()
      }),
      response: t.Array(CuestionarioSchema),
      detail: {
        tags: ['Cuestionarios'],
        description: 'Buscar cuestionarios por texto en la pregunta'
      }
    }
  );