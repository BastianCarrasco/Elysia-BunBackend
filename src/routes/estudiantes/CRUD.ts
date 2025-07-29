import { Elysia, t } from "elysia";
import { ProyectoEstudianteModel, EstudianteQueryResult } from "./model"; // Asegúrate que el path a tu modelo sea correcto

export const estudianteRoutes = new Elysia({ prefix: "/estudiantes" })
  // READ (Students by Project ID)
  .get(
    "/EstudiantesPorProyecto/:idProyecto", // Ruta para obtener estudiantes por ID de proyecto
    async ({ params: { idProyecto } }) => {
      const students = await ProyectoEstudianteModel.getStudentsByProjectId(
        Number(idProyecto)
      );
      if (!students || students.length === 0) {
        // Puedes decidir si lanzar un error 404 o retornar un array vacío si no hay estudiantes
        // throw new Error(`No se encontraron estudiantes para el proyecto ${idProyecto}`);
        return []; // Retorna un array vacío si no hay estudiantes
      }
      return students;
    },
    {
      params: t.Object({
        idProyecto: t.Numeric(), // Valida que el parámetro de la URL sea un número
      }),
      // Define el esquema de la respuesta esperada
      response: t.Array(
        t.Object({
          nombre: t.String(),
          a_paterno: t.String(),
        })
      ),
      detail: {
        tags: ["Estudiantes"], // Actualiza los tags para reflejar el recurso
        description:
          "Obtener nombres y apellidos paternos de estudiantes por ID de proyecto",
      },
    }
  );

// Si en el futuro necesitas agregar rutas para CRUD de estudiantes, las añadirías aquí.
// Por ejemplo, para crear un estudiante:
/*
.post(
  '/',
  async ({ body }) => {
    // Lógica para crear un nuevo estudiante si tu modelo de estudiante lo permite
    // const newStudent = await EstudianteModel.create(body);
    // return newStudent;
  },
  {
    body: t.Object({
      nombre: t.String({ maxLength: 50 }),
      a_paterno: t.String({ maxLength: 50 }),
      // ... otros campos
    }),
    response: t.Object({ /* Esquema del estudiante creado *\/ }),
    detail: {
      tags: ['Estudiantes'],
      description: 'Crear un nuevo estudiante'
    }
  }
)
*/
