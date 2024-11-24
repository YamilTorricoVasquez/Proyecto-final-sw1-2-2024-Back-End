
import { text } from 'express'
import { db } from '../database/connection.database.js'

const create = async ({ ci, email, password, nombre }) => {
    const query = {
        text: 'insert into users(ci,email,password,nombre) values($1,$2,$3,$4) returning nombre',
        values: [ci, email, password, nombre]
    }

    const { rows } = await db.query(query)
    return rows[0]
}



const FindOneByEmail = async (email) => {
    const query = {
        text: `select * from users where email=$1`,
        values: [email]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const nombreUsuario = async (email) => {
    const query = {
        text: `select nombre,ci,email,password from users where email=$1`,
        values: [email]

    }
    const { rows } = await db.query(query)
    return rows[0]
}
const ciUsuario = async (email) => {
    const query = {
        text: `select ci from users where email=$1`,
        values: [email]

    }
    const { rows } = await db.query(query)
    return rows[0].ci
}

const actualizarDatos = async (ci, ciN, email, password, nombre) => {
    const query = {
        text: `UPDATE users SET ci=$2, email=$3, password=$4, nombre=$5 WHERE ci=$1 RETURNING *`,
        values: [ci, ciN, email, password, nombre]
    };
    const { rows } = await db.query(query);
    return rows[0];
};



const findAll = async () => {
    const query = {
        text: `select * 
        from users `
    }
    const { rows } = await db.query(query)
    return rows
}

const FindOneByCI = async (ci) => { //uid es el parametro que recibe la funcion findonebyuid
    const query = {
        text: `select * from users where ci=$1`,
        values: [ci]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const FindOneByUid = async (uid) => { //uid es el parametro que recibe la funcion findonebyuid
    const query = {
        text: `select * from users where uid=$1`,
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows[0]
}

const updateRoleVet = async (uid) => { // uid es el parámetro que recibe la función findOneByUid
    const query = {
        text: `UPDATE users SET role_id = 2 WHERE uid = $1 RETURNING *`,
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows[0]
}



const updateRoleClient = async (uid) => { // uid es el parámetro que recibe la función findOneByUid
    const query = {
        text: `UPDATE users SET role_id = 3 WHERE uid = $1 RETURNING *`,
        values: [uid]
    }
    const { rows } = await db.query(query)
    return rows[0]
}


export const userModel = {
    create,
    FindOneByEmail,
    findAll,
    FindOneByUid,
    updateRoleVet,
    updateRoleClient,
    nombreUsuario,
    ciUsuario,
    actualizarDatos,
    FindOneByCI
}