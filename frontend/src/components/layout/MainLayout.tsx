import { Outlet } from "react-router-dom";
import { Header } from "../user/Header";
import { Footer } from "../user/Footer";

export default function MainLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
