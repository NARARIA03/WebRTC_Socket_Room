import { checkIdAction, registerAction, verifyAction } from "@apis/user";
import Loading from "@components/Loading";
import { getLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { IoCaretBackCircleSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [checkPw, setCheckPw] = useState<string>("");

  // 회원가입 버튼을 활성화 하기 위한 조건 체크 state
  const [isIdNotExist, setIsIdNotExist] = useState<boolean>(false);
  const [idMsg, setIdMsg] = useState<string>("");
  const [isPwCheck, setIsPwCheck] = useState<boolean>(false);
  const [pwMsg, setPwMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const goLandingPage = () => {
    navigate("/");
  };

  /**
   * @description 아이디 확인 버튼 클릭 핸들러
   */
  const handleCheckIdButton = () => {
    if (!id) {
      setIdMsg("아이디를 입력해주세요.");
      setTimeout(() => {
        setIdMsg("");
      }, 2000);
      return;
    }
    checkIdAction(id)
      .then((result) => {
        if (result.status === 200) {
          setIdMsg("사용 가능한 아이디입니다.");
          setIsIdNotExist(true);
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          let errorMsg = "";
          if (error.response?.status === 409) {
            errorMsg = "이미 존재하는 아이디입니다.";
          } else if (error.response?.status === 500) {
            errorMsg = "서버 오류가 발생했습니다.";
          } else {
            errorMsg = "알 수 없는 오류가 발생했습니다.";
          }
          setIdMsg(errorMsg);
          setIsIdNotExist(false);
          const timer = setTimeout(() => {
            setIdMsg("");
          }, 2000);
          return () => clearTimeout(timer);
        }
      });
  };

  /**
   * @description 가입하기 버튼 클릭 핸들러
   */
  const handleRegisterButton = () => {
    if (!id || !pw || !checkPw) {
      return;
    }
    setIsLoading(true);
    registerAction(id, pw)
      .then((result) => {
        console.log(result.data.msg);
        if (result.status === 201) {
          setIsLoading(false);
          alert("회원가입에 성공했습니다. 로그인해주세요.");
          navigate("/login");
        }
      })
      .catch((error) => {
        if (isAxiosError(error)) {
          setIsLoading(false);
          console.log(error.response?.data.msg);
          if (error.response?.status === 400) {
            alert(
              "회원가입에 실패했습니다. 아이디와 비밀번호를 다시 한 번 확인해주세요."
            );
          } else {
            alert("알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
          }
        }
      });
  };

  useEffect(() => {
    if (pw && checkPw) {
      if (pw === checkPw) {
        setIsPwCheck(true);
        setPwMsg("비밀번호가 확인되었습니다.");
      } else {
        setIsPwCheck(false);
        setPwMsg("비밀번호가 다릅니다.");
        const timer = setTimeout(() => {
          setPwMsg("");
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [pw, checkPw]);

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
        회원가입
      </h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="w-80 flex flex-col justify-center items-center mt-4 mx-auto">
          <div className="flex w-full items-center m-3">
            <input
              type="text"
              placeholder="사용할 ID를 입력해주세요."
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="flex-1 h-10 rounded-l-xl p-4 text-gray-700 border-r-0 rounded-r-none"
            />
            <button
              className="h-10 px-4 bg-slate-600 text-slate-200 transition-all rounded-r-xl hover:bg-slate-500"
              onClick={handleCheckIdButton}
            >
              ID 확인
            </button>
          </div>
          <p
            className={`self-start text-sm ${
              isIdNotExist ? "text-green-500" : "text-red-500"
            }`}
          >
            {idMsg}
          </p>

          <input
            type="password"
            autoComplete="new-password"
            placeholder="사용할 비밀번호를 입력해주세요."
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full h-10 rounded-xl p-4 m-3 text-gray-700"
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 확인해주세요."
            value={checkPw}
            onChange={(e) => setCheckPw(e.target.value)}
            className="w-full h-10 rounded-xl p-4 m-3 text-gray-700"
          />
          <p
            className={`self-start text-sm ${
              isPwCheck ? "text-green-500" : "text-red-500"
            }`}
          >
            {pwMsg}
          </p>
          <button
            className="w-full block m-4 px-8 py-4 rounded-xl bg-slate-600 hover:bg-slate-500 text-slate-200 disabled:bg-gray-400 disabled:hover:bg-gray-400 transition-all"
            disabled={!isIdNotExist || !isPwCheck}
            onClick={handleRegisterButton}
          >
            가입하기
          </button>
        </div>
      </form>
    </>
  );
}

export default RegisterPage;
