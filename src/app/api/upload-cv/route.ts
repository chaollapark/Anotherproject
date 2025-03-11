import { NextRequest, NextResponse } from "next/server";
import { bucket } from "@/lib/firebase";
import { extractTextFromPDF } from "@/lib/pdfParser"; // ✅ Import the function
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import slugify from "slugify";

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

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files allowed." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = await file.arrayBuffer();

    // Extract text from PDF using our helper function
    const text: string = await extractTextFromPDF(Buffer.from(buffer));
    console.log("Extracted PDF Text:", text); // ✅ Debugging log

    // Normalize text to remove excess spaces
    const cleanedText = text.replace(/\s+/g, " ").trim(); 

    // Debug: Log cleaned text
    console.log("🔍 Cleaned Text:", cleanedText);

    // Extract Email from PDF
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = cleanedText.match(emailRegex);
    const email = emails ? emails[0] : null;

    // Upload to Firebase Storage
    const safeFilename = slugify(file.name, { lower: true, strict: true });
    const fileRef = bucket.file(`cvs/${Date.now()}-${safeFilename}`);

    await fileRef.save(Buffer.from(buffer), {
      contentType: "application/pdf",
    });

    // Generate Signed URL (valid until 2099)
    const [fileUrl] = await fileRef.getSignedUrl({
      action: "read",
      expires: "03-09-2099",
    });

    // Save metadata to MongoDB
    const resume = new Resume({
      email,
      content: text,
      filename: file.name,
      fileUrl,
    });

    console.log("Saving to MongoDB:", resume); // ✅ Debugging log

    await resume.save();

    console.log("✅ Successfully saved to MongoDB!"); // ✅ Debugging log

    return NextResponse.json({
      success: true,
      message: "CV uploaded successfully! We'll send you an email with your ranking.",
      email,
      fileUrl,
    });

  } catch (error) {
    console.error("Error processing CV:", error);
    return NextResponse.json({ error: "Failed to process CV." }, { status: 500 });
  }
}
