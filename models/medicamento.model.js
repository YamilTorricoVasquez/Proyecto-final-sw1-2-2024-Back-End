import { text } from 'express'
import { db } from '../database/connection.database.js'



const registrar = async ({ nombre_medicamento, descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe }) => {
    const query = {
        text: 'insert into recordatorio_medicamento(nombre_medicamento,descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad,tipo, unidad, frecuencia, id_bebe) values($1, $2, $3, $4, $5, $6, $7, $8,$9,$10) returning *',
        values: [nombre_medicamento, descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe]
    }

    const { rows } = await db.query(query)
    return rows[0]
}

const obtenerMedicamentos = async (id_bebe) => {
    const query = {
        text: `SELECT * FROM recordatorio_medicamento WHERE id_bebe = $1`,
        values: [id_bebe]
    }
    const { rows } = await db.query(query)
    return rows
}

const acntualizarMedicamentos = async (id_recordatorio, nombre_medicamento, descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe) => {
    const query = {
        text: `UPDATE recordatorio_medicamento 
                SET nombre_medicamento=$2,descripcion_medicamento=$3,hora=$4,fecha_inicio=$5,fecha_fin=$6,cantidad=$7,tipo=$8,unidad=$9,frecuencia=$10 
                WHERE id_recordatorio = $1 and id_bebe=$11`,
        values: [id_recordatorio, nombre_medicamento,descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe]
    }
    const { rows } = await db.query(query)
    return rows
}
const eliminarMedicamentos = async (id_recordatorio, id_bebe) => {
    const query = {
        text: `delete from recordatorio_medicamento where id_recordatorio=$1 and id_bebe=$2`,
        values: [id_recordatorio, id_bebe]
    }
    const { rows } = await db.query(query)
    return rows
}

export const medicamentoModel = {
    registrar,
    obtenerMedicamentos,
    acntualizarMedicamentos,
    eliminarMedicamentos
}