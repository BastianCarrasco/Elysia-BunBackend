import { t } from "elysia";
import { pool } from "../../lib/db";

export interface AcademicosXUnidad {
  UnidadAcademica: string;
  NumeroDeProfesores: number;
}

export const AcademicosXUnidadSchema = t.Object({
  UnidadAcademica: t.String(),
  NumeroDeProfesores: t.Number(),
});

export const AcademicosXUnidadModel = {
  async getAll(): Promise<AcademicosXUnidad[]> {
    const query = `
      SELECT
        UA.nombre AS "UnidadAcademica",
        COUNT(A.ID_ACADEMICO)::INTEGER AS "NumeroDeProfesores"
      FROM
        UNIDADACADEMICA AS UA
        LEFT JOIN ACADEMICO AS A ON UA.ID_UNIDAD = A.ID_UNIDAD
      GROUP BY
        UA.nombre
      ORDER BY
        "NumeroDeProfesores" DESC;
    `;

    const { rows } = await pool.query<AcademicosXUnidad>(query);
    // Agregué <AcademicosXUnidad> para tipar las filas directamente desde la consulta.
    return rows;
  },
};

// 1. Interfaz TypeScript para los resultados de la consulta
export interface ProyectosPorProfesor {
  NombreAcademico: string;
  ApellidoAcademico: string;
  UnidadAcademica: string | null; // Puede ser null si el académico no tiene unidad asignada (debido al LEFT JOIN)
  NumeroDeProyectos: number;
}

// 2. Esquema de validación Elysia para la interfaz
export const ProyectosPorProfesorSchema = t.Object({
  NombreAcademico: t.String(),
  ApellidoAcademico: t.String(),
  UnidadAcademica: t.Union([t.String(), t.Null()]), // Puede ser string o null
  NumeroDeProyectos: t.Number(),
});

// 3. Modelo con el método para ejecutar la consulta
export const ProyectosPorProfesorModel = {
  async getAll(): Promise<ProyectosPorProfesor[]> {
    const query = `
      SELECT
          A.nombre AS "NombreAcademico",
          A.a_paterno AS "ApellidoAcademico",
          U.nombre AS "UnidadAcademica",
          COUNT(PA.ID_PROYECTO)::INTEGER AS "NumeroDeProyectos" -- Convertimos a INTEGER explícitamente
      FROM
          ACADEMICO AS A
      JOIN
          PROYECTOACADEMICO AS PA ON A.ID_ACADEMICO = PA.ID_ACADEMICO
      JOIN
          PROYECTO AS P ON PA.ID_PROYECTO = P.ID_PROYECTO
      LEFT JOIN
          UNIDADACADEMICA AS U ON A.ID_UNIDAD = U.ID_UNIDAD
      GROUP BY
          A.ID_ACADEMICO,
          A.nombre,
          A.a_paterno,
          U.nombre
      ORDER BY
          "NumeroDeProyectos" DESC, "NombreAcademico" ASC;
    `;

    // Ejecutamos la consulta y tipamos las filas con la interfaz ProyectosPorProfesor
    const { rows } = await pool.query<ProyectosPorProfesor>(query);

    return rows;
  },
};
