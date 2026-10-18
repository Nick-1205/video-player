import { useState, useEffect, useRef } from "react";
import VideoPlayer from "./VideoPlayer";
import { useJsonFetch } from "./useJsonFetch";

const localStorageKey = "videoPlayerPlaylist";

function App() {
  const [currentVideoId, setCurrentVideoId] = useState("1");
  const [videoShouldPlay, setVideoShouldPlay] = useState(false);

  const [videos, setVideos] = useState([
    {
      id: "1",
      title: "Ocean",
      src: "https://vjs.zencdn.net/v/oceans.mp4",
    },
    {
      id: "2",
      title: "Hase",
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: "3",
      title: "Drohne",
      src: "https://photo-sphere-viewer-data.netlify.app/assets/equirectangular-video/Ayutthaya_HD.mp4",
    },
  ]);
  const titleRef = useRef();
  const urlRef = useRef();

  useEffect(() => {
    const videos = localStorage.getItem(localStorageKey);
    if (videos) {
      setVideos(JSON.parse(videos));
    }
  }, []);

  const currentVideoObject =
    videos.find((video) => video.id === currentVideoId) ?? videos[0];
  const canSkipBackward = getNextOrPreviousVideo(-1);
  const canSkipForward = getNextOrPreviousVideo(1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Title:</span>
        <input ref={titleRef}></input>
        <span>URL:</span>
        <input ref={urlRef}></input>
        <button
          onClick={() => {
            setVideos((oldVideos) => {
              const newVideos = [
                ...oldVideos,
                {
                  id: (Date.now() * Math.random()).toString(),
                  title: titleRef.current.value,
                  src: urlRef.current.value,
                },
              ];

              save(newVideos);

              return newVideos;
            });
          }}
        >
          Add
        </button>
        <button
          onClick={() => {
            setVideos((oldVideos) => {
              const newVideos = oldVideos.filter(
                (video) => video.id !== currentVideoObject.id,
              );
              save(newVideos);
              return newVideos;
            });
          }}
        >
          Delete
        </button>
      </div>
      <select
        size="5"
        style={{ width: "200px" }}
        value={currentVideoId}
        onChange={(e) => {
          setCurrentVideoId(e.target.value);
        }}
      >
        {videos.map((video) => (
          <option key={video.id} value={video.id}>
            {video.title}
          </option>
        ))}
      </select>
      <div>
        <button
          disabled={!canSkipBackward}
          style={{ fontSize: "22px" }}
          onClick={() => {
            skipVideo(-1);
          }}
        >
          ⏮
        </button>
        <button
          disabled={!canSkipForward}
          style={{ fontSize: "22px" }}
          onClick={() => {
            skipVideo(+1);
          }}
        >
          ⏭
        </button>
      </div>
      <VideoPlayer
        src={currentVideoObject.src}
        shouldPlay={setVideoShouldPlay}
        onEnded={() => {
          skipVideo(1);
        }}
      ></VideoPlayer>
    </div>
  );

  function skipVideo(inc) {
    const nextVideo = getNextOrPreviousVideo(inc);

    if (nextVideo) {
      setCurrentVideoId(nextVideo.id);
      setVideoShouldPlay(true);
    }
  }

  function getNextOrPreviousVideo(inc) {
    const currentIndex = videos.findIndex(
      (video) => video.id === currentVideoId,
    );
    const nextVideo = videos[currentIndex + inc];
    return nextVideo;
  }
}

export default App;

function save(videos) {
  localStorage.setItem(localStorageKey, JSON.stringify(videos));
}

/*
// Fortgeschrittene Themen

import { useState, useEffect, useRef } from "react";
import VideoPlayer from "./VideoPlayer";
import { useJsonFetch } from "./useJsonFetch";
import { useImmer } from "use-immer";

const localStorageKey = "videoPlayerPlaylist";

function App() {
  const [currentVideoId, setCurrentVideoId] = useState("1");
  const [videoShouldPlay, setVideoShouldPlay] = useState(false);
  const { data, error, loading } = useJsonFetch("src/videoList.json");

  const [videos, setVideos] = useImmer([
    {
      id: "1",
      title: "Ocean",
      src: "https://vjs.zencdn.net/v/oceans.mp4",
    },
    {
      id: "2",
      title: "Hase",
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    {
      id: "3",
      title: "Drohne",
      src: "https://photo-sphere-viewer-data.netlify.app/assets/equirectangular-video/Ayutthaya_HD.mp4",
    },
  ]);
  const titleRef = useRef();
  const urlRef = useRef();

  useEffect(() => {
    if (data) {
      setVideos(data);
    }
  }, [data]);

  const currentVideoObject =
    videos.find((video) => video.id === currentVideoId) ?? videos[0];
  const canSkipBackward = getNextOrPreviousVideo(-1);
  const canSkipForward = getNextOrPreviousVideo(1);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <span>Title:</span>
        <input ref={titleRef}></input>
        <span>URL:</span>
        <input ref={urlRef}></input>
        <button
          onClick={() => {
            setVideos((videos) => {
              videos.push({
                id: (Date.now() * Math.random()).toString(),
                title: titleRef.current.value,
                src: urlRef.current.value,
              });

              save(videos);
            });
          }}
        >
          Add
        </button>
        <button
          onClick={() => {
            setVideos((oldVideos) => {
              const newVideos = oldVideos.filter(
                (video) => video.id !== currentVideoObject.id,
              );
              save(newVideos);
              return newVideos;
            });
          }}
        >
          Delete
        </button>
      </div>
      <select
        size="5"
        style={{ width: "200px" }}
        value={currentVideoId}
        onChange={(e) => {
          setCurrentVideoId(e.target.value);
        }}
      >
        {videos.map((video) => (
          <option key={video.id} value={video.id}>
            {video.title}
          </option>
        ))}
      </select>
      <div>
        <button
          disabled={!canSkipBackward}
          style={{ fontSize: "22px" }}
          onClick={() => {
            skipVideo(-1);
          }}
        >
          ⏮
        </button>
        <button
          disabled={!canSkipForward}
          style={{ fontSize: "22px" }}
          onClick={() => {
            skipVideo(+1);
          }}
        >
          ⏭
        </button>
      </div>
      <VideoPlayer
        src={currentVideoObject.src}
        shouldPlay={setVideoShouldPlay}
        onEnded={() => {
          skipVideo(1);
        }}
      ></VideoPlayer>
    </div>
  );

  function skipVideo(inc) {
    const nextVideo = getNextOrPreviousVideo(inc);

    if (nextVideo) {
      setCurrentVideoId(nextVideo.id);
      setVideoShouldPlay(true);
    }
  }

  function getNextOrPreviousVideo(inc) {
    const currentIndex = videos.findIndex(
      (video) => video.id === currentVideoId,
    );
    const nextVideo = videos[currentIndex + inc];
    return nextVideo;
  }
}

export default App;

function save(videos) {
  localStorage.setItem(localStorageKey, JSON.stringify(videos));
}
*/
