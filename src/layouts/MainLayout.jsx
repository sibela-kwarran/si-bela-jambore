import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}

      <Sidebar />

      {/* Konten */}

      <main className="flex-1">

        <Header />

        <div className="p-6">

          <Outlet />

        </div>

      </main>

    </div>
  );
}