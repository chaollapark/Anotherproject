"use client";

import { useState, useRef } from "react";
import { FaCheckCircle, FaSpinner, FaCloudUploadAlt, FaFile } from "react-icons/fa";
import AIApplyModal from "./AIApplyModal";
import JobSearchBar from "./JobSearchBar";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      } else {.
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
      <JobSearchBar />
      <div className="max-w-4xl mx-auto">
        {/* AI Apply Section */}
        <div className="hidden md:block w-full bg-white rounded-xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow mb-4">
          <h2 className="text-base font-semibold mb-4 text-gray-800 text-center">
            Apply with AI — you approve every application
          </h2>
          
          <div className="flex gap-4 justify-center items-center">
            {/* Trial Package - €50 */}
            <div className="flex-1 max-w-xs">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  if (typeof window !== 'undefined' && window.posthog) {
                    window.posthog.capture('ai_apply_click', { location: 'hero_section', package: 'trial' });
                  }
                }}
                className="transition-colors flex items-center justify-center gap-2 text-white py-2 px-4 rounded-md text-sm bg-blue-600 hover:bg-blue-700 font-semibold shadow-md w-full"
              >
                <span>25 applications for €50</span>
              </button>
              <p className="mt-2 text-xs text-gray-600 text-center">
                Trial package - perfect to test our service
              </p>
            </div>

            {/* Full Package - €100 */}
            <div className="flex-1 max-w-xs">
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  if (typeof window !== 'undefined' && window.posthog) {
                    window.posthog.capture('ai_apply_click', { location: 'hero_section', package: 'full' });
                  }
                }}
                className="transition-colors flex items-center justify-center gap-2 text-white py-2 px-4 rounded-md text-sm bg-green-600 hover:bg-green-700 font-semibold shadow-md w-full"
              >
                <span>100 applications for €100</span>
              </button>
              <p className="mt-2 text-xs text-gray-600 text-center">
                Best value - 7-day turnaround
              </p>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-gray-600 text-center">
          Being the first 5% of applicant raises your chances by 13x.
          </p>
        </div>
      </div>

      {/* AI Apply Modal */}
      <AIApplyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
