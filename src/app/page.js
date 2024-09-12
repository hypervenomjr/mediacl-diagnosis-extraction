"use client"; 

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDiagnosis(response.data.diagnosis);
    } catch (error) {
      console.error("Error during file upload:", error);
      alert("Failed to extract diagnosis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Medical Diagnosis Extraction</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 p-2 border"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mx-4"
        >
          {loading ? "Processing..." : "Upload and Extract"}
        </button>
      </form>

      {diagnosis && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Extracted Diagnosis:</h2>
          <p className="text-lg mt-2">{diagnosis}</p>
        </div>
      )}
    </div>
  );
}
