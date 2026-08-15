import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getLaporanAdmin,
} from "../../services/laporanService";

import StatCard from "./StatCard";

export default function Laporan() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const hasil = await getLaporanAdmin();

      setData(hasil || []);
    } catch (error) {
      console.error("GAGAL LOAD LAPORAN:", error);

      alert(
        "Gagal mengambil data laporan.\n\n" +
          error.message
      );

      setData([]);
    } finally {
      setLoading(false);
    }
  }

  // ======================================================
  // CETAK LAPORAN
  // ======================================================

  function handlePrint() {
  window.print();
}
  // ======================================================
  // DATA SD
  // ======================================================

  const dataSD = useMemo(() => {
    return data.filter(
      (item) =>
        String(item.jenjang || "")
          .trim()
          .toUpperCase() === "SD"
    );
  }, [data]);

  // ======================================================
  // DATA SMP
  // ======================================================

  const dataSMP = useMemo(() => {
    return data.filter(
      (item) =>
        String(item.jenjang || "")
          .trim()
          .toUpperCase() === "SMP"
    );
  }, [data]);

  // ======================================================
  // BELUM DITENTUKAN
  // ======================================================

  const dataBelumDitentukan = useMemo(() => {
    return data.filter((item) => {
      const jenjang = String(
        item.jenjang || ""
      )
        .trim()
        .toUpperCase();

      return (
        jenjang !== "SD" &&
        jenjang !== "SMP"
      );
    });
  }, [data]);

  // ======================================================
  // HITUNG KELOMPOK
  // ======================================================

  function hitungKelompok(dataKelompok) {
    return {
      pangkalan: dataKelompok.length,

      reguPutra: dataKelompok.reduce(
        (total, item) =>
          total +
          (Number(item.reguPutra) || 0),
        0
      ),

      reguPutri: dataKelompok.reduce(
        (total, item) =>
          total +
          (Number(item.reguPutri) || 0),
        0
      ),

      pesertaPutra: dataKelompok.reduce(
        (total, item) =>
          total +
          (Number(item.pesertaPutra) || 0),
        0
      ),

      pesertaPutri: dataKelompok.reduce(
        (total, item) =>
          total +
          (Number(item.pesertaPutri) || 0),
        0
      ),
    };
  }

  // ======================================================
  // STATISTIK KESELURUHAN
  // ======================================================

  const statistik = useMemo(() => {
    return {
      jumlahGudep: data.length,

      pembinaPutra: data.reduce(
        (total, item) =>
          total +
          (Number(item.pembinaPutra) || 0),
        0
      ),

      pembinaPutri: data.reduce(
        (total, item) =>
          total +
          (Number(item.pembinaPutri) || 0),
        0
      ),

      pesertaPutra: data.reduce(
        (total, item) =>
          total +
          (Number(item.pesertaPutra) || 0),
        0
      ),

      pesertaPutri: data.reduce(
        (total, item) =>
          total +
          (Number(item.pesertaPutri) || 0),
        0
      ),

      reguPutra: data.reduce(
        (total, item) =>
          total +
          (Number(item.reguPutra) || 0),
        0
      ),

      reguPutri: data.reduce(
        (total, item) =>
          total +
          (Number(item.reguPutri) || 0),
        0
      ),
    };
  }, [data]);

  // ======================================================
  // STATISTIK SD
  // ======================================================

  const statistikSD = useMemo(
    () => hitungKelompok(dataSD),
    [dataSD]
  );

  // ======================================================
  // STATISTIK SMP
  // ======================================================

  const statistikSMP = useMemo(
    () => hitungKelompok(dataSMP),
    [dataSMP]
  );

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div
            className="
              w-12
              h-12
              border-4
              border-green-200
              border-t-green-700
              rounded-full
              animate-spin
              mx-auto
              mb-4
            "
          />

          <p className="text-gray-500 font-medium">
            Memuat laporan Jambore...
          </p>
        </div>
      </div>
    );
  }

  // ======================================================
  // TAMPILAN
  // ======================================================

  return (
     <div className="laporan-page space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
          print-header
        "
      >
        <div>
          <h1
            className="
              text-2xl
              sm:text-3xl
              font-bold
              text-green-700
            "
          >
            📊 Laporan Jambore
          </h1>

          <p
            className="
              text-gray-500
              text-sm
              sm:text-base
              mt-1
            "
          >
            Rekapitulasi data peserta Jambore Ranting 2026
          </p>
        </div>

        {/* TOMBOL CETAK */}

        <button
  type="button"
  onClick={handlePrint}
  className="
    no-print
    bg-green-700
    hover:bg-green-800
    text-white
    px-4
    py-2
    rounded-lg
    font-semibold
  "
>
  🖨️ Cetak Laporan
</button>
      </div>

      {/* ==================================================
          STATISTIK UTAMA
      ================================================== */}

      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          gap-3
          sm:gap-5
          md:gap-6
        "
      >
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

        <StatCard
          icon="🏕️"
          title="Jumlah Regu"
          value={
            statistik.reguPutra +
            statistik.reguPutri
          }
        />
      </div>

      {/* ==================================================
          REKAP TINGKAT PENDIDIKAN
      ================================================== */}

      <div>
        <div className="mb-4">
          <h2
            className="
              text-xl
              sm:text-2xl
              font-bold
              text-green-700
            "
          >
            🏫 Rekapitulasi Berdasarkan Tingkat Pendidikan
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Data dikelompokkan berdasarkan jenjang yang
            ditentukan oleh Admin.
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-5
          "
        >

          {/* ==================================================
              SD
          ================================================== */}

          <div
            className="
              bg-white
              rounded-2xl
              shadow
              overflow-hidden
              border
              border-green-200
            "
          >
            <div
              className="
                bg-green-700
                text-white
                p-5
              "
            >
              <h3 className="text-xl font-bold">
                🏫 SD / SDIT / MI
              </h3>

              <p className="text-green-100 text-sm mt-1">
                Tingkat Sekolah Dasar
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-3
                p-5
              "
            >
              <div
                className="
                  bg-green-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Jumlah Pangkalan
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-green-700
                    mt-1
                  "
                >
                  {statistikSD.pangkalan}
                </p>
              </div>

              <div
                className="
                  bg-green-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Regu Putra
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-green-700
                    mt-1
                  "
                >
                  {statistikSD.reguPutra}
                </p>
              </div>

              <div
                className="
                  bg-pink-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Regu Putri
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-pink-600
                    mt-1
                  "
                >
                  {statistikSD.reguPutri}
                </p>
              </div>

              <div
                className="
                  bg-blue-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Peserta Putra
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-blue-700
                    mt-1
                  "
                >
                  {statistikSD.pesertaPutra}
                </p>
              </div>

              <div
                className="
                  bg-purple-50
                  rounded-xl
                  p-4
                  text-center
                  col-span-2
                "
              >
                <p className="text-xs text-gray-500">
                  Peserta Putri
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-purple-700
                    mt-1
                  "
                >
                  {statistikSD.pesertaPutri}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              SMP
          ================================================== */}

          <div
            className="
              bg-white
              rounded-2xl
              shadow
              overflow-hidden
              border
              border-purple-200
            "
          >
            <div
              className="
                bg-purple-700
                text-white
                p-5
              "
            >
              <h3 className="text-xl font-bold">
                🏫 SMP / SMPIT / MTs
              </h3>

              <p className="text-purple-100 text-sm mt-1">
                Tingkat Sekolah Menengah Pertama
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-2
                gap-3
                p-5
              "
            >
              <div
                className="
                  bg-purple-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Jumlah Pangkalan
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-purple-700
                    mt-1
                  "
                >
                  {statistikSMP.pangkalan}
                </p>
              </div>

              <div
                className="
                  bg-green-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Regu Putra
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-green-700
                    mt-1
                  "
                >
                  {statistikSMP.reguPutra}
                </p>
              </div>

              <div
                className="
                  bg-pink-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Regu Putri
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-pink-600
                    mt-1
                  "
                >
                  {statistikSMP.reguPutri}
                </p>
              </div>

              <div
                className="
                  bg-blue-50
                  rounded-xl
                  p-4
                  text-center
                "
              >
                <p className="text-xs text-gray-500">
                  Peserta Putra
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-blue-700
                    mt-1
                  "
                >
                  {statistikSMP.pesertaPutra}
                </p>
              </div>

              <div
                className="
                  bg-purple-50
                  rounded-xl
                  p-4
                  text-center
                  col-span-2
                "
              >
                <p className="text-xs text-gray-500">
                  Peserta Putri
                </p>

                <p
                  className="
                    text-3xl
                    font-extrabold
                    text-purple-700
                    mt-1
                  "
                >
                  {statistikSMP.pesertaPutri}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================
          BELUM DITENTUKAN
      ================================================== */}

      {dataBelumDitentukan.length > 0 && (
        <div
          className="
            bg-yellow-50
            border
            border-yellow-300
            rounded-2xl
            p-5
          "
        >
          <h3 className="font-bold text-yellow-800">
            ⚠️ Pangkalan Belum Ditentukan Jenjang
          </h3>

          <p className="text-sm text-yellow-700 mt-1">
            Masih ada {dataBelumDitentukan.length} pangkalan
            yang belum memiliki jenjang SD atau SMP.
          </p>

          <div
            className="
              mt-3
              flex
              flex-wrap
              gap-2
            "
          >
            {dataBelumDitentukan.map((item) => (
              <span
                key={item.id}
                className="
                  bg-yellow-100
                  text-yellow-800
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-semibold
                "
              >
                {item.nama_gudep || "-"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================
          TABEL REKAPITULASI GUDEP
      ================================================== */}

      <div
        className="
          bg-white
          rounded-xl
          shadow
          p-4
          sm:p-6
          print-section
        "
      >
        <div className="mb-5">
          <h2
            className="
              text-lg
              sm:text-xl
              font-bold
              text-green-700
            "
          >
            📋 Rekapitulasi Setiap Gudep
          </h2>

          <p
            className="
              text-xs
              sm:text-sm
              text-gray-500
              mt-1
            "
          >
            Jumlah pembina, peserta, dan regu dari setiap Gudep.
          </p>
        </div>

        <div
          className="
            w-full
            overflow-x-auto
            rounded-lg
            border
          "
        >
          <table className="
  laporan-print-table
  min-w-[1100px]
  w-full
  border-collapse
  text-sm
">
            <thead
              className="
                bg-green-700
                text-white
              "
            >
              <tr>
                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  No
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-left
                  "
                >
                  Nama Gudep
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  Jenjang
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  Pembina Putra
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  Pembina Putri
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  Peserta Putra
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  Peserta Putri
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  Regu Putra
                </th>

                <th
                  className="
                    border
                    border-green-600
                    p-3
                    text-center
                  "
                >
                  Regu Putri
                </th>

                <th className="
  kolom-aksi
  border
  border-green-600
  p-3
  text-center
">
  Aksi
</th>
              </tr>
            </thead>

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
                    className="hover:bg-gray-50"
                  >
                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {index + 1}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        font-medium
                        whitespace-nowrap
                      "
                    >
                      {item.nama_gudep || "-"}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {item.jenjang === "SD" ? (
                        <span
                          className="
                            inline-block
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-bold
                          "
                        >
                          SD
                        </span>
                      ) : item.jenjang === "SMP" ? (
                        <span
                          className="
                            inline-block
                            bg-purple-100
                            text-purple-700
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-bold
                          "
                        >
                          SMP
                        </span>
                      ) : (
                        <span
                          className="
                            inline-block
                            bg-yellow-100
                            text-yellow-700
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-bold
                          "
                        >
                          Belum Ditentukan
                        </span>
                      )}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {item.pembinaPutra || 0}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {item.pembinaPutri || 0}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {item.pesertaPutra || 0}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {item.pesertaPutri || 0}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {item.reguPutra || 0}
                    </td>

                    <td
                      className="
                        border
                        p-3
                        text-center
                      "
                    >
                      {item.reguPutri || 0}
                    </td>

                    <td className="
  kolom-aksi
  border
  p-3
  text-center
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

        {data.length > 0 && (
          <div
            className="
              mt-3
              text-xs
              text-gray-400
              sm:hidden
              text-center
            "
          >
            ← Geser tabel ke kiri/kanan untuk melihat semua data →
          </div>
        )}
      </div>

    </div>
  );
}