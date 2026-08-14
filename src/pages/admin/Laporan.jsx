import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getLaporanAdmin
} from "../../services/laporanService";

import StatCard from "./StatCard";


export default function Laporan() {

  const [data, setData] = useState([]);


  // ======================================================
  // STATISTIK
  // ======================================================

  const statistik = {

    jumlahGudep:
      data.length,


    pembinaPutra:
      data.reduce(
        (total, item) =>
          total + (Number(item.pembinaPutra) || 0),
        0
      ),


    pembinaPutri:
      data.reduce(
        (total, item) =>
          total + (Number(item.pembinaPutri) || 0),
        0
      ),


    pesertaPutra:
      data.reduce(
        (total, item) =>
          total + (Number(item.pesertaPutra) || 0),
        0
      ),


    pesertaPutri:
      data.reduce(
        (total, item) =>
          total + (Number(item.pesertaPutri) || 0),
        0
      ),


    jumlahReguPutra:
      data.reduce(
        (total, item) =>
          total + (Number(item.jumlahReguPutra) || 0),
        0
      ),


    jumlahReguPutri:
      data.reduce(
        (total, item) =>
          total + (Number(item.jumlahReguPutri) || 0),
        0
      ),


    jumlahRegu:
      data.reduce(
        (total, item) =>
          total + (Number(item.jumlahRegu) || 0),
        0
      )

  };


  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      const hasil =
        await getLaporanAdmin();

      setData(hasil || []);

    } catch (error) {

      console.error(
        "GAGAL LOAD LAPORAN:",
        error
      );

      setData([]);

    }

  }


  // ======================================================
  // TAMPILAN
  // ======================================================

  return (

    <div className="space-y-5 sm:space-y-6">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div>

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-green-700
        ">

          📊 Laporan Jambore

        </h1>

        <p className="
          text-gray-500
          text-sm
          sm:text-base
          mt-1
        ">

          Rekapitulasi data peserta Jambore Ranting 2026

        </p>

      </div>



      {/* ==================================================
          STATISTIK
      ================================================== */}

      <div className="
        grid
        grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        gap-3
        sm:gap-5
        md:gap-6
      ">


        <StatCard
          icon="🏫"
          title="Jumlah Gudep"
          value={statistik.jumlahGudep}
        />


        <StatCard
          icon="👨"
          title="Pembina Putra"
          value={statistik.pembinaPutra}
        />


        <StatCard
          icon="👩"
          title="Pembina Putri"
          value={statistik.pembinaPutri}
        />


        <StatCard
          icon="👦"
          title="Peserta Putra"
          value={statistik.pesertaPutra}
        />


        <StatCard
          icon="👧"
          title="Peserta Putri"
          value={statistik.pesertaPutri}
        />


        {/* REGU PUTRA */}

        <StatCard
          icon="🏕️"
          title="Regu Putra"
          value={statistik.jumlahReguPutra}
        />


        {/* REGU PUTRI */}

        <StatCard
          icon="🌸"
          title="Regu Putri"
          value={statistik.jumlahReguPutri}
        />


        {/* TOTAL REGU */}

        <StatCard
          icon="🏕️"
          title="Total Regu"
          value={statistik.jumlahRegu}
        />

      </div>



      {/* ==================================================
          TABEL REKAPITULASI GUDEP
      ================================================== */}

      <div className="
        bg-white
        rounded-xl
        shadow
        p-4
        sm:p-6
      ">


        {/* JUDUL TABEL */}

        <div className="
          mb-4
          sm:mb-5
        ">

          <h2 className="
            text-lg
            sm:text-xl
            font-bold
            text-green-700
          ">

            📋 Rekapitulasi Setiap Gudep

          </h2>

          <p className="
            text-xs
            sm:text-sm
            text-gray-500
            mt-1
          ">

            Jumlah pembina, peserta, serta regu putra dan putri dari setiap Gudep.

          </p>

        </div>



        {/* ==================================================
            TABLE WRAPPER
        ================================================== */}

        <div className="
          w-full
          overflow-x-auto
          rounded-lg
          border
        ">


          <table className="
            min-w-[1050px]
            w-full
            border-collapse
            text-sm
          ">


            {/* HEADER */}

            <thead className="
              bg-green-700
              text-white
            ">

              <tr>

                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  No
                </th>


                <th className="
                  border
                  border-green-600
                  p-3
                  text-left
                  whitespace-nowrap
                ">
                  Nama Gudep
                </th>


                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Pembina Putra
                </th>


                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Pembina Putri
                </th>


                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Peserta Putra
                </th>


                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Peserta Putri
                </th>


                {/* REGU PUTRA */}

                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Regu Putra
                </th>


                {/* REGU PUTRI */}

                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Regu Putri
                </th>


                {/* TOTAL REGU */}

                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Total Regu
                </th>


                <th className="
                  border
                  border-green-600
                  p-3
                  text-center
                  whitespace-nowrap
                ">
                  Aksi
                </th>

              </tr>

            </thead>



            {/* BODY */}

            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="10"
                    className="
                      border
                      p-6
                      text-center
                      text-gray-500
                    "
                  >

                    Belum ada data laporan Gudep.

                  </td>

                </tr>

              ) : (

                data.map((item, index) => (

                  <tr
                    key={
                      item.id ||
                      item.gudep_id ||
                      index
                    }
                    className="
                      hover:bg-gray-50
                    "
                  >


                    {/* NO */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                    ">

                      {index + 1}

                    </td>



                    {/* NAMA GUDEP */}

                    <td className="
                      border
                      p-3
                      font-medium
                      whitespace-nowrap
                    ">

                      {item.nama_gudep || "-"}

                    </td>



                    {/* PEMBINA PUTRA */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                    ">

                      {item.pembinaPutra || 0}

                    </td>



                    {/* PEMBINA PUTRI */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                    ">

                      {item.pembinaPutri || 0}

                    </td>



                    {/* PESERTA PUTRA */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                    ">

                      {item.pesertaPutra || 0}

                    </td>



                    {/* PESERTA PUTRI */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                    ">

                      {item.pesertaPutri || 0}

                    </td>



                    {/* REGU PUTRA */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                      font-bold
                      text-green-700
                    ">

                      {item.jumlahReguPutra || 0}

                    </td>



                    {/* REGU PUTRI */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                      font-bold
                      text-pink-600
                    ">

                      {item.jumlahReguPutri || 0}

                    </td>



                    {/* TOTAL REGU */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                      font-bold
                    ">

                      {item.jumlahRegu || 0}

                    </td>



                    {/* AKSI */}

                    <td className="
                      border
                      p-3
                      text-center
                      whitespace-nowrap
                    ">

                      <Link
                        to={`/admin/detail-laporan/${item.id}`}
                        className="
                          inline-flex
                          items-center
                          justify-center
                          gap-1
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          px-3
                          py-2
                          rounded-lg
                          transition
                          text-xs
                          sm:text-sm
                          font-medium
                        "
                      >

                        👁️ Lihat

                      </Link>

                    </td>


                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>



        {/* PETUNJUK HP */}

        {data.length > 0 && (

          <div className="
            mt-3
            text-xs
            text-gray-400
            sm:hidden
            text-center
          ">

            ← Geser tabel ke kiri/kanan untuk melihat semua data →

          </div>

        )}

      </div>

    </div>

  );

}