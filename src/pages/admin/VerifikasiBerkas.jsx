import { useState, useEffect } from "react";

import {
  getSemuaBerkasAdmin,
  updateBerkas
} from "../../services/berkasService";


// ======================================================
// KOMPONEN INFO
// ======================================================

function Info({ title, value }) {

  return (

    <div className="border rounded-lg p-4">

      <p className="text-gray-500">
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


  // ====================================================
  // AMBIL DATA SAAT HALAMAN DIBUKA
  // ====================================================

  useEffect(() => {

    loadBerkas();

  }, []);


  async function loadBerkas() {

    try {

      const hasil = await getSemuaBerkasAdmin();

      console.log(
        "DATA BERKAS ADMIN :",
        hasil
      );

      setData(hasil || []);


    } catch (error) {

      console.error(
        "Gagal mengambil berkas:",
        error
      );

    }

  }


  // ====================================================
  // UBAH STATUS
  // ====================================================

  async function ubahStatus(status) {

    try {

      await updateBerkas(

        selected.id,

        {
          status: status
        }

      );


      alert(
        "Status berhasil diperbarui"
      );


      setSelected(null);

      loadBerkas();


    } catch (error) {

      console.error(error);

    }

  }


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

        {/* 
          PENTING:
          Wrapper ini membuat TABEL bisa digeser
          horizontal menggunakan jari di HP.
        */}

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
              min-w-[700px]
              text-sm
              sm:text-base
            "
          >

            <thead className="bg-amber-700 text-white">

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
                  Status
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
                    colSpan="6"
                    className="
                      text-center
                      p-5
                    "
                  >

                    Belum ada data.

                  </td>

                </tr>


              ) : (


                data.map((item, index) => (

                  <tr
                    key={item.id}
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
                      "
                    >
                      {
                        item.profil_gudep?.nama_pangkalan
                        || "-"
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
                          "📄 Ada"
                          :
                          "-"
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
                          "📄 Ada"
                          :
                          "-"
                      }

                    </td>


                    {/* STATUS */}

                    <td
                      className="
                        p-3
                        text-center
                        whitespace-nowrap
                      "
                    >

                      <span
                        className="
                          inline-block
                          bg-yellow-100
                          text-yellow-700
                          px-3
                          py-1
                          rounded-full
                          whitespace-nowrap
                        "
                      >

                        {item.status || "Menunggu"}

                      </span>

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
                            "DETAIL BERKAS :",
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
                          rounded
                          whitespace-nowrap
                        "
                      >
                        Lihat
                      </button>

                    </td>


                  </tr>

                ))

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


          <h2
            className="
              text-xl
              sm:text-2xl
              font-bold
              text-amber-700
              mb-5
            "
          >
            Detail Berkas
          </h2>


          {/* ==================================================
              INFORMASI
          ================================================== */}

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
              sm:gap-5
              mb-6
            "
          >

            <Info
              title="Gudep"
              value={
                selected.profil_gudep?.nama_pangkalan
              }
            />


            <Info
              title="Status"
              value={selected.status}
            />

          </div>


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

                  src={selected.surat_tugas}

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

                <p className="text-red-600">
                  Belum ada surat tugas
                </p>

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

                  src={selected.surat_izin}

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

                <p className="text-red-600">
                  Belum ada surat izin
                </p>

              )

          }


          {/* ==================================================
              TOMBOL VERIFIKASI
          ================================================== */}

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
                ubahStatus("Terverifikasi")
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
                ubahStatus("Ditolak")
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

          </div>


        </div>

      )}

    </div>

  );

}