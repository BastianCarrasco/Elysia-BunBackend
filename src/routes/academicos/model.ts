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

// Operaciones de base de datos
export const AcademicoModel = {
  async getAll(): Promise<Academico[]> {
    const { rows } = await pool.query('SELECT * FROM academico');
    return rows;
  },

  async getById(id: number): Promise<Academico | null> {
    const { rows } = await pool.query('SELECT * FROM academicos WHERE id_academico = $1', [id]);
    return rows[0] || null;
  },

  async create(academico: Omit<Academico, 'id_academico'>): Promise<Academico> {
    const { rows } = await pool.query(
      `INSERT INTO academicos (nombre, email, a_materno, a_paterno) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [academico.nombre, academico.email, academico.a_materno, academico.a_paterno]
    );
    return rows[0];
  }
};