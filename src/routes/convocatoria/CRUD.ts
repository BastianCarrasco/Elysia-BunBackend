import { Elysia, t } from 'elysia';
import { ConvocatoriaModel, ConvocatoriaSchema } from './model';

export const convocatoriaRoutes = new Elysia({ prefix: '/convocatorias' })
  // Obtener todas las convocatorias
  .get('/', async () => {
    return await ConvocatoriaModel.getAll();
  }, {
    detail: {
      tags: ['Convocatorias'],
      description: 'Obtiene todas las convocatorias',
      responses: {
        200: { description: 'Lista de convocatorias obtenida exitosamente' }
      }
    }
  })

  // Obtener una convocatoria por ID
  .get('/:id', async ({ params: { id } }) => {
    const convocatoria = await ConvocatoriaModel.getById(Number(id));
    return convocatoria ?? { error: 'Convocatoria no encontrada', status: 404 };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Convocatorias'],
      description: 'Obtiene una convocatoria específica por ID',
      responses: {
        200: { description: 'Convocatoria encontrada' },
        404: { description: 'Convocatoria no encontrada' }
      }
    }
  })

  // Crear nueva convocatoria
  .post('/', async ({ body, set }) => {
    try {
      const nuevaConvocatoria = await ConvocatoriaModel.create(body);
      set.status = 201;
      return nuevaConvocatoria;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al crear convocatoria',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    body: t.Omit(ConvocatoriaSchema, ['id_convocatoria']),
    detail: {
      tags: ['Convocatorias'],
      description: 'Crea una nueva convocatoria',
      responses: {
        201: { description: 'Convocatoria creada exitosamente' },
        400: { description: 'Datos inválidos' }
      }
    }
  })

  // Actualizar convocatoria (PUT - completo)
  .put('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizada = await ConvocatoriaModel.update(Number(id), body);
      if (!actualizada) {
        set.status = 404;
        return { error: 'Convocatoria no encontrada' };
      }
      return actualizada;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al actualizar convocatoria',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Omit(ConvocatoriaSchema, ['id_convocatoria']),
    detail: {
      tags: ['Convocatorias'],
      description: 'Actualiza completamente una convocatoria',
      responses: {
        200: { description: 'Convocatoria actualizada exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Convocatoria no encontrada' }
      }
    }
  })

  // Actualizar parcialmente convocatoria (PATCH)
  .patch('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizada = await ConvocatoriaModel.update(Number(id), body);
      if (!actualizada) {
        set.status = 404;
        return { error: 'Convocatoria no encontrada' };
      }
      return actualizada;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al actualizar convocatoria',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Omit(ConvocatoriaSchema, ['id_convocatoria'])),
    detail: {
      tags: ['Convocatorias'],
      description: 'Actualiza parcialmente una convocatoria',
      responses: {
        200: { description: 'Convocatoria actualizada exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Convocatoria no encontrada' }
      }
    }
  })

  // Eliminar convocatoria
  .delete('/:id', async ({ params: { id }, set }) => {
    const eliminada = await ConvocatoriaModel.delete(Number(id));
    if (!eliminada) {
      set.status = 404;
      return { error: 'Convocatoria no encontrada' };
    }
    return { success: true, message: 'Convocatoria eliminada correctamente' };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Convocatorias'],
      description: 'Elimina una convocatoria',
      responses: {
        200: { description: 'Convocatoria eliminada exitosamente' },
        404: { description: 'Convocatoria no encontrada' }
      }
    }
  })

  // Búsqueda por nombre
  .get('/buscar/nombre/:nombre', async ({ params: { nombre } }) => {
    const resultados = await ConvocatoriaModel.searchByName(nombre);
    return resultados.length > 0 
      ? resultados 
      : { message: 'No se encontraron convocatorias con ese nombre' };
  }, {
    params: t.Object({ nombre: t.String() }),
    detail: {
      tags: ['Convocatorias'],
      description: 'Busca convocatorias por nombre',
      responses: {
        200: { description: 'Resultados de búsqueda' }
      }
    }
  })

  // Obtener por tipo
  .get('/tipo/:tipo', async ({ params: { tipo } }) => {
    const resultados = await ConvocatoriaModel.getByType(Number(tipo));
    return resultados.length > 0 
      ? resultados 
      : { message: 'No se encontraron convocatorias de ese tipo' };
  }, {
    params: t.Object({ tipo: t.Numeric() }),
    detail: {
      tags: ['Convocatorias'],
      description: 'Obtiene convocatorias por tipo',
      responses: {
        200: { description: 'Resultados obtenidos' }
      }
    }
  })

  // Obtener por institución
  .get('/institucion/:institucion', async ({ params: { institucion } }) => {
    const resultados = await ConvocatoriaModel.getByInstitution(Number(institucion));
    return resultados.length > 0 
      ? resultados 
      : { message: 'No se encontraron convocatorias para esa institución' };
  }, {
    params: t.Object({ institucion: t.Numeric() }),
    detail: {
      tags: ['Convocatorias'],
      description: 'Obtiene convocatorias por institución',
      responses: {
        200: { description: 'Resultados obtenidos' }
      }
    }
  });