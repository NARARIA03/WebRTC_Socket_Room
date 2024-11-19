export type Stream = {
  peerId: string;
  userId: string;
  stream: MediaStream;
};

export type Peer = {
  peerId: string;
  userId: string;
  peer: RTCPeerConnection;
};

export type Devices = {
  video: boolean;
  audio: boolean;
};

export type Chat = {
  id: string;
  userId: string;
  text: string;
  time: string;
};
