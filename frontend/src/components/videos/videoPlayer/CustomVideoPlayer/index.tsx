"use client";
import { useEffect } from 'react';
import Controls from './Controls';
import HlsPlayer from './HlsPlayer';
import styled from 'styled-components';
import useVideoPlayerStore from '@/video-player-store';

const VideoPlayerContainer = styled.div`
  position: relative;
  width: 50vw;
  max-width: 60vw;
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;

  &:hover > #player-controls {
    height: 65px;
    opacity: 0.65;
    visibility: visible;
  }
  &:hover > #playing-title {
    opacity: 1;
  }
`;

const TitleSpan = styled.span`
  pointer-events: none;
  user-select: none;
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 3px;
  font-family: helvetica;
  color: #fff;
  opacity: 0;
  box-shadow: 0px 0px 10px 8px rgba(0, 0, 0, 0.6);
  background-color: rgba(0, 0, 0, 0.6);
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
`;

interface CustomVideoPlayerProps {
  src: string; // Accept a single string for the URL
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src }) => {
  const { playerContainerRef, setSources, setPlayingSrc, playingTitle } = useVideoPlayerStore(state => ({
    playerContainerRef: state.playerContainerRef,
    setSources: state.setSources,
    setPlayingSrc: state.setPlayingSrc,
    playingTitle: state.playingTitle
  }));

  useEffect(() => {
    if (src) {
      setSources([src]); // Set sources as an array with one URL
      setPlayingSrc(src); // Set the current playing source
    }
  }, [src, setSources, setPlayingSrc]);

  return (
    <VideoPlayerContainer ref={playerContainerRef}>
      <TitleSpan id="playing-title">{playingTitle}</TitleSpan>
      <HlsPlayer />
      <Controls />
    </VideoPlayerContainer>
  );
};

export default CustomVideoPlayer;
