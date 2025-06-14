import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript
export interface Proyectoacademico {
  id: number;
  id_proyecto?: number | null;
  id_academico?: number | null;
  jefe?: number | null;
}

// Esquema de validación Elysia
export const ProyectoacademicoSchema = t.Object({
  id: t.Number(),
  id_proyecto: t.Optional(t.Union([t.Number(), t.Null()])),
  id_academico: t.Optional(t.Union([t.Number(), t.Null()])),
  jefe: t.Optional(t.Union([t.Number(), t.Null()])),
});

// Operaciones CRUD
export const ProyectoacademicoModel = {
  // CREATE
  async create(
    proyectoacademicoData: Omit<Proyectoacademico, "id">
  ): Promise<Proyectoacademico> {
    const { rows } = await pool.query(
      `INSERT INTO proyectoacademico (
        id_proyecto, id_academico, jefe
      ) 
      VALUES ($1, $2, $3)
      RETURNING *`,
      [
        proyectoacademicoData.id_proyecto,
        proyectoacademicoData.id_academico,
        proyectoacademicoData.jefe,
      ]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Proyectoacademico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM proyectoacademico ORDER BY id"
    );
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Proyectoacademico | null> {
    const { rows } = await pool.query(
      "SELECT * FROM proyectoacademico WHERE id = $1",
      [id]
    );
    return rows[0] || null;
  },

  // READ by Project ID
  async getByProjectId(projectId: number): Promise<Proyectoacademico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM proyectoacademico WHERE id_proyecto = $1",
      [projectId]
    );
    return rows;
  },

  // READ by Academico ID
  async getByAcademicoId(academicoId: number): Promise<Proyectoacademico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM proyectoacademico WHERE id_academico = $1",
      [academicoId]
    );
    return rows;
  },

  // READ Jefes
  async getJefes(): Promise<Proyectoacademico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM proyectoacademico WHERE jefe = 1"
    );
    return rows;
  },

  // UPDATE
  async update(
    id: number,
    proyectoacademicoData: Partial<Omit<Proyectoacademico, "id">>
  ): Promise<Proyectoacademico | null> {
    const updateData = {
      id_proyecto:
        proyectoacademicoData.id_proyecto === undefined
          ? undefined
          : proyectoacademicoData.id_proyecto,
      id_academico:
        proyectoacademicoData.id_academico === undefined
          ? undefined
          : proyectoacademicoData.id_academico,
      jefe:
        proyectoacademicoData.jefe === undefined
          ? undefined
          : proyectoacademicoData.jefe,
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
      throw new Error("No fields to update");
    }

    const query = `
      UPDATE proyectoacademico 
      SET ${fields.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM proyectoacademico WHERE id = $1",
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // DELETE by Project ID
  async deleteByProjectId(projectId: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM proyectoacademico WHERE id_proyecto = $1",
      [projectId]
    );
    return rowCount != null && rowCount > 0;
  },

  // DELETE by Academico ID
  async deleteByAcademicoId(academicoId: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM proyectoacademico WHERE id_academico = $1",
      [academicoId]
    );
    return rowCount != null && rowCount > 0;
  },
};
