import { useState, useEffect, useRef } from "react";

function VideoPlayer({ src, onEnded, shouldPlay }) {
  const videoRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setDuration(0);
    setPosition(0);
    setVolume(50);
    videoRef.current.volume = 1;

    if (shouldPlay) {
      videoRef.current.play();
    }
  }, [src, shouldPlay]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <video
        style={{ width: "100%" }}
        ref={videoRef}
        onPause={() => {
          setIsPlaying(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onVolumeChange={(e) => {
          const volume = e.target.volume;
          setVolume(volume * 100);
        }}
        onTimeUpdate={(e) => {
          const position = videoRef.current.currentTime;
          setPosition(position / videoRef.current.duration);
        }}
        onLoadedData={(e) => {
          const duration = videoRef.current.duration;
          setDuration(duration);
        }}
        onEnded={() => {
          onEnded && onEnded();
        }}
        src={src}
        controls
      ></video>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={() => {
            if (isPlaying) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
            setIsPlaying((oldValue) => !oldValue);
          }}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button
          onClick={() => {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
          }}
        >
          Stop
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => {
            const volume = parseInt(e.target.value);
            setVolume(volume);
            videoRef.current.volume = volume / 100;
          }}
        ></input>
        <div style={{ width: "100px" }}>{Math.round(volume)}</div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          onChange={(e) => {
            const position = parseFloat(e.target.value);
            setPosition(position);
            videoRef.current.currentTime = position * videoRef.current.duration;
          }}
        ></input>
        <div style={{ width: "100px" }}>
          {videoRef.current
            ? Math.round(position * videoRef.current.duration)
            : 0}
          / {Math.round(duration)}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;
