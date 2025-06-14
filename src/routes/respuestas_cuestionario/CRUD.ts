import { Elysia, t } from 'elysia';
import { RespuestaCuestionarioSchema, RespuestaCuestionarioModel } from './model';

export const respuestaCuestionarioRoutes = new Elysia({ prefix: '/respuestas-cuestionario' })
  // CREATE - Registrar nuevas respuestas
  .post(
    '/',
    async ({ body }) => {
      const nuevaRespuesta = await RespuestaCuestionarioModel.create({
        nombre_investigador: body.nombre_investigador,
        escuela: body.escuela,
        respuesta_1: body.respuesta_1 ?? null,
        respuesta_2: body.respuesta_2 ?? null,
        respuesta_3: body.respuesta_3 ?? null,
        respuesta_4: body.respuesta_4 ?? null,
        respuesta_5: body.respuesta_5 ?? null,
        respuesta_6: body.respuesta_6 ?? null,
        respuesta_7: body.respuesta_7 ?? null,
        respuesta_8: body.respuesta_8 ?? null,
        respuesta_9: body.respuesta_9 ?? null
      });
      return nuevaRespuesta;
    },
    {
      body: t.Object({
        nombre_investigador: t.Number(),
        escuela: t.Number(),
        respuesta_1: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_2: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_3: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_4: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_5: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_6: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_7: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_8: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_9: t.Optional(t.Union([t.String(), t.Null()]))
      }),
      response: RespuestaCuestionarioSchema,
      detail: {
        tags: ['Respuestas Cuestionario'],
        description: 'Registrar nuevas respuestas a un cuestionario'
      }
    }
  )

  // READ ALL - Obtener todas las respuestas
  .get(
    '/',
    async () => {
      const respuestas = await RespuestaCuestionarioModel.getAll();
      return respuestas;
    },
    {
      response: t.Array(RespuestaCuestionarioSchema),
      detail: {
        tags: ['Respuestas Cuestionario'],
        description: 'Obtener todas las respuestas registradas'
      }
    }
  )

  // READ ONE - Obtener una respuesta por ID
  .get(
    '/:id',
    async ({ params: { id } }) => {
      const respuesta = await RespuestaCuestionarioModel.getById(Number(id));
      if (!respuesta) {
        throw new Error('Respuesta no encontrada');
      }
      return respuesta;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: RespuestaCuestionarioSchema,
      detail: {
        tags: ['Respuestas Cuestionario'],
        description: 'Obtener una respuesta específica por ID'
      }
    }
  )

  // UPDATE - Actualizar una respuesta
  .patch(
    '/:id',
    async ({ params: { id }, body }) => {
      const respuestaActualizada = await RespuestaCuestionarioModel.update(
        Number(id),
        {
          ...body,
          respuesta_1: body.respuesta_1 ?? null,
          respuesta_2: body.respuesta_2 ?? null,
          respuesta_3: body.respuesta_3 ?? null,
          respuesta_4: body.respuesta_4 ?? null,
          respuesta_5: body.respuesta_5 ?? null,
          respuesta_6: body.respuesta_6 ?? null,
          respuesta_7: body.respuesta_7 ?? null,
          respuesta_8: body.respuesta_8 ?? null,
          respuesta_9: body.respuesta_9 ?? null
        }
      );
      if (!respuestaActualizada) {
        throw new Error('Respuesta no encontrada');
      }
      return respuestaActualizada;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      body: t.Partial(t.Object({
        nombre_investigador: t.Number(),
        escuela: t.Number(),
        respuesta_1: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_2: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_3: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_4: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_5: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_6: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_7: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_8: t.Optional(t.Union([t.String(), t.Null()])),
        respuesta_9: t.Optional(t.Union([t.String(), t.Null()]))
      })),
      response: RespuestaCuestionarioSchema,
      detail: {
        tags: ['Respuestas Cuestionario'],
        description: 'Actualizar una respuesta existente'
      }
    }
  )

  // DELETE - Eliminar una respuesta
  .delete(
    '/:id',
    async ({ params: { id } }) => {
      const eliminada = await RespuestaCuestionarioModel.delete(Number(id));
      if (!eliminada) {
        throw new Error('Respuesta no encontrada');
      }
      return { message: 'Respuesta eliminada correctamente' };
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: t.Object({
        message: t.String()
      }),
      detail: {
        tags: ['Respuestas Cuestionario'],
        description: 'Eliminar un cuestionario'
      }
    }
  )

  // GET BY INVESTIGADOR - Obtener respuestas por investigador
  .get(
    '/investigador/:id',
    async ({ params: { id } }) => {
      const respuestas = await RespuestaCuestionarioModel.getByInvestigador(Number(id));
      return respuestas;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: t.Array(RespuestaCuestionarioSchema),
      detail: {
        tags: ['Respuestas Cuestionario'],
        description: 'Obtener respuestas por ID de investigador'
      }
    }
  )

  // GET BY ESCUELA - Obtener respuestas por escuela
  .get(
    '/escuela/:id',
    async ({ params: { id } }) => {
      const respuestas = await RespuestaCuestionarioModel.getByEscuela(Number(id));
      return respuestas;
    },
    {
      params: t.Object({
        id: t.Numeric()
      }),
      response: t.Array(RespuestaCuestionarioSchema),
      detail: {
        tags: ['Respuestas Cuestionario'],
        description: 'Obtener respuestas por ID de escuela'
      }
    }
  );