"use client";

import { useState, useRef } from "react";
import { FaCheckCircle, FaSpinner, FaCloudUploadAlt, FaFile } from "react-icons/fa";

declare global {
  interface Window {
    posthog?: { capture: (event: string, props?: Record<string, any>) => void };
  }
}

export default function Hero() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      setUploadSuccess(false);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Only accept PDF files
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setUploadSuccess(false);
      } else {
        setMessage("Only PDF files are accepted.");
        setUploadSuccess(false);
      }
    }
  };
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file.");
      setUploadSuccess(false);
      return;
    }

    // Set loading state
    setIsUploading(true);
    setMessage("Uploading your CV...");
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      
      if (res.ok) {
        setUploadSuccess(true);
        setMessage(result.message || "CV uploaded successfully!");
        // Clear the file input after successful upload
        setFile(null);
      } else {
        setUploadSuccess(false);
        setMessage(result.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadSuccess(false);
      setMessage("An error occurred during upload. Please try again.");
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="container my-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
        Why go to 17 EU Jobsites? All EU jobs are here!
      </h1>

      <div className="flex max-w-4xl mx-auto">
        {/* Cover Letter Writer Section */}
        <div className="hidden md:block w-full bg-white rounded-xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow mb-4 flex flex-col items-center justify-center">
          <h2 className="text-base font-semibold mb-2 text-gray-800 text-center">
            Free AI Coverletter Writer
          </h2>
          <a
            href="https://client-production-a6d6.up.railway.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors flex items-center justify-center gap-2 text-white py-2 px-4 rounded-md text-sm bg-green-600 hover:bg-green-700 font-semibold shadow-md mt-2"
            onClick={() => {
              if (typeof window !== 'undefined' && window.posthog) {
                window.posthog.capture('coverletter_writer_click', { location: 'hero_section' });
              }
            }}
          >
            <span>Write 3 Coverletters for free!</span>
          </a>
          <p className="mt-3 text-xs text-gray-600 text-center">
            17x More Applications. Same Time.
          </p>
        </div>
      </div>
    </section>
  );
}
