import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProfilGudepById } from "../../services/profilGudepService";
import { getPembinaByGudep } from "../../services/pembinaService";
import { getReguByGudep } from "../../services/reguService";
import { getPesertaByGudep } from "../../services/pesertaService";

import html2pdf from "html2pdf.js";


// ======================================================
// DETAIL LAPORAN GUEDEP
// ======================================================

export default function DetailLaporan() {

  const { id } = useParams();
  const navigate = useNavigate();

  // ======================================================
  // STATE
  // ======================================================

  const [profil, setProfil] = useState({});
  const [pembina, setPembina] = useState([]);
  const [regu, setRegu] = useState([]);
  const [peserta, setPeserta] = useState([]);

  const [loading, setLoading] = useState(true);


  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {

    loadData();

  }, [id]);


  async function loadData() {

    try {

      setLoading(true);

      const gudepId = id;

      // ===============================
      // PROFIL
      // ===============================

      const profilData =
        await getProfilGudepById(gudepId);

      setProfil(profilData || {});


      // ===============================
      // PEMBINA
      // ===============================

      const pembinaData =
        await getPembinaByGudep(gudepId);

      setPembina(pembinaData || []);


      // ===============================
      // REGU
      // ===============================

      const reguData =
        await getReguByGudep(gudepId);

      setRegu(reguData || []);


      // ===============================
      // PESERTA
      // ===============================

      const pesertaData =
        await getPesertaByGudep(gudepId);

      setPeserta(pesertaData || []);


    } catch (error) {

      console.error(
        "DETAIL LAPORAN :",
        error
      );

    } finally {

      setLoading(false);

    }

  }


  // ======================================================
  // HITUNG STATISTIK
  // ======================================================

  const pembinaPutra =
    pembina.filter(
      (x) => x.jk === "Putra"
    ).length;


  const pembinaPutri =
    pembina.filter(
      (x) => x.jk === "Putri"
    ).length;


  const pesertaPutra =
    peserta.filter(
      (x) => x.jk === "Putra"
    ).length;


  const pesertaPutri =
    peserta.filter(
      (x) => x.jk === "Putri"
    ).length;


  // ======================================================
  // DATA PESERTA PUTRA
  // ======================================================

  const dataPesertaPutra =
    peserta.filter(
      (x) => x.jk === "Putra"
    );


  // ======================================================
  // DATA PESERTA PUTRI
  // ======================================================

  const dataPesertaPutri =
    peserta.filter(
      (x) => x.jk === "Putri"
    );


  // ======================================================
  // CETAK PDF
  // ======================================================

  function cetakPDF() {

    const element =
      document.getElementById(
        "laporan-pdf"
      );


    if (!element) {

      alert(
        "Elemen laporan tidak ditemukan"
      );

      return;

    }


    // ==================================================
    // STYLE KHUSUS PDF
    // ==================================================

    const style =
      document.createElement("style");

    style.id =
      "pdf-print-style";


    style.innerHTML = `

      /* ==============================
         SEMBUNYIKAN ELEMEN NON PDF
      ============================== */

      .no-pdf {
        display: none !important;
      }


      /* ==============================
         AREA PDF
      ============================== */

      #laporan-pdf {

        background: #ffffff !important;

        color: #000000 !important;

        width: 100% !important;

        max-width: none !important;

        padding: 0 !important;

        margin: 0 !important;

      }


      #laporan-pdf * {

        box-sizing: border-box !important;

      }


      /* ==============================
         HALAMAN PDF
      ============================== */

      #laporan-pdf .pdf-page {

        page-break-before: always !important;

        break-before: page !important;

        page-break-inside: avoid !important;

        break-inside: avoid !important;

        width: 100% !important;

        background: #ffffff !important;

      }


      /* ==============================
         TABLE
      ============================== */

      #laporan-pdf table {

        width: 100% !important;

        border-collapse: collapse !important;

        page-break-inside: auto !important;

        break-inside: auto !important;

      }


      #laporan-pdf thead {

        display: table-header-group !important;

      }


      #laporan-pdf tr {

        page-break-inside: avoid !important;

        break-inside: avoid !important;

      }


      #laporan-pdf th,

      #laporan-pdf td {

        page-break-inside: avoid !important;

        break-inside: avoid !important;

      }


      /* ==============================
         BLOK TIDAK TERPISAH
      ============================== */

      #laporan-pdf .pdf-no-break {

        page-break-inside: avoid !important;

        break-inside: avoid !important;

      }


      /* ==============================
         JUDUL
      ============================== */

      #laporan-pdf h1,

      #laporan-pdf h2,

      #laporan-pdf h3 {

        color: #000000 !important;

      }


      /* ==============================
         PAKSA BACKGROUND PUTIH
      ============================== */

      #laporan-pdf .bg-white {

        background: #ffffff !important;

      }


      /* ==============================
         HILANGKAN SHADOW
      ============================== */

      #laporan-pdf .shadow,

      #laporan-pdf .shadow-lg,

      #laporan-pdf .shadow-md {

        box-shadow: none !important;

      }

    `;


    document.head.appendChild(style);


    // ==================================================
    // FIX WARNA OKLCH
    // ==================================================

    const originalStyles = [];


    element
      .querySelectorAll("*")
      .forEach((el) => {

        const computed =
          window.getComputedStyle(el);


        originalStyles.push({

          el: el,

          color: el.style.color,

          backgroundColor:
            el.style.backgroundColor,

          borderColor:
            el.style.borderColor

        });


        if (
          computed.color &&
          computed.color.includes("oklch")
        ) {

          el.style.color =
            "#000000";

        }


        if (
          computed.backgroundColor &&
          computed.backgroundColor.includes(
            "oklch"
          )
        ) {

          el.style.backgroundColor =
            "#ffffff";

        }


        if (
          computed.borderColor &&
          computed.borderColor.includes(
            "oklch"
          )
        ) {

          el.style.borderColor =
            "#000000";

        }

      });


    // ==================================================
    // KONFIGURASI PDF
    // ==================================================

    html2pdf()
      .set({

        margin: [
          8,
          8,
          8,
          8
        ],

        filename:
          `Laporan-${profil.nama_pangkalan || "Gudep"}.pdf`,

        image: {

          type: "jpeg",

          quality: 0.98

        },

        html2canvas: {

          scale: 2,

          useCORS: true,

          backgroundColor:
            "#ffffff",

          logging: false

        },

        pagebreak: {

          mode: [
            "css",
            "legacy"
          ]

        },

        jsPDF: {

          unit: "mm",

          format: "a4",

          orientation:
            "portrait"

        }

      })

      .from(element)

      .save()

      .then(() => {

        // ==============================
        // KEMBALIKAN STYLE
        // ==============================

        originalStyles.forEach(
          (item) => {

            item.el.style.color =
              item.color;

            item.el.style.backgroundColor =
              item.backgroundColor;

            item.el.style.borderColor =
              item.borderColor;

          }
        );


        style.remove();

      })

      .catch((error) => {

        console.error(
          "ERROR CETAK PDF:",
          error
        );


        style.remove();


        alert(
          "Gagal membuat PDF. Silakan coba lagi."
        );

      });

  }


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="
        min-h-[300px]
        flex
        items-center
        justify-center
        p-6
      ">

        <div className="
          bg-white
          rounded-2xl
          shadow
          p-8
          text-center
        ">

          <div className="
            text-4xl
            mb-3
          ">
            ⏳
          </div>

          <p className="
            text-gray-600
            font-medium
          ">
            Memuat laporan gudep...
          </p>

        </div>

      </div>

    );

  }


  // ======================================================
  // TAMPILAN
  // ======================================================

  return (

    <div className="
      w-full
      space-y-5
      md:space-y-6
    ">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-center
        lg:justify-between
      ">

        <div>

          <h1 className="
            text-2xl
            md:text-3xl
            font-bold
            text-green-700
          ">

            📊 Detail Laporan Gudep

          </h1>


          <p className="
            text-gray-500
            mt-1
            text-sm
            md:text-base
          ">

            Laporan lengkap peserta
            Jambore Ranting 2026

          </p>

        </div>


        {/* ==============================
            TOMBOL
        ============================== */}

        <div className="
          flex
          flex-col
          sm:flex-row
          gap-2
          w-full
          lg:w-auto
          no-pdf
        ">

          <button
            onClick={cetakPDF}
            className="
              w-full
              sm:w-auto
              bg-red-600
              hover:bg-red-700
              active:bg-red-800
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              shadow
              transition
            "
          >

            📄 Cetak PDF

          </button>


          <button
            onClick={() =>
              navigate(
                "/admin/laporan"
              )
            }
            className="
              w-full
              sm:w-auto
              bg-slate-600
              hover:bg-slate-700
              active:bg-slate-800
              text-white
              px-5
              py-3
              rounded-xl
              shadow
              font-semibold
              transition
            "
          >

            ← Kembali

          </button>

        </div>

      </div>


      {/* ==================================================
          AREA YANG DICETAK
      ================================================== */}

      <div
        id="laporan-pdf"
        className="
          w-full
          max-w-5xl
          mx-auto
          bg-white
          p-3
          sm:p-5
          md:p-6
          rounded-xl
        "
      >


        {/* ==================================================
            PROFIL GUGUS DEPAN
        ================================================== */}

        <div className="
          bg-white
          rounded-xl
          border
          border-gray-200
          shadow-sm
          p-4
          sm:p-5
          md:p-6
        ">

          <h2 className="
            text-lg
            md:text-xl
            font-bold
            text-green-700
            mb-4
            md:mb-5
          ">

            🏫 Profil Gugus Depan

          </h2>


          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[500px]
            ">

              <tbody>

                <tr>

                  <td className="
                    font-semibold
                    w-48
                    md:w-56
                    py-2
                    pr-4
                  ">
                    Nama Pangkalan
                  </td>

                  <td>
                    {profil.nama_pangkalan || "-"}
                  </td>

                </tr>


                <tr>

                  <td className="
                    font-semibold
                    py-2
                    pr-4
                  ">
                    Gudep Putra
                  </td>

                  <td>
                    {profil.gudep_putra || "-"}
                  </td>

                </tr>


                <tr>

                  <td className="
                    font-semibold
                    py-2
                    pr-4
                  ">
                    Gudep Putri
                  </td>

                  <td>
                    {profil.gudep_putri || "-"}
                  </td>

                </tr>


                <tr>

                  <td className="
                    font-semibold
                    py-2
                    pr-4
                  ">
                    Kwarran
                  </td>

                  <td>
                    {profil.kwarran || "-"}
                  </td>

                </tr>


                <tr>

                  <td className="
                    font-semibold
                    py-2
                    pr-4
                  ">
                    Kabupaten
                  </td>

                  <td>
                    {profil.kabupaten || "-"}
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* ==================================================
            STATISTIK
            TIDAK MASUK PDF
        ================================================== */}

        <div className="
          grid
          grid-cols-2
          md:grid-cols-3
          gap-3
          md:gap-5
          mt-5
          no-pdf
        ">


          {/* PEMBINA PUTRA */}

          <div className="
            bg-white
            rounded-xl
            shadow
            border
            border-gray-100
            p-4
            md:p-5
          ">

            <div className="
              text-xs
              md:text-sm
              text-gray-500
            ">
              🧑 Pembina Putra
            </div>

            <div className="
              text-3xl
              md:text-4xl
              font-bold
              text-blue-700
              mt-1
            ">
              {pembinaPutra}
            </div>

          </div>


          {/* PEMBINA PUTRI */}

          <div className="
            bg-white
            rounded-xl
            shadow
            border
            border-gray-100
            p-4
            md:p-5
          ">

            <div className="
              text-xs
              md:text-sm
              text-gray-500
            ">
              👩 Pembina Putri
            </div>

            <div className="
              text-3xl
              md:text-4xl
              font-bold
              text-pink-600
              mt-1
            ">
              {pembinaPutri}
            </div>

          </div>


          {/* JUMLAH REGU */}

          <div className="
            bg-white
            rounded-xl
            shadow
            border
            border-gray-100
            p-4
            md:p-5
          ">

            <div className="
              text-xs
              md:text-sm
              text-gray-500
            ">
              ⛺ Jumlah Regu
            </div>

            <div className="
              text-3xl
              md:text-4xl
              font-bold
              text-orange-600
              mt-1
            ">
              {regu.length}
            </div>

          </div>


          {/* PESERTA PUTRA */}

          <div className="
            bg-white
            rounded-xl
            shadow
            border
            border-gray-100
            p-4
            md:p-5
          ">

            <div className="
              text-xs
              md:text-sm
              text-gray-500
            ">
              👦 Peserta Putra
            </div>

            <div className="
              text-3xl
              md:text-4xl
              font-bold
              text-blue-700
              mt-1
            ">
              {pesertaPutra}
            </div>

          </div>


          {/* PESERTA PUTRI */}

          <div className="
            bg-white
            rounded-xl
            shadow
            border
            border-gray-100
            p-4
            md:p-5
          ">

            <div className="
              text-xs
              md:text-sm
              text-gray-500
            ">
              👧 Peserta Putri
            </div>

            <div className="
              text-3xl
              md:text-4xl
              font-bold
              text-pink-600
              mt-1
            ">
              {pesertaPutri}
            </div>

          </div>


          {/* TOTAL PESERTA */}

          <div className="
            bg-white
            rounded-xl
            shadow
            border
            border-gray-100
            p-4
            md:p-5
          ">

            <div className="
              text-xs
              md:text-sm
              text-gray-500
            ">
              👥 Total Peserta
            </div>

            <div className="
              text-3xl
              md:text-4xl
              font-bold
              text-green-700
              mt-1
            ">
              {peserta.length}
            </div>

          </div>

        </div>


        {/* ==================================================
            DATA PEMBINA
        ================================================== */}

        <div className="
          pdf-no-break
          bg-white
          rounded-xl
          border
          border-gray-200
          shadow-sm
          p-4
          sm:p-5
          md:p-6
          mt-5
        ">

          <h2 className="
            text-lg
            md:text-xl
            font-bold
            text-blue-700
            mb-4
            md:mb-5
          ">

            👨‍🏫 Data Pembina

          </h2>


          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[650px]
              border
              border-collapse
            ">

              <thead>

                <tr
                  style={{
                    backgroundColor:
                      "#2563eb",
                    color:
                      "#ffffff",
                    fontWeight:
                      "bold"
                  }}
                >

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    No
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-left
                  ">
                    Nama Pembina
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    JK
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    Jabatan
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    No. HP
                  </th>

                </tr>

              </thead>


              <tbody>

                {pembina.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="
                        border
                        p-5
                        text-center
                        text-gray-500
                      "
                    >
                      Belum ada data pembina
                    </td>

                  </tr>

                ) : (

                  pembina.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          `pembina-${index}`
                        }
                        className="
                          hover:bg-gray-50
                        "
                      >

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {index + 1}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                        ">
                          {item.nama || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.jk || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.jabatan || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.hp || "-"}
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
            DATA REGU
        ================================================== */}

        <div className="
          pdf-no-break
          bg-white
          rounded-xl
          border
          border-gray-200
          shadow-sm
          p-4
          sm:p-5
          md:p-6
          mt-5
        ">

          <h2 className="
            text-lg
            md:text-xl
            font-bold
            text-orange-700
            mb-4
            md:mb-5
          ">

            ⛺ Data Regu

          </h2>


          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[550px]
              border
              border-collapse
            ">

              <thead>

                <tr
                  style={{
                    backgroundColor:
                      "#2563eb",
                    color:
                      "#ffffff",
                    fontWeight:
                      "bold"
                  }}
                >

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    No
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-left
                  ">
                    Nama Regu
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    Jenis
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    Jumlah Anggota
                  </th>

                </tr>

              </thead>


              <tbody>

                {regu.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="
                        border
                        p-5
                        text-center
                        text-gray-500
                      "
                    >
                      Belum ada data regu
                    </td>

                  </tr>

                ) : (

                  regu.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          `regu-${index}`
                        }
                        className="
                          hover:bg-gray-50
                        "
                      >

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {index + 1}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                        ">
                          {item.nama || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.jenis || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">

                          {
                            peserta.filter(
                              (p) =>
                                p.regu ===
                                item.nama
                            ).length
                          }

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
            DATA PESERTA PUTRA
        ================================================== */}

        <div
          id="peserta-putra"
          className="
            pdf-page
            bg-white
            rounded-xl
            border
            border-gray-200
            shadow-sm
            p-4
            sm:p-5
            md:p-6
            mt-5
          "
        >

          <h2 className="
            text-lg
            md:text-xl
            font-bold
            text-blue-700
            mb-4
            md:mb-5
          ">

            👦 Data Peserta Putra

          </h2>


          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[550px]
              border
              border-collapse
            ">

              <thead>

                <tr
                  style={{
                    backgroundColor:
                      "#2563eb",
                    color:
                      "#ffffff",
                    fontWeight:
                      "bold"
                  }}
                >

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    No
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-left
                  ">
                    Nama Peserta
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    Kelas
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    Regu
                  </th>

                </tr>

              </thead>


              <tbody>

                {dataPesertaPutra.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="
                        border
                        p-5
                        text-center
                        text-gray-500
                      "
                    >
                      Belum ada peserta putra
                    </td>

                  </tr>

                ) : (

                  dataPesertaPutra.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          `putra-${index}`
                        }
                      >

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {index + 1}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                        ">
                          {item.nama || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.kelas || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.regu || "-"}
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
            DATA PESERTA PUTRI
        ================================================== */}

        <div
          id="peserta-putri"
          className="
            pdf-page
            bg-white
            rounded-xl
            border
            border-gray-200
            shadow-sm
            p-4
            sm:p-5
            md:p-6
            mt-5
          "
        >

          <h2 className="
            text-lg
            md:text-xl
            font-bold
            text-pink-700
            mb-4
            md:mb-5
          ">

            👧 Data Peserta Putri

          </h2>


          <div className="
            overflow-x-auto
          ">

            <table className="
              w-full
              min-w-[550px]
              border
              border-collapse
            ">

              <thead>

                <tr
                  style={{
                    backgroundColor:
                      "#2563eb",
                    color:
                      "#ffffff",
                    fontWeight:
                      "bold"
                  }}
                >

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    No
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-left
                  ">
                    Nama Peserta
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    Kelas
                  </th>

                  <th className="
                    border
                    p-2
                    md:p-3
                    text-center
                  ">
                    Regu
                  </th>

                </tr>

              </thead>


              <tbody>

                {dataPesertaPutri.length === 0 ? (

                  <tr>

                    <td
                      colSpan="4"
                      className="
                        border
                        p-5
                        text-center
                        text-gray-500
                      "
                    >
                      Belum ada peserta putri
                    </td>

                  </tr>

                ) : (

                  dataPesertaPutri.map(
                    (item, index) => (

                      <tr
                        key={
                          item.id ||
                          `putri-${index}`
                        }
                      >

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {index + 1}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                        ">
                          {item.nama || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.kelas || "-"}
                        </td>

                        <td className="
                          border
                          p-2
                          md:p-3
                          text-center
                        ">
                          {item.regu || "-"}
                        </td>

                      </tr>

                    )
                  )

                )}

              </tbody>

            </table>

          </div>

        </div>


      </div>


      {/* ==================================================
          TOMBOL KEMBALI
          TIDAK IKUT PDF
      ================================================== */}

      <div className="
        flex
        justify-end
        no-pdf
      ">

        <button
          onClick={() =>
            navigate(
              "/admin/laporan"
            )
          }
          className="
            w-full
            sm:w-auto
            bg-green-700
            hover:bg-green-800
            active:bg-green-900
            text-white
            px-8
            py-3
            rounded-xl
            shadow-lg
            font-semibold
            transition
          "
        >

          ← Kembali ke Laporan

        </button>

      </div>


    </div>

  );

}