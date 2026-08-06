
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function MainLayout() {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* =================================
          SIDEBAR DESKTOP
      ================================= */}

      <div className="hidden lg:flex">

        <Sidebar />

      </div>


      {/* =================================
          SIDEBAR MOBILE
      ================================= */}

      {sidebarOpen && (

        <>

          {/* Overlay */}

          <div
            className="
              fixed
              inset-0
              bg-black/40
              z-40
              lg:hidden
            "
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}

          <div
            className="
              fixed
              left-0
              top-0
              bottom-0
              z-50
              lg:hidden
            "
          >

            <Sidebar />

          </div>

        </>

      )}


      {/* =================================
          KONTEN UTAMA
      ================================= */}

      <main className="flex-1 min-w-0 flex flex-col">

        <Header
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />


        {/* =================================
            ISI HALAMAN
        ================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-3
            sm:p-4
            lg:p-6
          "
        >

          <Outlet />

        </div>

      </main>

    </div>

  );
}

