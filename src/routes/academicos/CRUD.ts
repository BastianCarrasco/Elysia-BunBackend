import { Elysia, t } from 'elysia';
import { AcademicoModel, AcademicoSchema } from './model';

export const academicosRoutes = new Elysia({ prefix: '/academicos' })
  // Obtener todos los académicos
  .get('/', async () => {
    return await AcademicoModel.getAll();
  }, {
    detail: {
      tags: ['Académicos'],
      description: 'Obtiene todos los registros académicos',
      responses: {
        200: { description: 'Lista de académicos obtenida exitosamente' }
      }
    }
  })

  // Obtener un académico por ID
  .get('/:id', async ({ params: { id } }) => {
    const academico = await AcademicoModel.getById(Number(id));
    return academico ?? { error: 'Académico no encontrado', status: 404 };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Académicos'],
      description: 'Obtiene un académico específico por ID',
      responses: {
        200: { description: 'Académico encontrado' },
        404: { description: 'Académico no encontrado' }
      }
    }
  })

  // Crear nuevo académico
  .post('/', async ({ body, set }) => {
    try {
      const nuevoAcademico = await AcademicoModel.create(body);
      set.status = 201;
      return nuevoAcademico;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al insertar académico',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    body: t.Omit(AcademicoSchema, ['id_academico']),
    detail: {
      tags: ['Académicos'],
      description: 'Crea un nuevo registro académico',
      responses: {
        201: { description: 'Académico creado exitosamente' },
        400: { description: 'Datos inválidos' }
      }
    }
  })

  // Actualizar académico (PUT - completo)
  .put('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizado = await AcademicoModel.update(Number(id), body);
      if (!actualizado) {
        set.status = 404;
        return { error: 'Académico no encontrado' };
      }
      return actualizado;
    } catch (error) {
     set.status = 400;
      return { 
        error: 'Error al actualizar académico',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Omit(AcademicoSchema, ['id_academico']),
    detail: {
      tags: ['Académicos'],
      description: 'Actualiza completamente un académico',
      responses: {
        200: { description: 'Académico actualizado exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Académico no encontrado' }
      }
    }
  })

  // Actualizar parcialmente académico (PATCH)
  .patch('/:id', async ({ params: { id }, body, set }) => {
    try {
      const actualizado = await AcademicoModel.update(Number(id), body);
      if (!actualizado) {
        set.status = 404;
        return { error: 'Académico no encontrado' };
      }
      return actualizado;
    } catch (error) {
      set.status = 400;
      return { 
        error: 'Error al actualizar académico',
        details: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }, {
    params: t.Object({ id: t.Numeric() }),
    body: t.Partial(t.Omit(AcademicoSchema, ['id_academico'])),
    detail: {
      tags: ['Académicos'],
      description: 'Actualiza parcialmente un académico',
      responses: {
        200: { description: 'Académico actualizado exitosamente' },
        400: { description: 'Datos inválidos' },
        404: { description: 'Académico no encontrado' }
      }
    }
  })

  // Eliminar académico
  .delete('/:id', async ({ params: { id }, set }) => {
    const eliminado = await AcademicoModel.delete(Number(id));
    if (!eliminado) {
      set.status = 404;
      return { error: 'Académico no encontrado' };
    }
    return { success: true, message: 'Académico eliminado correctamente' };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Académicos'],
      description: 'Elimina un académico',
      responses: {
        200: { description: 'Académico eliminado exitosamente' },
        404: { description: 'Académico no encontrado' }
      }
    }
  })

  // Búsqueda de académicos (opcional)
  .get('/buscar/:termino', async ({ params: { termino } }) => {
    const resultados = await AcademicoModel.searchByName(termino);
    return resultados.length > 0 
      ? resultados 
      : { message: 'No se encontraron académicos con ese criterio' };
  }, {
    params: t.Object({ termino: t.String() }),
    detail: {
      tags: ['Académicos'],
      description: 'Busca académicos por nombre o apellido',
      responses: {
        200: { description: 'Resultados de búsqueda' }
      }
    }
  });