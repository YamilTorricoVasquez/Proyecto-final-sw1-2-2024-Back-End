import { text } from 'express'
import { db } from '../database/connection.database.js'




const obtenerRecomendaciones = async (nombre_interpretador) => {
    const query = {
        text: `select nombre,nombre_interpretador,titulo from soluciones as s,recomendaciones as r where r.id = s.id_recomendacion and nombre_interpretador =$1`,
        values: [nombre_interpretador]
    }
    const { rows } = await db.query(query)
    return rows
}





export const recomendacionModel = {
    obtenerRecomendaciones
}