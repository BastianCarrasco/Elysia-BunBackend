import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript para Academico
export interface Academico {
  id_academico: number;
  nombre: string;
  email: string;
  a_materno: string;
  a_paterno: string;
}

// Tipo TypeScript para FotoAcademico
export interface FotoAcademico {
  id_imagen: number;
  id_academico: number;
  foto: Buffer | null; // Puedes usar Buffer para datos binarios (bytea) o string si guardas la ruta
  link: string | null;
}

// Esquema de validación Elysia para Academico
export const AcademicoSchema = t.Object({
  id_academico: t.Number(),
  nombre: t.String(),
  email: t.String({ format: "email" }),
  a_materno: t.String(),
  a_paterno: t.String(),
});

// Esquema de validación Elysia para FotoAcademico (sin id_imagen para la creación)
export const FotoAcademicoSchema = t.Object({
  id_academico: t.Number(),
  foto: t.Optional(t.Any()), // Puedes especificar un tipo más restrictivo si sabes cómo vas a manejar la foto (e.g., t.String() para base64)
  link: t.Optional(t.String({ format: "uri" })),
});

// Operaciones CRUD completas para Academico y FotoAcademico
export const AcademicoModel = {
  // === Operaciones CRUD para Academico ===

  // CREATE Academico
  async create(academico: Omit<Academico, "id_academico">): Promise<Academico> {
    const { rows } = await pool.query(
      `INSERT INTO academico (nombre, email, a_materno, a_paterno)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        academico.nombre,
        academico.email,
        academico.a_materno,
        academico.a_paterno,
      ]
    );
    return rows[0];
  },

  // READ All Academico
  async getAll(): Promise<Academico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM academico ORDER BY nombre"
    );
    return rows;
  },

  // READ One Academico
  async getById(id: number): Promise<Academico | null> {
    const { rows } = await pool.query(
      "SELECT * FROM academico WHERE id_academico = $1",
      [id]
    );
    return rows[0] || null;
  },

  // UPDATE Academico
  async update(
    id: number,
    academico: Partial<Omit<Academico, "id_academico">>
  ): Promise<Academico | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(academico)) {
      // Asegurarse de que el valor no sea undefined (o null si no quieres actualizar a null)
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      // Devolver el académico existente si no hay campos para actualizar
      return this.getById(id);
    }

    const query = `
      UPDATE academico
      SET ${fields.join(", ")}
      WHERE id_academico = $${paramIndex}
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE Academico
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM academico WHERE id_academico = $1",
      [id]
    );
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda adicional de Academico
  async searchByName(name: string): Promise<Academico[]> {
    const { rows } = await pool.query(
      `SELECT * FROM academico
       WHERE nombre ILIKE $1 OR a_paterno ILIKE $1 OR a_materno ILIKE $1`,
      [`%${name}%`]
    );
    return rows;
  },

  // === Operaciones CRUD para FotoAcademico ===

  // CREATE FotoAcademico
  async createFoto(
    fotoData: Omit<FotoAcademico, "id_imagen">
  ): Promise<FotoAcademico> {
    const { id_academico, foto, link } = fotoData;
    const { rows } = await pool.query(
      `INSERT INTO foto_academico (id_academico, foto, link)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [id_academico, foto, link]
    );
    return rows[0];
  },

  // READ All Fotos de un Academico (específico)
  async getFotosByAcademicoId(id_academico: number): Promise<FotoAcademico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM foto_academico WHERE id_academico = $1 ORDER BY id_imagen",
      [id_academico]
    );
    return rows;
  },

  // READ ALL Fotos (TODAS las fotos de todos los académicos) - ¡NUEVO MÉTODO!
  async getAllFotos(): Promise<FotoAcademico[]> {
    const { rows } = await pool.query(
      "SELECT * FROM foto_academico ORDER BY id_academico, id_imagen"
    );
    return rows;
  },

  // READ One Foto (por id_imagen)
  async getFotoById(id_imagen: number): Promise<FotoAcademico | null> {
    const { rows } = await pool.query(
      "SELECT * FROM foto_academico WHERE id_imagen = $1",
      [id_imagen]
    );
    return rows[0] || null;
  },

  // UPDATE FotoAcademico
  async updateFoto(
    id_imagen: number,
    fotoData: Partial<Omit<FotoAcademico, "id_imagen" | "id_academico">>
  ): Promise<FotoAcademico | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    // Solo actualizamos 'foto' y 'link'
    if (fotoData.foto !== undefined) {
      fields.push(`foto = $${paramIndex}`);
      values.push(fotoData.foto);
      paramIndex++;
    }
    if (fotoData.link !== undefined) {
      fields.push(`link = $${paramIndex}`);
      values.push(fotoData.link);
      paramIndex++;
    }

    if (fields.length === 0) {
      // Devolver la foto existente si no hay campos para actualizar
      return this.getFotoById(id_imagen);
    }

    const query = `
      UPDATE foto_academico
      SET ${fields.join(", ")}
      WHERE id_imagen = $${paramIndex}
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id_imagen]);
    return rows[0] || null;
  },

  // DELETE FotoAcademico
  async deleteFoto(id_imagen: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      "DELETE FROM foto_academico WHERE id_imagen = $1",
      [id_imagen]
    );
    return rowCount != null && rowCount > 0;
  },
};
