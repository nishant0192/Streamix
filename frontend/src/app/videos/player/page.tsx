import React from 'react';
import VideoPlayer from '../../../components/videos/VideoPlayer';

const HomePage: React.FC = () => {
  // Replace with your HLS stream URL
  const hlsUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  return (
    <div>
      <h1>My Video Player</h1>
      <VideoPlayer url={hlsUrl} />
    </div>
  );
};

export default HomePage;
