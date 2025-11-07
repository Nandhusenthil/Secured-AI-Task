import tesseract from "node-tesseract-ocr";

/**
 * This OCR logic:
 * ✅ Extracts FULL text
 * ✅ Extracts WORD-LEVEL bounding boxes using HOCR
 * ✅ Works perfectly for PII detection + redaction
 * ✅ Returns coordinates relative to original image
 */
export async function runOCR(buffer) {
  try {
    const config = {
      lang: "eng",
      oem: 1,
      psm: 3,
      hocr: true        // ✅ enables bounding-box extraction
    };

    const hocrOutput = await tesseract.recognize(buffer, config);

    // ✅ Extract bounding box data from HOCR
    const boxes = extractBoundingBoxes(hocrOutput);

    // ✅ Build full text string
    const fullText = boxes.map(b => b.text).join(" ");

    return {
      text: fullText,
      boxes: boxes       // [{text,x,y,w,h}]
    };

  } catch (err) {
    console.error("OCR Error:", err);
    throw new Error("OCR processing failed");
  }
}


/**
 * ✅ Extract bounding boxes from HOCR output
 * HOCR format gives lines like:
 * <span class='ocrx_word' id='word_1' title='bbox 212 65 260 80'>John</span>
 */
function extractBoundingBoxes(hocr) {
  const lines = hocr.split("\n");
  const boxes = [];

  const bboxRegex = /bbox (\d+) (\d+) (\d+) (\d+)/;
  const wordRegex = />([^<]+)</;

  for (const line of lines) {
    const bboxMatch = line.match(bboxRegex);
    const wordMatch = line.match(wordRegex);

    if (bboxMatch && wordMatch) {
      const text = wordMatch[1].trim();
      if (!text || text.length === 0) continue;

      const x1 = parseInt(bboxMatch[1]);
      const y1 = parseInt(bboxMatch[2]);
      const x2 = parseInt(bboxMatch[3]);
      const y2 = parseInt(bboxMatch[4]);

      boxes.push({
        text,
        x: x1,
        y: y1,
        w: x2 - x1,
        h: y2 - y1
      });
    }
  }

  return boxes;
}
