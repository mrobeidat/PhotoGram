import React, { useRef, useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import IconButton from "@mui/material/IconButton";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CircularProgress from "@mui/material/CircularProgress";
import useVideoEvents from "@/hooks/useVideoEvents";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const SvgContainer = styled.div<{ show: boolean; persist?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  opacity: ${({ show, persist }) => (show || persist ? 1 : 0)};
  animation: ${({ show, persist }) =>
      show || persist
        ? css`
            ${fadeIn} 0.5s ease 1s infinite
          `
        : fadeOut}
    0.5s ease;
`;

const LeftSvgContainer = styled(SvgContainer)`
  justify-content: flex-start;
  padding-left: 10%;
`;

const RightSvgContainer = styled(SvgContainer)`
  justify-content: flex-end;
  padding-right: 10%;
`;

const SvgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;

const Svg = styled.svg`
  width: 60px;
  height: 60px;
  fill: white;
`;

const SvgText = styled.div`
  font-size: 20px;
  color: white;
  text-align: center;
`;

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [bufferedProgress, setBufferedProgress] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showBackArrow, setShowBackArrow] = useState(false);
  const [showForwardArrow, setShowForwardArrow] = useState(false);
  const [showPlayPause, setShowPlayPause] = useState(false);

  useVideoEvents(
    videoRef,
    setVideoProgress,
    setBufferedProgress,
    setIsPlaying,
    setIsVideoLoading,
    setShowControls
  );

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      const handleSeeking = () => setIsVideoLoading(true);
      const handleSeeked = () => setIsVideoLoading(false);

      videoElement.addEventListener("seeking", handleSeeking);
      videoElement.addEventListener("seeked", handleSeeked);

      return () => {
        videoElement.removeEventListener("seeking", handleSeeking);
        videoElement.removeEventListener("seeked", handleSeeked);
      };
    }
  }, []);

  const [tapTimeout, setTapTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleMuteUnmute = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSingleClick = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
      setIsPlaying(!isPlaying);
      setShowPlayPause(true);
      setTimeout(() => setShowPlayPause(false), 500);
    }
  };

  const handleDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const rect = videoElement.getBoundingClientRect();
      const tapPosition = event.clientX - rect.left;
      const isLeftSide = tapPosition < rect.width / 2;

      if (isLeftSide) {
        videoElement.currentTime = Math.max(videoElement.currentTime - 5, 0);
        setShowBackArrow(true);
        setTimeout(() => setShowBackArrow(false), 500);
      } else {
        videoElement.currentTime = Math.min(
          videoElement.currentTime + 5,
          videoElement.duration
        );
        setShowForwardArrow(true);
        setTimeout(() => setShowForwardArrow(false), 500);
      }
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (tapTimeout) {
      clearTimeout(tapTimeout);
      setTapTimeout(null);
      handleDoubleClick(event);
    } else {
      const timeout = setTimeout(() => {
        handleSingleClick();
        setTapTimeout(null);
      }, 300);
      setTapTimeout(timeout);
    }
  };

  const handleProgressBarClick = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clientX =
      "touches" in event ? event.touches[0].clientX : event.clientX;
    const offsetX = clientX - rect.left;
    const newProgress = (offsetX / rect.width) * 100;
    setVideoProgress(newProgress);
    if (videoRef.current) {
      videoRef.current.currentTime =
        (newProgress / 100) * videoRef.current.duration;
    }
    setShowControls(true);
  };

  return (
    <div
      className={`relative ${className}`}
      style={style}
      onClick={handleClick}
    >
      {isVideoLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-black bg-opacity-50 rounded-t-md">
          <CircularProgress color="error" />
        </div>
      )}
      <video
        ref={videoRef}
        id={`video-${videoUrl}`}
        loop
        className={`post-card_img !rounded-md shadow-lg ${videoClassName}`}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div
        className={`absolute bottom-0 md:bottom-0 right-0 md:right-2 transition-opacity duration-300 ${
          showControls || isVideoLoading ? "opacity-100" : "opacity-0"
        } z-20`}
      >
        <IconButton
          onClick={handleMuteUnmute}
          className="text-white bg-gray-700 hover:bg-gray-600 rounded-full"
        >
          {isMuted ? (
            <VolumeOffIcon htmlColor="red" />
          ) : (
            <VolumeUpIcon htmlColor="white" />
          )}
        </IconButton>
      </div>
      <div
        className={`absolute bottom-0 md:bottom-0 left-0 right-0 h-1 bg-gray-300 rounded-full transition-opacity duration-300 ${
          showControls || isVideoLoading ? "opacity-100" : "opacity-0"
        } z-20 cursor-pointer progress-bar`}
        onMouseDown={handleProgressBarClick}
        onTouchStart={handleProgressBarClick}
      >
        <div
          className="h-full bg-red/50 transition-all duration-300 rounded-full absolute"
          style={{ width: `${bufferedProgress}%` }}
        />
        <div
          className="h-full bg-red transition-all duration-300 rounded-full relative"
          style={{ width: `${videoProgress}%` }}
        />
      </div>
      <LeftSvgContainer show={showBackArrow}>
        <SvgText>-5</SvgText>
        {[...Array(3)].map((_, i) => (
          <SvgWrapper key={i}>
            <Svg viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" />
            </Svg>
          </SvgWrapper>
        ))}
      </LeftSvgContainer>
      <RightSvgContainer show={showForwardArrow}>
        {[...Array(3)].map((_, i) => (
          <SvgWrapper key={i}>
            <Svg viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" />
            </Svg>
          </SvgWrapper>
        ))}
        <SvgText>+5</SvgText>
      </RightSvgContainer>
      <SvgContainer show={showPlayPause} persist={!isPlaying}>
        <Svg
          viewBox="0 0 24 24"
          className="bg-black/50 backdrop-blur-2xl p-2 rounded-full"
        >
          {isPlaying ? (
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" fill="currentColor" />
          ) : (
            <path d="M8 5v14l11-7L8 5z" />
          )}
        </Svg>
      </SvgContainer>
    </div>
  );
};

export default CustomVideoPlayer;
