import { createMessage, decrypt, encrypt, enums, readMessage } from "openpgp";

// Utility to generate a random hex string (256 bits = 32 bytes)
export const generateRandomHex = (length: number) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const encryptFile = async (file: File, key: string): Promise<Blob> => {
  const fileBuffer = await file.arrayBuffer();
  const encryptedData = await encrypt({
    message: await createMessage({
      binary: new Uint8Array(fileBuffer),
    }),
    passwords: [key],
    format: "binary",
    config: {
      preferredCompressionAlgorithm: enums.compression.zlib,
      aeadProtect: true, // This enables authenticated encryption (AES-GCM)
    },
  });

  return new Blob([encryptedData as Uint8Array]);
};

export const generateClientSecret = () => {
  // 256 bits as hex string
  return generateRandomHex(32);
};

export const decryptBlob = async (blob: Blob, key: string): Promise<Blob> => {
  const encryptedArrayBuffer = await blob.arrayBuffer();
  const decryptedData = await decrypt({
    message: await readMessage({
      binaryMessage: new Uint8Array(encryptedArrayBuffer),
    }),
    passwords: [key],
    format: "binary",
  });
  return new Blob([decryptedData.data as Uint8Array]);
};
