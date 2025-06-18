// model_academicos.ts
import { pool } from "../../lib/db";
import { t } from "elysia";

// Interface TypeScript
export interface AcademicosPorProyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  profesores: string[];
}

// Schema for validation
export const AcademicosPorProyectoSchema = t.Object({
  id_proyecto: t.Number(),
  nombre_proyecto: t.String(),
  profesores: t.Array(t.String()),
});

// Model implementation
export const AcademicosPorProyectoModel = {
  async getAcademicosPorProyecto(): Promise<AcademicosPorProyecto[]> {
    const query = `
            SELECT
                p.ID_proyecto,
                p.nombre AS nombre_proyecto,
                STRING_AGG(
                    CONCAT(AC.nombre, ' ', AC.a_paterno),
                    ', '
                ) AS profesores
            FROM
                PROYECTOACADEMICO AS PA
                JOIN ACADEMICO AS AC ON PA.ID_ACADEMICO = AC.id_ACADEMICO
                JOIN proyecto AS p ON PA.ID_proyecto = p.ID_proyecto
            GROUP BY
                p.ID_proyecto, p.nombre;
        `;

    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return result.rows.map((row) => ({
        id_proyecto: row.id_proyecto,
        nombre_proyecto: row.nombre_proyecto,
        profesores: row.profesores.split(", ").filter(Boolean),
      }));
    } finally {
      client.release();
    }
  },

  async getByProjectId(id: number): Promise<AcademicosPorProyecto> {
    const query = `
            SELECT
                p.ID_proyecto,
                p.nombre AS nombre_proyecto,
                STRING_AGG(
                    CONCAT(AC.nombre, ' ', AC.a_paterno),
                    ', '
                ) AS profesores
            FROM
                PROYECTOACADEMICO AS PA
                JOIN ACADEMICO AS AC ON PA.ID_ACADEMICO = AC.id_ACADEMICO
                JOIN proyecto AS p ON PA.ID_proyecto = p.ID_proyecto
            WHERE
                p.ID_proyecto = $1
            GROUP BY
                p.ID_proyecto, p.nombre;
        `;

    const client = await pool.connect();
    try {
      const result = await client.query(query, [id]);
      if (result.rows.length === 0) {
        throw new Error("Project not found");
      }
      return {
        id_proyecto: result.rows[0].id_proyecto,
        nombre_proyecto: result.rows[0].nombre_proyecto,
        profesores: result.rows[0].profesores.split(", ").filter(Boolean),
      };
    } finally {
      client.release();
    }
  },
};
