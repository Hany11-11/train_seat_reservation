import { Router } from "express";

import { login, me, register, findByNic } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.get("/users/nic/:nic", findByNic);

export default router;
