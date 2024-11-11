import { loginAction, verifyAction } from "@apis/user";
import Loading from "@components/Loading";
import { getLocalStorage, setLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const goLandingPage = () => {
    navigate("/");
  };

  const handleLoginButton = () => {
    if (!id) {
      alert("아이디를 입력해주세요.");
      return;
    }
    if (!pw) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    loginAction(id, pw)
      .then((result) => {
        setIsLoading(false);
        console.log(result.data.msg);
        if (result.status === 200) {
          alert("로그인에 성공했습니다.");
          setLocalStorage("jwt", result.data.token);
          navigate("/home");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error");
        if (isAxiosError(error)) {
          if (error.response?.status === 400) {
            alert(error.response.data.msg);
          } else {
            alert("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        }
      });
  };

  // 토큰이 있고, 유효하면 /home으로 이동
  useEffect(() => {
    const token = getLocalStorage("jwt");
    if (token) {
      verifyAction(token)
        .then((res) => {
          console.log(res.data.msg);
          navigate("/home");
        })
        .catch((err) => {
          if (isAxiosError(err)) {
            console.log(err.response?.data.msg);
          }
        });
    }
  }, []);

  return (
    <>
      <Loading isLoading={isLoading} />
      <IoCaretBackCircleSharp
        className="absolute top-3 left-3 size-10 hover:top-2 hover:left-2 hover:size-12 transition-all"
        onClick={goLandingPage}
      />
      <h1 className="text-3xl text-gray-600 font-semibold text-center">
        로그인
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-80 flex flex-col justify-center items-center mt-4 mx-auto">
          <input
            type="text"
            placeholder="ID를 입력해주세요."
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full h-10 rounded-xl p-4 m-3 text-gray-700"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요."
            autoComplete="current-password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full h-10 rounded-xl p-4 m-3 text-gray-700"
          />
          <button
            className="w-full block m-4 px-8 py-4 bg-slate-600 hover:bg-slate-500 text-slate-200 transition-all rounded-xl"
            onClick={handleLoginButton}
          >
            로그인
          </button>
          <Link to={"/register"} className="self-end text-sm text-blue-700 p-2">
            회원가입 하기
          </Link>
        </div>
      </form>
    </>
  );
}

export default LoginPage;
