import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebase";
import { extractTextFromPDF } from "@/lib/pdfParser";
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import slugify from "slugify";

export const runtime = "nodejs"; // ✅ Fix file uploads in Vercel

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
    console.log("✅ Connected to database");

    const data = await req.formData();
    console.log("✅ Received FormData");

    const file = data.get("file") as File;

    // 🔴 STEP 1: CHECK IF FILE EXISTS
    if (!file) {
      console.error("❌ No file received in request.");
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    console.log("📂 File received:", file.name, file.type, file.size);

    // 🔴 STEP 2: CHECK FILE TYPE & SIZE
    if (file.type !== "application/pdf") {
      console.error("❌ File is not a PDF");
      return NextResponse.json({ error: "Only PDF files allowed." }, { status: 400 });
    }

    if (file.size === 0) {
      console.error("❌ Uploaded file is empty!");
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      console.error("❌ File size exceeds limit");
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // 🔴 STEP 3: TRY CONVERTING TO BUFFER
    console.log("⚡ Converting file to ArrayBuffer...");
    const arrayBuffer = await file.arrayBuffer();

    if (!arrayBuffer) {
      console.error("❌ `file.arrayBuffer()` returned undefined!");
      return NextResponse.json({ error: "File conversion failed (undefined arrayBuffer)" }, { status: 400 });
    }

    if (arrayBuffer.byteLength === 0) {
      console.error("❌ `file.arrayBuffer()` returned empty buffer!");
      return NextResponse.json({ error: "File upload error: Empty buffer." }, { status: 400 });
    }

    console.log("✅ `arrayBuffer` has", arrayBuffer.byteLength, "bytes");

    // 🔴 STEP 4: TRY CREATING A BUFFER
    console.log("⚡ Creating Buffer from ArrayBuffer...");
    let buffer;
    try {
      buffer = Buffer.from(arrayBuffer);
    } catch (err) {
      console.error("❌ Buffer.from() failed!", err);
      return NextResponse.json({ error: "Buffer conversion failed." }, { status: 400 });
    }

    console.log("✅ Successfully created Buffer from file.");

    // 🔴 STEP 5: EXTRACT TEXT
    let text;
    try {
      text = await extractTextFromPDF(buffer);
    } catch (err) {
      console.error("❌ PDF Extraction failed!", err);
      return NextResponse.json({ error: "Failed to extract text from PDF." }, { status: 500 });
    }

    console.log("Extracted PDF Text:", text);

    // 🔴 STEP 6: NORMALIZE TEXT
    const cleanedText = text.replace(/\s+/g, " ").trim();
    console.log("🔍 Cleaned Text:", cleanedText);

    // 🔴 STEP 7: EXTRACT EMAIL
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = cleanedText.match(emailRegex);
    const email = emails ? emails[0] : null;

    console.log("📧 Extracted Email:", email);

    // 🔴 STEP 8: UPLOAD TO FIREBASE
    const safeFilename = slugify(file.name, { lower: true, strict: true });
    const fileRef = bucket.file(`cvs/${Date.now()}-${safeFilename}`);

    await fileRef.save(buffer, { contentType: "application/pdf" });

    // 🔴 STEP 9: GENERATE SIGNED URL
    const [fileUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: new Date("2099-09-03"), // Use proper Date object
    });

    console.log("✅ File URL:", fileUrl);

    // 🔴 STEP 10: SAVE TO MONGODB
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
