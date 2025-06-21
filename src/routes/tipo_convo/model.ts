import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript
export interface TipoConvo {
  id: number;
  nombre?: string | null;
}

// Esquema de validación Elysia
export const TipoConvoSchema = t.Object({
  id: t.Number(),
  nombre: t.Optional(t.Union([t.String(), t.Null()])),
});

// Operaciones CRUD
export const TipoConvoModel = {
  // CREATE
  async create(tipoConvoData: Omit<TipoConvo, "id">): Promise<TipoConvo> {
    const { rows } = await pool.query(
      `INSERT INTO tipo_convo (nombre) 
       VALUES ($1) 
       RETURNING *`,
      [tipoConvoData.nombre]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<TipoConvo[]> {
    const { rows } = await pool.query(
      "SELECT * FROM tipo_convo ORDER BY nombre"
    );
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<TipoConvo | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tipo_convo WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number,
    tipoConvoData: Partial<Omit<TipoConvo, "id">>
  ): Promise<TipoConvo | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (tipoConvoData.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex}`);
      values.push(tipoConvoData.nombre);
      paramIndex++;
    }

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE tipo_convo 
      SET ${fields.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM tipo_convo WHERE id = $1",
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // SEARCH by Name
  async searchByName(name: string): Promise<TipoConvo[]> {
    const { rows } = await pool.query(
      `SELECT * FROM tipo_convo 
       WHERE nombre ILIKE $1`,
      [`%${name}%`]
    );
    return rows;
  },
};
