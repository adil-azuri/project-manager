import express from "express";
import { getUsers, login, logout, register } from "../controller/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/users", getUsers);

export default router;
