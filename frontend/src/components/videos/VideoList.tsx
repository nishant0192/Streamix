"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/VideoList.module.css";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { useSidebar } from "../../context/SidebarContext";

const MAX_TITLE_LENGTH = 52;

interface Video {
  id: string;
  url: string;
  title: string;
  channelName: string;
  thumbnail?: string;
}

const generateColorFromString = (str: string) => {
  // Simple hash function to generate a color based on string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color =
    ((hash >> 24) & 0xff).toString(16) +
    ((hash >> 16) & 0xff).toString(16) +
    ((hash >> 8) & 0xff).toString(16) +
    (hash & 0xff).toString(16);
  return `#${color.slice(0, 6)}`;
};

const VideoList: React.FC = () => {
  const { isSidebarOpen } = useSidebar();
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/videos/videos`
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
    <div
      className={`bg-[#0F0F0F] transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? "md:ml-[20vw]" : "md:ml-0"
      }`}
    >
      <h2>Videos</h2>
      <div className={styles.videoContainer}>
        <div className={styles.videoList}>
          {videos && videos.length > 0 ? (
            videos.map((video) => (
              <div key={video.id} className={styles.videoWrapper}>
                <a href={video.url}>
                  {video.thumbnail ? (
                    <img
                      width="100%"
                      className="aspect-video max-h-[30vh] rounded-[10px] object-cover"
                      src={video.thumbnail}
                      alt={video.title}
                    />
                  ) : (
                    <div
                      className="aspect-video max-h-[30vh] rounded-[10px] flex items-center justify-center"
                      style={{
                        backgroundColor: generateColorFromString(
                          video.channelName
                        ),
                      }}
                    >
                      <span className="text-white text-4xl text-[10.25rem] font-bold">
                        {video.channelName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </a>
                <div className="details flex items-center w-full">
                  <div className="channelImage">
                    <UserCircleIcon className="w-8 invert" />
                  </div>
                  <p className={`${styles.p} text-white`}>
                    {video.title.length > MAX_TITLE_LENGTH
                      ? `${video.title.slice(0, MAX_TITLE_LENGTH - 3)}...`
                      : video.title}
                  </p>
                  <div>
                    <h2 className="block text-white">{video.channelName}</h2>
                  </div>
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
