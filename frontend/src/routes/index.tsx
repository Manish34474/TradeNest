import MainLayout from "@/components/layout/MainLayout";
import HomePage from "@/pages/user/HomePage";
import LoginPage from "@/pages/user/LoginPage";
import RegisterPage from "@/pages/user/RegisterPage";
import ShopPage from "@/pages/user/ShopPage";
import { Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;
