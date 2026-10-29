import { Router } from "express";
import { signup, login, getEncryptionPublicKey, } from "../controllers/authController";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/public-key", getEncryptionPublicKey);


export default router;