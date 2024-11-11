import { MutableRefObject, useState } from "react";

type Device = {
  video: boolean;
  audio: boolean;
};

/**
 * @description 웹캠, 마이크를 온오프하기 위한 상태와 핸들러를 반환하는 커스텀 훅
 */
export const useDeviceToggle = (
  myMediaStream: MediaStream | null,
  videoRef: MutableRefObject<HTMLVideoElement | null>
) => {
  const [isDeviceOff, setIsDeviceOff] = useState<Device>({
    video: false,
    audio: false,
  });

  const handleToggleVideo = () => {
    setIsDeviceOff((prev) => ({ ...prev, video: !prev.video }));
    if (myMediaStream && videoRef.current) {
      myMediaStream
        .getVideoTracks()
        .forEach((videoTrack) => (videoTrack.enabled = !videoTrack.enabled));
    }
  };

  const handleToggleAudio = () => {
    setIsDeviceOff((prev) => ({ ...prev, audio: !prev.audio }));
    if (myMediaStream && videoRef.current) {
      myMediaStream
        .getAudioTracks()
        .forEach((audioTrack) => (audioTrack.enabled = !audioTrack.enabled));
    }
  };

  return { isDeviceOff, handleToggleVideo, handleToggleAudio };
};
