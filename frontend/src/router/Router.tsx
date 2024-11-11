import HomeLayout from "@components/HomeLayout";
import LandingLayout from "@components/LandingLayout";
import RoomLayout from "@components/RoomLayout";
import LandingPage from "@pages/LandingPage";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/home" element={<HomeLayout />} />
        <Route path="/room" element={<RoomLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
