import { pool } from "../../lib/db";
import { t } from "elysia";

export interface AcademicoProyecto {
  id: number;
  jefe: 0 | 1; // Mantengo 0 | 1 porque es lo más común para jefe/no-jefe
}

export interface ProyectoConAcademicos {
  nombre: string;
  monto: number | null; // Cambiado a permitir null directamente
  fecha_postulacion: string | Date | null;
  comentarios: string | null; // Cambiado a permitir null directamente
  unidad: number | null; // Cambiado a permitir null directamente
  id_tematica: number | null; // Cambiado a permitir null directamente
  id_estatus: number | null; // Cambiado a permitir null directamente
  tipo_convocatoria: number | null; // Cambiado a permitir null directamente
  inst_conv: number | null; // Cambiado a permitir null directamente
  detalle_apoyo: string | null; // Cambiado a permitir null directamente
  apoyo: number | null; // Cambiado a permitir null directamente
  convocatoria: string | null; // Cambiado a permitir null directamente
  academicos: AcademicoProyecto[];
}

export const ProyectoAcademicoSchema = t.Object({
  nombre: t.String(),
  monto: t.Union([t.Number(), t.Null()]),
  fecha_postulacion: t.Union([
    t.Date(),
    t.String({ format: "date-time" }),
    t.Null(),
  ]),
  comentarios: t.Union([t.String(), t.Null()]),
  unidad: t.Union([t.Number(), t.Null()]),
  id_tematica: t.Union([t.Number(), t.Null()]),
  id_estatus: t.Union([t.Number(), t.Null()]),
  tipo_convocatoria: t.Union([t.Number(), t.Null()]),
  inst_conv: t.Union([t.Number(), t.Null()]),
  detalle_apoyo: t.Union([t.String(), t.Null()]),
  apoyo: t.Union([t.Number(), t.Null()]),
  convocatoria: t.Union([t.String(), t.Null()]),
  academicos: t.Array(
    t.Object({
      id: t.Number(),
      jefe: t.Union([t.Literal(0), t.Literal(1)]),
    })
  ),
});

export const ModelAcademicoXProyecto = {
  async crearProyectoConAcademicos(data: ProyectoConAcademicos) {
    // Si el frontend envía null, simplemente lo pasamos como null.
    // No hay necesidad de un valor "default" si el default es null.
    const nombre = data.nombre;
    const monto = data.monto;
    const fecha_postulacion = data.fecha_postulacion;
    const comentarios = data.comentarios;
    const unidad = data.unidad;
    const id_tematica = data.id_tematica;
    const id_estatus = data.id_estatus;
    const tipo_convocatoria = data.tipo_convocatoria;
    const inst_conv = data.inst_conv;
    const detalle_apoyo = data.detalle_apoyo;
    const apoyo = data.apoyo;
    const convocatoria = data.convocatoria;
    const academicos = data.academicos;

    try {
      const result = await pool.query(
        `CALL crear_proyecto_con_academicos(
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
          JSON.stringify(academicos),
        ]
      );
      return result;
    } catch (error) {
      console.error("Error calling crear_proyecto_con_academicos:", error);
      throw error;
    }
  },
};
