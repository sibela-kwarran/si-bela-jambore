import { Outlet, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import supabase from "../lib/supabase";


export default function AdminLayout() {
const navigate = useNavigate();
const [showLogout, setShowLogout] = useState(false);
const [showReset, setShowReset] = useState(false);
const [resetText, setResetText] = useState("");
const [resetLoading, setResetLoading] = useState(false);


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
      console.error(
        "RESET ERROR:",
        error
      );

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
      replace: true
    });

    // Refresh agar statistik dashboard ikut diperbarui
    window.location.reload();

  } catch (err) {

    console.error(
      "GAGAL RESET DATA:",
      err
    );

    alert(
      "❌ Gagal melakukan reset data.\n\n" +
      err.message
    );

  } finally {

    setResetLoading(false);

  }

};
  

return (

<div className="flex min-h-screen bg-slate-100">


{/* SIDEBAR */}

<aside className="w-72 bg-amber-700 text-white flex flex-col shadow-xl">


{/* BRAND */}

<div className="p-6 border-b border-amber-500 text-center">


<img
  src="/logo/sibela.png"
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


<p className="
text-sm
text-amber-100
mt-1
">

Jambore Ranting 2026

</p>


<p className="
text-xs
text-amber-200
">

Kwarran Cikarang Utara

</p>


</div>



{/* MENU */}

<nav className="flex flex-col p-4 gap-2 flex-1">


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

<div className="
p-4
text-center
text-xs
border-t
border-amber-500
text-amber-100
">

© SI BELA 2026

</div>



</aside>




{/* CONTENT */}

<main className="flex-1 p-6">

<Outlet />

</main>

{showReset && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">

    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">

      <div className="bg-red-700 text-white p-6 rounded-t-2xl text-center">

        <div className="text-5xl mb-2">
          ⚠️
        </div>

        <h2 className="text-2xl font-bold">
          Reset Data Pendaftaran
        </h2>

      </div>

      <div className="p-6">

        <p className="text-gray-700 mb-4">
          Fitur ini akan menghapus seluruh data
          pendaftaran Gudep.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-5">

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

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-5">

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
          className="w-full border rounded-lg px-4 py-3"
        />

      </div>

      <div className="flex gap-3 p-6 pt-0">

        <button
          onClick={() => {
            setShowReset(false);
            setResetText("");
          }}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold"
        >
          Batal
        </button>

        <button
          onClick={handleReset}
          disabled={resetText !== "RESET SI BELA"}
          className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold"
        >
          🔄 Reset Sekarang
        </button>

      </div>

    </div>

  </div>
)}





{showLogout && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

      {/* HEADER */}
      <div className="bg-red-600 text-white text-center py-6">

        <div className="text-6xl mb-2">
          🚪
        </div>

        <h2 className="text-2xl font-bold">
          Logout Admin
        </h2>

      </div>

      {/* CONTENT */}
      <div className="p-8 text-center">

        <p className="text-gray-700 text-lg">
          Apakah Anda yakin ingin keluar dari
        </p>

        <h3 className="font-bold text-xl text-amber-700 mt-2">
          SI BELA ADMIN?
        </h3>

        <p className="text-gray-500 mt-3">
          Anda harus login kembali untuk mengakses
          menu administrator.
        </p>

      </div>

      {/* BUTTON */}
      <div className="flex gap-4 px-6 pb-6">

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