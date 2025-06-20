import { pool } from "../../lib/db";
import { t } from "elysia";

export interface AcademicoProyecto {
  id: number;
  jefe: 0 | 1; // 1 para jefe, 0 para no jefe
}

export interface ProyectoConAcademicos {
  nombre: string;
  monto: number;
  fecha_postulacion: string | Date;
  comentarios: string;
  unidad: number;
  id_tematica: number;
  id_estatus: number;
  tipo_convocatoria: number;
  inst_conv: number;
  detalle_apoyo: string;
  apoyo: number;
  convocatoria: string;
  academicos: AcademicoProyecto[];
}

export const ProyectoAcademicoSchema = t.Object({
  nombre: t.String(),
  monto: t.Number(),
  fecha_postulacion: t.Union([t.Date(), t.String({ format: "date-time" })]),
  comentarios: t.String(),
  unidad: t.Number(),
  id_tematica: t.Number(),
  id_estatus: t.Number(),
  tipo_convocatoria: t.Number(),
  inst_conv: t.Number(),
  detalle_apoyo: t.String(),
  apoyo: t.Number(),
  convocatoria: t.String(),
  academicos: t.Array(
    t.Object({
      id: t.Number(),
      jefe: t.Union([t.Literal(0), t.Literal(1)]),
    })
  ),
});

export const ModelAcademicoXProyecto = {
  // Define a method to call the stored procedure
  async crearProyectoConAcademicos(data: ProyectoConAcademicos) {
    const {
      nombre,
      monto,
      fecha_postulacion,
      comentarios,
      unidad,
      id_tematica,
      id_estatus,
      tipo_convocatoria,
      inst_conv,
      detalle_apoyo,
      apoyo,
      convocatoria,
      academicos,
    } = data;

    try {
      const result = await pool.query(
        `CALL public.crear_proyecto_con_academicos(
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
        )`,
        [
          nombre,
          monto,
          fecha_postulacion instanceof Date
            ? fecha_postulacion.toISOString().split("T")[0]
            : fecha_postulacion,
          comentarios,
          unidad,
          id_tematica,
          id_estatus,
          tipo_convocatoria,
          inst_conv,
          detalle_apoyo,
          apoyo,
          convocatoria,
          JSON.stringify(academicos), // Convert academicos array to JSON string
        ]
      );
      return result; // Or handle success message as needed
    } catch (error) {
      console.error("Error calling crear_proyecto_con_academicos:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  },
};
