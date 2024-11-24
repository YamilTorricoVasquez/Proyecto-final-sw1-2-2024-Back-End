

import { bebeModel } from "../models/bebe.model.js";

const registrar = async (req, res) => {
    try {
        //console.log(req.body)
        const { nombre, fecha_nacimiento, genero, ci_usuario } = req.body

        if (!nombre || !fecha_nacimiento || !genero || !ci_usuario) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" })
        }
        const existe = await bebeModel.verifNombreBebe(nombre)
        if (existe) {
            return res.status(401).json({ ok: false, msg: "EL bebe ya esta registrado" })
        }

        const newUser = await bebeModel.registrar({ nombre, fecha_nacimiento, genero, ci_usuario })


        return res.json({ ok: true, msg: newUser })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const obtenerBebe = async (req, res) => {
    try {
        const ci_usuario = req.params.ci_usuario; // Obtener CI de los parámetros
        const dd = await bebeModel.obtenerBebe(ci_usuario); // Pasar el CI a la función
        if (!dd || dd.length === 0) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }
        return res.json({ ok: true, msg: dd });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error server',
        });
    }
}
const obtenerDatoBebe = async (req, res) => {
    try {
        const id = req.params.id_bebe; // Obtener CI de los parámetros
        const dd = await bebeModel.obtenerDatoBebe(id); // Pasar el CI a la función
        if (!dd) {
            return res.status(404).json({ ok: false, msg: 'Usuario no encontrado' });
        }
        return res.json({ ok: true, msg: dd });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error server',
        });
    }
}
const actualizarDatos = async (req, res) => {
    try {
        const { nombre, nombreN, fecha_nacimiento, genero } = req.body;  // Obtener los datos desde el cuerpo de la solicitud

        // Comprobar que todos los datos están presentes
        if (!nombre || !nombreN || !fecha_nacimiento || !genero) {
            return res.status(400).json({ ok: false, msg: 'Faltan datos para la actualización' });
        }

        const dd = await bebeModel.actualizarDatos(nombre, nombreN, fecha_nacimiento, genero);  // Pasar los datos al modelo

        if (!dd) {
            return res.status(404).json({ ok: false, msg: 'Bebé no encontrado' });
        }

        return res.json({ ok: true, msg: 'Datos actualizados correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: 'Error del servidor' });
    }
}

const eliminarBebe = async (req, res) => {
    const { nombre, ci_usuario, id_bebe } = req.body;
    if (!nombre || !ci_usuario) {
        return res.status(400).json({ ok: false, msg: 'Faltan datos para la actualización' });
    }
    await bebeModel.eliminarBebe(nombre, ci_usuario);  // Pasar los datos al modelo
    return res.json({ ok: true, msg: 'Bebe eliminado correctamente' });
}

const vacunasBebe = async (req, res) => {
    const fecha_nacimiento = req.params.fecha_nacimiento;
    const dd = await bebeModel.vacunasBebe(fecha_nacimiento);
    return res.json({ ok: true, msg: dd });
}
const asignarEsquemaVacunas = async (req, res) => {
    try {
        const { id_bebe } = req.body;

        if (!id_bebe) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" });
        }

        // Verificar si ya existe un esquema de vacunación para el bebé
        const esquemaExistente = await bebeModel.verificarEsquemaVacunas(id_bebe);

        if (esquemaExistente) {
            return res.status(400).json({ ok: false, msg: "El esquema de vacunación ya está asignado para este bebé." });
        }

        // Si no existe, asignar un nuevo esquema de vacunación
        const newUser = await bebeModel.asignarEsquemaVacunas({ id_bebe });

        return res.json({ ok: true, msg: newUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        });
    }
};

const obtenerEsquemaVacunacion = async (req, res) => {
    const id_bebe = req.params.id_bebe;
    const dd = await bebeModel.obtenerEsquemaVacunacion(id_bebe);
    return res.json({ ok: true, msg: dd });
}
const obtenerEsquemaVacunacionAplicado = async (req, res) => {
    const id_bebe = req.params.id_bebe;
    const dd = await bebeModel.obtenerEsquemaVacunacionAplicado(id_bebe);
    return res.json({ ok: true, msg: dd });
}
const actualizarEstadoVacuna = async (req, res) => {
    try {
        const { id_bebe, id_vacuna } = req.body;

        if (!id_bebe || !id_vacuna) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" });
        }

        // Si no existe, asignar un nuevo esquema de vacunación
        const estadoActualizado = await bebeModel.actualizarEstadoVacuna(id_bebe, id_vacuna);

        return res.json({ ok: true, msg: estadoActualizado });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        });
    }
}
const actualizarEsquemaVacunacion = async (req, res) => {
    try {
        const { id_bebe } = req.body;

        if (!id_bebe) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" });
        }

        // Si no existe, asignar un nuevo esquema de vacunación
        const actualizado = await bebeModel.actualizarEsquemaVacunacion(id_bebe);

        return res.json({ ok: true, msg: actualizado });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        });
    }
}
export const BebeController = {
    registrar,
    obtenerBebe,
    actualizarDatos,
    eliminarBebe,
    vacunasBebe,
    asignarEsquemaVacunas,
    obtenerEsquemaVacunacion,
    actualizarEstadoVacuna,
    actualizarEsquemaVacunacion,
    obtenerEsquemaVacunacionAplicado,
    obtenerDatoBebe
}
