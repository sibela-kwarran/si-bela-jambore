import { useEffect, useState } from "react";
import supabase from "../../lib/supabase";
import { FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function NotifikasiPendaftaran() {

  const [gudep, setGudep] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

  const { data, error } = await supabase
    .from("pendaftaran")
    .select(`
      id,
      status,
      created_at,
      profil_gudep (
        nama_pangkalan,
        nama_mabigus
      )
    `)
    .eq("status", "Menunggu Verifikasi")
    .order("created_at", { ascending: false });

  console.log("NOTIF DATA :", data);

  if (error) {
    console.log(error);
    return;
  }

  console.log("DATA NOTIF :", data);

  setGudep(data || []);

}

  if (gudep.length === 0) {

    return (

      <div className="bg-green-100 border border-green-300 rounded-xl p-5 mb-6">

        <div className="flex items-center gap-3">

          <FaBell className="text-green-700"/>

          <div>

            <h2 className="font-bold text-green-700">

              Tidak ada pendaftaran baru

            </h2>

            <p>

              Semua Gudep sudah diverifikasi.

            </p>

          </div>

        </div>

      </div>

    );

  }

  return (

    <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-5 mb-6">

      <div className="flex justify-between items-center mb-5">

  <div className="flex items-center gap-3">

    <FaBell
      className="text-yellow-600 animate-pulse"
      size={30}
    />

    <div>

      <h2 className="text-xl font-bold text-gray-800">

        Pendaftaran Baru

      </h2>

      <p className="text-sm text-gray-500">

        Ada Gugus Depan yang menunggu verifikasi

      </p>

    </div>

  </div>

  <div
    className="
      bg-red-500
      text-white
      w-10
      h-10
      rounded-full
      flex
      items-center
      justify-center
      font-bold
      shadow
    "
  >
    {gudep.length}
  </div>

</div>

      <div className="mt-4 space-y-3">

  {gudep.map((item) => (

    <div
      key={item.id}
      className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500"
    >

      <div className="flex justify-between items-center">

        <div>

          <h3 className="font-bold text-lg">
            🏫 {item.profil_gudep?.nama_pangkalan}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Kepala Gudep :
            <span className="font-semibold">
              {" "}
              {item.profil_gudep?.nama_mabigus}
            </span>
          </p>

          <p className="text-xs text-gray-400 mt-2">
            📅 {new Date(item.created_at).toLocaleString("id-ID")}
          </p>

        </div>

        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
          {item.status}
        </span>

      </div>

    </div>

  ))}

</div>

<div className="mt-5 flex justify-end">

  <Link
    to="/admin/verifikasi-gudep"
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg shadow transition"
  >
    ✅ Verifikasi Sekarang
  </Link>

</div>

</div>

  );

}