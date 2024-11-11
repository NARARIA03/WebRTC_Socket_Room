import { verifyAction } from "@apis/user";
import { getLocalStorage } from "@utils/localStorage";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  const goRegisterPage = () => {
    navigate("/register");
  };

  const goLoginPage = () => {
    navigate("/login");
  };

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
      <h1 className="text-3xl text-gray-700 font-semibold text-center">
        환영합니다!
      </h1>
      <div className="w-64 flex flex-col justify-center items-center mt-4 mx-auto">
        <button
          className="w-full block m-4 px-8 py-4 bg-slate-600 hover:bg-slate-500 text-slate-200 transition-all rounded-xl"
          onClick={goLoginPage}
        >
          로그인
        </button>
        <button
          className="w-full block m-4 px-8 py-4 bg-slate-600 hover:bg-slate-500 text-slate-200 transition-all rounded-xl"
          onClick={goRegisterPage}
        >
          회원가입
        </button>
      </div>
    </>
  );
}

export default LandingPage;
