import express from "express";
import { add_project, detail_project, get_all_project, } from "../controller/projects";
import { add_tasks, get_tasks } from "../controller/task";
import { uploads } from "../utility/multer";
import { authenticate, authorizeAdmin } from "../utility/authenticate";

const router = express.Router();

router.post("/add-project", authenticate, authorizeAdmin, uploads.single('imageproject'), add_project);
router.get("/get-all-project", authenticate, get_all_project);
router.get("/project/:id", authenticate, detail_project);

// router.get("/tasks", authenticate, get_tasks);
// router.post("/tasks/add", authenticate, authorizeAdmin, uploads.single('photo'), add_tasks);
export default router;
