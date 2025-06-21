import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript
export interface InstConvo {
  id: number;
  nombre?: string | null;
}

// Esquema de validación Elysia
export const InstConvoSchema = t.Object({
  id: t.Number(),
  nombre: t.Optional(t.Union([t.String(), t.Null()])),
});

// Operaciones CRUD
export const InstConvoModel = {
  // CREATE
  async create(instConvoData: Omit<InstConvo, "id">): Promise<InstConvo> {
    const { rows } = await pool.query(
      `INSERT INTO inst_convo (nombre) 
       VALUES ($1) 
       RETURNING *`,
      [instConvoData.nombre]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<InstConvo[]> {
    const { rows } = await pool.query(
      "SELECT * FROM inst_convo ORDER BY nombre"
    );
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<InstConvo | null> {
    const { rows } = await pool.query(
      "SELECT * FROM inst_convo WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number,
    instConvoData: Partial<Omit<InstConvo, "id">>
  ): Promise<InstConvo | null> {
    const updateData = {
      nombre:
        instConvoData.nombre === undefined ? undefined : instConvoData.nombre,
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
      throw new Error("No hay campos para actualizar");
    }

    const query = `
      UPDATE inst_convo 
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
      "DELETE FROM inst_convo WHERE id = $1",
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por nombre
  async searchByName(nombre: string): Promise<InstConvo[]> {
    const { rows } = await pool.query(
      `SELECT * FROM inst_convo 
       WHERE nombre ILIKE $1`,
      [`%${nombre}%`]
    );
    return rows;
  },
};
