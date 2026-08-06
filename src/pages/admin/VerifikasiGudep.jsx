import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSemuaPendaftaran,
} from "../../services/pendaftaranService";

export default function VerifikasiGudep() {

  const navigate = useNavigate();

  const [dataPendaftaran, setDataPendaftaran] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      setLoading(true);

      setError("");


      const data =
        await getSemuaPendaftaran();


      console.log(
        "DATA VERIFIKASI GUDEP:",
        data
      );


      setDataPendaftaran(
        data || []
      );


    } catch (err) {

      console.error(
        "GAGAL MEMUAT DATA VERIFIKASI:",
        err
      );


      setError(
        err?.message ||
        "Gagal mengambil data pendaftaran."
      );


    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // BADGE STATUS
  // ==========================================

  function getStatusBadge(status) {

    if (
      status ===
      "Terverifikasi"
    ) {

      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm">

          ✅ Terverifikasi

        </span>
      );

    }


    if (
      status ===
      "Perlu Perbaikan"
    ) {

      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">

          🔄 Perlu Perbaikan

        </span>
      );

    }


    if (
      status ===
      "Ditolak"
    ) {

      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 font-semibold text-sm">

          ❌ Ditolak

        </span>
      );

    }


    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">

        ⏳ Menunggu Verifikasi

      </span>
    );

  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="space-y-6">

        <h1 className="text-3xl font-bold text-amber-700">

          Verifikasi Gudep

        </h1>


        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">

          Memuat data pendaftaran...

        </div>

      </div>

    );

  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="space-y-6">


      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-amber-700">

            Verifikasi Gudep

          </h1>

          <p className="text-gray-500 mt-1">

            Pemeriksaan dan verifikasi pendaftaran Gugus Depan.

          </p>

        </div>


        <button

          onClick={loadData}

          disabled={loading}

          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-5 py-2 rounded-lg font-semibold"

        >

          🔄 Refresh

        </button>

      </div>



      {/* ===================================== */}
      {/* ERROR */}
      {/* ===================================== */}

      {error && (

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">

          ❌ {error}

        </div>

      )}



      {/* ===================================== */}
      {/* TABEL */}
      {/* ===================================== */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">


            {/* ================================ */}
            {/* HEADER */}
            {/* ================================ */}

            <thead className="bg-amber-700 text-white">

              <tr>

                <th className="p-3 text-center w-16">

                  No

                </th>

                <th className="p-3 text-left">

                  Gudep

                </th>

                <th className="p-3 text-center">

                  Pembina

                </th>

                <th className="p-3 text-center">

                  Regu

                </th>

                <th className="p-3 text-center">

                  Peserta

                </th>

                <th className="p-3 text-center">

                  Status

                </th>

                <th className="p-3 text-center">

                  Aksi

                </th>

              </tr>

            </thead>


            {/* ================================ */}
            {/* BODY */}
            {/* ================================ */}

            <tbody>

              {dataPendaftaran.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="text-center p-8 text-gray-500"
                  >

                    📋 Belum ada data pendaftaran.

                  </td>

                </tr>

              ) : (

                dataPendaftaran.map(
                  (item, index) => (

                    <tr

                      key={
                        item.id ||
                        index
                      }

                      className="border-b hover:bg-gray-50"

                    >


                      {/* NO */}

                      <td className="p-3 text-center">

                        {index + 1}

                      </td>


                      {/* GUDEP */}

                      <td className="p-3">

                        <div className="font-semibold text-gray-800">

                          {
                            item.profil_gudep
                              ?.nama_pangkalan ||
                            item.nama_gudep ||
                            "-"
                          }

                        </div>


                        {item.profil_gudep
                          ?.nama_mabigus && (

                          <div className="text-sm text-gray-500">

                            Mabigus:{" "}

                            {
                              item.profil_gudep
                                .nama_mabigus
                            }

                          </div>

                        )}

                      </td>


                      {/* PEMBINA */}

                      <td className="p-3 text-center">

                        <span className="font-semibold">

                          {
                            item.jumlah_pembina ??
                            0
                          }

                        </span>

                      </td>


                      {/* REGU */}

                      <td className="p-3 text-center">

                        <span className="font-semibold">

                          {
                            item.jumlah_regu ??
                            0
                          }

                        </span>

                      </td>


                      {/* PESERTA */}

                      <td className="p-3 text-center">

                        {Number(
                          item.jumlah_peserta ||
                          0
                        ) === 0 ? (

                          <span className="text-red-600 font-semibold">

                            0 ⚠️

                          </span>

                        ) : (

                          <span className="font-semibold">

                            {
                              item.jumlah_peserta
                            }

                          </span>

                        )}

                      </td>


                      {/* STATUS */}

                      <td className="p-3 text-center">

                        {
                          getStatusBadge(
                            item.status
                          )
                        }

                      </td>


                      {/* AKSI */}

                      <td className="p-3 text-center">

                        <button

                          onClick={() => {

                            console.log(
                              "DATA ITEM DI KLIK:",
                              item
                            );


                            console.log(
                              "ID PENDAFTARAN:",
                              item.id
                            );


                            console.log(
                              "ID GUDEP:",
                              item.gudep_id
                            );


                            navigate(
                              `/admin/detail-gudep/${item.id}`
                            );

                          }}

                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"

                        >

                          👁 Lihat

                        </button>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>



      {/* ===================================== */}
      {/* INFORMASI */}
      {/* ===================================== */}

      {dataPendaftaran.length > 0 && (

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">

          <span className="font-semibold">

            ℹ️ Informasi:

          </span>{" "}

          Klik tombol <b>👁 Lihat</b> untuk memeriksa
          detail profil, pembina, regu, peserta,
          dan melakukan verifikasi pendaftaran.

        </div>

      )}

    </div>

  );

}