// src/api/upload.api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Updated type to accept a single item OR an array
export const uploadMedia = async (
  files: File | Blob | File[] | Blob[], 
  fileName?: string
) => {
  const formData = new FormData();
  
  // Normalize everything to an array so we can use forEach
  const fileArray = Array.isArray(files) ? files : [files];
  
  fileArray.forEach((file) => {
    if (file instanceof Blob && !(file instanceof File)) {
      formData.append("files", file, fileName || `voice-${Date.now()}.mp3`);
    } else {
      formData.append("files", file as File);
    }
  });

  const response = await fetch(`${BASE_URL}/upload/bulk`, {
    method: "POST",
    headers: { "x-api-key": "1234567890abcdef" },
    body: formData,
  });

  if (!response.ok) throw new Error("Upload failed");
  return response.json();
};