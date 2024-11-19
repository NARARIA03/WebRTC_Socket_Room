import { useNavigate } from "react-router-dom";
import { deleteLocalStorage, getLocalStorage } from "@utils/localStorage";
import { deleteAction } from "@apis/user";
import axios, { isAxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";

interface Props {
  id: string;
}

type RoomInfo = {
  roomName: string;
  count: number;
};

function HomePage({ id }: Props) {
  const [roomInfo, setRoomInfo] = useState<RoomInfo[]>([]);
  const [roomNameInput, setRoomNameInput] = useState<string>("");

  const navigate = useNavigate();

  /**
   * @description 로그아웃 버튼 이벤트 리스너, 로컬스토리지의 jwt를 삭제
   */
  const handleLogout = () => {
    deleteLocalStorage("jwt");
    alert("로그아웃 되었습니다");
    navigate("/");
  };

  /**
   * @description 회원탈퇴 버튼 이벤트 리스너, apis의 deleteAction을 사용
   */
  const handleDeleteId = () => {
    const token = getLocalStorage("jwt");
    if (!token) {
      alert("로그아웃 되었습니다");
      navigate("/");
      return;
    }
    deleteAction(id, token)
      .then((res) => {
        console.log(res);
        alert("회원탈퇴 되었습니다");
        deleteLocalStorage("jwt");
        navigate("/");
      })
      .catch((err) => {
        if (isAxiosError(err)) {
          console.log(err);
        }
      });
  };

  /**
   * @description 새로운 방 만드는 핸들러
   */
  const handleSubmitRoomName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!roomNameInput) {
      alert("채팅방 이름을 입력해주세요");
      return;
    }
    navigate("/room", {
      state: {
        roomName: roomNameInput,
      },
    });
  };

  useEffect(() => {
    const fetchRoomsData = async () => {
      try {
        const token = getLocalStorage("jwt");
        if (!token) {
          alert("로그아웃 되었습니다");
          navigate("/");
          return;
        }

        const { data } = await axios.get<{
          msg: string;
          rooms: RoomInfo[];
        }>(`${import.meta.env.VITE_API_URL}/chat`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRoomInfo(data.rooms);
      } catch (e) {
        console.error(e);
      }
    };

    fetchRoomsData();
  }, [navigate]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-tr from-slate-600 to-slate-500">
      <div className="bg-slate-200 min-w-96 px-24 py-16 rounded-xl shadow-xl flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-gray-700 mb-6">
          HomePage 입니다
        </h1>
        {roomInfo.length === 0 ? (
          <>
            <p className="text-gray-600 mb-1">채팅방이 존재하지 않습니다.</p>
            <p className="text-gray-600 mb-3">
              새로고침하거나, 새 채팅방을 만들어보세요!
            </p>
            <form
              className="flex flex-col items-center gap-4"
              onSubmit={handleSubmitRoomName}
            >
              <input
                className="px-4 py-2 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 w-64"
                type="text"
                placeholder="새로운 채팅방 이름을 입력해주세요"
                value={roomNameInput}
                onChange={(e) => setRoomNameInput(e.target.value)}
              />
              <input
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-all cursor-pointer"
                type="submit"
                value="채팅방 만들기"
              />
            </form>
          </>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {roomInfo.map((room) => (
              <button
                key={room.roomName}
                className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-300 transition-all rounded-lg shadow-md flex justify-between items-center"
                onClick={() => {
                  navigate("/room", {
                    state: {
                      roomName: room.roomName,
                    },
                  });
                }}
              >
                <div>
                  <p className="text-lg font-semibold text-gray-700">
                    {room.roomName}
                  </p>
                  <p className="text-sm text-gray-500">인원: {room.count}</p>
                </div>
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-4 mt-8 w-full">
          <button
            className="flex-1 block px-8 py-4 bg-slate-600 hover:bg-slate-500 text-slate-200 transition-all rounded-xl text-center"
            onClick={handleLogout}
          >
            로그아웃
          </button>
          <button
            className="flex-1 block px-8 py-4 bg-red-600 hover:bg-red-500 text-white transition-all rounded-xl text-center"
            onClick={handleDeleteId}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
