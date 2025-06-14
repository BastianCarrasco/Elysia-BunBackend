import { Elysia,t } from 'elysia';
import { AcademicoModel, AcademicoSchema } from './model';

export const academicosRoutes = new Elysia({ prefix: '/academicos' })
  .get('/', async () => {
    return await AcademicoModel.getAll();
  }, {
    detail: {
      tags: ['Académicos'],
      description: 'Obtiene todos los registros académicos'
    }
  })
  .get('/:id', async ({ params: { id } }) => {
    const academico = await AcademicoModel.getById(Number(id));
    return academico || { error: 'Académico no encontrado' };
  }, {
    params: t.Object({ id: t.Numeric() }),
    detail: {
      tags: ['Académicos'],
      description: 'Obtiene un académico específico por ID'
    }
  })
  .post('/', async ({ body }) => {
    return await AcademicoModel.create(body);
  }, {
    body: t.Omit(AcademicoSchema, ['id_academico']),
    detail: {
      tags: ['Académicos'],
      description: 'Crea un nuevo registro académico'
    }
  });