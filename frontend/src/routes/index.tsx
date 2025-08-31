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
import SellerLayout from "@/components/layout/SellerLayout";
import { SellerDashboard } from "@/pages/seller/SellerDashboard";
import { SellerProductsPage } from "@/pages/seller/SellerProductsPage";
import { SellerOrdersPage } from "@/pages/seller/SellerOrdersPage";
import NotFound from "@/pages/user/NotFound";

function AppRoutes() {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify/:email" element={<VerifyOtpPage />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[848]} />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/myorders" element={<MyOrdersPage />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<CategoryPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[949]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<AdminCategoriesPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/users" element={<UsersPage />} />
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[747]} />}>
            <Route element={<SellerLayout />}>
              <Route path="/seller/dashboard" element={<SellerDashboard />} />
              <Route path="/seller/products" element={<SellerProductsPage />} />
              <Route path="/seller/orders" element={<SellerOrdersPage />} />
            </Route>
          </Route>

          <Route path="/*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default AppRoutes;
