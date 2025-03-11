import PDFParser from "pdf2json";

export function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.parseBuffer(buffer);

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      // ✅ Extract structured text from each page
      const rawText = pdfData.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join("")
      ).join("\n");

      // 🛠 Fix spacing issues: Remove spaces between characters
      const cleanedText = rawText.replace(/\s+/g, " ").trim();

      console.log("✅ Extracted and Normalized Text:", cleanedText); // Debugging
      resolve(cleanedText);
    });

    pdfParser.on("pdfParser_dataError", (error) => {
      console.error("🚨 PDF Parsing Error:", error);
      reject(new Error("Failed to extract text from PDF."));
    });
  });
}
