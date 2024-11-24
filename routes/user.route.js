import { Router } from "express"
import { UserController } from "../controllers/user.controller.js"

import { verifyAdmin, verifyToken } from "../middlewares/jwt.middlewares.js"


const router = Router()

//api/v1
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/profile', verifyToken, UserController.profile)
router.get('/nombre/:email', UserController.nombreUsuario)
router.get('/ci/:email', UserController.ciUsuario)
router.post('/actualizar', UserController.actualizarUsuario)
//Admin
router.get('/', verifyToken, verifyAdmin, UserController.findAll)
router.put('/update-role-vet/:uid', verifyToken, verifyAdmin, UserController.updateRoleVet)
router.put('/update-role-client/:uid', verifyToken, verifyAdmin, UserController.updateRoleClient)

export default router;