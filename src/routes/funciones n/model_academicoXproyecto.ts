import { pool } from "../../lib/db";
import { t } from "elysia";

export interface AcademicoProyecto {
  id: number;
  jefe: 0 | 1; // Mantengo 0 | 1 porque es lo más común para jefe/no-jefe
}

export interface ProyectoConAcademicos {
  nombre: string;
  monto: number;
  fecha_postulacion: string | Date | null;
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

// ... (imports y interfaces)

export const ProyectoAcademicoSchema = t.Object({
  nombre: t.String(),
  monto: t.Union([t.Number(), t.Null()]), // También podría ser null al inicio
  fecha_postulacion: t.Union([
    t.Date(),
    t.String({ format: "date-time" }),
    t.Null(),
  ]),
  comentarios: t.Union([t.String(), t.Null()]), // Si comments también puede ser null/vacío
  unidad: t.Union([t.Number(), t.Null()]),
  id_tematica: t.Union([t.Number(), t.Null()]),
  id_estatus: t.Union([t.Number(), t.Null()]),
  tipo_convocatoria: t.Union([t.Number(), t.Null()]),
  inst_conv: t.Union([t.Number(), t.Null()]),
  detalle_apoyo: t.Union([t.String(), t.Null()]), // Si detalle_apoyo también puede ser null/vacío
  apoyo: t.Union([t.Number(), t.Null()]),
  convocatoria: t.Union([t.String(), t.Null()]), // Si convocatoria también puede ser null/vacío
  academicos: t.Array(
    t.Object({
      id: t.Number(),
      jefe: t.Union([t.Literal(0), t.Literal(1)]),
    })
  ),
});

export const ModelAcademicoXProyecto = {
  async crearProyectoConAcademicos(data: ProyectoConAcademicos) {
    // Aplicar valores por defecto si el frontend envió null
    const nombre = data.nombre; // nombre es requerido, no debería ser null
    const monto = data.monto ?? 1; // Usar 1 como default si es null (o 0 si prefieres)
    const fecha_postulacion = data.fecha_postulacion; // null se mantiene null
    const comentarios = data.comentarios ?? ""; // Usar "" como default si es null
    const unidad = data.unidad ?? 1; // Usar 1 como default si es null
    const id_tematica = data.id_tematica ?? 1; // Usar 1 como default si es null
    const id_estatus = data.id_estatus ?? 1; // Usar 1 como default si es null
    const tipo_convocatoria = data.tipo_convocatoria ?? 1; // Usar 1 como default si es null
    const inst_conv = data.inst_conv ?? 1; // Usar 1 como default si es null
    const detalle_apoyo = data.detalle_apoyo ?? ""; // Usar "" como default si es null
    const apoyo = data.apoyo ?? 1; // Usar 1 como default si es null
    const convocatoria = data.convocatoria ?? ""; // Usar "" como default si es null
    const academicos = data.academicos; // Requerido, no debería ser null

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
