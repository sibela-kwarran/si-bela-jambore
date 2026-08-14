import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabase";
import {
  getSemuaPendaftaran,
} from "../../services/pendaftaranService";

export default function VerifikasiGudep() {

  const navigate = useNavigate();

  const [dataPendaftaran, setDataPendaftaran] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

const [savingJenjang, setSavingJenjang] = useState({});
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
async function handleJenjangChange(item, value) {

  if (!value) return;

  const gudepId =
    item.profil_gudep?.id ||
    item.gudep_id;

  if (!gudepId) {
    alert("ID Gudep tidak ditemukan.");
    return;
  }

  try {

    setSavingJenjang((prev) => ({
      ...prev,
      [item.id]: true,
    }));

    const { error } = await supabase
      .from("profil_gudep")
      .update({
        jenjang: value,
      })
      .eq("id", gudepId);

    if (error) {
      throw error;
    }

    // Update tampilan langsung
    setDataPendaftaran((prev) =>
      prev.map((x) => {

        if (x.id !== item.id) {
          return x;
        }

        return {
          ...x,

          profil_gudep: {
            ...(x.profil_gudep || {}),
            jenjang: value,
          },

        };

      })
    );

  } catch (err) {

    console.error(
      "GAGAL MENYIMPAN JENJANG:",
      err
    );

    alert(
      err?.message ||
      "Gagal menyimpan jenjang."
    );

  } finally {

    setSavingJenjang((prev) => ({
      ...prev,
      [item.id]: false,
    }));

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
        <span
          className="
            inline-flex
            items-center
            px-2
            py-1
            sm:px-3
            rounded-full
            bg-green-100
            text-green-700
            font-semibold
            text-[10px]
            sm:text-sm
            whitespace-nowrap
          "
        >
          ✅ Terverifikasi
        </span>
      );

    }


    if (
      status ===
      "Perlu Perbaikan"
    ) {

      return (
        <span
          className="
            inline-flex
            items-center
            px-2
            py-1
            sm:px-3
            rounded-full
            bg-yellow-100
            text-yellow-700
            font-semibold
            text-[10px]
            sm:text-sm
            whitespace-nowrap
          "
        >
          🔄 Perlu Perbaikan
        </span>
      );

    }


    if (
      status ===
      "Ditolak"
    ) {

      return (
        <span
          className="
            inline-flex
            items-center
            px-2
            py-1
            sm:px-3
            rounded-full
            bg-red-100
            text-red-700
            font-semibold
            text-[10px]
            sm:text-sm
            whitespace-nowrap
          "
        >
          ❌ Ditolak
        </span>
      );

    }


    return (
      <span
        className="
          inline-flex
          items-center
          px-2
          py-1
          sm:px-3
          rounded-full
          bg-blue-100
          text-blue-700
          font-semibold
          text-[10px]
          sm:text-sm
          whitespace-nowrap
        "
      >
        ⏳ Menunggu Verifikasi
      </span>
    );

  }


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="space-y-4 sm:space-y-6">

        <h1
          className="
            text-xl
            sm:text-3xl
            font-bold
            text-amber-700
          "
        >
          Verifikasi Gudep
        </h1>

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-5
            sm:p-8
            text-center
            text-gray-500
            text-sm
            sm:text-base
          "
        >
          Memuat data pendaftaran...
        </div>

      </div>

    );

  }


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div
      className="
        space-y-4
        sm:space-y-6
      "
    >


      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div
        className="
          flex
          justify-between
          items-center
          gap-3
        "
      >

        <div className="min-w-0">

          <h1
            className="
              text-xl
              sm:text-3xl
              font-bold
              text-amber-700
            "
          >
            Verifikasi Gudep
          </h1>

          <p
            className="
              text-gray-500
              mt-1
              text-xs
              sm:text-base
            "
          >
            Pemeriksaan dan verifikasi pendaftaran Gugus Depan.
          </p>

        </div>


        <button
          onClick={loadData}
          disabled={loading}
          className="
            shrink-0
            bg-gray-600
            hover:bg-gray-700
            disabled:bg-gray-400
            text-white
            px-3
            py-2
            sm:px-5
            sm:py-2
            rounded-lg
            font-semibold
            text-xs
            sm:text-base
          "
        >
          🔄 Refresh
        </button>

      </div>


      {/* ===================================== */}
      {/* ERROR */}
      {/* ===================================== */}

      {error && (

        <div
          className="
            bg-red-50
            border
            border-red-200
            text-red-700
            rounded-lg
            p-3
            sm:p-4
            text-xs
            sm:text-base
          "
        >
          ❌ {error}
        </div>

      )}


      {/* ===================================== */}
      {/* TABEL */}
      {/* ===================================== */}

      <div
        className="
          bg-white
          rounded-xl
          shadow
          overflow-hidden
        "
      >

        <div
          className="
            overflow-x-auto
            w-full
          "
        >

          <table
            className="
              w-full
              min-w-[760px]
              border-collapse
              text-xs
              sm:text-sm
            "
          >


            {/* ================================ */}
            {/* HEADER */}
            {/* ================================ */}

            <thead className="bg-amber-700 text-white">

              <tr>

                <th
                  className="
                    p-2
                    sm:p-3
                    text-center
                    w-12
                    sm:w-16
                  "
                >
                  No
                </th>

                <th
                  className="
                    p-2
                    sm:p-3
                    text-left
                  "
                >
                  Gudep
                </th>
