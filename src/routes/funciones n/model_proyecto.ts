import { t } from "elysia";
import { pool } from "../../lib/db";

// Interface TypeScript
export interface Proyecto {
  id_proyecto: number;
  nombre: string;
  monto?: number | null;
  fecha_postulacion?: Date | string | null;
  comentarios?: string | null;
  tematica?: string | null;
  estatus?: string | null;
  convocatoria?: string | null;
  nombre_convo?: string | null;
  institucion?: string | null;
  detalle_apoyo?: string | null;
  apoyo?: string | null;
  unidad?: string | null;
}

// Esquema de validación Elysia
export const ProyectoSchema = t.Object({
  id_proyecto: t.Number(),
  nombre: t.String(),
  monto: t.Optional(t.Union([t.Number(), t.Null()])),
  fecha_postulacion: t.Optional(
    t.Union([t.Date(), t.String({ format: "date-time" }), t.Null()])
  ),
  comentarios: t.Optional(t.Union([t.String(), t.Null()])),
  tematica: t.Optional(t.Union([t.String(), t.Null()])),
  estatus: t.Optional(t.Union([t.String(), t.Null()])),
  convocatoria: t.Optional(t.Union([t.String(), t.Null()])),
  nombre_convo: t.Optional(t.Union([t.String(), t.Null()])),
  institucion: t.Optional(t.Union([t.String(), t.Null()])),
  detalle_apoyo: t.Optional(t.Union([t.String(), t.Null()])),
  apoyo: t.Optional(t.Union([t.String(), t.Null()])),
  unidad: t.Optional(t.Union([t.String(), t.Null()])),
});

// Modelo
export const ProyectoModel = {
  // GET All Proyectos with complete data
  async getAll(): Promise<Proyecto[]> {
    const { rows } = await pool.query(`
      SELECT
        P.ID_PROYECTO,
        P.NOMBRE,
        P.MONTO,
        P.FECHA_POSTULACION,
        P.COMENTARIOS,
        T.NOMBRE AS TEMATICA,
        E.TIPO AS ESTATUS,
        P.CONVOCATORIA,
        TC.NOMBRE AS NOMBRE_CONVO,
        IC.NOMBRE AS INSTITUCION,
        P.DETALLE_APOYO,
        AP.NOMBRE AS APOYO,
        UA.nombre as unidad
      FROM
        PROYECTO AS P
        LEFT JOIN TEMATICA AS T ON P.ID_TEMATICA = T.ID_TEMATICA
        LEFT JOIN ESTATUS AS E ON P.ID_ESTATUS = E.ID_ESTATUS
        LEFT JOIN TIPO_CONVO AS TC ON P.TIPO_CONVOCATORIA = TC.ID
        LEFT JOIN INST_CONVO AS IC ON P.INST_CONV = IC.ID
        LEFT JOIN APOYO AS AP ON P.APOYO = AP.ID_APOYO
        LEFT JOIN UNIDADACADEMICA AS UA ON P.unidad = UA.id_unidad
      ORDER BY P.ID_PROYECTO
    `);
    return rows;
  },
};
