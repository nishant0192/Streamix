"use client";
import { useState, useEffect } from "react";
import CustomVideoPlayer from "@/components/videos/videoPlayer/CustomVideoPlayer";

const HomePage: React.FC = () => {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const videoUrl = "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8";
      setData(videoUrl);
    };

    fetchData();
  }, []);

  return <>{data && <CustomVideoPlayer src={data} />}</>;
};

export default HomePage;
