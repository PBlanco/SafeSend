import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { deriveKey } from "../utils/crypto/keys";

const Download: React.FC = () => {
  const [message, setMessage] = useState("");
  const location = useLocation();

  const downloadFile = async () => {
    const params = new URLSearchParams(location.search);
    const serverSecretParam = params.get("serverSecret");
    const hashValue = location.hash.slice(1);

    if (!serverSecretParam || !hashValue) {
      setMessage("Can not download file. Missing required parameters");
      return;
    }

    const finalKey = deriveKey(serverSecretParam, hashValue);
    const response = await fetch(
      `/api/download?fileKey=${fileKey}&serverSecret=${serverSecret}`
    );
    const data = await response.json();
    console.log(data);
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
