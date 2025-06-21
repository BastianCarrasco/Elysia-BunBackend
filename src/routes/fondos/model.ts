import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript
export interface Fondo {
  id: number;
  nombre?: string | null;
  inicio?: Date | string | null;
  cierre?: Date | string | null;
  financiamiento?: string | null;
  plazo?: string | null;
  objetivo?: string | null;
  trl?: number | null;
  crl?: number | null;
  team?: number | null;
  brl?: number | null;
  iprl?: number | null;
  frl?: number | null;
  tipo?: number | null;
  req?: string | null;
}

// Esquema de validación Elysia
export const FondoSchema = t.Object({
  id: t.Number(),
  nombre: t.Optional(t.Union([t.String({ maxLength: 100 }), t.Null()])),
  inicio: t.Optional(
    t.Union([t.Date(), t.String({ format: "date" }), t.Null()])
  ),
  cierre: t.Optional(
    t.Union([t.Date(), t.String({ format: "date" }), t.Null()])
  ),
  financiamiento: t.Optional(t.Union([t.String({ maxLength: 20 }), t.Null()])),
  plazo: t.Optional(t.Union([t.String({ maxLength: 20 }), t.Null()])),
  objetivo: t.Optional(t.Union([t.String(), t.Null()])),
  trl: t.Optional(t.Union([t.Number(), t.Null()])),
  crl: t.Optional(t.Union([t.Number(), t.Null()])),
  team: t.Optional(t.Union([t.Number(), t.Null()])),
  brl: t.Optional(t.Union([t.Number(), t.Null()])),
  iprl: t.Optional(t.Union([t.Number(), t.Null()])),
  frl: t.Optional(t.Union([t.Number(), t.Null()])),
  tipo: t.Optional(t.Union([t.Number(), t.Null()])),
  req: t.Optional(t.Union([t.String(), t.Null()])),
});

// Operaciones CRUD
export const FondoModel = {
  // CREATE
  async create(fondoData: Omit<Fondo, "id">): Promise<Fondo> {
    const { rows } = await pool.query(
      `INSERT INTO fondos (
        nombre, inicio, cierre, financiamiento, plazo, objetivo,
        trl, crl, team, brl, iprl, frl, tipo, req
      ) 
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12, $13, $14
      ) 
      RETURNING *`,
      [
        fondoData.nombre,
        fondoData.inicio,
        fondoData.cierre,
        fondoData.financiamiento,
        fondoData.plazo,
        fondoData.objetivo,
        fondoData.trl,
        fondoData.crl,
        fondoData.team,
        fondoData.brl,
        fondoData.iprl,
        fondoData.frl,
        fondoData.tipo,
        fondoData.req,
      ]
    );
    return rows[0];
  },

  // READ (All)
  async getAll(): Promise<Fondo[]> {
    const { rows } = await pool.query("SELECT * FROM fondos ORDER BY nombre");
    return rows;
  },

  // READ (One)
  async getById(id: number): Promise<Fondo | null> {
    const { rows } = await pool.query("SELECT * FROM fondos WHERE id = $1", [
      id,
    ]);
    return rows[0] || null;
  },

  // UPDATE
  async update(
    id: number,
    fondoData: Partial<Omit<Fondo, "id">>
  ): Promise<Fondo | null> {
    // Create update object with explicit undefined/null handling
    const updateData = {
      nombre: fondoData.nombre === undefined ? undefined : fondoData.nombre,
      inicio: fondoData.inicio === undefined ? undefined : fondoData.inicio,
      cierre: fondoData.cierre === undefined ? undefined : fondoData.cierre,
      financiamiento:
        fondoData.financiamiento === undefined
          ? undefined
          : fondoData.financiamiento,
      plazo: fondoData.plazo === undefined ? undefined : fondoData.plazo,
      objetivo:
        fondoData.objetivo === undefined ? undefined : fondoData.objetivo,
      trl: fondoData.trl === undefined ? undefined : fondoData.trl,
      crl: fondoData.crl === undefined ? undefined : fondoData.crl,
      team: fondoData.team === undefined ? undefined : fondoData.team,
      brl: fondoData.brl === undefined ? undefined : fondoData.brl,
      iprl: fondoData.iprl === undefined ? undefined : fondoData.iprl,
      frl: fondoData.frl === undefined ? undefined : fondoData.frl,
      tipo: fondoData.tipo === undefined ? undefined : fondoData.tipo,
      req: fondoData.req === undefined ? undefined : fondoData.req,
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
      throw new Error("No hay campos para actualizar");
    }

    const query = `
      UPDATE fondos 
      SET ${fields.join(", ")} 
      WHERE id = $${paramIndex} 
      RETURNING *
    `;

    const { rows } = await pool.query(query, [...values, id]);
    return rows[0] || null;
  },

  // DELETE
  async delete(id: number): Promise<boolean> {
    const { rowCount } = await pool.query("DELETE FROM fondos WHERE id = $1", [
      id,
    ]);
    return rowCount != null && rowCount > 0;
  },

  // Búsqueda por nombre (opcional)
  async searchByName(nombre: string): Promise<Fondo[]> {
    const { rows } = await pool.query(
      `SELECT * FROM fondos 
       WHERE nombre ILIKE $1`,
      [`%${nombre}%`]
    );
    return rows;
  },
};
