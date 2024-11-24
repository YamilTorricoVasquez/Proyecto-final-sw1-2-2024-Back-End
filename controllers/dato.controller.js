import { datoModel } from "../models/dato.model.js";


const registrar = async (req, res) => {
    try {
        //console.log(req.body)
        const {  nombre_interpretador,fecha,contador,id_bebe } = req.body

        if (!nombre_interpretador || !fecha || !id_bebe ) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" })
        }


        const dato = await datoModel.registrar({ nombre_interpretador,fecha,contador,id_bebe })


        return res.json({ ok: true, msg: dato })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const obtenerDatobebe = async (req, res) => {
    try {
        const id_bebe = req.params.id_bebe; // Obtener CI de los parámetros
        const dd = await datoModel.obtener(id_bebe); // Pasar el CI a la función
      
        return res.json({ ok: true, msg: dd });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error server',
        });
    }
}

export const DatoController = {
    registrar,
    obtenerDatobebe
}