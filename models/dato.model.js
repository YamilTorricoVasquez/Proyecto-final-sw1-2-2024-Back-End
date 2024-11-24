import { text } from 'express'
import { db } from '../database/connection.database.js'




const registrar = async ({ nombre_interpretador,fecha,contador,id_bebe }) => {
    const query = {
        text: `insert into datos(nombre_interpretador, fecha,contador,id_bebe) values($1, $2, $3, $4) returning *`,
        values: [nombre_interpretador,fecha,contador,id_bebe]
    }

    const { rows } = await db.query(query)
    return rows[0]
}


const obtener = async (id_bebe) => {
    const query = {
        text: `SELECT 
    nombre_interpretador,
    SUM(contador) AS total_contador
FROM 
    datos
WHERE 
    nombre_interpretador != 'Ruido' and id_bebe=$1
GROUP BY 
    nombre_interpretador;`,
    values:[id_bebe]
    }
    const { rows } = await db.query(query)
    return rows
}

export const datoModel = {
    registrar,
    obtener
}