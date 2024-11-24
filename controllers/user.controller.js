import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";


const register = async (req, res) => {
    try {
        //console.log(req.body)
        const { ci, nombre, email, password } = req.body

        if (!nombre || !email || !password || !ci) {
            return res.status(400).json({ ok: false, msg: "Los datos se perdieron" })
        }
        const user = await userModel.FindOneByEmail(email)
        if (user) {
            return res.status(400).json({ ok: false, msg: "Email ya existe" })
        }
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)
        const newUser = await userModel.create({ ci, email, password: hashedPassword, nombre })

        const token = jwt.sign({ email: newUser.email, role_id: newUser.role_id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )

        return res.json({
            ok: true, msg: {
                token, role_id: newUser.role_id
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}
// /api/v1/users/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ error: "Ya existe" });
        }
        const user = await userModel.FindOneByEmail(email)
        if (!user) {
            return res.status(400).json({ error: "Email no existe" });
        }
        const isMatch = await bcryptjs.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }
        const token = jwt.sign({ email: user.email, role_id: user.role_id },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        )
        return res.json({
            ok: true, msg: {
                token, role_id: user.role_id
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}



const actualizarUsuario = async (req, res) => {
    try {
        const { ci, ciN, email, password, nombre } = req.body;

        // Validar que los campos ci, ciN, email y nombre están presentes
        if (!ci || !ciN || !email || !nombre) {
            return res.status(400).json({ ok: false, msg: "Faltan datos para actualizar" });
        }

        // Buscar al usuario por su CI
        const user = await userModel.FindOneByCI(ci);
        if (!user) {
            return res.status(404).json({ ok: false, msg: "Usuario no encontrado" });
        }

        // Si se proporciona una nueva contraseña, hashearla, de lo contrario, mantener la contraseña anterior
        let hashedPassword = user.password;
        if (password && password !== "") {
            const salt = await bcryptjs.genSalt(10);
            hashedPassword = await bcryptjs.hash(password, salt);
        }

        // Actualizar los datos del usuario
        const updatedUser = await userModel.actualizarDatos(ci, ciN, email, hashedPassword, nombre);

        // Devolver una respuesta con los datos actualizados
        return res.json({
            ok: true,
            msg: "Usuario actualizado correctamente",
            user: {
                ci: updatedUser.ci,
                ciN: updatedUser.ciN,
                email: updatedUser.email,
                nombre: updatedUser.nombre
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            msg: "Error del servidor"
        });
    }
};






const profile = async (req, res) => {
    try {
        const user = await userModel.FindOneByEmail(req.email)
        return res.json({ ok: true, msg: user })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Error server'
        })
    }
}
const nombreUsuario = async (req, res) => {
    try {
        const email = req.params.email; // Obtener CI de los parámetros
        const dd = await userModel.nombreUsuario(email); // Pasar el CI a la función
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
};
const ciUsuario = async (req, res) => {
    try {
        const email = req.params.email; // Obtener CI de los parámetros
        const dd = await userModel.ciUsuario(email); // Pasar el CI a la función
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
};

const logout = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        // Decodificar el token para obtener la fecha de expiración
        const decodedToken = jwt.decode(token);
        const expiration = new Date(decodedToken.exp * 1000);

        // Guardar el token en la lista de bloqueo (opcional, si estás implementando este enfoque)
        const query = {
            text: 'INSERT INTO blacklist_tokens (token, expiration) VALUES ($1, $2)',
            values: [token, expiration]
        };
        await db.query(query);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
}
const findAll = async (req, res) => {
    try {
        const users = await userModel.findAll()
        return res.json({ ok: true, msg: users })
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
}



const updateRoleVet = async (req, res) => {
    try {
        const { uid } = req.params
        const user = await userModel.FindOneByUid(uid)
        if (!user) {
            return res.status(400).json({ error: "Usuario no existe" });

        }
        const updatedUser = await userModel.updateRoleVet(uid)
        return res.json({ ok: true, msg: updatedUser })
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
}

const updateRoleClient = async (req, res) => {
    try {
        const { uid } = req.params
        const user = await userModel.FindOneByUid(uid)
        if (!user) {
            return res.status(400).json({ error: "Usuario no existe" });

        }
        const updatedUser = await userModel.updateRoleClient(uid)
        return res.json({ ok: true, msg: updatedUser })
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'Error logging out' });
    }
}



export const UserController = {
    register,
    login,
    actualizarUsuario,
    profile,
    logout,
    findAll,
    updateRoleVet,
    updateRoleClient,
    nombreUsuario,
    ciUsuario
}