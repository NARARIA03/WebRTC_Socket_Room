import { useEffect, useRef } from "react";

/**
 * @description mediaStream이 변경되면, videoRef를 업데이트하는 커스텀 훅
 */
export const useVideoRef = (myMediaStream: MediaStream | null) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // myMediaStream 값이 바뀌면, 바뀐 값으로 videoRef를 업데이트
  useEffect(() => {
    if (myMediaStream && videoRef.current) {
      videoRef.current.srcObject = myMediaStream;
    }
  }, [myMediaStream]);

  return videoRef;
};
