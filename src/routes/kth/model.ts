import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface KTH {
  id_kth: number;
  id_proyecto: number;
  trl?: number | null;
  crl?: number | null;
  team?: number | null;
  brl?: number | null;
  iprl?: number | null;
  frl?: number | null;
  fecha_creacion?: Date | string | null;
}

// Esquema de validación Elysia
export const KTHSchema = t.Object({
  id_kth: t.Number(),
  id_proyecto: t.Number(),
  trl: t.Optional(t.Union([t.Number(), t.Null()])),
  crl: t.Optional(t.Union([t.Number(), t.Null()])),
  team: t.Optional(t.Union([t.Number(), t.Null()])),
  brl: t.Optional(t.Union([t.Number(), t.Null()])),
  iprl: t.Optional(t.Union([t.Number(), t.Null()])),
  frl: t.Optional(t.Union([t.Number(), t.Null()])),
  fecha_creacion: t.Optional(t.Union([t.Date(), t.String({ format: 'date-time' }), t.Null()])),
});

// Operaciones CRUD
export const KTHModel = {
  // CREATE
  async create(kthData: Omit<KTH, 'id_kth'>): Promise<KTH> {
    const { rows } = await pool.query(
      `INSERT INTO kth (
        id_proyecto, trl, crl, team, brl, iprl, frl, fecha_creacion
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        kthData.id_proyecto,
        kthData.trl,
        kthData.crl,
        kthData.team,
        kthData.brl,
        kthData.iprl,
        kthData.frl,
        kthData.fecha_creacion
      ]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<KTH[]> {
    const { rows } = await pool.query('SELECT * FROM kth ORDER BY id_kth');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<KTH | null> {
    const { rows } = await pool.query(
      'SELECT * FROM kth WHERE id_kth = $1', 
      [id]
    );
    return rows[0] || null;
  },

  // READ by Project ID
  async getByProjectId(projectId: number): Promise<KTH | null> {
    const { rows } = await pool.query(
      'SELECT * FROM kth WHERE id_proyecto = $1',
      [projectId]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number, 
    kthData: Partial<Omit<KTH, 'id_kth'>>
  ): Promise<KTH | null> {
    const updateData = {
      id_proyecto: kthData.id_proyecto === undefined ? undefined : kthData.id_proyecto,
      trl: kthData.trl === undefined ? undefined : kthData.trl,
      crl: kthData.crl === undefined ? undefined : kthData.crl,
      team: kthData.team === undefined ? undefined : kthData.team,
      brl: kthData.brl === undefined ? undefined : kthData.brl,
      iprl: kthData.iprl === undefined ? undefined : kthData.iprl,
      frl: kthData.frl === undefined ? undefined : kthData.frl,
      fecha_creacion: kthData.fecha_creacion === undefined ? undefined : kthData.fecha_creacion
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
      throw new Error('No fields to update');
    }

    const query = `
      UPDATE kth 
      SET ${fields.join(', ')} 
      WHERE id_kth = $${paramIndex} 
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM kth WHERE id_kth = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // DELETE by Project ID
  async deleteByProjectId(projectId: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM kth WHERE id_proyecto = $1',
      [projectId]
    );
    return rowCount != null && rowCount > 0;
  }
};