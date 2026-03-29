
import express from "express";
import { getVistors, PostVistors } from "../controllers/VisitorController.js";

const router = express.Router()


router.get('/:profileId',getVistors)
router.post('/', PostVistors)

export default router;
