import React, { useState } from "react";
import { encryptFile, generateClientSecret } from "../utils/crypto/encryption";
import { deriveKey } from "../utils/crypto/keys";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const PATH = "generate-upload-url";

if (!API_ENDPOINT) {
  throw new Error("API_ENDPOINT is not set");
}

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [secureLink, setSecureLink] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const uploadFile = async () => {
    if (!file) return;

    try {
      setMessage("Requesting upload URL...");
      const res = await fetch(API_ENDPOINT + PATH);
      const { uploadURL, key, serverSecret } = await res.json();

      const clientSecret = generateClientSecret();
      const finalKey = deriveKey(serverSecret, clientSecret);

      setMessage("Encrypting file...");
      const encryptedFile = await encryptFile(file, finalKey);

      setMessage("Uploading encrypted file...");
      const response = await fetch(uploadURL, {
        method: "PUT",
        body: encryptedFile,
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const link = `${
        window.location.origin
      }/download?fileKey=${encodeURIComponent(
        key
      )}&serverSecret=${encodeURIComponent(serverSecret)}#${clientSecret}`;
      setSecureLink(link);
      setMessage("File uploaded and secure link generated!");
    } catch (error) {
      setMessage(
        `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Secure File Upload
        </h1>
        <div className="space-y-6">
          <label className="block">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
              <div className="text-gray-600">
                {file ? file.name : "Click to select a file"}
              </div>
            </div>
          </label>
          <button
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={uploadFile}
            disabled={!file}
          >
            Upload Securely
          </button>
          {message && (
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-center">
              {message}
            </div>
          )}
          {secureLink && (
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              <div className="mb-2 text-sm font-medium text-gray-600">
                Secure Download Link
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-md border border-gray-200">
                <span className="break-all text-sm flex-1 text-gray-800">
                  {secureLink}
                </span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(secureLink);
                    const btn = document.activeElement as HTMLButtonElement;
                    const originalTitle = btn.title;
                    btn.title = "Copied!";
                    setTimeout(() => {
                      btn.title = originalTitle;
                    }, 2000);
                  }}
                  className="shrink-0 p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                  title="Copy link"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
