import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-100">

      <aside className="w-72 bg-amber-700 text-white">

        <div className="p-6 text-2xl font-bold border-b">
          SI BELA Admin
        </div>

        <nav className="flex flex-col p-4 gap-2">

  <Link
    to="/admin/dashboard"
    className="hover:bg-amber-600 rounded-lg px-4 py-3"
  >
    🏠 Dashboard
  </Link>

  <Link
    to="/admin/verifikasi-gudep"
    className="hover:bg-amber-600 rounded-lg px-4 py-3"
  >
    🏕 Verifikasi Gudep
  </Link>

  <Link
    to="/admin/verifikasi-berkas"
    className="hover:bg-amber-600 rounded-lg px-4 py-3"
  >
    📄 Verifikasi Berkas
  </Link>

  <Link
    to="/admin/verifikasi-pembayaran"
    className="hover:bg-amber-600 rounded-lg px-4 py-3"
  >
    💳 Verifikasi Pembayaran
  </Link>

  <Link
    to="/admin/penempatan"
    className="hover:bg-amber-600 rounded-lg px-4 py-3"
  >
    ⛺ Penempatan Blok
  </Link>

  <Link
  to="/admin/peta"
  className="hover:bg-amber-600 rounded-lg px-4 py-3"
>
  🗺️ Peta Perkemahan
</Link>

  

</nav>

      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  );
}