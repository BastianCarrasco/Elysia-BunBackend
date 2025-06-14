import { Elysia, t } from 'elysia';
import { 
  UnidadAcademicaModel, 
  CreateUnidadAcademicaSchema 
} from './model';

export const unidadesRoutes = new Elysia({ prefix: '/unidades' })
  // Crear nueva unidad
  .post('/', async ({ body, set }) => {
    try {
      const nuevaUnidad = await UnidadAcademicaModel.create(body);
      set.status = 201;
      return nuevaUnidad;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al crear unidad académica',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }, {
    body: CreateUnidadAcademicaSchema,
    detail: {
      tags: ['Unidades Académicas'],
      description: 'Crea una nueva unidad académica',
      responses: {
        201: { description: 'Unidad creada exitosamente' },
        400: { description: 'Datos inválidos' }
      }
    }
  })

  // Obtener todas las unidades
  .get('/', async () => {
    return await UnidadAcademicaModel.getAll();
  }, {
    detail: {
      tags: ['Unidades Académicas'],
      description: 'Obtiene todas las unidades académicas',
      responses: {
        200: { description: 'Lista de unidades académicas' }
      }
    }
  })

  // Obtener unidad por ID
  .get('/:id', async ({ params: { id }, set }) => {
    const unidad = await UnidadAcademicaModel.getById(Number(id));
    if (!unidad) {
      set.status = 404;
      return { error: 'Unidad académica no encontrada' };
    }
    return unidad;
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Unidades Académicas'],
      description: 'Obtiene una unidad académica por su ID',
      responses: {
        200: { description: 'Unidad académica encontrada' },
        404: { description: 'Unidad no encontrada' }
      }
    }
  })

  // Actualizar unidad (completo)
  .put('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizada = await UnidadAcademicaModel.update(Number(id), body);
      if (!actualizada) {
        set.status = 404;
        return { error: 'Unidad académica no encontrada' };
      }
      return actualizada;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al actualizar unidad académica',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: CreateUnidadAcademicaSchema,
    detail: {
      tags: ['Unidades Académicas'],
      description: 'Actualiza todos los campos de una unidad académica',
      responses: {
        200: { description: 'Unidad actualizada exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Unidad no encontrada' }
      }
    }
  })

  // Actualizar unidad (parcial)
  .patch('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizada = await UnidadAcademicaModel.update(Number(id), body);
      if (!actualizada) {
        set.status = 404;
        return { error: 'Unidad académica no encontrada' };
      }
      return actualizada;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al actualizar unidad académica',
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(CreateUnidadAcademicaSchema),
    detail: {
      tags: ['Unidades Académicas'],
      description: 'Actualiza campos específicos de una unidad académica',
      responses: {
        200: { description: 'Unidad actualizada exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Unidad no encontrada' }
      }
    }
  })

  // Eliminar unidad
  .delete('/:id', async ({ params: { id }, set }) => {
    const eliminada = await UnidadAcademicaModel.delete(Number(id));
    if (!eliminada) {
      set.status = 404;
      return { error: 'Unidad académica no encontrada' };
    }
    return { success: true };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Unidades Académicas'],
      description: 'Elimina una unidad académica',
      responses: {
        200: { description: 'Unidad eliminada exitosamente' },
        404: { description: 'Unidad no encontrada' }
      }
    }
  })

  // Búsqueda por nombre (opcional)
  .get('/buscar/:nombre', async ({ params: { nombre } }) => {
    return await UnidadAcademicaModel.searchByName(nombre);
  }, {
    params: t.Object({ nombre: t.String() }),
    detail: {
      tags: ['Unidades Académicas'],
      description: 'Busca unidades académicas por nombre',
      responses: {
        200: { description: 'Resultados de búsqueda' }
      }
    }
  });