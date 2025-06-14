import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface Cuestionario {
  id_cuestionario: number;
  pregunta: string;
}

// Esquema de validación Elysia
export const CuestionarioSchema = t.Object({
  id_cuestionario: t.Number(),
  pregunta: t.String(),
});

// Operaciones CRUD completas
export const CuestionarioModel = {
  // CREATE
  async create(cuestionario: Omit<Cuestionario, 'id_cuestionario'>): Promise<Cuestionario> {
    const { rows } = await pool.query(
      `INSERT INTO cuestionario (pregunta) 
       VALUES ($1) 
       RETURNING *`,
      [cuestionario.pregunta]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Cuestionario[]> {
    const { rows } = await pool.query('SELECT * FROM cuestionario ORDER BY id_cuestionario');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Cuestionario | null> {
    const { rows } = await pool.query(
      'SELECT * FROM cuestionario WHERE id_cuestionario = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    cuestionario: Partial<Omit<Cuestionario, 'id_cuestionario'>>
  ): Promise<Cuestionario | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(cuestionario)) {
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
      UPDATE cuestionario 
      SET ${fields.join(', ')} 
      WHERE id_cuestionario = $${paramIndex} 
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM cuestionario WHERE id_cuestionario = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por pregunta (opcional)
  async searchByQuestion(pregunta: string): Promise<Cuestionario[]> {
    const { rows } = await pool.query(
      `SELECT * FROM cuestionario 
       WHERE pregunta ILIKE $1`,
      [`%${pregunta}%`]
    );
    return rows;
  }
};