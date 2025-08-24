import PersistLogin from "@/components/auth/PersistLogin";
import RequireAuth from "@/components/auth/RequireAuth";
import MainLayout from "@/components/layout/MainLayout";
import CategoryPage from "@/pages/user/CategoryPage";
import HomePage from "@/pages/user/HomePage";
import LoginPage from "@/pages/user/LoginPage";
import RegisterPage from "@/pages/user/RegisterPage";
import ShopPage from "@/pages/user/ShopPage";
import VerifyOtpPage from "@/pages/user/VerifyOtpPage";
import { Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:email" element={<VerifyOtpPage />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[848]} />}>
            <Route element={<MainLayout />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;
