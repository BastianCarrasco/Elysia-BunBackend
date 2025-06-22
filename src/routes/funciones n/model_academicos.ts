// model_academicos.ts
import { pool } from "../../lib/db";
import { t } from "elysia";

// Nuevo tipo para un profesor individual dentro de un proyecto
export interface ProfesorProyecto {
  id_academico: number;
  nombre_completo: string;
}

// Interface TypeScript actualizada para AcademicosPorProyecto
export interface AcademicosPorProyecto {
  id_proyecto: number;
  nombre_proyecto: string;
  // Ahora profesores será un array de objetos ProfesorProyecto
  profesores: ProfesorProyecto[];
}

// Schema for validation (actualizado para el nuevo tipo de profesores)
export const AcademicosPorProyectoSchema = t.Object({
  id_proyecto: t.Number(),
  nombre_proyecto: t.String(),
  profesores: t.Array(
    t.Object({
      id_academico: t.Number(),
      nombre_completo: t.String(),
    })
  ),
});

// Model implementation
export const AcademicosPorProyectoModel = {
  async getAcademicosPorProyecto(): Promise<AcademicosPorProyecto[]> {
    // Modificamos la consulta para agrupar IDs y nombres completos como JSON
    const query = `
            SELECT
                p.ID_proyecto,
                p.nombre AS nombre_proyecto,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id_academico', AC.id_academico,
                        'nombre_completo', CONCAT(AC.nombre, ' ', AC.a_paterno)
                    )
                    ORDER BY AC.nombre, AC.a_paterno -- Opcional: ordenar los profesores dentro del array
                ) AS profesores_json
            FROM
                PROYECTOACADEMICO AS PA
                JOIN ACADEMICO AS AC ON PA.ID_ACADEMICO = AC.id_ACADEMICO
                JOIN proyecto AS p ON PA.ID_proyecto = p.ID_proyecto
            GROUP BY
                p.ID_proyecto, p.nombre
            ORDER BY
                p.nombre; -- Opcional: ordenar los proyectos
        `;

    const client = await pool.connect();
    try {
      const result = await client.query(query);
      return result.rows.map((row) => ({
        id_proyecto: row.id_proyecto,
        nombre_proyecto: row.nombre_proyecto,
        // PostgreSQL devuelve JSON_AGG como un string, necesitamos parsearlo
        profesores: row.profesores_json, // Ya es un array de objetos parseado por el driver pg
      }));
    } finally {
      client.release();
    }
  },

  async getByProjectId(id: number): Promise<AcademicosPorProyecto | null> {
    const query = `
            SELECT
                p.ID_proyecto,
                p.nombre AS nombre_proyecto,
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id_academico', AC.id_academico,
                        'nombre_completo', CONCAT(AC.nombre, ' ', AC.a_paterno)
                    )
                    ORDER BY AC.nombre, AC.a_paterno
                ) AS profesores_json
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
        return null; // Retornar null si el proyecto no se encuentra
      }
      return {
        id_proyecto: result.rows[0].id_proyecto,
        nombre_proyecto: result.rows[0].nombre_proyecto,
        profesores: result.rows[0].profesores_json,
      };
    } finally {
      client.release();
    }
  },
};
