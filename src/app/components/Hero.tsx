"use client";

import { useState } from "react";

export default function Hero() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-cv", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    setMessage(result.message || "Upload failed.");
  };

  return (
    <section className="container my-8">
      <h1 className="text-4xl font-bold text-center mb-6">
        One place for all EU Policy Jobs
      </h1>

      <div className="flex max-w-4xl mx-auto">
        {/* CV Upload Section */}
        <div className="w-full bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Upload Your CV and Get a Job in 30 Days!
          </h2>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4"
          />

          <button
            onClick={handleUpload}
            className="transition-colors bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg"
          >
            Upload CV
          </button>

          {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
      </div>
    </section>
  );
}
