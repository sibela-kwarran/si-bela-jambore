
import {
  FaBell,
  FaUserCircle,
  FaCalendarAlt,
  FaBars,
} from "react-icons/fa";

export default function Header({ onMenuClick }) {

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (

    <header className="bg-white shadow-md border-b shrink-0">

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          px-4
          py-3
          sm:px-5
          sm:py-4
          lg:px-8
          lg:py-5
        "
      >

        {/* =================================
            KIRI
        ================================= */}

        <div className="flex items-center gap-3 min-w-0">

          {/* Tombol Menu HP */}

          <button
            onClick={onMenuClick}
            className="
              lg:hidden
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-lg
              bg-green-700
              text-white
              hover:bg-green-800
              transition
              shrink-0
            "
            aria-label="Buka menu"
          >

            <FaBars />

          </button>


          {/* Judul */}

          <div className="min-w-0">

            <h1
              className="
                text-lg
                sm:text-2xl
                lg:text-3xl
                font-bold
                text-green-700
                truncate
              "
            >
              Dashboard Operator
            </h1>

            <p
              className="
                hidden
                sm:block
                text-gray-500
                text-sm
                lg:text-base
                mt-1
                truncate
              "
            >
              Sistem Informasi Berkas Pendaftaran dan Administrasi
            </p>

          </div>

        </div>


        {/* =================================
            KANAN
        ================================= */}

        <div className="flex items-center gap-3 sm:gap-5 lg:gap-6 shrink-0">


          {/* Notifikasi */}

          <button className="relative">

            <FaBell
              className="
                text-lg
                sm:text-xl
                lg:text-2xl
                text-gray-500
                hover:text-green-700
              "
            />

            <span
              className="
                absolute
                -top-2
                -right-2
                bg-red-500
                text-white
                text-[10px]
                rounded-full
                w-4
                h-4
                sm:w-5
                sm:h-5
                flex
                items-center
                justify-center
              "
            >
              0
            </span>

          </button>


          {/* Kalender */}

          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              text-gray-600
            "
          >

            <FaCalendarAlt className="text-green-600" />

            <span className="text-sm">
              {today}
            </span>

          </div>


          {/* User */}

          <div className="flex items-center gap-2">

            <FaUserCircle
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                text-green-700
              "
            />

            <div className="hidden sm:block">

              <h3 className="font-semibold text-sm lg:text-base">
                Operator Gudep
              </h3>

              <p className="text-xs lg:text-sm text-gray-500">
                Login Aktif
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>

  );
}

