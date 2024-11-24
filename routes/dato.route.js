import { Router } from "express"

import { DatoController } from "../controllers/dato.controller.js";
const router = Router()

router.post('/registrar', DatoController.registrar)
router.get('/obtener/:id_bebe', DatoController.obtenerDatobebe)
export default router;