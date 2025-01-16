// import Recorder from "recorder-js";
import { createText, sendChatCompletion } from "./api";

export const playAudio = async (audio) => {
  return new Promise((resolve) => {
    audio.addEventListener("ended", () => {
      resolve();
    });
    audio.play();
  });
};

export const extractContentFormatted = async (apiResponse) => {
  try {
    if (apiResponse?.choices?.length > 0) {
      const content = apiResponse.choices[0]?.message?.content;
      if (content) {
        return content;
      } else {
        throw new Error("No content found in the response.");
      }
    } else {
      throw new Error("Invalid response structure or no choices available.");
    }
  } catch (error) {
    console.error("Error extracting useful text:", error.message);
    return { error: error.message };
  }
};

export const getQuestionFromLLM = async (prompt) => {
  const textDataFromLlm = await sendChatCompletion(prompt);
  return await extractContentFormatted(textDataFromLlm);
};

export const listen = async (wantNative) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Your browser does not support audio capture.");
    throw new Error("Audio capture is not supported in this browser.");
  }

  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";
      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

        const audioFile = new File([audioBlob], "audio.webm", {
          type: "audio/webm",
        });

        const transcription = await createText(audioFile, wantNative);

        resolve(transcription || "Sorry, I couldn't understand that.");
      };

      mediaRecorder.start();

      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }, 15000);
    } catch (error) {
      console.error("Error capturing audio:", error);
      reject("Audio capture failed. Please try again.");
    }
  });
};

export function saveToLocalStorage(key, value) {
  const data = {
    value: value,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

export function getFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  if (data) {
    const parsedData = JSON.parse(data);
    const currentTime = new Date().getTime();
    const storedTime = new Date(parsedData.timestamp).getTime();
    if (currentTime - storedTime <= 1200000) {
      return {
        value: parsedData.value,
        timestamp: parsedData.timestamp,
      };
    }
  }
  return null;
}
