"use client";
import { useState } from "react";
import axios from "axios";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Notification from "./Components/Notification";

export default function Home() {
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [csvLink, setCsvLink] = useState(""); // Store CSV file link
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    if (uploadedFile) {
      setFileURL(URL.createObjectURL(uploadedFile)); // Set the file URL for preview
    }
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!file) {
      setNotification("Please upload a file first.");
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

      if (response.data.diagnosis === "") {
        setNotification("No diagnosis found");
      } else {
        setDiagnosis(response.data.diagnosis);
        setCsvLink(response.data.csvLink); // Assuming the API returns a link to the CSV file
        setNotification("");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setNotification("Failed to extract diagnosis.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setNotification("No file uploaded. Please select a file.");
    } else {
      setNotification("File uploaded successfully!");
      setTimeout(() => {
        setNotification("");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-6 animate-fadeIn">
          Medical Diagnosis Extraction
        </h1>

        {/* Form Section */}
        <form className="space-y-6">
          {/* File Upload Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer transition-colors duration-300 ease-in-out hover:border-indigo-600"
          />

          {/* Upload Button */}
          <button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 ease-in-out"
            onClick={handleUpload}
          >
            <ArrowUpTrayIcon className="h-5 w-5" />
            <span>Upload</span>
          </button>

          {/* File Preview (opens image in a new tab) */}
          {fileURL && (
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block mt-2 text-center hover:text-blue-800 transition-colors duration-300 ease-in-out"
            >
              Preview Uploaded Image
            </a>
          )}

          {/* Extract Button */}
          <button
            type="submit"
            onClick={handleExtract}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-300 ease-in-out ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8v-8H4z"
                ></path>
              </svg>
            ) : (
              <ArrowUpTrayIcon className="h-5 w-5" />
            )}
            <span>{loading ? "Processing..." : "Extract Diagnosis"}</span>
          </button>
        </form>

        {/* Diagnosis and CSV Options Section */}
        {diagnosis && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg shadow-md transition-opacity duration-300 ease-in-out opacity-90">
            <h2 className="text-2xl font-semibold text-green-700">
              Extracted Diagnosis:
            </h2>
            <p className="text-lg mt-2 text-gray-800">{diagnosis}</p>

            {/* CSV File Options */}
            {csvLink && (
              <div className="mt-4 space-x-4">
                {/* Preview CSV Button */}
                <a
                  href={csvLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 transition-colors duration-300 ease-in-out"
                >
                  Preview CSV
                </a>

                {/* Download CSV Button */}
                <a
                  href={csvLink}
                  download
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-transform duration-300 ease-in-out"
                >
                  Download CSV
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification Component */}
      <Notification
        message={notification}
        onClose={() => setNotification("")}
      />
    </div>
  );
}
