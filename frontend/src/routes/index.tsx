import PersistLogin from "@/components/auth/PersistLogin";
import RequireAuth from "@/components/auth/RequireAuth";
import MainLayout from "@/components/layout/MainLayout";
import CartPage from "@/pages/user/CartPage";
import Categories from "@/pages/user/Categories";
import CategoryPage from "@/pages/user/CategoryPage";
import HomePage from "@/pages/user/HomePage";
import LoginPage from "@/pages/user/LoginPage";
import CheckoutPage from "@/pages/user/CheckoutPage";
import ProductPage from "@/pages/user/ProductPage";
import RegisterPage from "@/pages/user/RegisterPage";
import ShopPage from "@/pages/user/ShopPage";
import VerifyOtpPage from "@/pages/user/VerifyOtpPage";
import { Route, Routes } from "react-router-dom";
import { MyOrdersPage } from "@/pages/user/MyOrdersPage";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import AdminLayout from "@/components/layout/AdminLayout";
import { ProductsPage } from "@/pages/admin/ProductsPage";
import { OrdersPage } from "@/pages/admin/OrdersPage";
import { UsersPage } from "@/pages/admin/UsersPage";
import { AdminCategoriesPage } from "@/pages/admin/CategoriesPage";

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
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/myorders" element={<MyOrdersPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
            </Route>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/customers" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;
