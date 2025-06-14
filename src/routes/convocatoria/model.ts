import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface Convocatoria {
  id_convocatoria: number;
  nombre: string;
  tipo: number;
  institucion: number;
}

// Esquema de validación Elysia
export const ConvocatoriaSchema = t.Object({
  id_convocatoria: t.Number(),
  nombre: t.String(),
  tipo: t.Number(),
  institucion: t.Number()
});

// Operaciones CRUD completas
export const ConvocatoriaModel = {
  // CREATE
  async create(convocatoria: Omit<Convocatoria, 'id_convocatoria'>): Promise<Convocatoria> {
    const { rows } = await pool.query(
      `INSERT INTO convocatoria (nombre, tipo, institucion) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [convocatoria.nombre, convocatoria.tipo, convocatoria.institucion]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Convocatoria[]> {
    const { rows } = await pool.query('SELECT * FROM convocatoria ORDER BY id_convocatoria');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Convocatoria | null> {
    const { rows } = await pool.query(
      'SELECT * FROM convocatoria WHERE id_convocatoria = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    convocatoria: Partial<Omit<Convocatoria, 'id_convocatoria'>>
  ): Promise<Convocatoria | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(convocatoria)) {
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
      UPDATE convocatoria 
      SET ${fields.join(', ')} 
      WHERE id_convocatoria = $${paramIndex} 
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM convocatoria WHERE id_convocatoria = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por nombre
  async searchByName(name: string): Promise<Convocatoria[]> {
    const { rows } = await pool.query(
      `SELECT * FROM convocatoria 
       WHERE nombre ILIKE $1`,
      [`%${name}%`]
    );
    return rows;
  },

  // Obtener por tipo
  async getByType(tipo: number): Promise<Convocatoria[]> {
    const { rows } = await pool.query(
      'SELECT * FROM convocatoria WHERE tipo = $1',
      [tipo]
    );
    return rows;
  },

  // Obtener por institución
  async getByInstitution(institucion: number): Promise<Convocatoria[]> {
    const { rows } = await pool.query(
      'SELECT * FROM convocatoria WHERE institucion = $1',
      [institucion]
    );
    return rows;
  }
};