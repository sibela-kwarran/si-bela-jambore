import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../lib/supabase";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetText, setResetText] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // ==========================================
  // SIDEBAR MOBILE
  // ==========================================
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = () => {
    // Hapus session admin
    localStorage.removeItem("adminLogin");

    // Bersihkan session
    sessionStorage.clear();

    // Tutup modal logout
    setShowLogout(false);

    // Kembali ke Landing Page SI BELA
    navigate("/", { replace: true });
  };

  // ==========================================
  // RESET DATA
  // ==========================================
  const handleReset = async () => {
    if (resetText !== "RESET SI BELA") {
      alert("⚠️ Ketik RESET SI BELA dengan benar.");
      return;
    }

    const yakin = window.confirm(
      "PERINGATAN TERAKHIR!\n\n" +
        "Seluruh data pendaftaran Gudep akan dihapus.\n\n" +
        "Data yang dihapus:\n" +
        "- Profil Gudep\n" +
        "- Operator Gudep\n" +
        "- Data Pembina\n" +
        "- Data Regu\n" +
        "- Data Peserta\n" +
        "- Berkas\n" +
        "- Pembayaran\n" +
        "- Pendaftaran\n" +
        "- Penempatan Blok\n\n" +
        "Data Kapling, Peta Perkemahan, dan Users TIDAK dihapus.\n\n" +
        "Lanjutkan?"
    );

    if (!yakin) return;

    try {
      setResetLoading(true);

      const { error } = await supabase.rpc(
        "reset_data_pendaftaran"
      );

      if (error) {
        console.error("RESET ERROR:", error);
        throw error;
      }

      alert(
        "✅ RESET BERHASIL!\n\n" +
          "Seluruh data pendaftaran telah dikosongkan."
      );

      setResetText("");
      setShowReset(false);

      // Kembali ke dashboard
      navigate("/admin/dashboard", {
        replace: true,
      });

      // Refresh agar statistik dashboard ikut diperbarui
      window.location.reload();
    } catch (err) {
      console.error("GAGAL RESET DATA:", err);

      alert(
        "❌ Gagal melakukan reset data.\n\n" +
          err.message
      );
    } finally {
      setResetLoading(false);
    }
  };

  // ==========================================
  // TUTUP SIDEBAR SETELAH PILIH MENU
  // ==========================================
  const handleMenuClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-100 overflow-hidden">

      {/* ==================================================
          SIDEBAR DESKTOP
      ================================================== */}

      <aside
        className="
          hidden
          lg:flex
          w-72
          bg-amber-700
          text-white
          flex-col
          shadow-xl
          shrink-0
          h-screen
        "
      >

        {/* BRAND */}

        <div className="p-6 border-b border-amber-500 text-center">

          <img
            src="/logo/sibela.png"
            alt="Logo SI BELA"
            className="
              w-24
              h-24
              mx-auto
              object-cover
              rounded-full
              border-4
              border-white
              shadow-lg
              mb-3
            "
          />

          <h1 className="text-2xl font-bold">
            SI BELA ADMIN
          </h1>

          <p className="text-sm text-amber-100 mt-1">
            Jambore Ranting 2026
          </p>

          <p className="text-xs text-amber-200">
            Kwarran Cikarang Utara
          </p>

        </div>

        {/* MENU */}

        <nav className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">

          <Link
            to="/admin/dashboard"
            className="
              hover:bg-amber-600
              rounded-lg
              px-4
              py-3
              transition
            "
          >
            🏠 Dashboard
          </Link>
<Link
  to="/admin/pengaturan-pendaftaran"
  className="
    hover:bg-amber-600
    rounded-lg
    px-4
    py-3
    transition
  "
>
  ⚙️ Pengaturan Pendaftaran
