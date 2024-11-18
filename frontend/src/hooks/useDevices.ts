import { Devices } from "@@types/rtcTypes";
import { ChangeEvent, useEffect, useState } from "react";

export const useDevices = () => {
  const [myDevices, setMyDevices] = useState<MediaDeviceInfo[]>([]);
  const [isDeviceOff, setIsDeviceOff] = useState<Devices>({
    video: false,
    audio: false,
  });
  const [selectedVideo, setSelectedVideo] = useState<MediaDeviceInfo | null>(
    null
  );
  const [selectedAudio, setSelectedAudio] = useState<MediaDeviceInfo | null>(
    null
  );

  /**
   * @description 드롭다운으로 카메라 / 비디오를 변경하는 이벤트 함수
   */
  const handleSelectDevices = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.name === "video") {
      const newSelectedVideo = myDevices.find(
        (device) => device.deviceId === e.target.value
      );

      if (newSelectedVideo) setSelectedVideo(newSelectedVideo);
    } else {
      const newSelectedAudio = myDevices.find(
        (device) => device.deviceId === e.target.value
      );

      if (newSelectedAudio) setSelectedAudio(newSelectedAudio);
    }
  };

  const toggleVideo = () => {
    setIsDeviceOff((prev) => ({ ...prev, video: !prev.video }));
  };

  const toggleAudio = () => {
    setIsDeviceOff((prev) => ({ ...prev, audio: !prev.audio }));
  };

  // 클라이언트의 모든 장치 리스트로 받기
  useEffect(() => {
    const getMyDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setMyDevices(devices);
      } catch (e) {
        console.error(e);
      }
    };

    getMyDevices();
  }, []);

  return {
    myDevices,
    selectedVideo,
    selectedAudio,
    isDeviceOff,
    handleSelectDevices,
    toggleVideo,
    toggleAudio,
  };
};
