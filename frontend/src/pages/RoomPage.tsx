import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";
import { useDevices } from "@hooks/useDevices";
import { useSocket } from "@hooks/useSocket";
import ChatBox from "@components/ChatBox";
import { useRef, useEffect } from "react";
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
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <div className="p-4 bg-gray-700 shadow-md">
        <h1 className="text-2xl font-semibold text-center">
          채팅방 이름: {roomName}
        </h1>
      </div>

      <div className="flex-1 h-96 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div className="flex justify-center items-center bg-gray-800 rounded-lg p-4 shadow-md">
          <div className="bg-gray-700 rounded-lg p-2 shadow-md">
            <video
              ref={userVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-auto max-h-[300px] rounded-lg shadow-md object-cover"
            />
          </div>
        </div>

        {/* 원격 캠 */}
        <div className="bg-gray-800 rounded-lg shadow-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remoteStreams.map(({ peerId, stream }) => (
              <div
                key={peerId}
                className="bg-gray-700 rounded-lg p-2 shadow-md"
              >
                <Video stream={stream} />
                <p className="text-center text-sm mt-2 text-gray-400 truncate">
                  Peer ID: {peerId}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-md p-4 flex justify-center items-center">
          <ChatBox />
        </div>
      </div>

      <div className="w-full p-4 bg-gray-700 shadow-md flex items-center flex-wrap justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 transition-all text-white"
            onClick={toggleAudio}
          >
            {isDeviceOff.audio ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 transition-all text-white"
            onClick={toggleVideo}
          >
            {isDeviceOff.video ? <FaVideoSlash /> : <FaVideo />}
          </button>
        </div>

        <div className="flex justify-center items-center gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="videoSelect" className="text-sm text-gray-400">
              Video Device
            </label>
            <select
              id="videoSelect"
              name="video"
              value={selectedVideo ? selectedVideo.deviceId : ""}
              onChange={handleSelectDevices}
              className="w-full p-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            >
              {myDevices
                .filter((device) => device.kind === "videoinput")
                .map((video) => (
                  <option key={video.deviceId} value={video.deviceId}>
                    {video.label}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="audioSelect" className="text-sm text-gray-400">
              Audio Device
            </label>
            <select
              id="audioSelect"
              name="audio"
              value={selectedAudio ? selectedAudio.deviceId : ""}
              onChange={handleSelectDevices}
              className="w-full p-2 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
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
        </div>
      </div>
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

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="w-full h-auto max-h-[300px] rounded-lg shadow-md object-cover"
    />
  );
}

export default RoomPage;
