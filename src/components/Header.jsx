import {
  FaBell,
  FaUserCircle,
  FaCalendarAlt,
} from "react-icons/fa";

export default function Header() {

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (

    <header className="bg-white shadow-md border-b">

      <div className="flex justify-between items-center px-8 py-5">

        <div>

          <h1 className="text-3xl font-bold text-green-700">
            Dashboard Operator
          </h1>

          <p className="text-gray-500 mt-1">
            Sistem Informasi Berkas Pendaftaran dan Administrasi
          </p>

        </div>

        <div className="flex items-center gap-6">

          <button className="relative">

            <FaBell className="text-2xl text-gray-500 hover:text-green-700" />

            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>

          </button>

          <div className="flex items-center gap-2 text-gray-600">

            <FaCalendarAlt className="text-green-600" />

            <span className="text-sm">
              {today}
            </span>

          </div>

          <div className="flex items-center gap-3">

            <FaUserCircle className="text-5xl text-green-700" />

            <div>

              <h3 className="font-semibold">
                Operator Gudep
              </h3>

              <p className="text-sm text-gray-500">
                Login Aktif
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>

  );
}