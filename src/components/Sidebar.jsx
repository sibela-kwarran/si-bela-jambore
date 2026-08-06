import { NavLink, useNavigate } from "react-router-dom";

import {
  FaTachometerAlt,
  FaSchool,
  FaUserTie,
  FaUsers,
  FaUserGraduate,
  FaFolderOpen,
  FaMoneyBillWave,
  FaClipboardCheck,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Dashboard",
    path: "/operator/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    title: "Profil Gugus Depan",
    path: "/operator/profil",
    icon: <FaSchool />,
  },
  {
    title: "Data Pembina",
    path: "/operator/pembina",
    icon: <FaUserTie />,
  },
  {
    title: "Data Regu",
    path: "/operator/regu",
    icon: <FaUsers />,
  },
  {
    title: "Data Peserta",
    path: "/operator/peserta",
    icon: <FaUserGraduate />,
  },
  {
    title: "Upload Berkas",
    path: "/operator/upload",
    icon: <FaFolderOpen />,
  },
  {
    title: "Pembayaran",
    path: "/operator/pembayaran",
    icon: <FaMoneyBillWave />,
  },
  {
    title: "Konfirmasi Data",
    path: "/operator/konfirmasi",
    icon: <FaClipboardCheck />,
  },
  {
    title: "Status Verifikasi",
    path: "/operator/status",
    icon: <FaSearch />,
  },
];

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {

    if (!window.confirm("Yakin ingin keluar dari SI BELA?")) {
      return;
    }

    localStorage.removeItem("loginUser");
    localStorage.removeItem("loginRole");

    navigate("/");
  };

  return (

    <aside
      className="
        w-64
        h-screen
        bg-gradient-to-b from-green-800 to-green-600
        text-white
        shadow-2xl
        flex
        flex-col
        shrink-0
      "
    >

      {/* =========================
          LOGO
      ========================= */}

      <div className="py-5 text-center border-b border-green-500">

        <div className="flex justify-center">

          <img
            src="/logo/sibela.png"
            alt="Logo SI BELA"
            className="
              w-16
              h-16
              rounded-full
              border-2
              border-white
              shadow-lg
              object-cover
            "
          />

        </div>

        <h1 className="mt-2 text-2xl font-bold">
          SI BELA
        </h1>

        <p className="text-xs text-green-100">
          Sistem Informasi Berkas
        </p>

        <p className="text-xs text-green-100">
          Pendaftaran & Administrasi
        </p>

      </div>


      {/* =========================
          OPERATOR
      ========================= */}

      <div className="px-3 py-3 border-b border-green-500">

        <div className="bg-green-700 rounded-lg px-3 py-2">

          <p className="text-[10px] text-green-200">
            Login Sebagai
          </p>

          <h2 className="font-semibold text-sm">
            Operator Gugus Depan
          </h2>

        </div>

      </div>


      {/* =========================
          MENU
      ========================= */}

      <nav className="flex-1 py-2 overflow-y-auto">

        <div className="space-y-1">

          {menuItems.map((menu) => (

            
<NavLink
  key={menu.path}
  to={menu.path}
  className={({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200 ${
      isActive
        ? "bg-white !text-green-700 shadow-md font-semibold"
        : "text-white hover:bg-green-700 hover:translate-x-1"
    }`
  }
>



              <span className="text-lg shrink-0">
                {menu.icon}
              </span>

              <span className="truncate">
                {menu.title}
              </span>

            </NavLink>

          ))}

        </div>

      </nav>


      {/* =========================
          LOGOUT
      ========================= */}

      <div className="p-3 border-t border-green-500">

        <button
          onClick={handleLogout}
          className="
            flex
            items-center
            justify-center
            gap-2
            w-full
            bg-red-500
            hover:bg-red-600
            rounded-lg
            py-2.5
            text-sm
            font-semibold
            transition
          "
        >

          <FaSignOutAlt />

          Logout

        </button>

      </div>

    </aside>

  );
}



