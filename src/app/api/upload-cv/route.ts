import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebase";
import { extractTextFromPDF } from "@/lib/pdfParser";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import slugify from "slugify";

export const runtime = "nodejs";


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ResumeSchema = new mongoose.Schema({
  email: String,
  content: String,
  filename: String,
  uploadedAt: { type: Date, default: Date.now },
  fileUrl: String,
});

const Resume = mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const data = await req.formData();
    const file = data.get("file") as File;

    // ✅ Ensure file exists
    if (!file) {
      console.error("❌ No file received.");
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    console.log("📂 File received:", file.name, file.type, file.size);

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files allowed." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // ✅ Ensure `arrayBuffer()` is not empty
    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.error("❌ ArrayBuffer is empty.");
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    const buffer = Buffer.from(arrayBuffer);
    console.log("✅ Successfully created Buffer from file.");

    // ✅ Extract text from PDF
    const text: string = await extractTextFromPDF(buffer);
    console.log("Extracted PDF Text:", text);

    // ✅ Normalize text
    const cleanedText = text.replace(/\s+/g, " ").trim();
    console.log("🔍 Cleaned Text:", cleanedText);

    // ✅ Extract Email
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = cleanedText.match(emailRegex);
    const email = emails ? emails[0] : null;

    // ✅ Upload to Firebase
    const safeFilename = slugify(file.name, { lower: true, strict: true });
    const fileRef = bucket.file(`cvs/${Date.now()}-${safeFilename}`);

    await fileRef.save(buffer, { contentType: "application/pdf" });

    // ✅ Generate Signed URL
    const [fileUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2099",
    });

    // ✅ Save to MongoDB
    const resume = new Resume({
      email,
      content: text,
      filename: file.name,
      fileUrl,
    });

    console.log("Saving to MongoDB:", resume);
    await resume.save();
    console.log("✅ Successfully saved to MongoDB!");

    return NextResponse.json({
      success: true,
      message: "CV uploaded successfully!",
      email,
      fileUrl,
    });

  } catch (error) {
    console.error("🚨 Error processing CV:", error);
    return NextResponse.json({ error: "Failed to process CV." }, { status: 500 });
  }
}
