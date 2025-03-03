import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { GridFSBucket, Db } from "mongodb";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => mongoose.connection.once("open", resolve));
    }

    const conn = mongoose.connection;
    if (!conn.db) {
      throw new Error("Database connection is not established.");
    }

    const bucket = new GridFSBucket(conn.db as unknown as Db, {
      bucketName: "cvUploads",
    });

    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed." }, { status: 400 });
    }

    // Convert ReadableStream to Buffer
    const reader = file.stream().getReader();
    let chunks: Uint8Array[] = [];
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (value) chunks.push(value);
      done = readerDone;
    }

    const buffer = Buffer.concat(chunks);

    // Upload buffer to GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
    });

    uploadStream.end(buffer);

    return NextResponse.json({ 
      success: true, 
      message: "We'll send you a email with your ranking 1/10 and more info!" 
    });

  } catch (error) {
    console.error("Error uploading CV:", error);
    return NextResponse.json(
      { error: "Failed to upload CV." },
      { status: 500 }
    );
  }
}
