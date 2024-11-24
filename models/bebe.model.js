
import { text } from 'express'
import { db } from '../database/connection.database.js'

const registrar = async ({ nombre, fecha_nacimiento, genero, ci_usuario }) => {
    const query = {
        text: 'insert into bebe(nombre, fecha_nacimiento, genero, ci_usuario) values($1,$2,$3,$4) returning *',
        values: [nombre, fecha_nacimiento, genero, ci_usuario]
    }

    const { rows } = await db.query(query)
    return rows[0]
}

const obtenerBebe = async (ci_padre) => {
    const query = {
        text: `select id,nombre,fecha_nacimiento,genero from bebe where ci_usuario=$1`,
        values: [ci_padre]
    }
    const { rows } = await db.query(query)
    return rows
}
const obtenerDatoBebe = async (id_bebe) => {
    const query = {
        text: `select id,nombre,fecha_nacimiento,genero from bebe where id=$1`,
        values: [id_bebe]
    }
    const { rows } = await db.query(query)
    return rows[0]
}
const verifNombreBebe = async (nombre) => {
    const query = {
        text: `select * from bebe where nombre=$1`,
        values: [nombre]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const actualizarDatos = async (nombre, nombreN, fecha_nacimiento, genero) => { // uid es el parámetro que recibe la función findOneByUid
    const query = {
        text: `UPDATE bebe SET nombre = $2,fecha_nacimiento=$3,genero=$4 WHERE nombre = $1 RETURNING *`,
        values: [nombre, nombreN, fecha_nacimiento, genero]
    }
    const { rows } = await db.query(query)
    return rows[0]
}
const eliminarBebe = async (nombre, ci_usuario) => {
    const query = {
        text: `delete from bebe where nombre=$1 and ci_usuario=$2`,
        values: [nombre, ci_usuario]
    }
    const { rows } = await db.query(query)
    return rows
}
const vacunasBebe = async (fecha_nacimiento) => {
    const query = {
        text: `SELECT 
                    nombre_vacuna,
                    (fecha_nacimiento + INTERVAL '1 day' * dias_desde_nacimiento) AS fecha_vacunacion
                FROM 
                    vacunas,
                    (SELECT $1::DATE AS fecha_nacimiento) AS bebe
                ORDER BY fecha_vacunacion;`,  // Agregamos la cláusula ORDER BY
        values: [fecha_nacimiento]
    };
    const { rows } = await db.query(query);
    return rows;
}

const asignarEsquemaVacunas = async ({ id_bebe }) => {
    const query = {
        text: `INSERT INTO esquema_vacunacion (id_bebe, id_vacuna, fecha_programada, aplicada)
SELECT 
    b.id AS id_bebe,
    v.id AS id_vacuna,
    b.fecha_nacimiento + INTERVAL '1 day' * v.dias_desde_nacimiento AS fecha_programada,
    'pendiente' AS aplicada
FROM 
    bebe b,
    vacunas v
WHERE 
    b.id = $1 RETURNING *`,
        values: [id_bebe]
    }

    const { rows } = await db.query(query)
    return rows[0]
}
const obtenerEsquemaVacunacion = async (id_bebe) => {
    const query = {
        text: `select fecha_programada,aplicada,nombre_vacuna,id_vacuna from esquema_vacunacion as e,vacunas as v where e.id_vacuna=v.id and id_bebe=$1 and aplicada='pendiente'
        order by fecha_programada`,
        values: [id_bebe]
    }
    const { rows } = await db.query(query)
    return rows
}
const obtenerEsquemaVacunacionAplicado = async (id_bebe) => {
    const query = {
        text: `select fecha_programada,aplicada,nombre_vacuna,id_vacuna from esquema_vacunacion as e,vacunas as v where e.id_vacuna=v.id and id_bebe=$1 and aplicada='aplicado'
        order by fecha_programada`,
        values: [id_bebe]
    }
    const { rows } = await db.query(query)
    return rows
}
const verificarEsquemaVacunas = async (id_bebe) => {
    const query = {
        text: 'SELECT * FROM esquema_vacunacion WHERE id_bebe = $1 ',
        values: [id_bebe]
    };

    const result = await db.query(query);
    return result.rows.length > 0; // Devuelve true si hay esquemas existentes
};
const actualizarEstadoVacuna = async (id_bebe, id_vacuna) => {
    const query = {
        text: `update  esquema_vacunacion set aplicada='aplicado' where id_bebe=$1 and id_vacuna=$2`,
        values: [id_bebe, id_vacuna]
    }
    const { rows } = await db.query(query)
    return rows
}
const actualizarEsquemaVacunacion = async (id_bebe) => {
    const query = {
        text: `UPDATE esquema_vacunacion
SET fecha_programada = (
    SELECT b.fecha_nacimiento + INTERVAL '1 day' * v.dias_desde_nacimiento
    FROM bebe b
    JOIN vacunas v ON esquema_vacunacion.id_vacuna = v.id
    WHERE b.id = esquema_vacunacion.id_bebe
)
WHERE id_bebe = $1`,
        values: [id_bebe]
    }
    const { rows } = await db.query(query)
    return rows
}
export const bebeModel = {
    registrar,
    obtenerBebe,
    verifNombreBebe,
    actualizarDatos,
    eliminarBebe,
    vacunasBebe,
    asignarEsquemaVacunas,
    obtenerEsquemaVacunacion,
    verificarEsquemaVacunas,
    actualizarEstadoVacuna,
    actualizarEsquemaVacunacion,
    obtenerEsquemaVacunacionAplicado,
    obtenerDatoBebe
}
