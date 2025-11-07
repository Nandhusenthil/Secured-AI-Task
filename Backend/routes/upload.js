import express from "express";
import multer from "multer";
import { runOCR } from "../services/ocr.js";
import { detectAndRedactPII } from "../services/pii.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const buffer = req.file.buffer;
    const ocrResult = await runOCR(buffer);
    const { found, redactedText } = detectAndRedactPII(ocrResult.text);

    res.json({
      success: true,
      originalText: ocrResult.text,
      redactedText,
      pii: found
    });

  } catch (err) {
    res.status(500).json({ error: "Processing failed", details: err.message });
  }
});

export default router;
