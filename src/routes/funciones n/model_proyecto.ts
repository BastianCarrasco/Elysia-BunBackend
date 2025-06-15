import { t } from "elysia";
import { pool } from "../../lib/db";

// Interface TypeScript actualizada:
export interface ProyectosData {
  id_proyecto: number;
  nombre: string;
  monto?: number | 0; // Ahora es opcional
  fecha_postulacion?: Date | string | null;
  comentarios?: string | null;
  unidad?: string | null;
  convo_nombre?: string | null;
  tipo_convo?: string | null;
  inst_convo?: string | null;
  tematica?: string | null;
  tipo_apoyo?: string | null;
  detalle?: string | null;
  estatus?: string | null;
  academico?: string;
  jefe?: number | null;
}

// Schema Elysia actualizado:
export const ProyectosDataSchema = t.Object({
  id_proyecto: t.Number(),
  nombre: t.String(),
  monto: t.Optional(t.Union([t.Number(), t.Null()])),
  fecha_postulacion: t.Optional(
    t.Union([t.Date(), t.String({ format: "date-time" }), t.Null()])
  ),
  comentarios: t.Optional(t.Union([t.String(), t.Null()])),
  unidad: t.Optional(t.Union([t.String(), t.Null()])),
  convo_nombre: t.Optional(t.Union([t.String(), t.Null()])),
  tipo_convo: t.Optional(t.Union([t.String(), t.Null()])),
  inst_convo: t.Optional(t.Union([t.String(), t.Null()])),
  tematica: t.Optional(t.Union([t.String(), t.Null()])),
  tipo_apoyo: t.Optional(t.Union([t.String(), t.Null()])),
  detalle: t.Optional(t.Union([t.String(), t.Null()])),
  estatus: t.Optional(t.Union([t.String(), t.Null()])),
  academico: t.Optional(t.Union([t.String(), t.Null()])),
  jefe: t.Optional(t.Union([t.Number(), t.Null()])),
});

// Modelo
export const ProyectosDataModel = {
  // GET All Proyectos with complete data
  async getAll(): Promise<ProyectosData[]> {
    const { rows } = await pool.query(`
      SELECT
        P.ID_PROYECTO,
        P.NOMBRE,
        P.MONTO,
        P.FECHA_POSTULACION,
        P.COMENTARIOS,
        U.NOMBRE AS UNIDAD,
        CONVO.NOMBRE AS CONVO_NOMBRE,
        TC.NOMBRE AS TIPO_CONVO,
        IC.NOMBRE AS INST_CONVO,
        TM.NOMBRE AS TEMATICA,
        TP.TIPO AS TIPO_APOYO,
        AP.DETALLE,
        ES.TIPO as Estatus,
        CONCAT(AC.NOMBRE, ' ', AC.A_PATERNO) AS ACADEMICO,
        pya.jefe
      FROM
        PROYECTO AS P
        LEFT JOIN UNIDADACADEMICA AS U ON P.UNIDAD = U.ID_UNIDAD
        LEFT JOIN CONVOCATORIA AS CONVO ON P.ID_CONVOCATORIA = CONVO.ID_CONVOCATORIA
        LEFT JOIN TIPO_CONVO AS TC ON TC.ID = CONVO.TIPO
        LEFT JOIN INST_CONVO AS IC ON IC.ID = CONVO.INSTITUCION
        LEFT JOIN TEMATICA AS TM ON TM.ID_TEMATICA = P.ID_TEMATICA
        LEFT JOIN APOYO AS AP ON P.ID_APOYO = AP.ID_APOYO
        LEFT JOIN TIPO_APOYO AS TP ON TP.ID_TIPO_APOYO = AP.TIPO
        LEFT JOIN ESTATUS AS ES ON ES.ID_ESTATUS = P.ID_ESTATUS
        LEFT JOIN PROYECTOACADEMICO AS PYA ON PYA.ID_PROYECTO = P.ID_PROYECTO
        LEFT JOIN ACADEMICO AS AC ON PYA.ID_ACADEMICO = AC.ID_ACADEMICO
    `);
    return rows;
  },

  // GET Single Proyecto by ID
  async getById(id: number): Promise<ProyectosData | null> {
    const { rows } = await pool.query(
      `
      SELECT
        P.ID_PROYECTO,
        P.NOMBRE,
        P.MONTO,
        P.FECHA_POSTULACION,
        P.COMENTARIOS,
        U.NOMBRE AS UNIDAD,
        CONVO.NOMBRE AS CONVO_NOMBRE,
        TC.NOMBRE AS TIPO_CONVO,
        IC.NOMBRE AS INST_CONVO,
        TM.NOMBRE AS TEMATICA,
        TP.TIPO AS TIPO_APOYO,
        AP.DETALLE,
        ES.TIPO as Estatus,
        CONCAT(AC.NOMBRE, ' ', AC.A_PATERNO) AS ACADEMICO,
        pya.jefe
      FROM
        PROYECTO AS P
        LEFT JOIN UNIDADACADEMICA AS U ON P.UNIDAD = U.ID_UNIDAD
        LEFT JOIN CONVOCATORIA AS CONVO ON P.ID_CONVOCATORIA = CONVO.ID_CONVOCATORIA
        LEFT JOIN TIPO_CONVO AS TC ON TC.ID = CONVO.TIPO
        LEFT JOIN INST_CONVO AS IC ON IC.ID = CONVO.INSTITUCION
        LEFT JOIN TEMATICA AS TM ON TM.ID_TEMATICA = P.ID_TEMATICA
        LEFT JOIN APOYO AS AP ON P.ID_APOYO = AP.ID_APOYO
        LEFT JOIN TIPO_APOYO AS TP ON TP.ID_TIPO_APOYO = AP.TIPO
        LEFT JOIN ESTATUS AS ES ON ES.ID_ESTATUS = P.ID_ESTATUS
        LEFT JOIN PROYECTOACADEMICO AS PYA ON PYA.ID_PROYECTO = P.ID_PROYECTO
        LEFT JOIN ACADEMICO AS AC ON PYA.ID_ACADEMICO = AC.ID_ACADEMICO
      WHERE P.ID_PROYECTO = $1
      `,
      [id]
    );
    return rows[0] || null;
  },
};
