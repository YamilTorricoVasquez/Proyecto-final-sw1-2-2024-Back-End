import { chatModel } from "../models/chat.model.js";


const registrar = async (req, res) => {
    try {
        //console.log(req.body)
        const {  fecha,descripcion,ci_usuario } = req.body

        if (!fecha || !descripcion || !ci_usuario ) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" })
        }


        const dato = await chatModel.registrar({ fecha,descripcion,ci_usuario })


        return res.json({ ok: true, msg: dato })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}
const obtener = async (req, res) => {
    try {
        const chats = await chatModel.obtener()
        return res.json({ ok: true, msg: chats })
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
}

export const ChatController = {
    registrar,
    obtener
}