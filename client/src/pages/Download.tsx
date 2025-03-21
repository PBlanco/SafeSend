import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { decryptBlob } from "../utils/crypto/encryption";
import { deriveKey } from "../utils/crypto/keys";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const PATH = "generate-download-url";

const Download: React.FC = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();

  const downloadFile = async () => {
    try {
      const params = new URLSearchParams(location.search);
      const fileKey = params.get("fileKey");
      const serverSecretParam = params.get("serverSecret");
      const hashValue = location.hash.slice(1);

      if (!serverSecretParam || !hashValue || !fileKey) {
        throw new Error("Can not download file. Missing required parameters");
      }

      setMessage("Generating download URL...");
      const response = await fetch(
        `${API_ENDPOINT}${PATH}?key=${encodeURIComponent(fileKey)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const { downloadURL } = await response.json();

      setMessage("Downloading encrypted file...");
      const encryptedResponse = await fetch(downloadURL);
      const encryptedBlob = await encryptedResponse.blob();

      setMessage("Decrypting file...");
      const decryptedBlob = await decryptBlob(
        encryptedBlob,
        deriveKey(serverSecretParam, hashValue)
      );

      // Create and trigger download
      const downloadUrl = URL.createObjectURL(decryptedBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "decrypted-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl); // Clean up the URL object

      setMessage("File decrypted and downloaded!");
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Secure File Download
        </h1>
        <div className="space-y-6">
          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={downloadFile}
          >
            Download File
          </button>
          {message && (
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-center">
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;
