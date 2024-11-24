import { Router } from "express"

import { RecomendacionController } from "../controllers/recomendacion.controller.js";
const router = Router()

router.get('/obtener/:nombre_interpretador', RecomendacionController.obtenerRecomendaciones)


export default router;