import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface VideoRecorderProps {
  fetchRecordedVideos: () => void;
}

const VideoRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/mp4",
      });
      mediaRecorderRef.current = mediaRecorder;

      let chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = async function () {
        const blob = new Blob(chunks, { type: "video/mp4" });
        const formData = new FormData();
        formData.append("video", blob, `${fileName}.webm`);
        formData.append("fileName", fileName);
        try {
          const axiosInstance = axios.create({
            baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
            withCredentials: true,
          });
          const authToken = Cookies.get("authToken");
          const response = await axiosInstance.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/record`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );
          const data = response.data;
          console.log("Upload successful:", data);
        } catch (error) {
          console.error("Error uploading video:", error);
        }
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) {
      console.error("MediaRecorder not initialized.");
      return;
    }

    // Stop the media recorder
    mediaRecorderRef.current.stop();

    // Stop the media stream
    const stream = videoRef.current?.srcObject as MediaStream;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());

    // Release the media stream
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setRecording(false);
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  return (
    <>
      <div className="video-recorder  mt-4">
        <label>
          File Name: <br />
          <input
            type="text"
            value={fileName}
            className="border-black border-2 !text-black"
            onChange={handleFileNameChange}
          />
        </label>
        {recording ? (
          <button
            onClick={stopRecording}
            className="bg-black ml-4 p-3 rounded-xl"
          >
            Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="bg-black ml-4 p-3 rounded-xl"
          >
            Start Recording
          </button>
        )}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="transform scale-x-[-1]"
        />
      </div>
      <div className="mt-4"></div>
    </>
  );
};

export default VideoRecorder;
