import { t } from 'elysia';
import { pool } from '../../lib/db';

// Tipo TypeScript
export interface RespuestaCuestionario {
  id: number;
  nombre_investigador: number;
  escuela: number;
  respuesta_1?: string | null;
  respuesta_2?: string | null;
  respuesta_3?: string | null;
  respuesta_4?: string | null;
  respuesta_5?: string | null;
  respuesta_6?: string | null;
  respuesta_7?: string | null;
  respuesta_8?: string | null;
  respuesta_9?: string | null;
  fecha_creacion: Date;
}

// Esquema de validación Elysia
export const RespuestaCuestionarioSchema = t.Object({
  id: t.Number(),
  nombre_investigador: t.Number(),
  escuela: t.Number(),
  respuesta_1: t.Optional(t.String()),
  respuesta_2: t.Optional(t.String()),
  respuesta_3: t.Optional(t.String()),
  respuesta_4: t.Optional(t.String()),
  respuesta_5: t.Optional(t.String()),
  respuesta_6: t.Optional(t.String()),
  respuesta_7: t.Optional(t.String()),
  respuesta_8: t.Optional(t.String()),
  respuesta_9: t.Optional(t.String()),
  fecha_creacion: t.Date(),
});

// Operaciones CRUD
export const RespuestaCuestionarioModel = {
  // CREATE
  async create(respuesta: Omit<RespuestaCuestionario, 'id' | 'fecha_creacion'>): Promise<RespuestaCuestionario> {
    const { rows } = await pool.query(
      `INSERT INTO cuestionario_respuestas (
        nombre_investigador, escuela, respuesta_1, respuesta_2, respuesta_3,
        respuesta_4, respuesta_5, respuesta_6, respuesta_7, respuesta_8, respuesta_9
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        respuesta.nombre_investigador,
        respuesta.escuela,
        respuesta.respuesta_1,
        respuesta.respuesta_2,
        respuesta.respuesta_3,
        respuesta.respuesta_4,
        respuesta.respuesta_5,
        respuesta.respuesta_6,
        respuesta.respuesta_7,
        respuesta.respuesta_8,
        respuesta.respuesta_9
      ]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<RespuestaCuestionario[]> {
    const { rows } = await pool.query('SELECT * FROM cuestionario_respuestas ORDER BY id');
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<RespuestaCuestionario | null> {
    const { rows } = await pool.query(
      'SELECT * FROM cuestionario_respuestas WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number,
    respuesta: Partial<Omit<RespuestaCuestionario, 'id' | 'fecha_creacion'>>
  ): Promise<RespuestaCuestionario | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(respuesta)) {
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
      UPDATE cuestionario_respuestas
      SET ${fields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      'DELETE FROM cuestionario_respuestas WHERE id = $1',
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Obtener respuestas por investigador
  async getByInvestigador(investigadorId: number): Promise<RespuestaCuestionario[]> {
    const { rows } = await pool.query(
      'SELECT * FROM cuestionario_respuestas WHERE nombre_investigador = $1',
      [investigadorId]
    );
    return rows;
  },

  // Obtener respuestas por escuela
  async getByEscuela(escuelaId: number): Promise<RespuestaCuestionario[]> {
    const { rows } = await pool.query(
      'SELECT * FROM cuestionario_respuestas WHERE escuela = $1',
      [escuelaId]
    );
    return rows;
  }
};