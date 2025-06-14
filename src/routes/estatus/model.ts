import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface Estatus {
  id_estatus: number;
  tipo?: string | null;  // Nullable y opcional
}

// Esquema de validación Elysia
export const EstatusSchema = t.Object({
  id_estatus: t.Number(),
  tipo: t.Optional(t.Union([t.String({ maxLength: 20 }), t.Null()])),
});

// Operaciones CRUD
export const EstatusModel = {
  // CREATE
  async create(estatusData: Omit<Estatus, 'id_estatus'>): Promise<Estatus> {
    const { rows } = await pool.query(
      `INSERT INTO estatus (tipo) 
       VALUES ($1) 
       RETURNING *`,
      [estatusData.tipo]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Estatus[]> {
    const { rows } = await pool.query('SELECT * FROM estatus ORDER BY id_estatus');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Estatus | null> {
    const { rows } = await pool.query(
      'SELECT * FROM estatus WHERE id_estatus = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    estatusData: Partial<Omit<Estatus, 'id_estatus'>>
  ): Promise<Estatus | null> {
    // Manejo explícito de valores null
    const updateData = {
      ...estatusData,
      tipo: estatusData.tipo === undefined ? undefined : estatusData.tipo
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
      throw new Error('No hay campos para actualizar');
    }

    const query = `
      UPDATE estatus 
      SET ${fields.join(', ')} 
      WHERE id_estatus = $${paramIndex} 
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM estatus WHERE id_estatus = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por tipo (opcional)
  async searchByType(tipo: string): Promise<Estatus[]> {
    const { rows } = await pool.query(
      `SELECT * FROM estatus 
       WHERE tipo ILIKE $1`,
      [`%${tipo}%`]
    );
    return rows;
  }
};