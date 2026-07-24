import { useMemo } from "react";

export default function DashboardAdmin() {
const data =
  JSON.parse(localStorage.getItem("dataPendaftaran")) || [];

const statistik = useMemo(() => {

  const totalGudep = data.length;

  const dataPeserta =
  JSON.parse(localStorage.getItem("dataPeserta")) || [];

const totalPeserta = dataPeserta.length;
  const sudahVerifikasi = data.filter(
    item => item.status === "Terverifikasi"
  ).length;

  const belumVerifikasi =
    totalGudep - sudahVerifikasi;

  return {
    totalGudep,
    totalPeserta,
    sudahVerifikasi,
    belumVerifikasi,
  };

}, [data]);
  return (

    <div className="space-y-8">

  {/* HEADER */}

  <div>

    <h1 className="text-4xl font-bold text-amber-700">
      Dashboard Admin
    </h1>

    <p className="text-gray-600 mt-2">
      Selamat datang di Panel Admin SI BELA
    </p>

  </div>

  {/* KARTU STATISTIK */}

  <div className="grid grid-cols-4 gap-6">

    <div className="bg-blue-500 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        🏕 Gudep
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {statistik.totalGudep}
      </h2>

      <p className="mt-2 opacity-80">
        Total Gudep
      </p>

    </div>

    <div className="bg-green-600 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        👥 Peserta
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {statistik.totalPeserta}
      </h2>

      <p className="mt-2 opacity-80">
        Total Peserta
      </p>

    </div>

    <div className="bg-purple-600 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        ✅ Verifikasi
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {statistik.sudahVerifikasi}
      </h2>

      <p className="mt-2 opacity-80">
        Sudah Diverifikasi
      </p>

    </div>

    <div className="bg-orange-500 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        ⏳ Menunggu
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {statistik.belumVerifikasi}
      </h2>

      <p className="mt-2 opacity-80">
        Belum Diverifikasi
      </p>

    </div>

  </div>

</div>

  );

}