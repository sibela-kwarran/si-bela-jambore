import { useState, useEffect } from "react";

import {
  getSemuaPembayaran,
  updatePembayaran,
} from "../../services/pembayaranService";

import {
  getReguByGudep,
} from "../../services/reguService";

export default function VerifikasiPembayaran() {

  const [dataPembayaran, setDataPembayaran] =
    useState([]);

  const [dataRegu, setDataRegu] =
    useState({});

  const [cari, setCari] =
    useState("");

  const [selected, setSelected] =
    useState(null);


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      const data =
        await getSemuaPembayaran();

      setDataPembayaran(
        data || []
      );


      // =================================================
      // AMBIL DATA REGU MASING-MASING GUDEP
      // =================================================

      const hasilRegu = {};

      await Promise.all(

        (data || []).map(
          async (item) => {

            const gudepId =
              item.gudep_id ||
              item.profil_gudep?.id;

            if (!gudepId) return;

            try {

              const regu =
                await getReguByGudep(
                  gudepId
                );

              hasilRegu[gudepId] =
                regu || [];

            } catch (err) {

              console.error(
                "Gagal mengambil regu Gudep:",
                gudepId,
                err
              );

              hasilRegu[gudepId] =
                [];

            }

          }
        )

      );


      setDataRegu(
        hasilRegu
      );


      console.log(
        "DATA PEMBAYARAN ADMIN:",
        data
      );

      console.log(
        "DATA REGU ADMIN:",
        hasilRegu
      );


    } catch (err) {

      console.error(
        "Gagal mengambil data pembayaran:",
        err
      );

      alert(
        "Gagal mengambil data pembayaran."
      );

    }

  }


  // =====================================================
  // UBAH STATUS PEMBAYARAN
  // =====================================================

  async function ubahStatus(
    statusBaru
  ) {

    if (!selected) return;


    try {

      await updatePembayaran(
        selected.id,
        {
          status: statusBaru,
        }
      );


      setSelected(
        prev => ({
          ...prev,
          status:
            statusBaru,
        })
      );


      setDataPembayaran(
        prev =>
          prev.map(
            item =>
              item.id === selected.id
                ? {
                    ...item,
                    status:
                      statusBaru,
                  }
                : item
          )
      );


      alert(
        "Status pembayaran berhasil diperbarui."
      );


    } catch (err) {

      console.error(
        "Gagal update pembayaran:",
        err
      );

      alert(
        "Gagal mengubah status pembayaran."
      );

    }

  }


  // =====================================================
  // UBAH TANGGAL PEMBAYARAN
  // =====================================================

  async function ubahTanggalPembayaran() {

    if (!selected) return;


    const tanggal =
      window.prompt(
        "Masukkan tanggal pembayaran sesuai kwitansi (format YYYY-MM-DD):",
        selected.tanggalPembayaran || ""
      );


    if (tanggal === null) {
      return;
    }


    if (!tanggal) {

      alert(
        "Tanggal pembayaran harus diisi."
      );

      return;

    }


    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        tanggal
      )
    ) {

      alert(
        "Format tanggal salah.\nGunakan format YYYY-MM-DD.\nContoh: 2026-08-08"
      );

      return;

    }


    try {

      await updatePembayaran(
        selected.id,
        {
          tanggal_pembayaran:
            tanggal,
        }
      );


      setSelected(
        prev => ({
          ...prev,
          tanggalPembayaran:
            tanggal,
        })
      );


      setDataPembayaran(
        prev =>
          prev.map(
            item =>
              item.id === selected.id
                ? {
                    ...item,
                    tanggal_pembayaran:
                      tanggal,
                  }
                : item
          )
      );


      alert(
        "Tanggal pembayaran berhasil disimpan."
      );


      await loadData();


    } catch (err) {

      console.error(
        "GAGAL UPDATE TANGGAL:",
        err
      );

      alert(
        "Gagal menyimpan tanggal pembayaran."
      );

    }

  }


  // =====================================================
  // UBAH NOMOR KAPLING
  // =====================================================

  async function ubahNomorKapling(
    item
  ) {

    const nomorLama =
      item.nomor_kapling || "";


    const nomor =
      window.prompt(
        "Masukkan Nomor Kapling untuk Gudep ini.\n\nNomor kapling diisi berdasarkan urutan tanggal pembayaran.",
        nomorLama
      );


    if (nomor === null) {
      return;
    }


    const nomorBersih =
      String(nomor).trim();


    // ================================================
    // KOSONGKAN NOMOR KAPLING
    // ================================================

    if (!nomorBersih) {

      try {

        await updatePembayaran(
          item.id,
          {
            nomor_kapling:
              null,
          }
        );


        setDataPembayaran(
          prev =>
            prev.map(
              data =>
                data.id === item.id
                  ? {
                      ...data,
                      nomor_kapling:
                        null,
                    }
                  : data
            )
        );


        if (
          selected &&
          selected.id === item.id
        ) {

          setSelected(
            prev => ({
              ...prev,
              nomor_kapling:
                null,
            })
          );

        }


        alert(
          "Nomor kapling dikosongkan."
        );

        return;

      } catch (err) {

        console.error(
          "GAGAL MENGHAPUS NOMOR KAPLING:",
          err
        );

        alert(
          "Gagal menghapus nomor kapling."
        );

        return;

      }

    }


    // ================================================
    // VALIDASI NOMOR 01 - 90
    // ================================================

    const angka =
      Number(nomorBersih);


    if (
      !Number.isInteger(angka) ||
      angka < 1 ||
      angka > 90
    ) {

      alert(
        "Nomor kapling harus berupa angka 01 sampai 90."
      );

      return;

    }


    const nomorFinal =
      String(angka).padStart(
        2,
        "0"
      );


    // ================================================
    // SIMPAN
    // ================================================

    try {

      await updatePembayaran(
        item.id,
        {
          nomor_kapling:
            nomorFinal,
        }
      );


      setDataPembayaran(
        prev =>
          prev.map(
            data =>
              data.id === item.id
                ? {
                    ...data,
                    nomor_kapling:
                      nomorFinal,
                  }
                : data
          )
      );


      if (
        selected &&
        selected.id === item.id
      ) {

        setSelected(
          prev => ({
            ...prev,
            nomor_kapling:
              nomorFinal,
          })
        );

      }


      alert(
        `Nomor Kapling ${nomorFinal} berhasil disimpan.`
      );


    } catch (err) {

      console.error(
        "GAGAL UPDATE NOMOR KAPLING:",
        err
      );

      alert(
        "Gagal menyimpan nomor kapling."
      );

    }

  }


  // =====================================================
  // BENTUK DATA TABEL
  // =====================================================

  const data =
    dataPembayaran.map(
      item => {

        const gudepId =
          item.gudep_id ||
          item.profil_gudep?.id;


        const reguGudep =
          dataRegu[gudepId] ||
          [];


        const jumlahPeserta =
          reguGudep.reduce(
            (total, regu) =>
              total +
              Number(
                regu.jumlah || 0
              ),
            0
          );


        return {

          id: item.id,

          gudepId: gudepId,

          gudep:
            item.profil_gudep
              ?.nama_pangkalan ||
            "-",

          ketua:
            item.profil_gudep
              ?.nama_mabigus ||
            "-",

          peserta:
            jumlahPeserta,

          total:
            Number(
              item.nominal || 0
            ),

          status:
            item.status ||
            "Belum Bayar",

          bukti:
            item.bukti || null,

          tanggalPembayaran:
            item.tanggal_pembayaran ||
            null,

          tanggalUpload:
            item.tanggal ||
            item.created_at ||
            null,

          nomor_kapling:
            item.nomor_kapling ||
            null,

        };

      }
    );


  // =====================================================
  // URUTKAN BERDASARKAN TANGGAL PEMBAYARAN
  // =====================================================

  data.sort(
    (a, b) => {

      if (
        !a.tanggalPembayaran &&
        !b.tanggalPembayaran
      ) {
        return 0;
      }


      if (!a.tanggalPembayaran) {
        return 1;
      }


      if (!b.tanggalPembayaran) {
        return -1;
      }


      return (
        new Date(
          a.tanggalPembayaran
        ).getTime() -
        new Date(
          b.tanggalPembayaran
        ).getTime()
      );

    }
  );


  // =====================================================
  // FILTER PENCARIAN
  // =====================================================

  const hasil =
    data.filter(
      item =>
        item.gudep
          .toLowerCase()
          .includes(
            cari.toLowerCase()
          )
    );


  // =====================================================
  // TAMPILAN
  // =====================================================

  return (

    <div className="
      space-y-4
      sm:space-y-6
    ">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:justify-between
        sm:items-center
        gap-3
      ">

        <div>

          <h1 className="
            text-2xl
            sm:text-3xl
            font-bold
            text-amber-700
          ">

            Verifikasi Pembayaran

          </h1>

          <p className="
            text-xs
            sm:text-sm
            text-gray-500
            mt-1
          ">

            Pemeriksaan pembayaran Gudep.

          </p>

        </div>


        <input
          type="text"
          placeholder="🔎 Cari Gudep..."
          value={cari}
          onChange={
            e =>
              setCari(
                e.target.value
              )
          }
          className="
            border
            rounded-lg
            px-3
            py-2
            text-sm
            w-full
            sm:w-72
            focus:outline-none
            focus:ring-2
            focus:ring-amber-500
          "
        />

      </div>


      {/* =================================================
          TABEL
      ================================================= */}

      <div className="
        bg-white
        rounded-xl
        shadow
        overflow-hidden
      ">

        {/* PETUNJUK GESER DI HP */}

        <div className="
          sm:hidden
          bg-amber-50
          border-b
          border-amber-100
          px-3
          py-2
          text-xs
          text-amber-700
          text-center
        ">

          👉 Geser tabel ke kanan untuk melihat kolom Aksi

        </div>


        <div className="
          overflow-x-auto
          w-full
          overscroll-x-contain
        ">

          <table className="
            w-full
            min-w-[850px]
            text-xs
            sm:text-sm
          ">

            <thead className="
              bg-amber-700
              text-white
            ">

              <tr>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                  text-center
                ">
                  Prioritas
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                  text-left
                ">
                  Gudep
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                ">
                  Mabigus
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                ">
                  Tgl. Bayar
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                ">
                  No. Kapling
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                ">
                  Peserta
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                ">
                  Total
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                ">
                  Status
                </th>

                <th className="
                  p-2
                  sm:p-3
                  whitespace-nowrap
                  sticky
                  right-0
                  bg-amber-700
                ">
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>

              {hasil.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="
                      text-center
                      p-6
                      text-gray-500
                    "
                  >

                    Belum ada data pembayaran

                  </td>

                </tr>

              ) : (

                hasil.map(
                  (item, index) => (

                    <tr
                      key={item.id}
                      className="
                        border-b
                        hover:bg-gray-50
                      "
                    >

                      {/* PRIORITAS */}

                      <td className="
                        p-2
                        sm:p-3
                        text-center
                      ">

                        <span className="
                          font-bold
                          text-base
                          sm:text-lg
                        ">

                          {index + 1}

                        </span>

                      </td>


                      {/* GUDEP */}

                      <td className="
                        p-2
                        sm:p-3
                        max-w-[180px]
                      ">

                        <span className="
                          font-semibold
                          text-gray-800
                          break-words
                        ">

                          {item.gudep}

                        </span>

                      </td>


                      {/* MABIGUS */}

                      <td className="
                        p-2
                        sm:p-3
                        max-w-[150px]
                      ">

                        <span className="
                          break-words
                        ">

                          {item.ketua}

                        </span>

                      </td>


                      {/* TANGGAL PEMBAYARAN */}

                      <td className="
                        p-2
                        sm:p-3
                        whitespace-nowrap
                      ">

                        {item.tanggalPembayaran

                          ? new Date(
                              item.tanggalPembayaran +
                              "T00:00:00"
                            ).toLocaleDateString(
                              "id-ID",
                              {
                                day:
                                  "2-digit",
                                month:
                                  "short",
                                year:
                                  "numeric",
                              }
                            )

                          : (

                            <span className="
                              text-red-500
                              font-semibold
                            ">

                              Belum diisi

                            </span>

                          )}

                      </td>


                      {/* NOMOR KAPLING */}

                      <td className="
                        p-2
                        sm:p-3
                        text-center
                      ">

                        {item.nomor_kapling ? (

                          <button
                            onClick={() =>
                              ubahNomorKapling(
                                item
                              )
                            }
                            className="
                              bg-blue-100
                              text-blue-700
                              hover:bg-blue-200
                              px-3
                              sm:px-4
                              py-1.5
                              sm:py-2
                              rounded-lg
                              font-bold
                              min-w-[55px]
                            "
                            title="Klik untuk mengubah nomor kapling"
                          >

                            {item.nomor_kapling}

                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              ubahNomorKapling(
                                item
                              )
                            }
                            className="
                              bg-yellow-100
                              text-yellow-700
                              hover:bg-yellow-200
                              px-2
                              sm:px-3
                              py-1.5
                              sm:py-2
                              rounded-lg
                              font-semibold
                            "
                          >

                            + Isi

                          </button>

                        )}

                      </td>


                      {/* PESERTA */}

                      <td className="
                        p-2
                        sm:p-3
                        text-center
                        font-semibold
                      ">

                        {item.peserta}

                      </td>


                      {/* TOTAL */}

                      <td className="
                        p-2
                        sm:p-3
                        whitespace-nowrap
                        font-semibold
                      ">

                        Rp{" "}

                        {Number(
                          item.total
                        ).toLocaleString(
                          "id-ID"
                        )}

                      </td>


                      {/* STATUS */}

                      <td className="
                        p-2
                        sm:p-3
                        whitespace-nowrap
                      ">

                        <StatusBadge
                          status={
                            selected &&
                            selected.id ===
                              item.id
                              ? selected.status
                              : item.status
                          }
                        />

                      </td>


                      {/* AKSI */}

                      <td className="
                        p-2
                        sm:p-3
                        text-center
                        sticky
                        right-0
                        bg-white
                        border-l
                        border-gray-200
                      ">

                        <button
                          onClick={() =>
                            setSelected(
                              item
                            )
                          }
                          className="
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            px-3
                            sm:px-4
                            py-1.5
                            sm:py-2
                            rounded-lg
                            font-semibold
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


      {/* =================================================
          DETAIL PEMBAYARAN
      ================================================= */}

      {selected && (

        <div className="
          bg-white
          rounded-xl
          shadow
          p-4
          sm:p-6
        ">

          <h2 className="
            text-xl
            sm:text-2xl
            font-bold
            text-amber-700
            mb-4
            sm:mb-5
          ">

            Detail Pembayaran

          </h2>


          <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-3
            sm:gap-5
          ">

            <Info
              title="Gudep"
              value={
                selected.gudep
              }
            />


            <Info
              title="Mabigus"
              value={
                selected.ketua
              }
            />


            <Info
              title="Jumlah Peserta"
              value={
                selected.peserta
              }
            />


            <Info
              title="Tanggal Pembayaran"
              value={

                selected.tanggalPembayaran

                  ? new Date(
                      selected.tanggalPembayaran +
                      "T00:00:00"
                    ).toLocaleDateString(
                      "id-ID",
                      {
                        day:
                          "2-digit",
                        month:
                          "long",
                        year:
                          "numeric",
                      }
                    )

                  : "Belum diisi"

              }
            />


            {/* NOMOR KAPLING DETAIL */}

            <div className="
              border
              border-blue-200
              rounded-lg
              p-3
              sm:p-4
              bg-blue-50
            ">

              <p className="
                text-gray-500
                text-sm
                mb-1
              ">

                Nomor Kapling

              </p>


              <div className="
                flex
                items-center
                justify-between
                gap-2
              ">

                <h2 className="
                  font-bold
                  text-xl
                  sm:text-2xl
                  text-blue-700
                ">

                  {selected.nomor_kapling ||
                    "Belum diisi"}

                </h2>


                <button
                  onClick={() =>
                    ubahNomorKapling(
                      selected
                    )
                  }
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    px-3
                    sm:px-4
                    py-2
                    rounded-lg
                    text-sm
                    font-semibold
                  "
                >

                  📍{" "}
                  {selected.nomor_kapling
                    ? "Edit"
                    : "Isi"}

                </button>

              </div>

            </div>


            {/* TANGGAL EDIT */}

            <div className="
              flex
              items-stretch
            ">

              <button
                onClick={
                  ubahTanggalPembayaran
                }
                className="
                  bg-amber-600
                  hover:bg-amber-700
                  text-white
                  px-4
                  py-3
                  rounded-lg
                  w-full
                  text-sm
                  font-semibold
                "
              >

                📅{" "}

                {selected.tanggalPembayaran
                  ? "Edit Tanggal Pembayaran"
                  : "Isi Tanggal Pembayaran"}

              </button>

            </div>


            <Info
              title="Total Bayar"
              value={
                `Rp ${Number(
                  selected.total || 0
                ).toLocaleString(
                  "id-ID"
                )}`
              }
            />


            <Info
              title="Status"
              value={
                selected.status
              }
            />

          </div>


         {/* =================================================
    BUKTI TRANSFER
================================================= */}

{selected.bukti && (

  <div className="
    mt-5
    sm:mt-6
  ">

    <h3 className="
      font-bold
      mb-3
      text-base
      sm:text-lg
    ">

      Bukti Transfer

    </h3>


    {/*
      ================================================
      CEK APAKAH FILE ADALAH PDF
      ================================================
    */}

    {(
      selected.bukti
        .toLowerCase()
        .startsWith("data:application/pdf")

      ||

      selected.bukti
        .toLowerCase()
        .includes(".pdf")
    )

      ? (

        <div className="
          space-y-3
        ">

          {/* LABEL PDF */}

          <div className="
            bg-blue-50
            border
            border-blue-200
            rounded-lg
            p-3
            text-blue-800
            font-semibold
          ">

            📄 Bukti Pembayaran PDF

          </div>


          {/* ========================================
              TAMPILKAN PDF LANGSUNG
          ======================================== */}

          <div className="
            w-full
            border
            rounded-lg
            overflow-hidden
            bg-gray-100
          ">

            <iframe
              src={selected.bukti}
              title="Bukti Pembayaran"
              className="
                w-full
                h-[700px]
                sm:h-[800px]
                border-0
              "
            />

          </div>


          {/* ========================================
              TOMBOL BUKA PDF
          ======================================== */}

          <a
            href={selected.bukti}
            target="_blank"
            rel="noreferrer"
            className="
              inline-block
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-4
              py-2
              rounded-lg
              text-sm
              font-semibold
            "
          >

            📄 Buka PDF di Tab Baru

          </a>

        </div>

      )

      : (

        /* ==========================================
           JIKA GAMBAR
        ========================================== */

        <div className="
          space-y-3
        ">

          <div className="
            bg-green-50
            border
            border-green-200
            rounded-lg
            p-3
            text-green-800
            font-semibold
          ">

            🖼 Bukti Pembayaran

          </div>


          <img
            src={selected.bukti}
            alt="Bukti Transfer"
            className="
              w-full
              max-w-2xl
              rounded-lg
              border
              shadow
            "
          />

        </div>

      )}

  </div>

)}


          {/* =================================================
              TOMBOL VERIFIKASI
          ================================================= */}

          <div className="
            flex
            flex-col
            sm:flex-row
            gap-3
            mt-5
            sm:mt-6
          ">

            <button
              onClick={() =>
                ubahStatus(
                  "Lunas"
                )
              }
              className="
                bg-green-700
                hover:bg-green-800
                text-white
                px-5
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
                px-5
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


// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({
  status
}) {

  if (
    status === "Lunas"
  ) {

    return (

      <span className="
        inline-flex
        bg-green-100
        text-green-700
        px-2
        sm:px-3
        py-1
        rounded-full
        font-semibold
        text-xs
        sm:text-sm
      ">

        Lunas

      </span>

    );

  }


  if (
    status === "Ditolak"
  ) {

    return (

      <span className="
        inline-flex
        bg-red-100
        text-red-700
        px-2
        sm:px-3
        py-1
        rounded-full
        font-semibold
        text-xs
        sm:text-sm
      ">

        Ditolak

      </span>

    );

  }


  return (

    <span className="
      inline-flex
      bg-yellow-100
      text-yellow-700
      px-2
      sm:px-3
      py-1
      rounded-full
      font-semibold
      text-xs
      sm:text-sm
    ">

      Menunggu

    </span>

  );

}


// =====================================================
// INFO
// =====================================================

function Info({
  title,
  value
}) {

  return (

    <div className="
      border
      rounded-lg
      p-3
      sm:p-4
    ">

      <p className="
        text-gray-500
        text-xs
        sm:text-sm
      ">

        {title}

      </p>


      <h2 className="
        font-bold
        text-base
        sm:text-xl
        break-words
      ">

        {value}

      </h2>

    </div>

  );

}