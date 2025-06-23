import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript para Academico
export interface Academico {
  id_academico: number;
  nombre: string;
  email: string;
  a_materno: string;
  a_paterno: string;
  id_unidad: number | null; // Cambiado para aceptar null
}

// Tipo TypeScript para FotoAcademico
export interface FotoAcademico {
  id_imagen: number;
  id_academico: number;
  foto: Buffer | null; // Puedes usar Buffer para datos binarios (bytea) o string si guardas la ruta
  link: string | null;
}

// Esquema de validación Elysia para Academico (para cuando lo recibes del cliente)
// id_academico no se incluye en el esquema para creación, pero sí para validación de lectura/actualización
export const AcademicoSchema = t.Object({
  id_academico: t.Number(),
  nombre: t.String(),
  email: t.String({ format: "email" }),
  a_materno: t.String(),
  a_paterno: t.String(),
  id_unidad: t.Union([t.Number(), t.Null()]), // Acepta número o null
});

// Esquema de validación Elysia para la creación de Academico (sin id_academico)
export const AcademicoCreateSchema = t.Object({
  nombre: t.String(),
  email: t.String({ format: "email" }),
  a_materno: t.String(),
  a_paterno: t.String(),
  id_unidad: t.Optional(t.Union([t.Number(), t.Null()])), // Opcional y acepta número o null
});

// Esquema de validación Elysia para FotoAcademico
// Para la creación, los campos 'foto' y 'link' serán opcionales y podrían ser undefined
// si no se proporcionan, pero la DB espera null. El modelo debe manejarlo.
export const FotoAcademicoSchema = t.Object({
  id_academico: t.Number(),
  // t.Optional significa que la propiedad puede no estar presente, resultando en `undefined`.
  // Si la DB espera `null` para un valor no proporcionado, la lógica en `createFoto` lo manejará.
  foto: t.Optional(t.Any()), // Puedes especificar un tipo más restrictivo si sabes cómo vas a manejar la foto (e.g., t.String() para base64)
  link: t.Optional(t.String({ format: "uri" })),
});

// Operaciones CRUD completas para Academico y FotoAcademico
export const AcademicoModel = {
  // === Operaciones CRUD para Academico ===

  // CREATE Academico
  async create(academico: {
    nombre: string;
    email: string;
    a_materno: string;
    a_paterno: string;
    id_unidad?: number | null; // Asegura que id_unidad pueda ser opcional o null
  }): Promise<Academico> {
    const { rows } = await pool.query(
      `INSERT INTO academico (nombre, email, a_materno, a_paterno, id_unidad)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`, // RETURNING * devolverá todos los campos, incluyendo el id_academico generado
      [
        academico.nombre,
        academico.email,
        academico.a_materno,
        academico.a_paterno,
        academico.id_unidad === undefined ? null : academico.id_unidad, // Convertir undefined a null
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

    // Iterar sobre las propiedades del objeto academico para construir la consulta de actualización
    if (academico.nombre !== undefined) {
      fields.push(`nombre = $${paramIndex}`);
      values.push(academico.nombre);
      paramIndex++;
    }
    if (academico.email !== undefined) {
      fields.push(`email = $${paramIndex}`);
      values.push(academico.email);
      paramIndex++;
    }
    if (academico.a_materno !== undefined) {
      fields.push(`a_materno = $${paramIndex}`);
      values.push(academico.a_materno);
      paramIndex++;
    }
    if (academico.a_paterno !== undefined) {
      fields.push(`a_paterno = $${paramIndex}`);
      values.push(academico.a_paterno);
      paramIndex++;
    }
    // Permitir la actualización de id_unidad a un número o a null
    // Es importante manejar `undefined` para que si no se envía la propiedad, no se intente actualizarla
    // y si se envía `null`, se actualice a `null`.
    if (academico.id_unidad !== undefined) {
      fields.push(`id_unidad = $${paramIndex}`);
      values.push(academico.id_unidad);
      paramIndex++;
    }

    if (fields.length === 0) {
      // Si no hay campos para actualizar, devolver el académico existente
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
  // La entrada `fotoData` ahora solo incluye `id_academico`, `foto` y `link`
  // Los campos `foto` y `link` pueden ser undefined si no se proporcionan en el cuerpo de la petición.
  // La base de datos espera `null`.
  async createFoto(fotoData: {
    id_academico: number;
    foto?: any; // any, Buffer, string, lo que uses para el archivo
    link?: string;
  }): Promise<FotoAcademico> {
    const { id_academico } = fotoData;
    // Asegurarse de que `undefined` se convierta a `null` para la base de datos.
    const foto = fotoData.foto === undefined ? null : fotoData.foto;
    const link = fotoData.link === undefined ? null : fotoData.link;

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
    // Convertir `undefined` a `null` para la DB si se envía la propiedad pero con valor undefined (raro pero posible)
    // O si quieres que un `undefined` explícito resetee el campo a `null`.
    if (fotoData.foto !== undefined) {
      fields.push(`foto = $${paramIndex}`);
      values.push(fotoData.foto === undefined ? null : fotoData.foto); // Asegura null para undefined
      paramIndex++;
    }
    if (fotoData.link !== undefined) {
      fields.push(`link = $${paramIndex}`);
      values.push(fotoData.link === undefined ? null : fotoData.link); // Asegura null para undefined
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
  async deleteFoto(id: number): Promise<boolean> {
    // CAMBIO: El parámetro aquí es `id`, no `id_imagen` en el nombre del parámetro,
    // pero se usa para buscar por `id_imagen`. Para claridad, renombro `id` a `id_imagen`.
    const { rowCount } = await pool.query(
      "DELETE FROM foto_academico WHERE id_imagen = $1",
      [id]
    ); // Usa el 'id' pasado
    return rowCount != null && rowCount > 0;
  },
};
