"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/VideoList.module.css";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const MAX_TITLE_LENGTH = 52;

interface Video {
  id: string;
  url: string;
  title: string;
}

const VideoList: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/videos`,
          {
            withCredentials: true,
          }
        );

        const videosData: Video[] = response.data.videos;

        if (!videosData || videosData.length === 0) {
          console.error("No videos data found");
          setVideos([]);
        } else {
          setVideos(videosData);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-[#0F0F0F]">
      <h2>Videos</h2>
      <div className={styles.videoContainer}>
        <div className={styles.videoList}>
          {videos && videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className={styles.videoWrapper}>
                <video controls width="100%" src={video.url} />
                <div className="details flex items-center w-full">
                  <div className="channelImage">
                    <UserCircleIcon className="w-8 invert" />
                  </div>
                  <p className={`${styles.p} text-white`}>
                    {video.title.length > MAX_TITLE_LENGTH
                      ? `${video.title.slice(0, MAX_TITLE_LENGTH - 3)}...`
                      : video.title}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No videos available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoList;
