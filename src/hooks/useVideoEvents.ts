import { useEffect, useRef, RefObject, Dispatch, SetStateAction } from "react";

const useVideoEvents = (
  videoRef: RefObject<HTMLVideoElement>,
  setVideoProgress: Dispatch<SetStateAction<number>>,
  setBufferedProgress: Dispatch<SetStateAction<number>>,
  setIsPlaying: Dispatch<SetStateAction<boolean>>,
  setIsVideoLoading: Dispatch<SetStateAction<boolean>>,
  setShowControls: Dispatch<SetStateAction<boolean>>
) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationRef = useRef<number | null>(null);

  const updateProgress = () => {
    if (videoRef.current) {
      const progress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };

  const updateBufferedProgress = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const buffered = videoElement.buffered;
      if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const duration = videoElement.duration;
        if (duration > 0) {
          const bufferedProgress = (bufferedEnd / duration) * 100;
          setBufferedProgress(bufferedProgress);
        }
      }
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoElement.play();
            setIsPlaying(true);
          } else {
            videoElement.pause();
            setIsPlaying(false);
          }
        },
        { root: null, rootMargin: "0px", threshold: 0.5 }
      );
      observerRef.current.observe(videoElement);

      videoElement.addEventListener("timeupdate", updateProgress);
      videoElement.addEventListener("progress", updateBufferedProgress);
      videoElement.addEventListener("loadeddata", () =>
        setIsVideoLoading(false)
      );
      videoElement.addEventListener("waiting", () => setIsVideoLoading(true));
      videoElement.addEventListener("playing", () => {
        setIsVideoLoading(false);
        setIsPlaying(true);
        setShowControls(false);
      });
      videoElement.addEventListener("pause", () => {
        setIsPlaying(false);
        setShowControls(true);
      });
      videoElement.addEventListener("ended", () => {
        setVideoProgress(0);
        setIsPlaying(false);
        setShowControls(true);
      });

      return () => {
        if (observerRef.current) {
          observerRef.current.unobserve(videoElement);
          observerRef.current.disconnect();
        }
        videoElement.removeEventListener("timeupdate", updateProgress);
        videoElement.removeEventListener("progress", updateBufferedProgress);
        videoElement.removeEventListener("loadeddata", () =>
          setIsVideoLoading(false)
        );
        videoElement.removeEventListener("waiting", () =>
          setIsVideoLoading(true)
        );
        videoElement.removeEventListener("playing", () => {
          setIsVideoLoading(false);
          setIsPlaying(true);
          setShowControls(false);
        });
        videoElement.removeEventListener("pause", () => {
          setIsPlaying(false);
          setShowControls(true);
        });
        videoElement.removeEventListener("ended", () => {
          setVideoProgress(0);
          setIsPlaying(false);
          setShowControls(true);
        });
      };
    }
  }, [
    videoRef,
    setVideoProgress,
    setBufferedProgress,
    setIsPlaying,
    setIsVideoLoading,
    setShowControls,
  ]);

  return { animationRef };
};

export default useVideoEvents;
