import { useEffect, useState } from "react";

/**
 * @description 사용자 기기에 있는 전체 장비 목록을 상태로 반환하는 커스텀 훅
 */
export const useMyDevices = () => {
  const [myDevices, setMyDevices] = useState<MediaDeviceInfo[]>([]);

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

  return myDevices;
};
