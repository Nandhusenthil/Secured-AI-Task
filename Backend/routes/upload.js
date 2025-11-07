import express from "express";
import multer from "multer";
import { runOCR } from "../services/ocr.js";
import { detectAndRedactPII } from "../services/pii.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const userText = req.body.text || ""; // text entered by user
    let combinedText = userText;

    // OCR part
    if (req.file) {
      const ocrResult = await runOCR(req.file.buffer);
      combinedText += " " + ocrResult.text;
    }

    // detect + redact
    const { found, redactedText } = detectAndRedactPII(combinedText);

    res.json({
      success: true,
      originalText: combinedText.trim(),
      redactedText,
      pii: found
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Processing failed" });
  }
});

export default router;
    