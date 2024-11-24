import { text } from 'express'
import { db } from '../database/connection.database.js'


const registrar = async ({ fecha,descripcion,ci_usuario }) => {
    const query = {
        text: `insert into chat(fecha,descripcion,ci_usuario) values($1, $2, $3) returning *`,
        values: [fecha,descripcion,ci_usuario]
    }

    const { rows } = await db.query(query)
    return rows[0]
}
const obtener = async () => {
    const query = {
        text: `select nombre,descripcion,fecha from chat as c, users as u where c.ci_usuario=u.ci`
    }
    const { rows } = await db.query(query)
    return rows
}

export const chatModel = {
    registrar,
    obtener
}