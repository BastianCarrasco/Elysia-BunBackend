import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface Academico {
  id_academico: number;
  nombre: string;
  email: string;
  a_materno: string;
  a_paterno: string;
}

// Esquema de validación Elysia
export const AcademicoSchema = t.Object({
  id_academico: t.Number(),
  nombre: t.String(),
  email: t.String({ format: 'email' }),
  a_materno: t.String(),
  a_paterno: t.String()
});

// Operaciones CRUD completas
export const AcademicoModel = {
  // CREATE
  async create(academico: Omit<Academico, 'id_academico'>): Promise<Academico> {
    const { rows } = await pool.query(
      `INSERT INTO academico (nombre, email, a_materno, a_paterno) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [academico.nombre, academico.email, academico.a_materno, academico.a_paterno]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Academico[]> {
    const { rows } = await pool.query('SELECT * FROM academico ORDER BY id_academico');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Academico | null> {
    const { rows } = await pool.query(
      'SELECT * FROM academico WHERE id_academico = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    academico: Partial<Omit<Academico, 'id_academico'>>
  ): Promise<Academico | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(academico)) {
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
      UPDATE academico 
      SET ${fields.join(', ')} 
      WHERE id_academico = $${paramIndex} 
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM academico WHERE id_academico = $1',
      [id]
    );
    return rowCount !=null && rowCount > 0;
  },

  // Búsqueda adicional (opcional)
  async searchByName(name: string): Promise<Academico[]> {
    const { rows } = await pool.query(
      `SELECT * FROM academico 
       WHERE nombre ILIKE $1 OR a_paterno ILIKE $1 OR a_materno ILIKE $1`,
      [`%${name}%`]
    );
    return rows;
  }
};