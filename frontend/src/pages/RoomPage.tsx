import { useDevices } from "@hooks/useDevices";
import { useSocket } from "@hooks/useSocket";
import { useRef, useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";

function RoomPage() {
  const location = useLocation();
  const { roomName }: { roomName: string } = location.state;
  const {
    myDevices,
    selectedVideo,
    selectedAudio,
    isDeviceOff,
    handleSelectDevices,
    toggleVideo,
    toggleAudio,
  } = useDevices();

  const { remoteStreams, userVideoRef } = useSocket(
    roomName,
    selectedVideo,
    selectedAudio,
    isDeviceOff
  );

  return (
    <div className="w-screen h-screen">
      <p>방 이름: {roomName}</p>

      <video ref={userVideoRef} autoPlay muted playsInline />

      {remoteStreams.map(({ peerId, stream }) => (
        <Fragment key={peerId}>
          <Video stream={stream} />
          <p>{peerId}</p>
        </Fragment>
      ))}

      <button name="audio" onClick={toggleAudio}>
        {isDeviceOff.audio ? "Unmute" : "Mute"}
      </button>
      <button name="video" onClick={toggleVideo}>
        {isDeviceOff.video ? "Camera On" : "Camera Off"}
      </button>

      <select
        name="video"
        value={selectedVideo ? selectedVideo.deviceId : ""}
        onChange={handleSelectDevices}
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
        name="audio"
        value={selectedAudio ? selectedAudio.deviceId : ""}
        onChange={handleSelectDevices}
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

function Video({ stream }: { stream: MediaStream }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.srcObject = stream;
    }
  }, [stream]);

  return <video ref={ref} autoPlay playsInline />;
}

export default RoomPage;
