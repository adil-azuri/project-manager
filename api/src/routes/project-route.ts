import express from "express";
import {
    add_project, detail_project,
    get_all_project, update_project_status,
    update_project, delete_project
} from "../controller/projects";
import { add_task, update_task_status } from "../controller/task";
import { uploads } from "../utility/multer";
import { authenticate, authorizeAdmin } from "../utility/authenticate";

const router = express.Router();

router.get("/get-all-project", authenticate, get_all_project);

router.post("/add-project", authenticate, authorizeAdmin, uploads.single('imageProject'), add_project);
router.put("/project/:id", authenticate, authorizeAdmin, update_project);
router.delete("/project/:id", authenticate, authorizeAdmin, delete_project);

router.get("/project/:id", authenticate, detail_project);
router.patch("/project/status/:id", authenticate, update_project_status);

router.post("/tasks/add", authenticate, authorizeAdmin, add_task);
router.patch("/task/status", authenticate, update_task_status);
export default router;
