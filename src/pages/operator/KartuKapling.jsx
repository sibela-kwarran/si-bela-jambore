import { useNavigate } from "react-router-dom";
export default function KartuKapling() {

const navigate = useNavigate();

  const profil =
    JSON.parse(localStorage.getItem("profilGudep")) || {};

  const dataPendaftaran =
    JSON.parse(localStorage.getItem("dataPendaftaran")) || [];

  const data = dataPendaftaran.find(
    (item) => item.namaGudep === profil.pangkalan
  );

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-8">

          <h2 className="text-sm tracking-[5px] uppercase text-gray-500">
            Jambore Ranting
          </h2>

          <h1 className="text-4xl font-extrabold text-green-700 mt-2">
            KARTU KAPLING
          </h1>

          <p className="text-gray-500 mt-2">
            Kwarran Cikarang Utara
          </p>

        </div>

        {/* ================= CEK KAPLING ================= */}

        {!data?.blokPutra ? (

          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-8 text-center">

            <h2 className="text-2xl font-bold text-yellow-700">
              Kapling Belum Dibuat
            </h2>

            <p className="mt-3 text-gray-700">
              Silakan menunggu panitia melakukan Generate Kapling.
            </p>

          </div>

        ) : (

          <>
        
          {/* ================= KARTU ================= */}

<div
  id="print-area"
  className="bg-white border-4 border-green-700 rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto"
>

  {/* HEADER KARTU */}

  <div className="bg-green-700 text-white text-center py-5">

    <h1 className="text-3xl font-extrabold">
      JAMBORE RANTING
    </h1>

    <h2 className="text-xl mt-1">
      KWARRAN CIKARANG UTARA
    </h2>

    <p className="mt-1 text-sm tracking-wider">
      KARTU KAPLING PERKEMAHAN
    </p>

  </div>

  {/* NAMA GUDEP */}

  <div className="bg-green-50 py-3 border-b">

    <h2 className="text-center text-2xl font-bold text-green-700">

      {data.namaGudep}

    </h2>

  </div>

  {/* ISI */}

  <div className="grid grid-cols-2 gap-4 p-5">
    {/* ================= BLOK PUTRA ================= */}

<div className="bg-green-50 border-2 border-green-600 rounded-xl p-4">

  <h3 className="text-center text-2xl font-bold text-green-700 mb-6">
    🏕 BLOK PUTRA
  </h3>

  <div className="space-y-4">

    <div>

      <p className="text-gray-500 text-sm">
        Kecamatan
      </p>

      <p className="font-bold text-lg">
        {data.blokPutra.kecamatan}
      </p>

    </div>

    <div>

      <p className="text-gray-500 text-sm">
        Kelurahan
      </p>

      <p className="font-bold text-lg">
        {data.blokPutra.kelurahan}
      </p>

    </div>

  </div>

  <div className="mt-4 text-center">

    <p className="text-gray-500">
      NOMOR KAPLING
    </p>

    <div className="text-5xl font-extrabold text-green-700 mt-1">
      {data.blokPutra.kapling}
    </div>

  </div>

</div>

{/* ================= BLOK PUTRI ================= */}

<div className="bg-pink-50 border-2 border-pink-500 rounded-xl p-4">

  <h3 className="text-center text-2xl font-bold text-pink-600 mb-6">
    🌸 BLOK PUTRI
  </h3>

  <div className="space-y-4">

    <div>

      <p className="text-gray-500 text-sm">
        Kecamatan
      </p>

      <p className="font-bold text-lg">
        {data.blokPutri.kecamatan}
      </p>

    </div>

    <div>

      <p className="text-gray-500 text-sm">
        Kelurahan
      </p>

      <p className="font-bold text-lg">
        {data.blokPutri.kelurahan}
      </p>

    </div>

  </div>

  <div className="mt-8 text-center">

    <p className="text-gray-500">
      NOMOR KAPLING
    </p>

    <div className="text-5xl font-extrabold text-pink-600 mt-1">
      {data.blokPutri.kapling}
    </div>

  </div>

</div>
    </div>

  {/* ================= FOOTER ================= */}

  <div className="bg-gray-100 border-t px-5 py-3">

    <div className="text-center">

      <p className="text-gray-600">

        Pembina wajib membawa kartu ini sebagai bukti resmi
        penempatan kapling saat registrasi ulang dan pendirian tenda.

      </p>

      <div className="mt-5">

        <span className="inline-block bg-green-700 text-white px-6 py-2 rounded-full font-bold">

          JAMBORE RANTING KWARRAN CIKARANG UTARA

        </span>

      </div>

    </div>

  </div>

</div>

          </>

        )}

      </div>
{/* TOMBOL */}

<div className="flex justify-between mt-8 no-print">

  <button
    onClick={() => navigate("/operator/status")}
    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl shadow font-bold"
  >
    ⬅ Kembali
  </button>

  <button
    onClick={() => window.print()}
    className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl shadow font-bold"
  >
    🖨 Print Out Kartu
  </button>

</div>
    </div>

  );

}