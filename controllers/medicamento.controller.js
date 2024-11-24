import { medicamentoModel } from "../models/medicamento.model.js";


const registrar = async (req, res) => {
    try {
        //console.log(req.body)
        const { nombre_medicamento, descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe } = req.body

        if (!nombre_medicamento || !fecha_inicio || !fecha_fin || !cantidad || !frecuencia || !id_bebe) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" })
        }


        const newMedicamento = await medicamentoModel.registrar({ nombre_medicamento, descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe })


        return res.json({ ok: true, msg: newMedicamento })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}

const obtenerMedicamentos = async (req, res) => {
    try {
        const id_bebe = req.params.id_bebe; // Obtener CI de los parámetros
        const dd = await medicamentoModel.obtenerMedicamentos(id_bebe); // Pasar el CI a la función
        if (!dd || dd.length === 0) {
            return res.status(404).json({ ok: false, msg: 'No tiene registrado medicamentos' });
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
const acntualizarMedicamentos = async (req, res) => {
    try {
        const { id_recordatorio, nombre_medicamento, descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe } = req.body;

        
        await medicamentoModel.acntualizarMedicamentos(id_recordatorio, nombre_medicamento, descripcion_medicamento, hora, fecha_inicio, fecha_fin, cantidad, tipo, unidad, frecuencia, id_bebe);
        return res.json({ ok: true, msg: 'Datos actualizados correctamente' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, msg: 'Error del servidor' });
    }
}
const eliminarMedicamentos = async (req, res) => {
    const { id_recordatorio, id_bebe } = req.body;
    if (!id_recordatorio || !id_bebe) {
        return res.status(400).json({ ok: false, msg: 'Faltan datos para la actualización' });
    }
    await medicamentoModel.eliminarMedicamentos(id_recordatorio, id_bebe);  // Pasar los datos al modelo
    return res.json({ ok: true, msg: 'Bebe eliminado correctamente' });
}
export const MedicamentoController = {
    registrar,
    obtenerMedicamentos,
    acntualizarMedicamentos,
    eliminarMedicamentos
}