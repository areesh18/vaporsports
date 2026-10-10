import PlaySvg from "../PlaySvg";
import { useState, useRef } from "react";
export default function Video() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Video playback failed:", error);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };
  return (
    <div className="relative  w-full h-full flex items-center justify-center ">
      <video
        ref={videoRef}
        src="/video.mp4"
        className="absolute inset-0 w-full h-full object-cover"
        /* controls={isPlaying} */
        playsInline
        preload
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlayback}
      />
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlayback}
          aria-label="Play video"
          className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer"
        >
          <PlaySvg className="w-[50px] h-[50px]" />
        </button>
      )}
    </div>
  );
}
