import { useNavigate } from "react-router-dom";

export default function StatusVerifikasi() {
  const navigate = useNavigate();

  const profil =
    JSON.parse(localStorage.getItem("profilGudep")) || {};

  const dataPendaftaran =
    JSON.parse(localStorage.getItem("dataPendaftaran")) || [];

  const data = dataPendaftaran.find(
    (item) => item.namaGudep === profil.pangkalan
  );

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-10">

        <h1 className="text-3xl font-bold text-green-700 mb-6">
          Status Verifikasi
        </h1>

        <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-6 text-center">

          <h2 className="text-xl font-bold text-yellow-700">
            Belum Ada Data Pendaftaran
          </h2>

          <p className="mt-3 text-gray-700">
            Silakan lakukan pengiriman data pendaftaran terlebih dahulu.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">

  <h1 className="text-3xl font-bold text-green-700 mb-6">
    Status Verifikasi
  </h1>

  <div className="bg-white rounded-2xl shadow-xl border border-green-700 overflow-hidden">

    {/* HEADER */}

    <div className="bg-green-700 text-white px-10 py-6">

      <h2 className="text-3xl font-extrabold">
        STATUS VERIFIKASI PENDAFTARAN
      </h2>

      <p className="mt-2 text-green-100">
        Jambore Ranting Kwarran Cikarang Utara
      </p>

    </div>

    {/* CONTENT */}

    <div className="p-10">

      <div className="grid grid-cols-2 gap-10">

        {/* KOLOM KIRI */}

        <div className="space-y-6">

          <div>

            <p className="text-gray-500 text-sm">
              Nama Gudep
            </p>

            <h2 className="text-3xl font-bold text-green-700">
              {data.namaGudep}
            </h2>

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Tanggal Verifikasi
            </p>

            <p className="text-xl font-semibold">
              {data.tanggalVerifikasi || "-"}
            </p>

          </div>

          <div>

            <p className="text-gray-500 text-sm">
              Status
            </p>

            <span className="inline-block bg-green-100 text-green-700 font-bold px-6 py-2 rounded-full">

              {data.status}

            </span>

          </div>

        </div>

        {/* KOLOM KANAN */}

        <div className="space-y-6">

          <div>

            <p className="text-gray-500 text-sm">
              Catatan Panitia
            </p>

            <div className="mt-2 bg-gray-100 rounded-xl p-5 min-h-[130px]">

              {data.catatanAdmin || "Belum ada catatan."}

            </div>

          </div>
                    {/* TOMBOL */}

          {data.status === "Terverifikasi" && (

            <div className="flex items-end justify-end">

              <button
                onClick={() => navigate("/operator/kapling")}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl shadow-lg font-bold text-lg transition duration-300"
              >
                🪪 Lihat & Cetak Kartu Kapling
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  </div>

</div>

  );

}
    