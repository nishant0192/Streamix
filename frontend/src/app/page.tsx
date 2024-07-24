import Navbar from "@/components/common/Navbar";
import "../styles/globals.css";
import VideoList from "@/components/videos/VideoList";
export default function Home() {
  return (
    <>
      <Navbar />
      <VideoList />
    </>
  );
}
