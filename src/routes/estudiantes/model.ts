import { t } from "elysia";
import { pool } from "../../lib/db";

// Tipo TypeScript para Estudiante con los campos que obtendrás de la consulta
export interface EstudianteQueryResult {
  nombre: string;
  a_paterno: string;
}

// Nota: No se requiere un esquema Elysia para Estudiante si solo vas a consultar datos.
// Si en el futuro necesitas validar entradas para crear/actualizar estudiantes,
// entonces sí definirías un esquema completo aquí.

// Modelo para operaciones relacionadas con PROYECTO_ESTUDIANTE y ESTUDIANTES
export const ProyectoEstudianteModel = {
  /**
   * Obtiene los nombres y apellidos paternos de los estudiantes
   * asociados a un proyecto específico.
   * @param id_proyecto El ID del proyecto.
   * @returns Una promesa que resuelve con un array de objetos { nombre: string, a_paterno: string }.
   */
  async getStudentsByProjectId(
    id_proyecto: number
  ): Promise<EstudianteQueryResult[]> {
    const { rows } = await pool.query(
      `SELECT
         E.nombre,
         E.a_paterno
       FROM
         PROYECTO_ESTUDIANTE AS PE
         JOIN ESTUDIANTES AS E ON E.ID_ESTUDIANTES = PE.ID_ESTUDIANTE
       WHERE
         ID_PROYECTO = $1`,
      [id_proyecto]
    );
    return rows;
  },

  // Puedes añadir aquí otras funciones relacionadas con proyectos y estudiantes
  // Por ejemplo, para añadir o quitar estudiantes de un proyecto si lo necesitas:
  /*
  async addStudentToProject(id_proyecto: number, id_estudiante: number): Promise<void> {
    await pool.query(
      `INSERT INTO PROYECTO_ESTUDIANTE (ID_PROYECTO, ID_ESTUDIANTE)
       VALUES ($1, $2)`,
      [id_proyecto, id_estudiante]
    );
  },

  async removeStudentFromProject(id_proyecto: number, id_estudiante: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      `DELETE FROM PROYECTO_ESTUDIANTE
       WHERE ID_PROYECTO = $1 AND ID_ESTUDIANTE = $2`,
      [id_proyecto, id_estudiante]
    );
    return rowCount != null && rowCount > 0;
  }
  */
};
