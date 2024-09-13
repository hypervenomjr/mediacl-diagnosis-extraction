"use client";
import { useState } from "react";
import axios from "axios";
import { ArrowUpTrayIcon } from "@heroicons/react/24/solid";
import Notification from "./Components/Notification";

export default function Home() {
  const [file, setFile] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
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
        setNotification("");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
      setNotification("Failed to extract diagnosis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg">
        <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-6">
          Medical Diagnosis Extraction
        </h1>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none transition-transform duration-300 ease-in-out hover:scale-105 hover:border-indigo-600"
          />
          <button
            type="submit"
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center space-x-2 transition duration-300 ease-in-out transform hover:scale-105 ${
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
            <span>{loading ? "Processing..." : "Upload and Extract"}</span>
          </button>
        </form>

        {/* Diagnosis Section */}
        {diagnosis && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg transition-opacity duration-500 ease-in-out animate-fadeIn">
            <h2 className="text-2xl font-semibold text-green-700">
              Extracted Diagnosis:
            </h2>
            <p className="text-lg mt-2 text-gray-800">{diagnosis}</p>
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
