import { t } from "elysia";
import { pool } from "../../lib/db";

// Interface TypeScript actualizada
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
  convocatoria: t.Optional(t.Union([t.String(), t.Null()])), // Corrección aquí
  nombre_convo: t.Optional(t.Union([t.String(), t.Null()])),
  institucion: t.Optional(t.Union([t.String(), t.Null()])),
  detalle_apoyo: t.Optional(t.Union([t.String(), t.Null()])),
  apoyo: t.Optional(t.Union([t.String(), t.Null()])),
});

// Modelo actualizado
export const ProyectoModel = {
  // CREATE
  async create(proyectoData: Omit<Proyecto, "id_proyecto">): Promise<Proyecto> {
    const { rows } = await pool.query(
      `INSERT INTO proyecto (
        nombre, monto, fecha_postulacion, comentarios, 
        id_tematica, id_estatus, convocatoria, detalle_apoyo, apoyo
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        proyectoData.nombre,
        proyectoData.monto,
        proyectoData.fecha_postulacion,
        proyectoData.comentarios,
        proyectoData.tematica,
        proyectoData.estatus,
        proyectoData.convocatoria,
        proyectoData.detalle_apoyo,
        proyectoData.apoyo,
      ]
    );

    // Para devolver el objeto completo con joins como en getAll
    return this.getById(rows[0].id_proyecto) as Promise<Proyecto>;
  },

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
        AP.NOMBRE AS APOYO
      FROM
        PROYECTO AS P
        LEFT JOIN TEMATICA AS T ON P.ID_TEMATICA = T.ID_TEMATICA
        LEFT JOIN ESTATUS AS E ON P.ID_ESTATUS = E.ID_ESTATUS
        LEFT JOIN TIPO_CONVO AS TC ON P.TIPO_CONVOCATORIA = TC.ID
        LEFT JOIN INST_CONVO AS IC ON P.INST_CONV = IC.ID
        LEFT JOIN APOYO AS AP ON P.APOYO = AP.ID_APOYO
      ORDER BY P.ID_PROYECTO
    `);
    return rows;
  },

  // GET Single Proyecto by ID
  async getById(id: number): Promise<Proyecto | null> {
    const { rows } = await pool.query(
      `
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
        AP.NOMBRE AS APOYO
      FROM
        PROYECTO AS P
        LEFT JOIN TEMATICA AS T ON P.ID_TEMATICA = T.ID_TEMATICA
        LEFT JOIN ESTATUS AS E ON P.ID_ESTATUS = E.ID_ESTATUS
        LEFT JOIN TIPO_CONVO AS TC ON P.TIPO_CONVOCATORIA = TC.ID
        LEFT JOIN INST_CONVO AS IC ON P.INST_CONV = IC.ID
        LEFT JOIN APOYO AS AP ON P.APOYO = AP.ID_APOYO
      WHERE P.ID_PROYECTO = $1
      `,
      [id]
    );
    return rows[0] || null;
  },

  // GET by Status
  async getByStatus(status: string): Promise<Proyecto[]> {
    const { rows } = await pool.query(
      `
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
        AP.NOMBRE AS APOYO
      FROM
        PROYECTO AS P
        LEFT JOIN TEMATICA AS T ON P.ID_TEMATICA = T.ID_TEMATICA
        LEFT JOIN ESTATUS AS E ON P.ID_ESTATUS = E.ID_ESTATUS
        LEFT JOIN TIPO_CONVO AS TC ON P.TIPO_CONVOCATORIA = TC.ID
        LEFT JOIN INST_CONVO AS IC ON P.INST_CONV = IC.ID
        LEFT JOIN APOYO AS AP ON P.APOYO = AP.ID_APOYO
      WHERE E.TIPO = $1
      `,
      [status]
    );
    return rows;
  },

  // GET by Convocatoria
  async getByConvocatoria(convocatoria: string): Promise<Proyecto[]> {
    const { rows } = await pool.query(
      `
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
        AP.NOMBRE AS APOYO
      FROM
        PROYECTO AS P
        LEFT JOIN TEMATICA AS T ON P.ID_TEMATICA = T.ID_TEMATICA
        LEFT JOIN ESTATUS AS E ON P.ID_ESTATUS = E.ID_ESTATUS
        LEFT JOIN TIPO_CONVO AS TC ON P.TIPO_CONVOCATORIA = TC.ID
        LEFT JOIN INST_CONVO AS IC ON P.INST_CONV = IC.ID
        LEFT JOIN APOYO AS AP ON P.APOYO = AP.ID_APOYO
      WHERE P.CONVOCATORIA = $1
      `,
      [convocatoria] // Corrección aquí
    );
    return rows;
  },

  // UPDATE
  async update(
    id: number,
    proyectoData: Partial<Omit<Proyecto, "id_proyecto">>
  ): Promise<Proyecto | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Mapear los nombres de campos del modelo a los nombres de la base de datos
    const fieldMap: Record<string, string> = {
      tematica: "id_tematica",
      estatus: "id_estatus",
      nombre_convo: "tipo_convocatoria",
      institucion: "inst_conv",
      apoyo: "apoyo",
    };

    for (const [key, value] of Object.entries(proyectoData)) {
      if (value !== undefined) {
        const dbField = fieldMap[key] || key;
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE proyecto 
      SET ${fields.join(", ")} 
      WHERE id_proyecto = $${paramIndex} 
      RETURNING id_proyecto
    `;

    const { rows } = await pool.query(query, [...values, id]);

    if (rows.length === 0) {
      return null;
    }

    // Devuelve el proyecto actualizado con todos los joins
    return this.getById(id);
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM proyecto WHERE id_proyecto = $1",
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // SEARCH by Name
  async searchByName(name: string): Promise<Proyecto[]> {
    const { rows } = await pool.query(
      `
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
        AP.NOMBRE AS APOYO
      FROM
        PROYECTO AS P
        LEFT JOIN TEMATICA AS T ON P.ID_TEMATICA = T.ID_TEMATICA
        LEFT JOIN ESTATUS AS E ON P.ID_ESTATUS = E.ID_ESTATUS
        LEFT JOIN TIPO_CONVO AS TC ON P.TIPO_CONVOCATORIA = TC.ID
        LEFT JOIN INST_CONVO AS IC ON P.INST_CONV = IC.ID
        LEFT JOIN APOYO AS AP ON P.APOYO = AP.ID_APOYO
      WHERE P.NOMBRE ILIKE $1
      `,
      [`%${name}%`]
    );
    return rows;
  },
};
