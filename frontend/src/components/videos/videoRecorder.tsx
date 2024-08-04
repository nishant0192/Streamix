"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import RecordRTC from "recordrtc";
import Cookies from "js-cookie";

const VideoRecorder: React.FC = () => {
  const [recording, setRecording] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const mediaRecorderRef = useRef<RecordRTC | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);

      const recordRTC = new RecordRTC(mediaStream, {
        type: "video",
        mimeType: "video/mp4",
      });
      mediaRecorderRef.current = recordRTC;

      recordRTC.startRecording();
      setRecording(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stopRecording(async () => {
        const blob = mediaRecorderRef.current?.getBlob();
        if (blob) {
          const formData = new FormData();
          formData.append("video", blob, `${fileName}.mp4`);
          formData.append("fileName", fileName);

          try {
            const authToken = Cookies.get("authToken");
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/record`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
              }
            );
            console.log("Upload successful:", response.data);
          } catch (error) {
            console.error("Error uploading video:", error);
          }
        }
      });

      const mediaStream = stream;
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      setRecording(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        placeholder="File name"
      />
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <video ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default VideoRecorder;
