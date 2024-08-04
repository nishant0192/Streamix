"use client";
import React, { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import styles from "@/styles/VideoPlayer.module.css";
import {
  ForwardIcon,
  BackwardIcon,
  PlayIcon,
  PauseIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState("auto");
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [hls, setHls] = useState<Hls | null>(null);
  const [qualityLevels, setQualityLevels] = useState<string[]>([
    "auto", "1080p", "720p", "480p", "360p", "240p", "144p"
  ]);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      const hlsInstance = new Hls({
        abrEwmaFastVoD: 2.0,
        abrEwmaSlowVoD: 10.0,
      });
      setHls(hlsInstance);

      hlsInstance.loadSource(url);
      hlsInstance.attachMedia(videoRef.current);

      hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hlsInstance.on(Hls.Events.LEVEL_LOADED, () => {
        setIsLoading(false);
      });

      hlsInstance.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          console.error(`Hls.js error: ${data.fatal}`);
        }
      });

      return () => {
        hlsInstance.destroy();
      };
    }
  }, [url]);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
      }
    };

    const handleProgress = () => {
      if (videoRef.current) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBuffered((bufferedEnd / videoRef.current.duration) * 100);
      }
    };

    const video = videoRef.current;
    video?.addEventListener("timeupdate", handleTimeUpdate);
    video?.addEventListener("progress", handleProgress);

    return () => {
      video?.removeEventListener("timeupdate", handleTimeUpdate);
      video?.removeEventListener("progress", handleProgress);
    };
  }, []);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, videoRef.current.duration);
    }
  };

  const handleBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleQualityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedQuality(selected);
    if (videoRef.current && hls) {
      const currentTime = videoRef.current.currentTime;
      const isPlaying = !videoRef.current.paused;

      if (selected === 'auto') {
        hls.currentLevel = -1; // Auto quality
      } else {
        const levelIndex = qualityLevels.indexOf(selected) - 1;
        if (levelIndex !== -1) {
          hls.currentLevel = levelIndex;
        }
      }

      // Clear the buffer and reload from the new quality
      hls.stopLoad();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      videoRef.current.currentTime = currentTime;

      if (isPlaying) {
        videoRef.current.play();
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setSelectedSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (parseFloat(event.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
      setProgress(parseFloat(event.target.value));
    }
  };

  return (
    <div className={styles.videoContainer}>
      {isLoading && <p>Loading...</p>}
      <video ref={videoRef} className={styles.video} />
      <div className={styles.controls}>
        <button onClick={handleBackward} className={styles.controlButton}>
          <BackwardIcon />
        </button>
        <button onClick={handlePlayPause} className={styles.controlButton}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={handleForward} className={styles.controlButton}>
          <ForwardIcon />
        </button>
        <button onClick={toggleSettings} className={styles.controlButton}>
          <Cog6ToothIcon />
        </button>
        {showSettings && (
          <div className={styles.settingsMenu}>
            <div className={styles.settingsSection}>
              <span className={styles.qualityLabel}>Quality</span>
              <select
                value={selectedQuality}
                onChange={handleQualityChange}
                className={styles.qualitySelector}
              >
                {qualityLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.settingsSection}>
              <span className={styles.qualityLabel}>Speed</span>
              <button
                className={styles.qualitySelector}
                onClick={() => handleSpeedChange(0.5)}
              >
                0.5x
              </button>
              <button
                className={styles.qualitySelector}
                onClick={() => handleSpeedChange(1)}
              >
                1x
              </button>
              <button
                className={styles.qualitySelector}
                onClick={() => handleSpeedChange(1.5)}
              >
                1.5x
              </button>
              <button
                className={styles.qualitySelector}
                onClick={() => handleSpeedChange(2)}
              >
                2x
              </button>
            </div>
          </div>
        )}
        <div className={styles.progressContainer}>
          <div
            className={styles.progressBuffered}
            style={{ width: `${buffered}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className={styles.progress}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
