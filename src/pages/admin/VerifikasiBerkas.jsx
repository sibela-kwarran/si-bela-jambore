import { useState, useEffect } from "react";

import {
  getSemuaBerkasAdmin,
  updateBerkas
} from "../../services/berkasService";

import supabase from "../../lib/supabase";


// ======================================================
// KOMPONEN INFO
// ======================================================

function Info({ title, value }) {

  return (

    <div className="border rounded-lg p-4">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-xl font-bold">
        {value || "-"}
      </h2>

    </div>

  );

}


// ======================================================
// VERIFIKASI BERKAS
// ======================================================

export default function VerifikasiBerkas() {


  const [data, setData] = useState([]);

  const [selected, setSelected] = useState(null);

  const [loading, setLoading] = useState(true);


  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {

    loadBerkas();

  }, []);


  async function loadBerkas() {

    try {

      setLoading(true);


      // ==================================================
      // 1. AMBIL SEMUA GUDEP
      // ==================================================

      const {
        data: gudep,
        error: gudepError
      } = await supabase

        .from("profil_gudep")

        .select(`
          id,
          nama_pangkalan
        `)

        .order("id", {
          ascending: true
        });


      if (gudepError) {

        console.error(
          "ERROR GET GUDEP:",
          gudepError
        );

        return;

      }


      console.log(
        "GUDEP RESMI VERIFIKASI BERKAS:",
        gudep
      );


      // ==================================================
      // 2. AMBIL SEMUA BERKAS
      // ==================================================

      const hasilBerkas =
        await getSemuaBerkasAdmin();


      console.log(
        "BERKAS ADMIN:",
        hasilBerkas
      );


      // ==================================================
      // 3. GABUNGKAN GUDEP + BERKAS
      // ==================================================

      const hasil = (gudep || []).map(
        (itemGudep) => {


          const berkas = (hasilBerkas || []).find(

            item =>

              Number(item.gudep_id) ===
              Number(itemGudep.id)

          );


          // ==============================================
          // BELUM ADA RECORD BERKAS
          // ==============================================

          if (!berkas) {

            return {

              id: null,

              gudep_id:
                itemGudep.id,

              profil_gudep: {

                id:
                  itemGudep.id,

                nama_pangkalan:
                  itemGudep.nama_pangkalan

              },

              surat_tugas: null,

              surat_izin: null,

              status: null,

              statusBerkas:
                "Belum Upload"

            };

          }


          // ==============================================
          // CEK DOKUMEN
          // ==============================================

          const adaSuratTugas =
            Boolean(
              berkas.surat_tugas
            );


          const adaSuratIzin =
            Boolean(
              berkas.surat_izin
            );


          let statusBerkas;


          if (
            adaSuratTugas &&
            adaSuratIzin
          ) {

            statusBerkas =
              "Lengkap";

          }

          else if (
            adaSuratTugas ||
            adaSuratIzin
          ) {

            statusBerkas =
              "Menunggu";

          }

          else {

            statusBerkas =
              "Belum Upload";

          }


          return {

            ...berkas,

            gudep_id:
              itemGudep.id,

            profil_gudep: {

              id:
                itemGudep.id,

              nama_pangkalan:
                itemGudep.nama_pangkalan

            },

            statusBerkas

          };

        }

      );


      // ==================================================
      // 4. LOG HASIL
      // ==================================================

      console.log(
        "======================================"
      );

      console.log(
        "HASIL VERIFIKASI BERKAS:"
      );

      console.log(
        "Total Gudep:",
        hasil.length
      );

      console.log(
        "Lengkap:",
        hasil.filter(
          item =>
            item.statusBerkas ===
            "Lengkap"
        ).length
      );

      console.log(
        "Menunggu:",
        hasil.filter(
          item =>
            item.statusBerkas ===
            "Menunggu"
        ).length
      );

      console.log(
        "Belum Upload:",
        hasil.filter(
          item =>
            item.statusBerkas ===
            "Belum Upload"
        ).length
      );

      console.log(
        "======================================"
      );


      setData(hasil);


    } catch (error) {

      console.error(
        "Gagal mengambil data berkas:",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  // ====================================================
  // UBAH STATUS
  // ====================================================

  async function ubahStatus(status) {


    if (!selected) {

      return;

    }


    // Tidak boleh verifikasi
    // jika data berkas tidak ada

    if (!selected.id) {

      alert(
        "Gudep ini belum mengupload berkas."
      );

      return;

    }


    // Tidak boleh verifikasi
    // jika dokumen belum lengkap

    if (
      !selected.surat_tugas ||
      !selected.surat_izin
    ) {

      alert(
        "Berkas belum lengkap. Surat Tugas Mabigus dan Surat Izin Orang Tua harus tersedia."
      );

      return;

    }


    try {


      await updateBerkas(

        selected.id,

        {
          status: status
        }

      );


      alert(
        "Status berhasil diperbarui."
      );


      setSelected(null);


      await loadBerkas();


    } catch (error) {

      console.error(
        "ERROR UPDATE STATUS:",
        error
      );

      alert(
        "Gagal memperbarui status."
      );

    }

  }


  // ====================================================
  // WARNA STATUS
  // ====================================================

  function getStatusClass(status) {


    if (
      status ===
      "Lengkap"
    ) {

      return `
        bg-green-100
        text-green-700
      `;

    }


    if (
      status ===
      "Menunggu"
    ) {

      return `
        bg-yellow-100
        text-yellow-700
      `;

    }


    if (
      status ===
      "Belum Upload"
    ) {

      return `
        bg-red-100
        text-red-700
      `;

    }


    if (
      status ===
      "Terverifikasi"
    ) {

      return `
        bg-green-100
        text-green-700
      `;

    }


    if (
      status ===
      "Ditolak"
    ) {

      return `
        bg-red-100
        text-red-700
      `;

    }


    return `
      bg-gray-100
      text-gray-700
    `;

  }


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div className="w-full">

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-6
            text-center
          "
        >

          <p className="text-gray-500">

            Memuat data berkas...

          </p>

        </div>

      </div>

    );

  }


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div
      className="
        w-full
        max-w-full
        space-y-5
        sm:space-y-6
        overflow-x-hidden
      "
    >


      {/* ==================================================
          JUDUL
      ================================================== */}

      <div>

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-amber-700
          "
        >

          Verifikasi Berkas

        </h1>


        <p className="text-gray-500 mt-1">

          Pemeriksaan kelengkapan berkas setiap Gudep

        </p>

      </div>


      {/* ==================================================
          RINGKASAN
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-3
          gap-4
        "
      >


        {/* LENGKAP */}

        <div
          className="
            bg-green-50
            border
            border-green-200
            rounded-xl
            p-4
          "
        >

          <p className="text-green-700">
            🟢 Lengkap
          </p>

          <p className="text-2xl font-bold text-green-700">

            {
              data.filter(
                item =>
                  item.statusBerkas ===
                  "Lengkap"
              ).length
            }

            {" "}Gudep

          </p>

        </div>


        {/* MENUNGGU */}

        <div
          className="
            bg-yellow-50
            border
            border-yellow-200
            rounded-xl
            p-4
          "
        >

          <p className="text-yellow-700">
            🟡 Menunggu
          </p>

          <p className="text-2xl font-bold text-yellow-700">

            {
              data.filter(
                item =>
                  item.statusBerkas ===
                  "Menunggu"
              ).length
            }

            {" "}Gudep

          </p>

        </div>


        {/* BELUM UPLOAD */}

        <div
          className="
            bg-red-50
            border
            border-red-200
            rounded-xl
            p-4
          "
        >

          <p className="text-red-700">
            🔴 Belum Upload
          </p>

          <p className="text-2xl font-bold text-red-700">

            {
              data.filter(
                item =>
                  item.statusBerkas ===
                  "Belum Upload"
              ).length
            }

            {" "}Gudep

          </p>

        </div>


      </div>


      {/* ==================================================
          TABEL
      ================================================== */}

      <div
        className="
          bg-white
          rounded-xl
          shadow
          w-full
          min-w-0
        "
      >

        <div
          className="
            w-full
            overflow-x-auto
            overscroll-x-contain
          "
        >

          <table
            className="
              w-full
              min-w-[800px]
              text-sm
              sm:text-base
            "
          >

            <thead
              className="
                bg-amber-700
                text-white
              "
            >

              <tr>

                <th
                  className="
                    p-3
                    whitespace-nowrap
                    text-center
                  "
                >
                  No
                </th>

                <th
                  className="
                    p-3
                    whitespace-nowrap
                    text-left
                  "
                >
                  Gudep
                </th>

                <th
                  className="
                    p-3
                    whitespace-nowrap
                    text-center
                  "
                >
                  Surat Tugas
                </th>

                <th
                  className="
                    p-3
                    whitespace-nowrap
                    text-center
                  "
                >
                  Surat Izin
                </th>

                <th
                  className="
                    p-3
                    whitespace-nowrap
                    text-center
                  "
                >
                  Status Berkas
                </th>

                <th
                  className="
                    p-3
                    whitespace-nowrap
                    text-center
                  "
                >
                  Status Verifikasi
                </th>

                <th
                  className="
                    p-3
                    whitespace-nowrap
                    text-center
                  "
                >
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>


              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="
                      text-center
                      p-5
                    "
                  >

                    Belum ada data Gudep.

                  </td>

                </tr>

              ) : (

                data.map(
                  (item, index) => (

                    <tr
                      key={
                        item.gudep_id
                      }
                      className="
                        border-b
                        hover:bg-gray-50
                      "
                    >


                      {/* NO */}

                      <td
                        className="
                          p-3
                          text-center
                          whitespace-nowrap
                        "
                      >

                        {index + 1}

                      </td>


                      {/* GUDEP */}

                      <td
                        className="
                          p-3
                          whitespace-nowrap
                          font-medium
                        "
                      >

                        {
                          item.profil_gudep
                            ?.nama_pangkalan
                          ||
                          "-"
                        }

                      </td>


                      {/* SURAT TUGAS */}

                      <td
                        className="
                          p-3
                          text-center
                          whitespace-nowrap
                        "
                      >

                        {

                          item.surat_tugas

                            ?

                            (
                              <span
                                className="
                                  text-green-600
                                  font-semibold
                                "
                              >

                                📄 Ada

                              </span>
                            )

                            :

                            (
                              <span
                                className="
                                  text-red-600
                                  font-semibold
                                "
                              >

                                ❌ Belum

                              </span>
                            )

                        }

                      </td>


                      {/* SURAT IZIN */}

                      <td
                        className="
                          p-3
                          text-center
                          whitespace-nowrap
                        "
                      >

                        {

                          item.surat_izin

                            ?

                            (
                              <span
                                className="
                                  text-green-600
                                  font-semibold
                                "
                              >

                                📄 Ada

                              </span>
                            )

                            :

                            (
                              <span
                                className="
                                  text-red-600
                                  font-semibold
                                "
                              >

                                ❌ Belum

                              </span>
                            )

                        }

                      </td>


                      {/* STATUS BERKAS */}

                      <td
                        className="
                          p-3
                          text-center
                          whitespace-nowrap
                        "
                      >

                        <span
                          className={`
                            inline-block
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                            ${getStatusClass(
                              item.statusBerkas
                            )}
                          `}
                        >

                          {item.statusBerkas}

                        </span>

                      </td>


                      {/* STATUS VERIFIKASI */}

                      <td
                        className="
                          p-3
                          text-center
                          whitespace-nowrap
                        "
                      >

                        {

                          item.status

                            ?

                            (
                              <span
                                className={`
                                  inline-block
                                  px-3
                                  py-1
                                  rounded-full
                                  ${getStatusClass(
                                    item.status
                                  )}
                                `}
                              >

                                {
                                  item.status
                                }

                              </span>
                            )

                            :

                            (
                              <span
                                className="
                                  text-gray-400
                                "
                              >

                                Belum diperiksa

                              </span>
                            )

                        }

                      </td>


                      {/* AKSI */}

                      <td
                        className="
                          p-3
                          text-center
                          whitespace-nowrap
                        "
                      >

                        <button
                          onClick={() => {

                            console.log(
                              "DETAIL BERKAS:",
                              item
                            );

                            setSelected(item);

                          }}
                          className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            whitespace-nowrap
                          "
                        >

                          Lihat

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


      {/* ==================================================
          DETAIL BERKAS
      ================================================== */}

      {selected && (

        <div
          className="
            bg-white
            rounded-xl
            shadow
            p-4
            sm:p-6
            w-full
            min-w-0
          "
        >


          {/* JUDUL */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              mb-5
            "
          >

            <h2
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-amber-700
              "
            >

              Detail Berkas

            </h2>


            <span
              className={`
                inline-block
                px-3
                py-1
                rounded-full
                font-semibold
                w-fit
                ${getStatusClass(
                  selected.statusBerkas
                )}
              `}
            >

              {selected.statusBerkas}

            </span>

          </div>


          {/* ==================================================
              INFORMASI
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-4
              sm:gap-5
              mb-6
            "
          >

            <Info
              title="Gudep"
              value={
                selected.profil_gudep
                  ?.nama_pangkalan
              }
            />


            <Info
              title="ID Gudep"
              value={
                selected.gudep_id
              }
            />


            <Info
              title="Status Verifikasi"
              value={
                selected.status
                  ||
                  "Belum diperiksa"
              }
            />

          </div>


          {/* ==================================================
              BELUM UPLOAD SAMA SEKALI
          ================================================== */}

          {!selected.surat_tugas &&
           !selected.surat_izin && (

            <div
              className="
                bg-red-50
                border
                border-red-200
                rounded-xl
                p-5
                mb-6
              "
            >

              <h3
                className="
                  text-lg
                  font-bold
                  text-red-700
                  mb-2
                "
              >

                🔴 Berkas Belum Diupload

              </h3>


              <p className="text-red-600">

                Gudep ini belum mengupload
                Surat Tugas Mabigus maupun
                Surat Izin Orang Tua.

              </p>


            </div>

          )}


          {/* ==================================================
              SURAT TUGAS
          ================================================== */}

          <h3
            className="
              text-lg
              sm:text-xl
              font-bold
              mb-3
            "
          >

            📄 Surat Tugas Mabigus

          </h3>


          {

            selected.surat_tugas

              ?

              (

                <iframe

                  src={
                    selected.surat_tugas
                  }

                  className="
                    w-full
                    h-[450px]
                    sm:h-[600px]
                    border
                    rounded-lg
                    mb-6
                  "

                  title="Surat Tugas"

                />

              )

              :

              (

                <div
                  className="
                    bg-red-50
                    border
                    border-red-200
                    rounded-lg
                    p-4
                    mb-6
                  "
                >

                  <p className="text-red-600 font-semibold">

                    ❌ Belum upload Surat Tugas Mabigus.

                  </p>

                </div>

              )

          }


          {/* ==================================================
              SURAT IZIN
          ================================================== */}

          <h3
            className="
              text-lg
              sm:text-xl
              font-bold
              mb-3
            "
          >

            📄 Surat Izin Orang Tua

          </h3>


          {

            selected.surat_izin

              ?

              (

                <iframe

                  src={
                    selected.surat_izin
                  }

                  className="
                    w-full
                    h-[450px]
                    sm:h-[600px]
                    border
                    rounded-lg
                  "

                  title="Surat Izin"

                />

              )

              :

              (

                <div
                  className="
                    bg-red-50
                    border
                    border-red-200
                    rounded-lg
                    p-4
                  "
                >

                  <p className="text-red-600 font-semibold">

                    ❌ Belum upload Surat Izin Orang Tua.

                  </p>

                </div>

              )

          }


          {/* ==================================================
              TOMBOL VERIFIKASI
          ================================================== */}

          {

            selected.surat_tugas &&
            selected.surat_izin

              ?

              (

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                    mt-6
                  "
                >

                  <button

                    onClick={() =>
                      ubahStatus(
                        "Terverifikasi"
                      )
                    }

                    className="
                      bg-green-700
                      hover:bg-green-800
                      text-white
                      px-6
                      py-3
                      rounded-lg
                      font-semibold
                      w-full
                      sm:w-auto
                    "

                  >

                    ✔ Verifikasi

                  </button>


                  <button

                    onClick={() =>
                      ubahStatus(
                        "Ditolak"
                      )
                    }

                    className="
                      bg-red-600
                      hover:bg-red-700
                      text-white
                      px-6
                      py-3
                      rounded-lg
                      font-semibold
                      w-full
                      sm:w-auto
                    "

                  >

                    ✖ Tolak

                  </button>


                  <button

                    onClick={() =>
                      setSelected(null)
                    }

                    className="
                      bg-gray-500
                      hover:bg-gray-600
                      text-white
                      px-6
                      py-3
                      rounded-lg
                      font-semibold
                      w-full
                      sm:w-auto
                    "

                  >

                    Tutup

                  </button>

                </div>

              )

              :

              (

                <div
                  className="
                    mt-6
                    bg-yellow-50
                    border
                    border-yellow-200
                    rounded-lg
                    p-4
                  "
                >

                  <p
                    className="
                      text-yellow-700
                      font-semibold
                    "
                  >

                    ⚠️ Belum dapat diverifikasi.

                  </p>

                  <p
                    className="
                      text-yellow-700
                      text-sm
                      mt-1
                    "
                  >

                    Pastikan Surat Tugas Mabigus
                    dan Surat Izin Orang Tua
                    sudah diupload terlebih dahulu.

                  </p>

                </div>

              )

          }


        </div>

      )}

    </div>

  );

}