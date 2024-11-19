import { Devices } from "@@types/rtcTypes";
import { ChangeEvent } from "react";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

interface Props {
  myDevices: MediaDeviceInfo[];
  selectedVideo: MediaDeviceInfo | null;
  selectedAudio: MediaDeviceInfo | null;
  isDeviceOff: Devices;
  handleSelectDevices: (e: ChangeEvent<HTMLSelectElement>) => void;
  toggleVideo: () => void;
  toggleAudio: () => void;
}

function ControlBar({
  isDeviceOff,
  selectedVideo,
  selectedAudio,
  myDevices,
  handleSelectDevices,
  toggleVideo,
  toggleAudio,
}: Props) {
  return (
    <div className="w-full p-4 bg-gray-700 shadow-md flex items-center flex-wrap justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 transition-all text-slate-200"
          onClick={toggleAudio}
        >
          {isDeviceOff.audio ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>
        <button
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-600 hover:bg-gray-500 transition-all text-slate-200"
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
            className="w-full p-2 rounded-lg bg-gray-800 text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-400"
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
            className="w-full p-2 rounded-lg bg-gray-800 text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-gray-400"
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
  );
}

export default ControlBar;
