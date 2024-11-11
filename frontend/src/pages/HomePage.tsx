import { useNavigate } from "react-router-dom";
import { deleteLocalStorage, getLocalStorage } from "@utils/localStorage";
import { deleteAction } from "@apis/user";
import { isAxiosError } from "axios";

interface Props {
  id: string;
}

function HomePage({ id }: Props) {
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

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-tr from-slate-600 to-slate-500">
      <div className="bg-slate-200 min-w-96 px-24 py-16 rounded-xl shadow-xl flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-gray-700 mb-4">
          HomePage 입니다
        </h1>
        <p className="text-lg text-gray-700">제출자: 2022204045 최현성</p>
        <p className="text-base text-gray-800">현재 로그인한 ID: {id}</p>
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
