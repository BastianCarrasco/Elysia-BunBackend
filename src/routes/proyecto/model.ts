import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript
export interface Proyecto {
  id_proyecto: number;
  nombre?: string | null;
  monto?: number | null;
  fecha_postulacion?: Date | string | null;
  comentarios?: string | null;
  unidad?: number | null;
  id_convocatoria?: number | null;
  id_tematica?: number | null;
  id_apoyo?: number | null;
  id_estatus?: number | null;
  id_kth?: number | null;
}

// Esquema de validación Elysia
export const ProyectoSchema = t.Object({
  id_proyecto: t.Number(),
  nombre: t.Optional(t.Union([t.String(), t.Null()])),
  monto: t.Optional(t.Union([t.Number(), t.Null()])),
  fecha_postulacion: t.Optional(
    t.Union([t.Date(), t.String({ format: "date" }), t.Null()])
  ),
  comentarios: t.Optional(t.Union([t.String(), t.Null()])),
  unidad: t.Optional(t.Union([t.Number(), t.Null()])),
  id_convocatoria: t.Optional(t.Union([t.Number(), t.Null()])),
  id_tematica: t.Optional(t.Union([t.Number(), t.Null()])),
  id_apoyo: t.Optional(t.Union([t.Number(), t.Null()])),
  id_estatus: t.Optional(t.Union([t.Number(), t.Null()])),
  id_kth: t.Optional(t.Union([t.Number(), t.Null()])),
});

// Operaciones CRUD
export const ProyectoModel = {
  // CREATE
  async create(proyectoData: Omit<Proyecto, "id_proyecto">): Promise<Proyecto> {
    const { rows } = await pool.query(
      `INSERT INTO proyecto (
        nombre, monto, fecha_postulacion, comentarios, unidad,
        id_convocatoria, id_tematica, id_apoyo, id_estatus, id_kth
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        proyectoData.nombre,
        proyectoData.monto,
        proyectoData.fecha_postulacion,
        proyectoData.comentarios,
        proyectoData.unidad,
        proyectoData.id_convocatoria,
        proyectoData.id_tematica,
        proyectoData.id_apoyo,
        proyectoData.id_estatus,
        proyectoData.id_kth,
      ]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Proyecto[]> {
    const { rows } = await pool.query(
      "SELECT * FROM proyecto ORDER BY id_proyecto"
    );
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Proyecto | null> {
    const { rows } = await pool.query(
      "SELECT * FROM proyecto WHERE id_proyecto = $1",
      [id]
    );
    return rows[0] || null;
  },

  // READ by Status
  async getByStatus(statusId: number): Promise<Proyecto[]> {
    const { rows } = await pool.query(
      "SELECT * FROM proyecto WHERE id_estatus = $1",
      [statusId]
    );
    return rows;
  },

  // READ by Convocatoria
  async getByConvocatoria(convocatoriaId: number): Promise<Proyecto[]> {
    const { rows } = await pool.query(
      "SELECT * FROM proyecto WHERE id_convocatoria = $1",
      [convocatoriaId]
    );
    return rows;
  },

  // UPDATE
  async update(
    id: number,
    proyectoData: Partial<Omit<Proyecto, "id_proyecto">>
  ): Promise<Proyecto | null> {
    const updateData = {
      nombre:
        proyectoData.nombre === undefined ? undefined : proyectoData.nombre,
      monto: proyectoData.monto === undefined ? undefined : proyectoData.monto,
      fecha_postulacion:
        proyectoData.fecha_postulacion === undefined
          ? undefined
          : proyectoData.fecha_postulacion,
      comentarios:
        proyectoData.comentarios === undefined
          ? undefined
          : proyectoData.comentarios,
      unidad:
        proyectoData.unidad === undefined ? undefined : proyectoData.unidad,
      id_convocatoria:
        proyectoData.id_convocatoria === undefined
          ? undefined
          : proyectoData.id_convocatoria,
      id_tematica:
        proyectoData.id_tematica === undefined
          ? undefined
          : proyectoData.id_tematica,
      id_apoyo:
        proyectoData.id_apoyo === undefined ? undefined : proyectoData.id_apoyo,
      id_estatus:
        proyectoData.id_estatus === undefined
          ? undefined
          : proyectoData.id_estatus,
      id_kth:
        proyectoData.id_kth === undefined ? undefined : proyectoData.id_kth,
    };

    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
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
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
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
      `SELECT * FROM proyecto 
       WHERE nombre ILIKE $1`,
      [`%${name}%`]
    );
    return rows;
  },
};
