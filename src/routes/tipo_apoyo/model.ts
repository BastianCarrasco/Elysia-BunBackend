import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript
export interface TipoApoyo {
  id_tipo_apoyo: number;
  tipo: string;
}

// Esquema de validación Elysia
export const TipoApoyoSchema = t.Object({
  id_tipo_apoyo: t.Number(),
  tipo: t.String({ maxLength: 15 }),
});

// Operaciones CRUD
export const TipoApoyoModel = {
  // CREATE
  async create(
    tipoApoyoData: Omit<TipoApoyo, "id_tipo_apoyo">
  ): Promise<TipoApoyo> {
    const { rows } = await pool.query(
      `INSERT INTO tipo_apoyo (tipo) 
       VALUES ($1) 
       RETURNING *`,
      [tipoApoyoData.tipo]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<TipoApoyo[]> {
    const { rows } = await pool.query(
      "SELECT * FROM tipo_apoyo ORDER BY id_tipo_apoyo"
    );
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<TipoApoyo | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tipo_apoyo WHERE id_tipo_apoyo = $1",
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number,
    tipoApoyoData: Partial<Omit<TipoApoyo, "id_tipo_apoyo">>
  ): Promise<TipoApoyo | null> {
    if (!tipoApoyoData.tipo) {
      throw new Error("At least one field must be provided for update");
    }

    const { rows } = await pool.query(
      `UPDATE tipo_apoyo 
       SET tipo = $1 
       WHERE id_tipo_apoyo = $2 
       RETURNING *`,
      [tipoApoyoData.tipo, id]
    );
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM tipo_apoyo WHERE id_tipo_apoyo = $1",
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // SEARCH by Tipo
  async searchByTipo(tipo: string): Promise<TipoApoyo[]> {
    const { rows } = await pool.query(
      `SELECT * FROM tipo_apoyo 
       WHERE tipo ILIKE $1`,
      [`%${tipo}%`]
    );
    return rows;
  },
};
