import { useDeviceChange } from "@hooks/useDeviceChange";
import { useDeviceToggle } from "@hooks/useDeviceToggle";
import { useMediaStream } from "@hooks/useMediaStream";
import { useMyDevices } from "@hooks/useMyDevices";
import { useSocket } from "@hooks/useSocket";
import { useVideoRef } from "@hooks/useVideoRef";
import { useLocation } from "react-router-dom";

interface Props {
  id: string;
}

function RoomPage({ id }: Props): JSX.Element {
  const location = useLocation();
  const { roomName } = location.state;

  // 소켓 연결, 방 연결, 소켓 연결 해제를 처리하는 커스텀 훅
  useSocket(id, roomName);

  // 사용자 기기에 있는 전체 장비 목록을 상태로 반환하는 커스텀 훅
  const myDevices = useMyDevices();

  // 디바이스 변경과 관련된 상태와 이벤트핸들러를 반환하는 커스텀 훅
  const {
    selectedVideo,
    selectedAudio,
    handleSelectedVideo,
    handleSelectedAudio,
  } = useDeviceChange(myDevices);

  // 선택한 비디오 / 오디오 장치가 변경되면, mediaStream을 업데이트하는 커스텀 훅
  const myMediaStream = useMediaStream(selectedVideo, selectedAudio);

  // mediaStream이 변경되면, videoRef를 업데이트하는 커스텀 훅
  const videoRef = useVideoRef(myMediaStream);

  // 웹캠, 마이크를 온오프하기 위한 상태와 핸들러를 반환하는 커스텀 훅
  const { isDeviceOff, handleToggleVideo, handleToggleAudio } = useDeviceToggle(
    myMediaStream,
    videoRef
  );

  return (
    <div className="w-screen h-screen">
      <p>방 이름: {roomName}</p>

      {myMediaStream && (
        <video autoPlay playsInline ref={videoRef} className="w-64 h-64" />
      )}

      <button onClick={handleToggleAudio}>
        {isDeviceOff.audio ? "Unmute" : "Mute"}
      </button>
      <button onClick={handleToggleVideo}>
        {isDeviceOff.video ? "Camera On" : "Camera Off"}
      </button>

      <select
        value={selectedVideo ? selectedVideo.deviceId : ""}
        onChange={handleSelectedVideo}
      >
        {myDevices
          .filter((device) => device.kind === "videoinput")
          .map((video) => (
            <option key={video.deviceId} value={video.deviceId}>
              {video.label}
            </option>
          ))}
      </select>

      <select
        value={selectedAudio ? selectedAudio.deviceId : ""}
        onChange={handleSelectedAudio}
      >
        {myDevices
          .filter((device) => device.kind === "audioinput")
          .map((audio) => (
            <option key={audio.deviceId} value={audio.deviceId}>
              {audio.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default RoomPage;
