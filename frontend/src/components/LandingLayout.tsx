import { useValidateToken } from "@hooks/useValidateToken";
import { Navigate, Outlet } from "react-router-dom";
import Loading from "./Loading";

function LandingLayout() {
  const { id, isLoading } = useValidateToken();

  if (isLoading) return <Loading isLoading={isLoading} />;

  return !id ? (
    <div className="w-screen h-screen bg-slate-400 flex justify-center items-center">
      <div className="bg-slate-200 rounded-2xl w-1/2 min-w-96 h-1/2 min-h-96 p-8 shadow-2xl flex flex-col justify-center relative">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/home" />
  );
}

export default LandingLayout;
