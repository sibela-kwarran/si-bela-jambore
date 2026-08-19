import { useEffect, useState } from "react";

import {
  getLaporanRekapFinal,
} from "../../services/laporanRekapFinalService";


export default function LaporanRekapFinal() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      setLoading(true);

      const hasil =
        await getLaporanRekapFinal();

      setData(hasil);

    } catch (error) {

      console.error(
        "GAGAL LOAD LAPORAN:",
        error
      );

      alert(
        "Gagal mengambil data laporan.\n\n" +
        error.message
      );

    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // CETAK
  // =====================================================

  function handlePrint() {

    window.print();

  }


  if (loading) {

    return (

      <div className="min-h-[400px] flex items-center justify-center">

        <div className="text-center">

          <div
            className="
              animate-spin
              rounded-full
              h-10
              w-10
              border-b-2
              border-amber-700
              mx-auto
              mb-4
            "
          />

          <p className="text-gray-600">
            Mengambil data pendaftaran final...
          </p>

        </div>

      </div>

    );

  }


  if (!data) return null;


  // =====================================================
  // TOTAL
  // =====================================================

  const totalGudep =
    data.gudep.SD.Negeri +
    data.gudep.SD.Swasta +
    data.gudep.SMP.Negeri +
    data.gudep.SMP.Swasta;


  const totalPeserta =
    data.peserta.SD.Negeri.putra +
    data.peserta.SD.Negeri.putri +
    data.peserta.SD.Swasta.putra +
    data.peserta.SD.Swasta.putri +
    data.peserta.SMP.Negeri.putra +
    data.peserta.SMP.Negeri.putri +
    data.peserta.SMP.Swasta.putra +
    data.peserta.SMP.Swasta.putri;


  const totalRegu =
    data.regu.SD.Negeri.putra +
    data.regu.SD.Negeri.putri +
    data.regu.SD.Swasta.putra +
    data.regu.SD.Swasta.putri +
    data.regu.SMP.Negeri.putra +
    data.regu.SMP.Negeri.putri +
    data.regu.SMP.Swasta.putra +
    data.regu.SMP.Swasta.putri;


  // =====================================================
  // BARIS TABEL
  // =====================================================

  function baris(
    label,
    obj,
    jenjang,
    status
  ) {

    const total =
      obj.putra +
      obj.putri;


    return (

      <tr key={`${jenjang}-${status}`}>

        <td className="border px-3 py-2">
          {jenjang}
        </td>

        <td className="border px-3 py-2">
          {status}
        </td>

        <td className="border px-3 py-2 text-center">
          {obj.putra}
        </td>

        <td className="border px-3 py-2 text-center">
          {obj.putri}
        </td>

        <td className="border px-3 py-2 text-center font-bold">
          {total}
        </td>

      </tr>

    );

  }


  return (

    <>
      {/* =================================================
          CSS KHUSUS CETAK F4 PORTRAIT
      ================================================= */}

      <style>{`

        @media print {

          @page {

            size: 21.5cm 33cm portrait;

            margin: 1.2cm 1.2cm 1.3cm 1.2cm;

          }


          html,
          body {

            width: 21.5cm;

            min-height: 33cm;

            margin: 0;

            padding: 0;

            background: white !important;

          }


          body {

            -webkit-print-color-adjust: exact !important;

            print-color-adjust: exact !important;

          }


          /* Sembunyikan semua elemen selain laporan */

          body * {

            visibility: hidden;

          }


          #laporan-rekap-final,
          #laporan-rekap-final * {

            visibility: visible;

          }


          #laporan-rekap-final {

            position: absolute;

            left: 0;

            top: 0;

            width: 100%;

            max-width: none !important;

            margin: 0 !important;

            padding: 0 !important;

            background: white !important;

          }


          /* Tombol tidak dicetak */

          .no-print {

            display: none !important;

          }


          /* Hilangkan tampilan kartu */

          .print-card {

            box-shadow: none !important;

            border-radius: 0 !important;

            margin-bottom: 18px !important;

            padding: 0 !important;

          }


          /* Header laporan */

          .print-header {

            background: white !important;

            color: black !important;

            border-bottom: 2px solid black;

            border-radius: 0 !important;

            padding: 0 0 10px 0 !important;

            margin-bottom: 15px !important;

            text-align: center;

          }


          .print-header h1 {

            color: black !important;

            font-size: 18pt !important;

            margin: 0 !important;

          }


          .print-header p {

            color: black !important;

            font-size: 10pt !important;

            margin: 3px 0 !important;

          }


          /* Judul tabel */

          .print-title {

            font-size: 13pt !important;

            margin-bottom: 7px !important;

          }


          /* Tabel */

          table {

            width: 100% !important;

            border-collapse: collapse !important;

            font-size: 9.5pt !important;

          }


          th,
          td {

            border: 1px solid #000 !important;

            padding: 5px 6px !important;

            color: #000 !important;

          }


          th {

            font-weight: bold !important;

            background: #eeeeee !important;

          }


          /* Jangan pecah satu baris */

          tr {

            break-inside: avoid !important;

            page-break-inside: avoid !important;

          }


          thead {

            display: table-header-group;

          }


          /* Ringkasan */

          .print-summary {

            display: grid !important;

            grid-template-columns: repeat(3, 1fr) !important;

            gap: 8px !important;

            margin-bottom: 15px !important;

          }


          .print-summary-card {

            border: 1px solid #000 !important;

            border-radius: 0 !important;

            box-shadow: none !important;

            padding: 8px !important;

            text-align: center;

          }


          .print-summary-card p:first-child {

            font-size: 8.5pt !important;

            color: #000 !important;

            margin: 0 !important;

          }


          .print-summary-card p:last-child {

            font-size: 15pt !important;

            font-weight: bold !important;

            color: #000 !important;

            margin: 3px 0 0 0 !important;

          }


          /* Setiap bagian */

          .print-section {

            margin-bottom: 16px !important;

          }


          /* Daftar Gudep */

          .daftar-gudep {

            page-break-before: auto;

          }


          /* Hindari halaman kosong */

          .print-section:last-child {

            margin-bottom: 0 !important;

          }

        }

      `}</style>


      {/* =================================================
          AREA LAPORAN
      ================================================= */}

      <div
        id="laporan-rekap-final"
        className="max-w-7xl mx-auto space-y-6"
      >


        {/* =================================================
            TOMBOL CETAK
        ================================================= */}

        <div className="no-print flex justify-end">

          <button
            onClick={handlePrint}
            className="
              bg-amber-700
              hover:bg-amber-800
              text-white
              px-5
              py-3
              rounded-xl
              shadow-lg
              font-semibold
              transition
            "
          >
            🖨️ Cetak Laporan F4
          </button>

        </div>


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            print-header
            bg-amber-700
            text-white
            rounded-2xl
            p-6
            shadow
          "
        >

          <h1 className="text-2xl md:text-3xl font-bold">
            LAPORAN REKAP FINAL PENDAFTARAN
          </h1>

          <p className="mt-2">
            Jambore Ranting Kwarran Cikarang Utara
          </p>

          <p>
            Tahun 2026
          </p>

        </div>


        {/* =================================================
            RINGKASAN
        ================================================= */}

        <div
          className="
            print-summary
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
          "
        >

          <div
            className="
              print-summary-card
              bg-white
              rounded-xl
              shadow
              p-5
            "
          >

            <p className="text-gray-500">
              Total Gudep
            </p>

            <p className="text-3xl font-bold text-amber-700 mt-2">
              {totalGudep}
            </p>

          </div>


          <div
            className="
              print-summary-card
              bg-white
              rounded-xl
              shadow
              p-5
            "
          >

            <p className="text-gray-500">
              Total Peserta
            </p>

            <p className="text-3xl font-bold text-green-700 mt-2">
              {totalPeserta}
            </p>

          </div>


          <div
            className="
              print-summary-card
              bg-white
              rounded-xl
              shadow
              p-5
            "
          >

            <p className="text-gray-500">
              Total Regu
            </p>

            <p className="text-3xl font-bold text-blue-700 mt-2">
              {totalRegu}
            </p>

          </div>

        </div>


        {/* =================================================
            GUDEP
        ================================================= */}

        <div className="print-card print-section bg-white rounded-2xl shadow p-5">

          <h2 className="print-title text-xl font-bold mb-5">
            🏫 Rekap Jumlah Gugus Depan
          </h2>


          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-amber-100">

                  <th className="border px-4 py-3">
                    Jenjang
                  </th>

                  <th className="border px-4 py-3">
                    Status Sekolah
                  </th>

                  <th className="border px-4 py-3">
                    Jumlah Gudep
                  </th>

                </tr>

              </thead>


              <tbody>

                <tr>

                  <td className="border px-4 py-3">
                    SD
                  </td>

                  <td className="border px-4 py-3">
                    Negeri
                  </td>

                  <td className="border px-4 py-3 text-center font-bold">
                    {data.gudep.SD.Negeri}
                  </td>

                </tr>


                <tr>

                  <td className="border px-4 py-3">
                    SD
                  </td>

                  <td className="border px-4 py-3">
                    Swasta
                  </td>

                  <td className="border px-4 py-3 text-center font-bold">
                    {data.gudep.SD.Swasta}
                  </td>

                </tr>


                <tr>

                  <td className="border px-4 py-3">
                    SMP
                  </td>

                  <td className="border px-4 py-3">
                    Negeri
                  </td>

                  <td className="border px-4 py-3 text-center font-bold">
                    {data.gudep.SMP.Negeri}
                  </td>

                </tr>


                <tr>

                  <td className="border px-4 py-3">
                    SMP / MTS
                  </td>

                  <td className="border px-4 py-3">
                    Swasta
                  </td>

                  <td className="border px-4 py-3 text-center font-bold">
                    {data.gudep.SMP.Swasta}
                  </td>

                </tr>


                <tr className="bg-gray-100 font-bold">

                  <td
                    colSpan="2"
                    className="border px-4 py-3"
                  >
                    TOTAL
                  </td>

                  <td className="border px-4 py-3 text-center">
                    {totalGudep}
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            PESERTA
        ================================================= */}

        <div className="print-card print-section bg-white rounded-2xl shadow p-5">

          <h2 className="print-title text-xl font-bold mb-5">
            👦 Rekap Peserta
          </h2>


          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-green-100">

                  <th className="border px-4 py-3">
                    Jenjang
                  </th>

                  <th className="border px-4 py-3">
                    Status Sekolah
                  </th>

                  <th className="border px-4 py-3">
                    Putra
                  </th>

                  <th className="border px-4 py-3">
                    Putri
                  </th>

                  <th className="border px-4 py-3">
                    Total
                  </th>

                </tr>

              </thead>


              <tbody>

                {baris(
                  "SD",
                  data.peserta.SD.Negeri,
                  "SD",
                  "Negeri"
                )}

                {baris(
                  "SD",
                  data.peserta.SD.Swasta,
                  "SD",
                  "Swasta"
                )}

                {baris(
                  "SMP",
                  data.peserta.SMP.Negeri,
                  "SMP",
                  "Negeri"
                )}

                {baris(
                  "SMP",
                  data.peserta.SMP.Swasta,
                  "SMP / MTS",
                  "Swasta"
                )}


                <tr className="bg-gray-100 font-bold">

                  <td
                    colSpan="4"
                    className="border px-4 py-3"
                  >
                    TOTAL PESERTA
                  </td>

                  <td className="border px-4 py-3 text-center">
                    {totalPeserta}
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            REGU
        ================================================= */}

        <div className="print-card print-section bg-white rounded-2xl shadow p-5">

          <h2 className="print-title text-xl font-bold mb-5">
            ⛺ Rekap Regu
          </h2>


          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>

                <tr className="bg-blue-100">

                  <th className="border px-4 py-3">
                    Jenjang
                  </th>

                  <th className="border px-4 py-3">
                    Status Sekolah
                  </th>

                  <th className="border px-4 py-3">
                    Regu Putra
                  </th>

                  <th className="border px-4 py-3">
                    Regu Putri
                  </th>

                  <th className="border px-4 py-3">
                    Total
                  </th>

                </tr>

              </thead>


              <tbody>

                {baris(
                  "SD",
                  data.regu.SD.Negeri,
                  "SD",
                  "Negeri"
                )}

                {baris(
                  "SD",
                  data.regu.SD.Swasta,
                  "SD",
                  "Swasta"
                )}

                {baris(
                  "SMP",
                  data.regu.SMP.Negeri,
                  "SMP",
                  "Negeri"
                )}

                {baris(
                  "SD",
                  data.regu.SMP.Swasta,
                  "SMP / MTS",
                  "Swasta"
                )}


                <tr className="bg-gray-100 font-bold">

                  <td
                    colSpan="4"
                    className="border px-4 py-3"
                  >
                    TOTAL REGU
                  </td>

                  <td className="border px-4 py-3 text-center">
                    {totalRegu}
                  </td>

                </tr>

              </tbody>

            </table>

          </div>

        </div>


        {/* =================================================
            DAFTAR GUDEP
        ================================================= */}

        <div className="print-card print-section daftar-gudep bg-white rounded-2xl shadow p-5">

          <h2 className="print-title text-xl font-bold mb-5">
            📋 Daftar Gugus Depan Peserta
          </h2>


          <div className="overflow-x-auto">

            <table className="w-full border-collapse text-sm">

              <thead>

                <tr className="bg-gray-100">

                  <th className="border px-3 py-2">
                    No
                  </th>

                  <th className="border px-3 py-2 text-left">
                    Nama Pangkalan
                  </th>

                  <th className="border px-3 py-2">
                    Jenjang
                  </th>

                  <th className="border px-3 py-2">
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {data.daftarGudep.map(
                  (item, index) => (

                    <tr key={item.id}>

                      <td className="border px-3 py-2 text-center">
                        {index + 1}
                      </td>

                      <td className="border px-3 py-2">
                        {item.nama_pangkalan}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        {item.jenjang}
                      </td>

                      <td className="border px-3 py-2 text-center">
                        {item.status}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


      </div>

    </>

  );

}