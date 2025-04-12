import express from "express";
import multer from "multer";
import { authMiddleware } from "../../prisma/middleware/authMiddleware";
import {
  createProperty,
  getProperties,
  getProperty,
} from "../controllers/propertyControllers";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post(
  "/",
  authMiddleware(["manager"]),
  upload.array("photos"),
  createProperty
);

export default router;