</Link>
          <Link
            to="/admin/verifikasi-gudep"
            className="
              hover:bg-amber-600
              rounded-lg
              px-4
              py-3
              transition
            "
          >
            🏕 Verifikasi Gudep
          </Link>

          <Link
            to="/admin/verifikasi-berkas"
            className="
              hover:bg-amber-600
              rounded-lg
              px-4
              py-3
              transition
            "
          >
            📄 Verifikasi Berkas
          </Link>

          <Link
            to="/admin/verifikasi-pembayaran"
            className="
              hover:bg-amber-600
              rounded-lg
              px-4
              py-3
              transition
            "
          >
            💳 Pembayaran
          </Link>

          <Link
            to="/admin/penempatan"
            className="
              hover:bg-amber-600
              rounded-lg
              px-4
              py-3
              transition
            "
          >
            ⛺ Penempatan Blok
          </Link>

          <Link
            to="/admin/peta"
            className="
              hover:bg-amber-600
              rounded-lg
              px-4
              py-3
              transition
            "
          >
            🗺️ Peta Perkemahan
          </Link>

          <Link
            to="/admin/laporan"
            className="
              hover:bg-amber-600
              rounded-lg
              px-4
              py-3
              transition
            "
          >
            📊 Laporan
          </Link>

          <button
            onClick={() => {
              console.log("RESET DIKLIK");

              setResetText("");
              setShowReset(true);

              console.log("SHOW RESET = TRUE");
            }}
            className="
              w-full
              text-left
              bg-red-700
              hover:bg-red-800
              rounded-lg
              px-4
              py-3
              transition
              font-semibold
              shadow
            "
          >
            🔄 Reset Data Pendaftaran
          </button>

          <button
            onClick={() => setShowLogout(true)}
            className="
              mt-auto
              w-full
              text-left
              bg-red-600
              hover:bg-red-700
              rounded-lg
              px-4
              py-3
              transition
              font-semibold
              shadow
            "
          >
            🚪 Logout
          </button>

        </nav>

        {/* FOOTER */}

        <div
          className="
            p-4
            text-center
            text-xs
            border-t
            border-amber-500
            text-amber-100
          "
        >
          © SI BELA 2026
        </div>

      </aside>


      {/* ==================================================
          SIDEBAR MOBILE
      ================================================== */}

      {sidebarOpen && (
        <>
          {/* OVERLAY */}

          <div
            className="
              fixed
              inset-0
              z-40
              bg-black/50
              lg:hidden
            "
            onClick={() => setSidebarOpen(false)}
          />

          {/* DRAWER */}

          <aside
            className="
              fixed
              left-0
              top-0
              bottom-0
              z-50
              w-72
              max-w-[85vw]
              bg-amber-700
              text-white
              flex
              flex-col
              shadow-2xl
              lg:hidden
            "
          >

            {/* BRAND */}

            <div className="p-5 border-b border-amber-500 text-center">

              <div className="flex items-center justify-between mb-3">

                <span className="text-sm font-semibold text-amber-100">
                  MENU ADMIN
                </span>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-amber-800
                    hover:bg-amber-900
                    flex
                    items-center
                    justify-center
                    text-lg
                  "
                  aria-label="Tutup menu"
                >
                  ✕
                </button>

              </div>

              <img
                src="/logo/sibela.png"
                alt="Logo SI BELA"
                className="
                  w-20
                  h-20
                  mx-auto
                  object-cover
                  rounded-full
                  border-4
                  border-white
                  shadow-lg
                  mb-3
                "
              />

              <h1 className="text-xl font-bold">
                SI BELA ADMIN
              </h1>

              <p className="text-xs text-amber-100 mt-1">
                Jambore Ranting 2026
              </p>

              <p className="text-[11px] text-amber-200">
                Kwarran Cikarang Utara
              </p>

            </div>

            {/* MENU */}

            <nav
              className="
                flex
                flex-col
                p-4
                gap-2
                flex-1
                overflow-y-auto
              "
            >

              <Link
                to="/admin/dashboard"
                onClick={handleMenuClick}
                className="
                  hover:bg-amber-600
                  rounded-lg
                  px-4
                  py-3
                  transition
                "
              >
                🏠 Dashboard
              </Link>

              <Link
                to="/admin/verifikasi-gudep"
                onClick={handleMenuClick}
                className="
                  hover:bg-amber-600
                  rounded-lg
                  px-4
                  py-3
                  transition
                "
              >
                🏕 Verifikasi Gudep
              </Link>

              <Link
                to="/admin/verifikasi-berkas"
                onClick={handleMenuClick}
                className="
                  hover:bg-amber-600
                  rounded-lg
                  px-4
                  py-3
                  transition
                "
              >
                📄 Verifikasi Berkas
              </Link>

              <Link
                to="/admin/verifikasi-pembayaran"
                onClick={handleMenuClick}
                className="
                  hover:bg-amber-600
                  rounded-lg
                  px-4
                  py-3
                  transition
                "
              >
                💳 Pembayaran
              </Link>

              <Link
                to="/admin/penempatan"
                onClick={handleMenuClick}
                className="
                  hover:bg-amber-600
                  rounded-lg
                  px-4
                  py-3
                  transition
                "
              >
                ⛺ Penempatan Blok
              </Link>

              <Link
                to="/admin/peta"
                onClick={handleMenuClick}
                className="
                  hover:bg-amber-600
                  rounded-lg
                  px-4
                  py-3
                  transition
                "
              >
                🗺️ Peta Perkemahan
              </Link>

              <Link
                to="/admin/laporan"
                onClick={handleMenuClick}
                className="
                  hover:bg-amber-600
                  rounded-lg
                  px-4
                  py-3
                  transition
                "
              >
                📊 Laporan
              </Link>

              <button
                onClick={() => {
                  setResetText("");
                  setShowReset(true);
                  setSidebarOpen(false);
                }}
                className="
                  w-full
                  text-left
                  bg-red-700
                  hover:bg-red-800
                  rounded-lg
                  px-4
                  py-3
                  transition
                  font-semibold
                  shadow
                "
              >
                🔄 Reset Data Pendaftaran
              </button>

              <button
                onClick={() => {
                  setShowLogout(true);
                  setSidebarOpen(false);
                }}
                className="
                  mt-auto
                  w-full
                  text-left
                  bg-red-600
                  hover:bg-red-700
                  rounded-lg
                  px-4
                  py-3
                  transition
                  font-semibold
                  shadow
                "
              >
                🚪 Logout
              </button>

            </nav>

            {/* FOOTER */}

            <div
              className="
                p-4
                text-center
                text-xs
                border-t
                border-amber-500
                text-amber-100
              "
            >
              © SI BELA 2026
            </div>

          </aside>
        </>
      )}


      {/* ==================================================
          AREA UTAMA
      ================================================== */}

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">

        {/* HEADER MOBILE */}

        <header
          className="
            lg:hidden
            h-16
            bg-white
            shadow-md
            border-b
            flex
            items-center
            justify-between
            px-3
            sm:px-4
            shrink-0
          "
        >

          <div className="flex items-center gap-3 min-w-0">

            <button
              onClick={() => setSidebarOpen(true)}
              className="
                w-10
                h-10
                shrink-0
                rounded-lg
                bg-amber-700
                hover:bg-amber-800
                text-white
                flex
                items-center
                justify-center
                text-xl
                shadow
              "
              aria-label="Buka menu admin"
            >
              ☰
            </button>

            <div className="min-w-0">

              <h1 className="font-bold text-amber-700 text-base sm:text-lg truncate">
                SI BELA ADMIN
              </h1>

              <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                Jambore Ranting 2026
              </p>

            </div>

          </div>

          <button
            onClick={() => setShowLogout(true)}
            className="
              w-9
              h-9
              shrink-0
              rounded-full
              bg-red-100
              text-red-600
              flex
              items-center
              justify-center
            "
            aria-label="Logout"
          >
            🚪
          </button>

        </header>


        {/* CONTENT */}

        <main
          className="
            flex-1
            min-w-0
            overflow-y-auto
            p-3
            sm:p-4
            lg:p-6
          "
        >
          <Outlet />
        </main>

      </div>


      {/* ==================================================
          MODAL RESET
      ================================================== */}

      {showReset && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/60
            p-4
          "
        >

          <div
            className="
              bg-white
              w-full
              max-w-lg
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              shadow-2xl
            "
          >

            <div
              className="
                bg-red-700
                text-white
                p-5
                sm:p-6
                rounded-t-2xl
                text-center
              "
            >

              <div className="text-4xl sm:text-5xl mb-2">
                ⚠️
              </div>

              <h2 className="text-xl sm:text-2xl font-bold">
                Reset Data Pendaftaran
              </h2>

            </div>

            <div className="p-5 sm:p-6">

              <p className="text-gray-700 mb-4">
                Fitur ini akan menghapus seluruh data
                pendaftaran Gudep.
              </p>

              <div
                className="
                  bg-red-50
                  border
                  border-red-200
                  rounded-lg
                  p-4
                  mb-5
                "
              >

                <p className="font-bold text-red-700 mb-2">
                  Data yang akan dihapus:
                </p>

                <p>❌ Profil Gudep</p>
                <p>❌ Operator Gudep</p>
                <p>❌ Data Pembina</p>
                <p>❌ Data Regu</p>
                <p>❌ Peserta</p>
                <p>❌ Berkas</p>
                <p>❌ Pembayaran</p>
                <p>❌ Pendaftaran</p>
                <p>❌ Penempatan Blok</p>

              </div>

              <div
                className="
                  bg-green-50
                  border
                  border-green-200
                  rounded-lg
                  p-4
                  mb-5
                "
              >

                <p className="font-bold text-green-700">
                  Tetap aman:
                </p>

                <p>✅ Kapling</p>
                <p>✅ Peta Perkemahan</p>
                <p>✅ Users</p>

              </div>

              <label className="block font-semibold mb-2">

                Ketik:

                <span className="text-red-600 ml-1">
                  RESET SI BELA
                </span>

              </label>

              <input
                type="text"
                value={resetText}
                onChange={(e) =>
                  setResetText(e.target.value)
                }
                placeholder="RESET SI BELA"
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                "
              />

            </div>

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                p-5
                sm:p-6
                pt-0
              "
            >

              <button
                onClick={() => {
                  setShowReset(false);
                  setResetText("");
                }}
                className="
                  flex-1
                  bg-gray-500
                  hover:bg-gray-600
                  text-white
                  py-3
                  rounded-lg
                  font-semibold
                "
              >
                Batal
              </button>

              <button
                onClick={handleReset}
                disabled={
                  resetText !== "RESET SI BELA" ||
                  resetLoading
                }
                className="
                  flex-1
                  bg-red-600
                  hover:bg-red-700
                  disabled:bg-gray-400
                  text-white
                  py-3
                  rounded-lg
                  font-semibold
                "
              >
                {resetLoading
                  ? "Memproses..."
                  : "🔄 Reset Sekarang"}
              </button>

            </div>

          </div>

        </div>
      )}


      {/* ==================================================
          MODAL LOGOUT
      ================================================== */}

      {showLogout && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            backdrop-blur-sm
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-md
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >

            {/* HEADER */}

            <div className="bg-red-600 text-white text-center py-5 sm:py-6">

              <div className="text-5xl sm:text-6xl mb-2">
                🚪
              </div>

              <h2 className="text-xl sm:text-2xl font-bold">
                Logout Admin
              </h2>

            </div>

            {/* CONTENT */}

            <div className="p-6 sm:p-8 text-center">

              <p className="text-gray-700 text-base sm:text-lg">
                Apakah Anda yakin ingin keluar dari
              </p>

              <h3 className="font-bold text-lg sm:text-xl text-amber-700 mt-2">
                SI BELA ADMIN?
              </h3>

              <p className="text-gray-500 mt-3 text-sm sm:text-base">
                Anda harus login kembali untuk mengakses
                menu administrator.
              </p>

            </div>

            {/* BUTTON */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                sm:gap-4
                px-5
                sm:px-6
                pb-5
                sm:pb-6
              "
            >

              <button
                onClick={() => setShowLogout(false)}
                className="
                  flex-1
                  py-3
                  rounded-xl
                  border
                  border-gray-300
                  hover:bg-gray-100
                  font-semibold
                "
              >
                Batal
              </button>

              <button
                onClick={handleLogout}
                className="
                  flex-1
                  py-3
                  rounded-xl
                  bg-red-600
                  hover:bg-red-700
                  text-white
                  font-semibold
                  shadow-lg
                "
              >
                Ya, Logout
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}