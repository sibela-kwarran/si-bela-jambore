import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPendaftaranByGudep } from "../../services/pendaftaranService";
import { getProfilGudep } from "../../services/profilGudepService";

export default function StatusVerifikasi() {

  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      setLoading(true);

      const profilData = await getProfilGudep();

      setProfil(profilData);

      if (!profilData?.id) {
        setData(null);
        return;
      }

      const hasil = await getPendaftaranByGudep(
        profilData.id
      );

      setData(hasil);

    } catch (error) {

      console.error(
        "GAGAL LOAD STATUS VERIFIKASI:",
        error
      );

      setData(null);

    } finally {

      setLoading(false);

    }

  }


  // ==========================
  // LOADING
  // ==========================

  if (loading) {

    return (
      <div className="p-6 md:p-10 text-center">

        <p className="text-gray-500">
          Memuat data verifikasi...
        </p>

      </div>
    );

  }


  // ==========================
  // BELUM ADA DATA
  // ==========================

  if (!data) {

    return (

      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 md:p-10">

          <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-5 md:mb-6">
            Status Verifikasi
          </h1>

          <div className="bg-yellow-100 border border-yellow-300 rounded-xl p-5 md:p-6 text-center">

            <h2 className="text-lg md:text-xl font-bold text-yellow-700">
              Belum Ada Data Pendaftaran
            </h2>

            <p className="mt-3 text-sm md:text-base text-gray-700">
              Silakan lakukan pengiriman data pendaftaran terlebih dahulu.
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ==========================
  // DATA STATUS
  // ==========================

  return (

    <div className="max-w-7xl mx-auto">

      <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-5 md:mb-6">
        Status Verifikasi
      </h1>


      <div className="bg-white rounded-2xl shadow-xl border border-green-700 overflow-hidden">


        {/* ==========================
            HEADER
        ========================== */}

        <div className="bg-green-700 text-white px-5 py-5 md:px-10 md:py-6">

          <h2 className="text-xl md:text-3xl font-extrabold">
            STATUS VERIFIKASI PENDAFTARAN
          </h2>

          <p className="mt-2 text-sm md:text-base text-green-100">
            Jambore Ranting Kwarran Cikarang Utara
          </p>

        </div>


        {/* ==========================
            CONTENT
        ========================== */}

        <div className="p-5 md:p-10">


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">


            {/* ==========================
                KOLOM KIRI
            ========================== */}

            <div className="space-y-5 md:space-y-6">


              <div>

                <p className="text-gray-500 text-sm">
                  Nama Gudep
                </p>

                <h2 className="text-xl md:text-3xl font-bold text-green-700 break-words">
                  {data.nama_gudep}
                </h2>

              </div>


              <div>

                <p className="text-gray-500 text-sm">
                  Tanggal Verifikasi
                </p>

                <p className="text-base md:text-xl font-semibold">

                  {data.tanggal_verifikasi
                    ? new Date(
                        data.tanggal_verifikasi
                      ).toLocaleDateString("id-ID")
                    : "-"
                  }

                </p>

              </div>


              <div>

                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <span className="inline-block bg-green-100 text-green-700 font-bold px-4 md:px-6 py-2 rounded-full text-sm md:text-base">

                  {data.status}

                </span>

              </div>


            </div>


            {/* ==========================
                KOLOM KANAN
            ========================== */}

            <div className="space-y-5 md:space-y-6">


              <div>

                <p className="text-gray-500 text-sm">
                  Catatan Panitia
                </p>

                <div className="mt-2 bg-gray-100 rounded-xl p-4 md:p-5 min-h-[100px] md:min-h-[130px] text-sm md:text-base break-words">

                  {data.catatan_admin || "Belum ada catatan."}

                </div>

              </div>


              {/* ==========================
                  TOMBOL KARTU KAPLING
              ========================== */}

              {data.status === "Terverifikasi" && (

                <div className="flex justify-center md:justify-end">

                  <button
                    onClick={() => {

                      console.log(
                        "DATA STATUS :",
                        data
                      );

                      console.log(
                        "MENUJU KAPLING ID :",
                        data?.gudep_id
                      );

                      navigate(
                        `/operator/kapling/${data?.gudep_id}`
                      );

                    }}
                    className="
                      w-full
                      md:w-auto
                      bg-green-700
                      hover:bg-green-800
                      text-white
                      px-5
                      md:px-8
                      py-3
                      md:py-4
                      rounded-xl
                      shadow-lg
                      font-bold
                      text-sm
                      md:text-lg
                      transition
                      duration-300
                    "
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