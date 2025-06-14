import { t } from 'elysia';
import { pool } from '../../../lib/db';

// Tipo TypeScript
export interface Tag {
  id_apoyo: number;
  tag: string;
}

// Esquema de validación Elysia
export const TagSchema = t.Object({
  id_apoyo: t.Number(),
  tag: t.String({ maxLength: 100 }),
});

// Operaciones CRUD
export const TagModel = {
  // CREATE
  async create(tagData: Omit<Tag, 'id_apoyo'>): Promise<Tag> {
    const { rows } = await pool.query(
      `INSERT INTO detalles_apoyo (tag) 
       VALUES ($1) 
       RETURNING *`,
      [tagData.tag]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Tag[]> {
    const { rows } = await pool.query('SELECT * FROM detalles_apoyo ORDER BY id_apoyo');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Tag | null> {
    const { rows } = await pool.query(
      'SELECT * FROM detalles_apoyo WHERE id_apoyo = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    tagData: Partial<Omit<Tag, 'id_apoyo'>>
  ): Promise<Tag | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(tagData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    const query = `
      UPDATE detalles_apoyo 
      SET ${fields.join(', ')} 
      WHERE id_apoyo = $${paramIndex} 
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM detalles_apoyo WHERE id_apoyo = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por tag (opcional)
  async searchByTag(tag: string): Promise<Tag[]> {
    const { rows } = await pool.query(
      `SELECT * FROM detalles_apoyo 
       WHERE tag ILIKE $1`,
      [`%${tag}%`]
    );
    return rows;
  }
};