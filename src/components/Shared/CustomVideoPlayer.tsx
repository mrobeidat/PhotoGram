import React, { useRef, useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Forward5Icon from "@mui/icons-material/Forward5";
import Replay5Icon from "@mui/icons-material/Replay5";
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";

interface CustomVideoPlayerProps {
  videoUrl: string;
  className?: string;
  videoClassName?: string;
  style?: React.CSSProperties;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  videoUrl,
  className,
  videoClassName,
  style,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const updateProgress = () => {
        setVideoProgress(
          (videoElement.currentTime / videoElement.duration) * 100
        );
      };
      const handleVideoEnd = () => {
        setIsPlaying(false);
        setShowControls(true);
      };

      videoElement.addEventListener("timeupdate", updateProgress);
      videoElement.addEventListener("ended", handleVideoEnd);

      return () => {
        videoElement.removeEventListener("timeupdate", updateProgress);
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setIsPlaying(true);
          setShowControls(false);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
          setShowControls(true);
        }
      },
      {
        root: null,
        threshold: 0.5,
      }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (videoElement.paused) {
        videoElement.play();
        setShowControls(false); // Hide controls when playing
      } else {
        videoElement.pause();
        setShowControls(true); // Show controls when paused
      }
      setIsPlaying(!videoElement.paused);
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
      setIsMuted(videoElement.muted);
    }
  };

  const skipTime = (seconds: number) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = Math.max(
        0,
        Math.min(videoElement.currentTime + seconds, videoElement.duration)
      );
    }
  };

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    if (videoRef.current) {
      const newTime = (offsetX / rect.width) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setVideoProgress((newTime / videoRef.current.duration) * 100);
    }
  };

  const handleMouseOver = () => {
    setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const handleToggleControls = () => {
    setShowControls((prev) => !prev);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        overflow: "hidden",
        borderRadius: "8px",
        backgroundColor: "black",
        ...style,
      }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handleToggleControls}
    >
      {isVideoLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <CircularProgress color="error" />
        </div>
      )}
      <video
        ref={videoRef}
        className={`w-full ${videoClassName}`}
        src={videoUrl}
        playsInline
        muted={isMuted}
        onLoadedData={() => {
          setIsVideoLoading(false);
          setIsPlaying(!videoRef.current?.paused);
          if (videoRef.current?.paused) {
            setShowControls(true);
          }
        }}
        onPause={handleVideoPause} // Ensure controls appear on pause
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          opacity: showControls ? 1 : 0,
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(2px)",
          borderRadius: "50px",
          visibility: showControls ? "visible" : "hidden",
          transition: "opacity 0.3s, visibility 0.3s",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        <IconButton onClick={() => skipTime(-5)}>
          <Replay5Icon fontSize="large" htmlColor="white" />
        </IconButton>
        <IconButton onClick={togglePlayPause}>
          {isPlaying ? (
            <PauseIcon fontSize="large" htmlColor="white" />
          ) : (
            <PlayArrowIcon fontSize="large" htmlColor="white" />
          )}
        </IconButton>
        <IconButton onClick={() => skipTime(5)}>
          <Forward5Icon fontSize="large" htmlColor="white" />
        </IconButton>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          right: "10px",
          opacity: showControls ? 1 : 0,
          visibility: showControls ? "visible" : "hidden",
          transition: "opacity 0.3s, visibility 0.3s",
          pointerEvents: showControls ? "auto" : "none",
        }}
      >
        <IconButton onClick={toggleMute}>
          {isMuted ? (
            <VolumeOffIcon fontSize="medium" htmlColor="white" />
          ) : (
            <VolumeUpIcon fontSize="medium" htmlColor="white" />
          )}
        </IconButton>
      </div>
      <div
        onClick={handleProgressBarClick}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "5px",
          cursor: "pointer",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={videoProgress}
          sx={{
            height: "5px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "red",
            },
          }}
        />
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
