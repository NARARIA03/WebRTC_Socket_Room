import { Chat, Devices, Peer, Stream } from "@@types/rtcTypes";
import { useEffect, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

/**
 * @description 소켓 연결, 연결 해제와 RTC 연결 이벤트를 처리하는 커스텀 훅
 */
export const useSocket = (
  roomName: string,
  myUserId: string,
  selectedVideo: MediaDeviceInfo | null,
  selectedAudio: MediaDeviceInfo | null,
  isDeviceOff: Devices
) => {
  const [remoteStreams, setRemoteStreams] = useState<Stream[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const myStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Peer[]>([]);

  const submitChat = (text: string) => {
    if (socketRef.current) {
      const socketId = socketRef.current.id as string;

      const time = new Date().toISOString();
      socketRef.current.emit(
        "send-chat",
        { id: socketId, userId: myUserId, text, time },
        roomName
      );
    }
  };

  // 소켓 연결 이후 -> 제일 먼저 userMedia를 받아와서 ref에 집어넣고,
  // RTC 연결 과정을 순차적으로 실행하는 함수
  const RTCConnection = async () => {
    if (socketRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      myStreamRef.current = stream;
      if (userVideoRef.current) userVideoRef.current.srcObject = stream;

      // 방 연결 이벤트를 서버로 발사
      socketRef.current.emit("join-room", roomName);

      socketRef.current.on("recv-chat", (chat: Chat[]) => setChats(chat));

      // 방에 잘 들어갔으면, 방에 있는 다른 유저들 socket.id와 userId 받아옴
      socketRef.current.on(
        "all-users",
        (remoteUsers: { remotePeerId: string; remoteUserId: string }[]) => {
          console.log(remoteUsers);
          // 방에 있는 다른 모든 유저들에게 offer를 날림
          remoteUsers.forEach(async ({ remotePeerId, remoteUserId }) => {
            // createPeer 함수는 offer를 만들어서 send-offer 하는 함수
            // 매개변수는 순서대로 offer 보낼 대상의 socket.id와 userId, 스트림 정보
            // ice, 원격 스트림, 로컬 스트림 처리는 createPeer 안에서 수행
            const peer = await createPeer(remotePeerId, remoteUserId, stream);
            // peersRef에 push해서 저장 <- userId는 상대방 아이디임
            peersRef.current.push({
              peerId: remotePeerId,
              userId: remoteUserId,
              peer,
            });
          });
        }
      );

      // 기존에 방에 있던 유저면 all-users를 받지 않을거임
      // 대신, 새로 들어온 애가 쏘는 send-offer를 수신 (recv-offer)하게 될거임
      // offer를 수신하고, offer를 보낸 애한테 answer를 날림
      socketRef.current.on(
        "recv-offer",
        async (senderPeerId, senderUserId, offer) => {
          // addPeer 함수는 answer를 만들어서 send-answer 하는 함수
          // 매개변수는 순서대로 offer, answer 보낼 대상, answer 보낼 대상의 userId, 스트림 정보
          // offer를 보낸 사람 (senderPeerId, senderUserId)에게 answer를 보낸다고 보면 됨
          // ice, 원격 스트림, 로컬 스트림 처리는 createPeer 안에서 수행
          const peer = await addPeer(offer, senderPeerId, senderUserId, stream);
          // peersRef에 push해서 저장
          peersRef.current.push({
            peerId: senderPeerId,
            userId: senderUserId,
            peer,
          });
        }
      );

      // 다시 방에 처음 들어온 유저의 입장에서는 send-offer -> recv-answer 순서다
      socketRef.current.on("recv-answer", (senderPeerId, answer) => {
        // answer를 보낸 peer를 peersRef에서 찾음
        const item = peersRef.current.find(
          (peer) => peer.peerId === senderPeerId
        );
        if (item) {
          // 찾은 peer의 remote description에 받은 answer 추가
          item.peer.setRemoteDescription({
            type: answer.type,
            sdp: answer.sdp,
          });
        }
      });

      // send-ice-candidate 이벤트를 createPeer, addPeer 함수 내에서 쏨
      // 이를 받는 recv-ice-candidate 이벤트도 필요
      socketRef.current.on("recv-ice-candidate", (senderPeerId, candidate) => {
        // candidate를 보낸 peer를 peersRef에서 찾음
        const item = peersRef.current.find(
          (peer) => peer.peerId === senderPeerId
        );
        if (item) {
          // 찾은 peer의 ice-candidate 정보에 받은 candidate 추가
          item.peer.addIceCandidate(candidate);
        }
      });

      // 방에 3명이 이미 있는 경우를 처리
      socketRef.current.on("room-full", () => {
        alert("방이 가득 찼습니다.");
      });

      // 내가 접속한 방에 다른 유저가 나가면 peersRef와 remoteStreams 제거
      socketRef.current.on("user-leave", (socketId: string) => {
        const leavePeerObj = peersRef.current.find(
          (peer) => peer.peerId === socketId
        );
        if (leavePeerObj) {
          // 1. RTCPeerConnection 닫기
          leavePeerObj.peer.close();
          // 2. peersRef에서 제거
          peersRef.current = peersRef.current.filter(
            (peer) => peer.peerId !== socketId
          );
        }
        setRemoteStreams((prev) =>
          prev.filter(({ peerId }) => peerId !== socketId)
        );
      });
    }
  };

  /**
   * @description 새로 들어온 유저가 기존 유저들에게 offer 날리고 필요 이벤트 처리하는 함수
   * @param remotePeerId offer 받을 유저의 socket.id
   * @param remoteUserId offer 받을 유저의 userId
   * @param stream 새로 들어온 유저의 스트림
   * @returns peer: RTCPeerConnection
   */
  const createPeer = async (
    remotePeerId: string,
    remoteUserId: string,
    stream: MediaStream
  ) => {
    // 새 peerConnection 객체 생성
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    // 원격 스트림 처리
    // 이 부분 이해 잘 안 됨
    // peer에 왜 ontrack이며, e를 받고 기존꺼에 e.streams[0]을 왜 추가하는지 공부
    peer.ontrack = (e) => {
      const newStreamObj: Stream = {
        peerId: remotePeerId,
        userId: remoteUserId,
        stream: e.streams[0],
      };
      setRemoteStreams((prev) =>
        prev.some(({ peerId }) => peerId === remotePeerId)
          ? prev
          : [...prev, newStreamObj]
      );
    };

    // 로컬 스트림 추가
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    // 오퍼 생성하고, await으로 기다린 뒤에 send-offer 이벤트 연결
    // 오퍼를 받을 peerId와 오퍼를 보낸(자신) userId를 함께 보냄
    const offer = await peer.createOffer();
    peer.setLocalDescription(offer);
    if (socketRef.current) {
      socketRef.current.emit("send-offer", remotePeerId, myUserId, {
        type: offer.type,
        sdp: offer.sdp,
      });
    }

    // ICE후보를 remotePeerId에 해당하는 socket.id에게 전송하도록 이벤트 리스너 연결
    // 이부분 이해 잘 안 됨
    peer.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit("send-ice-candidate", remotePeerId, e.candidate);
      }
    };

    return peer;
  };

  /**
   * @description 기존에 들어와 있던 유저가 recv-offer를 받으면 실행되는 함수
   * @param offer recv-offer로 받은 offer
   * @param remotePeerId answer를 받을 유저의 socket.id
   * @param remoteUserId answer를 받을 유저의 userId
   * @param stream 기존 유저의 stream
   * @returns peer: RTCPeerConnection
   */
  const addPeer = async (
    offer: RTCSessionDescriptionInit,
    remotePeerId: string,
    remoteUserId: string,
    stream: MediaStream
  ) => {
    // 새 peerConnection 객체 생성
    const peer = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.services.mozilla.com" },
        { urls: "stun:stun.l.google.com:19302" },
      ],
    });

    // 원격 스트림 처리
    // 이 부분 이해 잘 안 됨
    // peer에 왜 ontrack이며, e를 받고 기존꺼에 e.streams[0]을 왜 추가하는지 공부
    peer.ontrack = (e) => {
      const newStreamObj = {
        peerId: remotePeerId,
        userId: remoteUserId,
        stream: e.streams[0],
      };
      setRemoteStreams((prev) =>
        prev.some(({ peerId }) => peerId === remotePeerId)
          ? prev
          : [...prev, newStreamObj]
      );
    };

    // 로컬 스트림 추가
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));

    // offer를 remote description에 저장
    // 이 부분 이해 잘 안 됨
    await peer.setRemoteDescription(new RTCSessionDescription(offer));

    // answer 생성하고, local description에 저장하고 send-answer로 전달
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    if (socketRef.current) {
      socketRef.current.emit("send-answer", remotePeerId, answer);
    }

    // ICE후보를 to에 해당하는 socket.id에게 전송하도록 이벤트 리스너 연결
    // 이부분 이해 잘 안 됨
    peer.onicecandidate = (e) => {
      if (e.candidate && socketRef.current) {
        socketRef.current.emit("send-ice-candidate", remotePeerId, e.candidate);
      }
    };

    return peer;
  };

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      query: {
        userId: myUserId,
      },
    });
    RTCConnection();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, []);

  // 디바이스 state 변경 시 RTC와 video에 반영하는 effect
  useEffect(() => {
    const changeDeviceState = async () => {
      if (!selectedVideo && !selectedAudio) return;

      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: selectedVideo
            ? { deviceId: { exact: selectedVideo.deviceId } }
            : true,
          audio: selectedAudio
            ? { deviceId: { exact: selectedAudio.deviceId } }
            : true,
        });

        myStreamRef.current = newStream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = newStream;
        }

        // 모든 연결된 피어에 대해 변경된 스트림에 대해
        // kind가 일치하는 걸 찾아서 replaceTrack 한다는 개념..!
        peersRef.current.forEach((peer) => {
          newStream.getTracks().forEach((newTrack) => {
            const sender = peer.peer
              .getSenders()
              .find((s) => s.track?.kind === newTrack.kind);
            if (sender) {
              sender.replaceTrack(newTrack);
            }
          });
        });
      } catch (e) {
        console.error(e);
      }
    };

    changeDeviceState();
  }, [selectedVideo, selectedAudio]);

  useEffect(() => {
    if (myStreamRef.current) {
      myStreamRef.current
        .getVideoTracks()
        .forEach((videoTrack) => (videoTrack.enabled = !videoTrack.enabled));
    }
  }, [isDeviceOff.video]);

  useEffect(() => {
    if (myStreamRef.current) {
      myStreamRef.current
        .getAudioTracks()
        .forEach((audioTrack) => (audioTrack.enabled = !audioTrack.enabled));
    }
  }, [isDeviceOff.audio]);

  return { chats, submitChat, remoteStreams, userVideoRef };
};
