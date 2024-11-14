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
        <h1 className="text-4xl font-bold text-gray-700 mb-4">
          HomePage 입니다
        </h1>
        {roomInfo.length === 0 ? (
          <>
            <p>방이 존재하지 않습니다. 만들어보세요!</p>
            <form onSubmit={handleSubmitRoomName}>
              <input
                type="text"
                placeholder="새로운 방 이름을 입력해주세요"
                value={roomNameInput}
                onChange={(e) => setRoomNameInput(e.target.value)}
              />
              <input type="submit" />
            </form>
          </>
        ) : (
          roomInfo.map((room) => (
            <button
              onClick={() => {
                navigate("/room", {
                  state: {
                    roomName: room.roomName,
                  },
                });
              }}
            >
              <p>{room.roomName}</p>
              <p>{room.count}</p>
            </button>
          ))
        )}
        <button
          className="w-full block m-4 px-8 py-4 bg-slate-600 hover:bg-slate-500 text-slate-200 transition-all rounded-xl"
          onClick={handleLogout}
        >
          로그아웃
        </button>
        <button
          className="w-full block m-4 px-8 py-4 bg-slate-600 hover:bg-slate-500 text-slate-200 transition-all rounded-xl"
          onClick={handleDeleteId}
        >
          회원탈퇴
        </button>
      </div>
    </div>
  );
}

export default HomePage;
