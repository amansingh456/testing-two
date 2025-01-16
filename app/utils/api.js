import axios from "axios";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import { getFromLocalStorage, saveToLocalStorage } from "./helperFunc";
require("dotenv").config();

const fetchToken = async () => {
  try {
    const res = await fetch("/api/tokenMurf");
    const data = await res.json();

    if (res.ok) {
      const res = saveToLocalStorage("detexToken", data.token);
      return res;
    }
  } catch (error) {
    console.log("Fetch error:", error);
  }
};

export const createSpeech = async (text) => {
  try {
    const response = await axios({
      method: "post",
      url: "https://api.openai.com/v1/audio/speech",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENV_OPENAI_API}`,
        "Content-Type": "application/json",
      },
      data: {
        model: "tts-1",
        input: text,
        voice: "shimmer",
        speed: 0.9,
      },
      responseType: "arraybuffer",
    });
    return response;
  } catch (error) {
    console.log("Error:", error.response ? error.response.data : error.message);
    return error;
  }
};

// export const createSpeech = async (text, wantVoice, wantNative) => {
//   const tokenData = getFromLocalStorage("detexToken") || (await fetchToken());
//   try {
//     let data = JSON.stringify({
//       audioDuration: 0,
//       channelType: "MONO",
//       encodeAsBase64: false,
//       format: "WAV",
//       modelVersion: "GEN2",
//       multiNativeLocale: wantNative,
//       pitch: 2,
//       pronunciationDictionary: {},
//       rate: 4,
//       sampleRate: 24000,
//       style: "Conversational",
//       text: text,
//       variation: 1,
//       voiceId: wantVoice,
//     });

//     const config = {
//       method: "post",
//       url: "https://api.murf.ai/v1/speech/generate",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         token: tokenData.value,
//       },
//       data: data,
//     };

//     const response = await axios(config);
//     return response.data;
//   } catch (error) {
//     console.log("Error:", error.response ? error.response.data : error.message);
//     return error;
//   }
// };

// Optimize sendChatCompletion function
export const sendChatCompletion = async (promptMsg) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: promptMsg,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENV_OPENAI_API}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error:", error.response ? error.response.data : error.message);
    return error;
  }
};

export const createText = async (audioFilePath, wantNative) => {
  try {
    const formData = new FormData();
    formData.append("file", audioFilePath, "audio.mp3");
    formData.append("model", "whisper-1");
    formData.append("language", wantNative === "en-IN" ? "en" : "hi");

    const response = await axios({
      method: "post",
      url: "https://api.openai.com/v1/audio/transcriptions",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENV_OPENAI_API}`,
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });

    return response.data.text;
  } catch (error) {
    console.log("Error:", error.response ? error.response.data : error.message);
    return error;
  }
};

export const getScore = async (promptMsg) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: promptMsg,
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ENV_OPENAI_API}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error:", error.response ? error.response.data : error.message);
    return error;
  }
};

export const uploadToS3 = async (blob) => {
  const s3Client = new S3({
    endpoint: "https://fra1.digitaloceanspaces.com",
    region: "us-east-1",
    credentials: {
      accessKeyId: "DO00Y6E98L82H7GRXJK7",
      secretAccessKey: "HYsQivlnYjpGrNSofVHlPmo0f75Y31Hs3wHZA6ZLwlk",
    },
  });

  const fileName = `detex-data/recording-${Date.now()}.webm`;
  const bucketParams = {
    Bucket: "stg-kyc-docs",
    Key: fileName,
    Body: blob,
    ContentType: "video/webm",
    ACL: "public-read",
  };

  try {
    const response = await s3Client.send(new PutObjectCommand(bucketParams));

    const fileUrl = `https://fra1.digitaloceanspaces.com/stg-kyc-docs/${fileName}`;

    console.log("Upload successful:", { fileUrl, response });
    return { success: true, fileUrl };
  } catch (error) {
    console.log("Error whileUpload failed:", error);
    return { success: false, error };
  }
};
