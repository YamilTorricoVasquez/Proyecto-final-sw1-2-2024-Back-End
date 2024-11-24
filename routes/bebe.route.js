import { Router } from "express"

import { BebeController } from "../controllers/bebe.controller.js";
const router = Router()

//api/v1
router.post('/registrar', BebeController.registrar)
router.get('/obtener/:ci_usuario', BebeController.obtenerBebe)
router.put('/actualizar', BebeController.actualizarDatos);
router.put('/eliminar', BebeController.eliminarBebe)
router.get('/vacunas/:fecha_nacimiento', BebeController.vacunasBebe)
router.post('/asignarVacuna',BebeController.asignarEsquemaVacunas)
router.get('/obtenerEsquemaVacunacion/:id_bebe',BebeController.obtenerEsquemaVacunacion)
router.get('/obtenerEsquemaVacunacionAplicado/:id_bebe',BebeController.obtenerEsquemaVacunacionAplicado)
router.post('/actualizarEstadoVacuna',BebeController.actualizarEstadoVacuna)
router.post('/actualizarEsquema',BebeController.actualizarEsquemaVacunacion)
router.get('/obtenerBebe/:id_bebe',BebeController.obtenerDatoBebe)

export default router;