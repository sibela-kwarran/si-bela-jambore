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
  FaIdCard,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  {
    title: "Dashboard",
    path: "/operator/dashboard",
    icon: <FaTachometerAlt className="text-blue-400 text-xl" />,
  },
  {
    title: "Profil Gugus Depan",
    path: "/operator/profil",
    icon: <FaSchool className="text-green-300 text-xl" />,
  },
  {
    title: "Data Pembina",
    path: "/operator/pembina",
    icon: <FaUserTie className="text-purple-300 text-xl" />,
  },
  {
    title: "Data Regu",
    path: "/operator/regu",
    icon: <FaUsers className="text-orange-300 text-xl" />,
  },
  {
    title: "Data Peserta",
    path: "/operator/peserta",
    icon: <FaUserGraduate className="text-cyan-300 text-xl" />,
  },
  {
    title: "Upload Berkas",
    path: "/operator/upload",
    icon: <FaFolderOpen className="text-yellow-300 text-xl" />,
  },
  {
    title: "Pembayaran",
    path: "/operator/pembayaran",
    icon: <FaMoneyBillWave className="text-lime-300 text-xl" />,
  },
  {
    title: "Konfirmasi Data",
    path: "/operator/konfirmasi",
    icon: <FaClipboardCheck className="text-emerald-300 text-xl" />,
  },
  {
    title: "Status Verifikasi",
    path: "/operator/status",
    icon: <FaSearch className="text-red-300 text-xl" />,
  },
  {
    title: "Download Kartu",
    path: "/operator/kartu",
    icon: <FaIdCard className="text-indigo-300 text-xl" />,
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
    <aside className="w-72 bg-gradient-to-b from-green-800 to-green-600 text-white shadow-2xl flex flex-col">

      {/* Logo */}
      <div className="py-8 text-center border-b border-green-500">

        <div className="flex justify-center">

  <img
    src="/logo/sibela.png"
    alt="Logo SI BELA"
    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
  />

</div>

        <h1 className="mt-4 text-3xl font-bold">
          SI BELA
        </h1>

        <p className="text-sm text-green-100">
          Sistem Informasi Berkas
        </p>

        <p className="text-sm text-green-100">
          Pendaftaran & Administrasi
        </p>

      </div>

      {/* Operator */}

      <div className="p-5 border-b border-green-500">

        <div className="bg-green-700 rounded-xl p-3">

          <p className="text-xs text-green-200">
            Login Sebagai
          </p>

          <h2 className="font-semibold text-lg">
            Operator Gugus Depan
          </h2>

        </div>

      </div>

      {/* Menu */}

      <nav className="flex-1 py-4 overflow-y-auto">

        {menuItems.map((menu) => (

          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 mx-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white text-green-700 shadow-lg font-semibold"
                  : "hover:bg-green-700 hover:translate-x-1"
              }`
            }
          >
            {menu.icon}
            <span>{menu.title}</span>
          </NavLink>

        ))}

      </nav>

      {/* Logout */}

      <div className="p-4 border-t border-green-500">

        <button
  onClick={handleLogout}
  className="flex items-center justify-center gap-3 w-full bg-red-500 hover:bg-red-600 rounded-xl py-3 font-semibold transition"
>

  <FaSignOutAlt />

  Logout

</button>

      </div>

    </aside>
  );
}