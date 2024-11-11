import { ChangeEvent, useState } from "react";

/**
 * @description 디바이스 변경과 관련된 상태와 이벤트핸들러를 반환하는 커스텀 훅
 */
export const useDeviceChange = (myDevices: MediaDeviceInfo[]) => {
  const [selectedVideo, setSelectedVideo] = useState<MediaDeviceInfo | null>(
    null
  );
  const [selectedAudio, setSelectedAudio] = useState<MediaDeviceInfo | null>(
    null
  );

  const handleSelectedVideo = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSelectedVideo = myDevices.find(
      (device) => device.deviceId === e.target.value
    );

    if (newSelectedVideo) setSelectedVideo(newSelectedVideo);
  };

  const handleSelectedAudio = (e: ChangeEvent<HTMLSelectElement>) => {
    const newSelectedAudio = myDevices.find(
      (device) => device.deviceId === e.target.value
    );

    if (newSelectedAudio) setSelectedAudio(newSelectedAudio);
  };

  return {
    selectedVideo,
    selectedAudio,
    handleSelectedVideo,
    handleSelectedAudio,
  };
};
