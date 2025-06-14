import { Elysia, t } from 'elysia';
import { ApoyoModel, ApoyoSchema } from './model';

export const apoyoRoutes = new Elysia({ prefix: '/apoyos' })
  // Obtener todos los apoyos
  .get('/', async () => {
    return await ApoyoModel.getAll();
  }, {
    detail: {
      tags: ['Apoyos'],
      description: 'Obtiene todos los registros de apoyo',
      responses: {
        200: { description: 'Lista de apoyos obtenida exitosamente' }
      }
    }
  })

  // Obtener un apoyo por ID
  .get('/:id', async ({ params: { id } }) => {
    const apoyo = await ApoyoModel.getById(Number(id));
    return apoyo ?? { error: 'Apoyo no encontrado', status: 404 };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Apoyos'],
      description: 'Obtiene un apoyo específico por ID',
      responses: {
        200: { description: 'Apoyo encontrado' },
        404: { description: 'Apoyo no encontrado' }
      }
    }
  })

  // Crear nuevo apoyo
  .post('/', async ({ body, set }) => {
    try {
      const nuevoApoyo = await ApoyoModel.create(body);
      set.status = 201;
      return nuevoApoyo;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al insertar apoyo',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    body: t.Omit(ApoyoSchema, ['id_apoyo']),
    detail: {
      tags: ['Apoyos'],
      description: 'Crea un nuevo registro de apoyo',
      responses: {
        201: { description: 'Apoyo creado exitosamente' },
        400: { description: 'Datos inválidos' }
      }
    }
  })

  // Actualizar apoyo (PUT - completo)
  .put('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizado = await ApoyoModel.update(Number(id), body);
      if (!actualizado) {
        set.status = 404;
        return { error: 'Apoyo no encontrado' };
      }
      return actualizado;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al actualizar apoyo',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Omit(ApoyoSchema, ['id_apoyo']),
    detail: {
      tags: ['Apoyos'],
      description: 'Actualiza completamente un apoyo',
      responses: {
        200: { description: 'Apoyo actualizado exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Apoyo no encontrado' }
      }
    }
  })

  // Actualizar parcialmente apoyo (PATCH)
  .patch('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizado = await ApoyoModel.update(Number(id), body);
      if (!actualizado) {
        set.status = 404;
        return { error: 'Apoyo no encontrado' };
      }
      return actualizado;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al actualizar apoyo',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Omit(ApoyoSchema, ['id_apoyo'])),
    detail: {
      tags: ['Apoyos'],
      description: 'Actualiza parcialmente un apoyo',
      responses: {
        200: { description: 'Apoyo actualizado exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Apoyo no encontrado' }
      }
    }
  })

  // Eliminar apoyo
  .delete('/:id', async ({ params: { id }, set }) => {
    const eliminado = await ApoyoModel.delete(Number(id));
    if (!eliminado) {
      set.status = 404;
      return { error: 'Apoyo no encontrado' };
    }
    return { success: true, message: 'Apoyo eliminado correctamente' };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Apoyos'],
      description: 'Elimina un apoyo',
      responses: {
        200: { description: 'Apoyo eliminado exitosamente' },
        404: { description: 'Apoyo no encontrado' }
      }
    }
  })

  // Búsqueda de apoyos por tipo
  .get('/buscar/tipo/:tipo', async ({ params: { tipo } }) => {
    const resultados = await ApoyoModel.searchByType(tipo);
    return resultados.length > 0 
      ? resultados 
      : { message: 'No se encontraron apoyos con ese tipo' };
  }, {
    params: t.Object({ tipo: t.String() }),
    detail: {
      tags: ['Apoyos'],
      description: 'Busca apoyos por tipo',
      responses: {
        200: { description: 'Resultados de búsqueda' }
      }
    }
  })

  // Búsqueda de apoyos por detalle
  .get('/buscar/detalle/:detalle', async ({ params: { detalle } }) => {
    const resultados = await ApoyoModel.searchByDetail(detalle);
    return resultados.length > 0 
      ? resultados 
      : { message: 'No se encontraron apoyos con ese detalle' };
  }, {
    params: t.Object({ detalle: t.String() }),
    detail: {
      tags: ['Apoyos'],
      description: 'Busca apoyos por contenido del detalle',
      responses: {
        200: { description: 'Resultados de búsqueda' }
      }
    }
  });