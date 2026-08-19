import { useEffect, useState } from "react";

import {
  getUpdateDataPeserta,
} from "../../services/updateDataPesertaService";


export default function UpdateDataPeserta() {

  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(true);


  async function loadData() {

    try {

      setLoading(true);

      const hasil =
        await getUpdateDataPeserta();

      setData(hasil);

    } catch (error) {

      console.error(
        "GAGAL LOAD UPDATE DATA:",
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


  useEffect(() => {

    loadData();

  }, []);


  if (loading) {

    return (

      <div
        className="
          min-h-[400px]
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              animate-spin
              rounded-full
              h-10
              w-10
              border-b-2
              border-green-700
              mx-auto
              mb-4
            "
          />

          <p className="text-gray-600">
            Mengambil data peserta...
          </p>

        </div>

      </div>

    );

  }


  if (!data) {
    return null;
  }


  const rows =
    Object.entries(data.kelompok);


  return (

    <div className="space-y-6">


      {/* ========================================
          HEADER
      ======================================== */}

      <div>

        <h1
          className="
            text-2xl
            md:text-3xl
            font-bold
            text-gray-800
          "
        >
          📊 Update Data Peserta
        </h1>

        <p className="text-gray-500 mt-1">

          Rekapitulasi peserta Jambore Ranting
          berdasarkan jenjang dan status sekolah.

        </p>

      </div>


      {/* ========================================
          KARTU TOTAL
      ======================================== */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-5
          gap-4
        "
      >

        <Card
          title="Total Gudep"
          value={data.total.gudep}
          icon="🏫"
        />

        <Card
          title="Putra"
          value={data.total.putra}
          icon="👦"
        />

        <Card
          title="Putri"
          value={data.total.putri}
          icon="👧"
        />

        <Card
          title="Regu Putra"
          value={data.total.reguPutra}
          icon="🏕️"
        />

        <Card
          title="Regu Putri"
          value={data.total.reguPutri}
          icon="🏕️"
        />

      </div>


      {/* ========================================
          TABEL
      ======================================== */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          border
          overflow-hidden
        "
      >

        <div
          className="
            p-5
            border-b
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-3
          "
        >

          <div>

            <h2
              className="
                text-xl
                font-bold
                text-gray-800
              "
            >
              Rekapitulasi Data Peserta
            </h2>

            <p className="text-sm text-gray-500">

              Data diambil langsung dari Supabase.

            </p>

          </div>


          <button
            onClick={loadData}
            className="
              bg-green-700
              hover:bg-green-800
              text-white
              px-5
              py-2
              rounded-lg
              font-semibold
              transition
            "
          >

            🔄 Refresh Data

          </button>

        </div>


        {/* ========================================
            TABLE
        ======================================== */}

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              min-w-[850px]
              text-sm
            "
          >

            <thead>

              <tr className="bg-green-700 text-white">

                <th className="px-4 py-3 text-left">
                  Jenjang
                </th>

                <th className="px-4 py-3 text-left">
                  Status Sekolah
                </th>

                <th className="px-4 py-3 text-center">
                  Gudep
                </th>

                <th className="px-4 py-3 text-center">
                  Putra
                </th>

                <th className="px-4 py-3 text-center">
                  Putri
                </th>

                <th className="px-4 py-3 text-center">
                  Regu Putra
                </th>

                <th className="px-4 py-3 text-center">
                  Regu Putri
                </th>

              </tr>

            </thead>


            <tbody>

              {rows.map(
                ([nama, item]) => (

                  <tr
                    key={nama}
                    className="
                      border-b
                      hover:bg-gray-50
                    "
                  >

                    <td className="px-4 py-3 font-semibold">

                      {item.jenjang}

                    </td>


                    <td className="px-4 py-3">

                      {item.status}

                    </td>


                    <td className="px-4 py-3 text-center font-semibold">

                      {item.gudep}

                    </td>


                    <td className="px-4 py-3 text-center">

                      {item.putra}

                    </td>


                    <td className="px-4 py-3 text-center">

                      {item.putri}

                    </td>


                    <td className="px-4 py-3 text-center">

                      {item.reguPutra}

                    </td>


                    <td className="px-4 py-3 text-center">

                      {item.reguPutri}

                    </td>

                  </tr>

                )
              )}


              {/* ==================================
                  TOTAL
              ================================== */}

              <tr
                className="
                  bg-gray-100
                  font-bold
                  border-t-2
                "
              >

                <td
                  colSpan="2"
                  className="px-4 py-4"
                >

                  TOTAL

                </td>


                <td className="px-4 py-4 text-center">

                  {data.total.gudep}

                </td>


                <td className="px-4 py-4 text-center">

                  {data.total.putra}

                </td>


                <td className="px-4 py-4 text-center">

                  {data.total.putri}

                </td>


                <td className="px-4 py-4 text-center">

                  {data.total.reguPutra}

                </td>


                <td className="px-4 py-4 text-center">

                  {data.total.reguPutri}

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </div>


      {/* ========================================
          VALIDASI
      ======================================== */}

      <div
        className="
          bg-blue-50
          border
          border-blue-200
          rounded-xl
          p-5
        "
      >

        <p className="font-bold text-blue-800 mb-2">

          ℹ️ Informasi Data

        </p>

        <p className="text-sm text-blue-700">

          Data peserta dan regu dihitung otomatis
          berdasarkan Gudep yang terdaftar.
          Gunakan tombol <b>Refresh Data</b> untuk
          mengambil perubahan terbaru.

        </p>

      </div>


    </div>

  );

}


// ========================================
// CARD
// ========================================

function Card({
  title,
  value,
  icon,
}) {

  return (

    <div
      className="
        bg-white
        rounded-xl
        shadow
        border
        p-4
      "
    >

      <div className="text-2xl mb-2">

        {icon}

      </div>

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <p
        className="
          text-2xl
          font-bold
          text-gray-800
          mt-1
        "
      >

        {value}

      </p>

    </div>

  );

}