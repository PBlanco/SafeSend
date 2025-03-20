import * as openpgp from "openpgp";
import React, { useState } from "react";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

if (!API_ENDPOINT) {
  throw new Error("API_ENDPOINT is not set");
}

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const encryptFile = async (file: File): Promise<Blob> => {
    const fileBuffer = await file.arrayBuffer();
    const encryptedData = await openpgp.encrypt({
      message: await openpgp.createMessage({
        binary: new Uint8Array(fileBuffer),
      }),
      passwords: ["super-secure-passphrase"], // Replace with secure key management
      format: "binary",
      config: {
        preferredCompressionAlgorithm: openpgp.enums.compression.zlib,
        aeadProtect: true, // This enables authenticated encryption (AES-GCM)
      },
    });

    return new Blob([encryptedData as Uint8Array]);
  };

  const uploadFile = async () => {
    if (!file) return;

    try {
      setMessage("Encrypting file...");
      const encryptedFile = await encryptFile(file);

      setMessage("Requesting upload URL...");
      const res = await fetch(API_ENDPOINT + "/generate-upload-url");
      const { uploadURL, key } = await res.json();

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

      setMessage(`File uploaded successfully! Key: ${key}`);
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
        </div>
      </div>
    </div>
  );
};

export default App;
