"use client";

import { useState, useRef } from "react";
import { FaCheckCircle, FaSpinner, FaCloudUploadAlt, FaFile } from "react-icons/fa";

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
        {/* CV Upload Section */}
        <div className="hidden md:block w-full bg-white rounded-xl shadow-lg p-4 border border-gray-200 hover:shadow-xl transition-shadow mb-4">
          <h2 className="text-base font-semibold mb-2 text-gray-800">
            Upload Your CV and Get a Job in 30 Days!
          </h2>
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            value={file ? undefined : ""}
            key={uploadSuccess ? "reset-input" : "upload-input"}
            disabled={isUploading}
          />
          
          {/* Drag & Drop Zone */}
          <div 
            className={`border-2 border-dashed rounded-lg p-3 mb-3 text-center cursor-pointer
              ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
              transition-all duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="flex items-center justify-center gap-2">
              <FaCloudUploadAlt className="text-xl text-indigo-500" />
              <p className="text-sm text-gray-600">
                {file ? 
                  <span className="flex items-center gap-2">
                    <FaFile className="text-indigo-600" />
                    <span className="font-medium truncate max-w-[150px] inline-block">{file.name}</span>
                  </span> : 
                  <span>
                    Drag PDF or <span className="text-indigo-600 font-medium">browse</span>
                  </span>
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`transition-colors flex-1 flex items-center justify-center gap-1 text-white py-1.5 px-3 rounded-md text-sm ${isUploading || !file ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                "Upload CV"
              )}
            </button>
          </div>

          {message && (
            <div className={`mt-2 p-2 text-sm rounded-md ${uploadSuccess ? 'bg-green-100 text-green-800' : isUploading ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              <div className="flex items-center gap-1">
                {uploadSuccess && <FaCheckCircle className="text-green-600 text-sm flex-shrink-0" />}
                <p className="text-xs">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
