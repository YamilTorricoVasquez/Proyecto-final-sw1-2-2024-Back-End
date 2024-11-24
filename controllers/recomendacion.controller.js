import { recomendacionModel } from "../models/recomendacion.modal.js";




const obtenerRecomendaciones = async (req, res) => {
    try {
        const nombre_interpretador = req.params.nombre_interpretador; // Obtener CI de los parámetros
        const dd = await recomendacionModel.obtenerRecomendaciones(nombre_interpretador); // Pasar el CI a la función
        if (!dd || dd.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No tiene registrado recomendaciones' });
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

export const RecomendacionController = {
    obtenerRecomendaciones
}