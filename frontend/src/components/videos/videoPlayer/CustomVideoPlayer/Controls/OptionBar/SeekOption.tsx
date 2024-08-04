import React from "react";
import styled from "styled-components";
import { rem } from "@/utils";
import useVideoPlayerStore from "@/video-player-store";

// Styled component for the buttons
const SeekButton = styled.button`
  margin: 0 ${rem(8)};
  padding: ${rem(8)} ${rem(12)};
  background-color: #444;
  color: #fff;
  border: none;
  border-radius: ${rem(4)};
  cursor: pointer;
  font-size: ${rem(14)};
  &:hover {
    background-color: #666;
  }
`;

const SeekOption = () => {
  const { playerRef, updateProgress, duration } = useVideoPlayerStore();

  const seek = (seconds: number) => {
    if (playerRef.current) {
      const newTime = Math.min(Math.max(playerRef.current.currentTime + seconds, 0), duration);
      playerRef.current.currentTime = newTime;
      updateProgress(newTime);
    }
  };

  return (
    <div>
      <SeekButton onClick={() => seek(-10)}>-10s</SeekButton>
      <SeekButton onClick={() => seek(10)}>+10s</SeekButton>
    </div>
  );
};

export default SeekOption;
