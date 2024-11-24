import { useNavigate } from "react-router-dom";
import { deleteLocalStorage, getLocalStorage } from "@utils/localStorage";
import { deleteAction } from "@apis/user";
import axios, { isAxiosError } from "axios";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";

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

  const fetchRoomsData = useCallback(async () => {
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
  }, [navigate]);

  useEffect(() => {
    fetchRoomsData();
  }, [fetchRoomsData]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-tr from-slate-600 to-slate-500">
      <div className="relative bg-slate-200 min-w-96 px-24 py-16 rounded-xl shadow-xl flex flex-col justify-center items-center">
        <h1 className="mb-8 text-4xl font-bold text-gray-700">채팅방 목록</h1>
        <button
          onClick={fetchRoomsData}
          className="absolute top-20 right-20 ml-4 p-2 hover:scale-125 transition-all"
        >
          <IoMdRefresh className="h-7 w-7 text-slate-600" />
        </button>
        <div className="flex flex-col gap-4 w-full mb-6">
          {roomInfo.length === 0 ? (
            <div className="text-center text-gray-500">
              <p>현재 채팅방이 존재하지 않습니다.</p>
              <p>채팅방을 만들거나 새로고침해보세요.</p>
            </div>
          ) : (
            roomInfo.map((room) => (
              <button
                key={room.roomName}
                className="w-full px-6 py-4 bg-slate-100 hover:bg-slate-300 disabled:bg-gray-400 transition-all rounded-lg shadow-md flex justify-between items-center"
                disabled={room.count === 3}
                onClick={() => {
                  navigate("/room", {
                    state: {
                      roomName: room.roomName,
                    },
                  });
                }}
              >
                <div>
                  <p className="text-lg text-start font-semibold text-gray-700">
                    {room.roomName}
                  </p>
                  <p className="text-sm text-gray-500">
                    인원: {room.count} (
                    {room.count === 3 ? "입장 불가" : "입장 가능"})
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <form
          className="flex flex-row items-center gap-4 mt-4"
          onSubmit={handleSubmitRoomName}
        >
          <input
            className="px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 w-64"
            type="text"
            placeholder="새로운 채팅방 이름을 입력해주세요"
            value={roomNameInput}
            onChange={(e) => setRoomNameInput(e.target.value)}
          />
          <input
            className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-lg transition-all cursor-pointer"
            type="submit"
            value="채팅방 만들기"
          />
        </form>

        <div className="flex gap-4 mt-8 w-full">
          <button
            className="flex-1 block px-8 py-4 bg-slate-600 hover:bg-slate-500 text-slate-200 transition-all rounded-xl text-center"
            onClick={handleLogout}
          >
            로그아웃
          </button>
          <button
            className="flex-1 block px-8 py-4 bg-red-600 hover:bg-red-500 text-slate-200 transition-all rounded-xl text-center"
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
