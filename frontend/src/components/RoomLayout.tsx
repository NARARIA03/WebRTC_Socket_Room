import { useValidateToken } from "@hooks/useValidateToken";
import Loading from "./Loading";
import { Navigate } from "react-router-dom";
import RoomPage from "@pages/RoomPage";

function RoomLayout() {
  const { id, isLoading } = useValidateToken();

  if (isLoading) return <Loading isLoading={isLoading} />;

  return id ? <RoomPage id={id} /> : <Navigate to="/login" />;
}

export default RoomLayout;
