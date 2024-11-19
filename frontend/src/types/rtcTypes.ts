export type Stream = {
  peerId: string;
  stream: MediaStream;
};

export type Peer = {
  peerId: string;
  peer: RTCPeerConnection;
};

export type Devices = {
  video: boolean;
  audio: boolean;
};

export type Chat = {
  id: string;
  text: string;
  time: string;
};
