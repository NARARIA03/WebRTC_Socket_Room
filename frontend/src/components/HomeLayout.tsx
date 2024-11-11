import { useValidateToken } from "@hooks/useValidateToken";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";
import HomePage from "@pages/HomePage";

function HomeLayout() {
  const { id, isLoading } = useValidateToken();

  if (isLoading) return <Loading isLoading={isLoading} />;

  return id ? <HomePage id={id} /> : <Navigate to="/login" />;
}

export default HomeLayout;
