import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface UnidadAcademica {
  id_unidad: number;  // SERIAL en PostgreSQL
  nombre: string;
}

// Esquema de validación Elysia
export const UnidadAcademicaSchema = t.Object({
  id_unidad: t.Number(),
  nombre: t.String({ minLength: 3, maxLength: 100 })
});

export const CreateUnidadAcademicaSchema = t.Omit(UnidadAcademicaSchema, ['id_unidad']);

// Operaciones CRUD completas
export const UnidadAcademicaModel = {
  // CREATE
  async create(unidad: Omit<UnidadAcademica, 'id_unidad'>): Promise<UnidadAcademica> {
    const { rows } = await pool.query<UnidadAcademica>(
      `INSERT INTO unidadacademica (nombre) 
       VALUES ($1) 
       RETURNING *`,
      [unidad.nombre]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<UnidadAcademica[]> {
    const { rows } = await pool.query<UnidadAcademica>(
      'SELECT * FROM unidadacademica ORDER BY id_unidad'
    );
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<UnidadAcademica | null> {
    const { rows } = await pool.query<UnidadAcademica>(
      'SELECT * FROM unidadacademica WHERE id_unidad = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    unidad: Partial<Omit<UnidadAcademica, 'id_unidad'>>
  ): Promise<UnidadAcademica | null> {
    const validUpdates = Object.entries(unidad).filter(([_, v]) => v !== undefined);
    
    if (validUpdates.length === 0) {
      throw new Error('No hay campos válidos para actualizar');
    }

    const setClause = validUpdates
      .map(([key], i) => `${key} = $${i + 1}`)
      .join(', ');

    const values = validUpdates.map(([_, v]) => v);

    const { rows } = await pool.query<UnidadAcademica>(
      `UPDATE unidadacademica 
       SET ${setClause} 
       WHERE id_unidad = $${validUpdates.length + 1} 
       RETURNING *`,
      [...values, id]
    );

    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM unidadacademica WHERE id_unidad = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por nombre (opcional)
  async searchByName(name: string): Promise<UnidadAcademica[]> {
    const { rows } = await pool.query<UnidadAcademica>(
      `SELECT * FROM unidadacademica 
       WHERE nombre ILIKE $1
       ORDER BY id_unidad`,
      [`%${name}%`]
    );
    return rows;
  }
};