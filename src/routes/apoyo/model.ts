import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface Apoyo {
  id_apoyo: number;
  tipo: string;
  detalle: string;
}

// Esquema de validación Elysia
export const ApoyoSchema = t.Object({
  id_apoyo: t.Number(),
  tipo: t.String(),
  detalle: t.String()
});

// Operaciones CRUD completas
export const ApoyoModel = {
  // CREATE
  async create(apoyo: Omit<Apoyo, 'id_apoyo'>): Promise<Apoyo> {
    const { rows } = await pool.query(
      `INSERT INTO apoyo (tipo, detalle) 
       VALUES ($1, $2) 
       RETURNING *`,
      [apoyo.tipo, apoyo.detalle]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Apoyo[]> {
    const { rows } = await pool.query('SELECT * FROM apoyo ORDER BY id_apoyo');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Apoyo | null> {
    const { rows } = await pool.query(
      'SELECT * FROM apoyo WHERE id_apoyo = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    apoyo: Partial<Omit<Apoyo, 'id_apoyo'>>
  ): Promise<Apoyo | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(apoyo)) {
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
      UPDATE apoyo 
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
      'DELETE FROM apoyo WHERE id_apoyo = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por tipo (opcional)
  async searchByType(tipo: string): Promise<Apoyo[]> {
    const { rows } = await pool.query(
      `SELECT * FROM apoyo 
       WHERE tipo ILIKE $1`,
      [`%${tipo}%`]
    );
    return rows;
  },

  // Búsqueda por detalle (opcional)
  async searchByDetail(detalle: string): Promise<Apoyo[]> {
    const { rows } = await pool.query(
      `SELECT * FROM apoyo 
       WHERE detalle ILIKE $1`,
      [`%${detalle}%`]
    );
    return rows;
  }
};