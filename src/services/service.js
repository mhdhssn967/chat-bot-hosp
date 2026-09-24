// --------------------------------------------------
// File: src/services/service.js
// Small helper service to call the backend endpoints (/upload and /ask)

import { auth } from "../../firebaseConfig";

const API_BASE = import.meta.env?.VITE_API_URL || "https://oqulix-chat-server.onrender.com";

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);

  try {
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Upload failed');
    }

    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' || err.message.includes('Failed to fetch')) {
      throw new Error(`Unable to connect to server (${API_BASE}). Render free server may be sleeping or starting up (HTTP 503). Please wait a few seconds and try again.`);
    }
    throw err;
  }
}

export async function askQuestion(question, userId, language, previousAnswer, onChunk) {
  console.log("Calling backend endpoint:", `${API_BASE}/askClaude`);
  
  const payload = { question, userId, language, previousAnswer };

  let res;
  try {
    res = await fetch(`${API_BASE}/askClaude`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Network error during askQuestion fetch:", err);
    throw new Error(`Server connection failed (${API_BASE}). The backend on Render may be sleeping or starting up. Please wait 15-30 seconds and try again.`);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Server error (${res.status}): Ask failed`);
  }

  // ✅ STREAMING - read chunks as they arrive
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullAnswer = "";

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) {
      console.log("✅ Stream complete. Full answer:", fullAnswer);
      return { answer: fullAnswer };
    }

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        
        if (data.chunk) {
          fullAnswer += data.chunk;
          console.log("🟢 Received chunk:", data.chunk);
          
          // ✅ CALL CALLBACK WITH EACH CHUNK
          if (onChunk) {
            onChunk(data.chunk);
          }
        }
        
        if (data.done) {
          return { answer: fullAnswer };
        }
      }
    }
  }
}