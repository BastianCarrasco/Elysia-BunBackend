import { Elysia, t } from "elysia";
import { pool } from "../lib/db";

export const healthRoutes = new Elysia({ prefix: '/health' })
  .get("/", () => ({ status: "ok" }), {
    detail: {
      tags: ['Health'],
      description: 'Health check básico',
      responses: {
        200: { description: 'Servicio en funcionamiento' }
      }
    }
  })
  .get("/db", async () => {
    const { rows } = await pool.query('SELECT NOW() as time');
    return { db_time: rows[0].time };
  }, {
    detail: {
      tags: ['Health'],
      description: 'Verifica conexión a la base de datos',
      responses: {
        200: { description: 'Hora actual de la base de datos' }
      }
    }
  })
  .get("/tables", async () => {
    const { rows } = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    return { tables: rows.map(row => row.table_name) };
  }, {
    detail: {
      tags: ['Health'],
      description: 'Lista todas las tablas en la base de datos',
      responses: {
        200: { 
          description: 'Listado de tablas',
          content: {
            'application/json': {
              example: {
                tables: ["academico", "unidad_academica"]
              }
            }
          }
        }
      }
    }
  })
  .get("/tables-detailed", async () => {
    const { rows } = await pool.query(`
      SELECT 
        table_name,
        column_name,
        data_type,
        is_nullable,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `);
    
    const tablesInfo = rows.reduce((acc, row) => {
      if (!acc[row.table_name]) {
        acc[row.table_name] = [];
      }
      acc[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES',
        max_length: row.character_maximum_length
      });
      return acc;
    }, {});

    return { tables: tablesInfo };
  }, {
    detail: {
      tags: ['Health'],
      description: 'Estructura detallada de todas las tablas',
      responses: {
        200: { 
          description: 'Metadatos de las tablas',
          content: {
            'application/json': {
              example: {
                tables: {
                  "academico": [
                    {
                      "column": "id_academico",
                      "type": "integer",
                      "nullable": false,
                      "max_length": null
                    },
                    {
                      "column": "nombre",
                      "type": "character varying",
                      "nullable": true,
                      "max_length": 255
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  });