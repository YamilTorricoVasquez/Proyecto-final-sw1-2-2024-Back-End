import { Router } from "express"

import { ChatController } from "../controllers/chat.controller.js";
const router = Router()

router.post('/registrar', ChatController.registrar)
router.get('/obtener', ChatController.obtener)
export default router;