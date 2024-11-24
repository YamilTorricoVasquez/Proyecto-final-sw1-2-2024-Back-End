import { Router } from "express"

import { MedicamentoController } from "../controllers/medicamento.controller.js";
const router = Router()

router.post('/registrar', MedicamentoController.registrar)
router.get('/obtener/:id_bebe', MedicamentoController.obtenerMedicamentos)
router.post('/actualizar', MedicamentoController.acntualizarMedicamentos)
router.post('/eliminar', MedicamentoController.eliminarMedicamentos)


export default router;