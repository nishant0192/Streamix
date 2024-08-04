import styled from "styled-components";
import { rem } from "@/utils";
import type { ChangeEvent } from "react";
import useVideoPlayerStore from "@/video-player-store";

// Styled components for the buttons and container
const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;


const ProgressSlider = styled.input<{ $progress: number }>`
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  width: calc(100% - ${rem(80)}); /* Adjust width to account for button space */
  height: ${rem(10)};
  border-radius: 2px;
  margin: 0;
  background: linear-gradient(
    to right,
    #f00 ${({ $progress }) => $progress}%,
    rgba(255, 255, 255, 0.4) ${({ $progress }) => $progress}%
  );

  &::-webkit-slider-thumb {
    height: ${rem(16)};
    width: ${rem(16)};
    background-color: #fff;
    border-radius: 50%;
    border: ${rem(2)} solid #f00;
    appearance: none;
    &:hover {
      transform: scale(1.5);
    }
  }
`;

const VideoProgressSlider = () => {
  const { playerRef, progress, duration, updateProgress } = useVideoPlayerStore();

  const handleProgressChange = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement;
    if (playerRef.current) {
      playerRef.current.currentTime = +value;
      updateProgress(+value);
    }
  };

  const seek = (seconds: number) => {
    if (playerRef.current) {
      const newTime = Math.min(Math.max(playerRef.current.currentTime + seconds, 0), duration);
      playerRef.current.currentTime = newTime;
      updateProgress(newTime);
    }
  };

  return (
    <SliderContainer>
      <ProgressSlider
        $progress={(progress / duration) * 100}
        type="range"
        step="0.01"
        min="0"
        max={duration}
        value={progress}
        onChange={handleProgressChange}
      />
    </SliderContainer>
  );
};

export default VideoProgressSlider;
