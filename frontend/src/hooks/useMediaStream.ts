import { useEffect, useState } from "react";

/**
 * @description 선택한 비디오 / 오디오 장치가 변경되면, mediaStream을 업데이트하는 커스텀 훅
 */
export const useMediaStream = (
  selectedVideo: MediaDeviceInfo | null,
  selectedAudio: MediaDeviceInfo | null
) => {
  const [myMediaStream, setMyMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getMedia = async () => {
      try {
        const constraint = {
          audio: selectedAudio
            ? { deviceId: { exact: selectedAudio.deviceId } }
            : true,
          video: selectedVideo
            ? { deviceId: { exact: selectedVideo.deviceId } }
            : true,
        };
        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraint
        );
        setMyMediaStream(mediaStream);
      } catch (e) {
        console.error(e);
      }
    };

    getMedia();
  }, [selectedAudio, selectedVideo]);

  return myMediaStream;
};
