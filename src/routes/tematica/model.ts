import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript
export interface Tematica {
  id_tematica: number;
  nombre?: string | null;
}

// Esquema de validación Elysia
export const TematicaSchema = t.Object({
  id_tematica: t.Number(),
  nombre: t.Optional(t.Union([t.String(), t.Null()])),
});

// Operaciones CRUD
export const TematicaModel = {
  // CREATE
  async create(tematicaData: Omit<Tematica, "id_tematica">): Promise<Tematica> {
    const { rows } = await pool.query(
      `INSERT INTO tematica (nombre) 
       VALUES ($1) 
       RETURNING *`,
      [tematicaData.nombre]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Tematica[]> {
    const { rows } = await pool.query("SELECT * FROM tematica ORDER BY nombre");
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Tematica | null> {
    const { rows } = await pool.query(
      "SELECT * FROM tematica WHERE id_tematica = $1",
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number,
    tematicaData: Partial<Omit<Tematica, "id_tematica">>
  ): Promise<Tematica | null> {
    const updateData = {
      nombre:
        tematicaData.nombre === undefined ? undefined : tematicaData.nombre,
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
      UPDATE tematica 
      SET ${fields.join(", ")} 
      WHERE id_tematica = $${paramIndex} 
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM tematica WHERE id_tematica = $1",
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // SEARCH by Name
  async searchByName(name: string): Promise<Tematica[]> {
    const { rows } = await pool.query(
      `SELECT * FROM tematica 
       WHERE nombre ILIKE $1`,
      [`%${name}%`]
    );
    return rows;
  },
};