<th
  className="
    p-2
    sm:p-3
    text-center
  "
>
  Jenjang
</th>
                <th
                  className="
                    p-2
                    sm:p-3
                    text-center
                  "
                >
                  Pembina
                </th>

                <th
                  className="
                    p-2
                    sm:p-3
                    text-center
                  "
                >
                  Regu
                </th>

                <th
                  className="
                    p-2
                    sm:p-3
                    text-center
                  "
                >
                  Peserta
                </th>

                <th
                  className="
                    p-2
                    sm:p-3
                    text-center
                  "
                >
                  Status
                </th>

                <th
                  className="
                    p-2
                    sm:p-3
                    text-center
                  "
                >
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
                    className="
                      text-center
                      p-6
                      sm:p-8
                      text-gray-500
                    "
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
                      className="
                        border-b
                        hover:bg-gray-50
                      "
                    >


                      {/* NO */}

                      <td
                        className="
                          p-2
                          sm:p-3
                          text-center
                        "
                      >
                        {index + 1}
                      </td>


                      {/* GUDEP */}

                      <td
                        className="
                          p-2
                          sm:p-3
                        "
                      >








                        <div
                          className="
                            font-semibold
                            text-gray-800
                          "
                        >
                          {
                            item.profil_gudep
                              ?.nama_pangkalan ||
                            item.nama_gudep ||
                            "-"
                          }
                        </div>


                        {item.profil_gudep
                          ?.nama_mabigus && (

                          <div
                            className="
                              text-[10px]
                              sm:text-sm
                              text-gray-500
                              mt-0.5
                            "
                          >
                            Mabigus:{" "}
                            {
                              item.profil_gudep
                                .nama_mabigus
                            }
                          </div>

                        )}

                      </td>
{/* JENJANG */}

<td
  className="
    p-2
    sm:p-3
    text-center
  "
>

  <select
    value={
      item.profil_gudep?.jenjang ||
      ""
    }
    onChange={(e) =>
      handleJenjangChange(
        item,
        e.target.value
      )
    }
    disabled={
      savingJenjang[item.id]
    }
    className="
      border
      border-gray-300
      rounded-lg
      px-2
      py-1.5
      text-xs
      sm:text-sm
      font-semibold
      bg-white
      focus:outline-none
      focus:ring-2
      focus:ring-amber-300
    "
  >

    <option value="">
      Pilih Jenjang
    </option>

    <option value="SD">
      SD / SDIT / MI
    </option>

    <option value="SMP">
      SMP / SMPIT / MTs
    </option>

  </select>

  {savingJenjang[item.id] && (
    <div className="text-[10px] text-gray-400 mt-1">
      Menyimpan...
    </div>
  )}

</td>


                      {/* PEMBINA */}

                      <td
                        className="
                          p-2
                          sm:p-3
                          text-center
                        "
                      >

                        <span className="font-semibold">
                          {
                            item.jumlah_pembina ??
                            0
                          }
                        </span>

                      </td>


                      {/* REGU */}

                      <td
                        className="
                          p-2
                          sm:p-3
                          text-center
                        "
                      >

                        <span className="font-semibold">
                          {
                            item.jumlah_regu ??
                            0
                          }
                        </span>

                      </td>


                      {/* PESERTA */}

                      <td
                        className="
                          p-2
                          sm:p-3
                          text-center
                        "
                      >

                        {Number(
                          item.jumlah_peserta ||
                          0
                        ) === 0 ? (

                          <span
                            className="
                              text-red-600
                              font-semibold
                            "
                          >
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

                      <td
                        className="
                          p-2
                          sm:p-3
                          text-center
                        "
                      >

                        {
                          getStatusBadge(
                            item.status
                          )
                        }

                      </td>


                      {/* AKSI */}

                      <td
                        className="
                          p-2
                          sm:p-3
                          text-center
                        "
                      >

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
                          className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-3
                            py-1.5
                            sm:px-4
                            sm:py-2
                            rounded-lg
                            font-semibold
                            text-xs
                            sm:text-sm
                            whitespace-nowrap
                          "
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

        <div
          className="
            bg-blue-50
            border
            border-blue-200
            rounded-xl
            p-3
            sm:p-4
            text-xs
            sm:text-sm
            text-blue-800
          "
        >

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