import { useState, useEffect } from "react";

import { getRegu } from "../../services/reguService";

import {
  getPembayaran,
  getBuktiPembayaran,
  savePembayaran,
  updatePembayaran,
} from "../../services/pembayaranService";

import { getProfilGudep } from "../../services/profilGudepService";


export default function Pembayaran() {

  // ==========================================
  // STATE
  // ==========================================

  const [preview, setPreview] = useState(null);

  const [dataRegu, setDataRegu] = useState([]);

  const [jumlahRegu, setJumlahRegu] = useState(0);

  const [jumlahPeserta, setJumlahPeserta] = useState(0);

  const [jumlahPesertaTambahan, setJumlahPesertaTambahan] =
    useState(0);

  const [profil, setProfil] = useState({});

  const [pembayaran, setPembayaran] = useState({
  bank: "BANK BJB",
  rekening: "0148423563101",
  atasNama: "KWARRAN CIKARANG UTARA",

  biayaPerRegu: 750000,

  bukti: null,

  status: "Belum Bayar",

  tanggal: null,

  // Tanggal yang tercantum pada kwitansi
  tanggalPembayaran: "",
});

  // ==========================================
  // KONSTANTA PEMBAYARAN
  // ==========================================

  const PESERTA_DASAR_PER_REGU = 12;

  const BIAYA_PER_REGU = 750000;

  const BIAYA_TAMBAHAN_PER_ORANG = 65000;


  // ==========================================
  // HITUNG KUOTA DASAR
  // ==========================================

  const kuotaDasar =
    jumlahRegu * PESERTA_DASAR_PER_REGU;


  // ==========================================
  // BIAYA DASAR
  // ==========================================

  const biayaDasar =
    jumlahRegu * BIAYA_PER_REGU;


  // ==========================================
  // BIAYA TAMBAHAN
  // ==========================================

  const biayaTambahan =
    jumlahPesertaTambahan *
    BIAYA_TAMBAHAN_PER_ORANG;


  // ==========================================
  // TOTAL PEMBAYARAN
  // ==========================================

  const totalBayar =
    biayaDasar + biayaTambahan;


  // ==========================================
  // LOAD SEMUA DATA
  // ==========================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    await Promise.all([
      loadProfilGudep(),
      loadDataRegu(),
      loadDataPembayaran(),
    ]);

  }


  // ==========================================
  // LOAD PROFIL GUDEP
  // ==========================================

  async function loadProfilGudep() {

    try {

      const data =
        await getProfilGudep();

      console.log(
        "PROFIL GUDEP PEMBAYARAN:",
        data
      );

      setProfil(data || {});

    } catch (err) {

      console.error(
        "ERROR LOAD PROFIL GUDEP:",
        err
      );

    }

  }


  // ==========================================
  // LOAD DATA REGU
  // ==========================================

  async function loadDataRegu() {

    try {

      const data =
        await getRegu();

      console.log(
        "DATA REGU PEMBAYARAN:",
        data
      );


      // Pastikan selalu array
      const regu =
        Array.isArray(data)
          ? data
          : [];


      setDataRegu(regu);


      // ======================================
      // JUMLAH REGU
      // ======================================

      setJumlahRegu(
        regu.length
      );


      // ======================================
      // TOTAL PESERTA AKTUAL
      // ======================================

      const totalPeserta =
        regu.reduce(
          (total, item) =>
            total +
            (Number(item.jumlah) || 0),
          0
        );


      setJumlahPeserta(
        totalPeserta
      );


      // ======================================
      // PESERTA TAMBAHAN
      //
      // DIHITUNG PER REGU
      // ======================================

      const totalTambahan =
        regu.reduce(
          (total, item) => {

            const jumlah =
              Number(item.jumlah) || 0;


            const tambahan =
              Math.max(
                0,
                jumlah -
                PESERTA_DASAR_PER_REGU
              );


            return total + tambahan;

          },
          0
        );


      setJumlahPesertaTambahan(
        totalTambahan
      );


      console.log(
        "JUMLAH REGU:",
        regu.length
      );

      console.log(
        "TOTAL PESERTA:",
        totalPeserta
      );

      console.log(
        "TOTAL PESERTA TAMBAHAN:",
        totalTambahan
      );


    } catch (err) {

      console.error(
        "ERROR LOAD DATA REGU PEMBAYARAN:",
        err
      );


      setDataRegu([]);

      setJumlahRegu(0);

      setJumlahPeserta(0);

      setJumlahPesertaTambahan(0);

    }

  }


  // ==========================================
  // LOAD DATA PEMBAYARAN
  // ==========================================

  
async function loadDataPembayaran() {

  try {

    const data =
      await getPembayaran();

    console.log(
      "DATA PEMBAYARAN:",
      data
    );

    if (!data) {

      setPembayaran(prev => ({
        ...prev,

        bukti: null,

        status: "Belum Bayar",

        tanggal: null,

        tanggalPembayaran: "",
      }));

      return;

    }

    setPembayaran(prev => ({

      ...prev,

      bank:
        data.bank ||
        "BANK BJB",

      rekening:
        data.rekening ||
        "0148423563101",

      atasNama:
        data.atas_nama ||
        "KWARRAN CIKARANG UTARA",

      biayaPerRegu:
        Number(
          data.biaya_per_regu
        ) ||
        BIAYA_PER_REGU,

      nominal:
        Number(
          data.nominal
        ) ||
        0,

      status:
        data.status ||
        "Belum Bayar",

      tanggal:
        data.tanggal ||
        null,

      tanggalPembayaran:
        data.tanggal_pembayaran ||
        "",

    }));

  } catch (err) {

    console.error(
      "ERROR LOAD PEMBAYARAN:",
      err
    );

  }

}


  // ==========================================
  // UPLOAD BUKTI PEMBAYARAN
  // ==========================================

  async function uploadBukti(e) {

  try {

    const file =
      e.target.files?.[0];


    if (!file) {

      return;

    }


    // ==========================================
    // CEK PROFIL GUDEP
    // ==========================================

    if (!profil?.id) {

      alert(
        "Data profil Gudep belum ditemukan."
      );

      e.target.value = "";

      return;

    }


    // ==========================================
    // CEK TANGGAL PEMBAYARAN
    // ==========================================

    if (
      !pembayaran.tanggalPembayaran
    ) {

      alert(
        "Silakan isi tanggal pembayaran sesuai tanggal yang tercantum pada kwitansi."
      );

      e.target.value = "";

      return;

    }


    // ==========================================
    // CEK FORMAT FILE
    // ==========================================

    const tipeDiizinkan = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];


    if (
      !tipeDiizinkan.includes(
        file.type
      )
    ) {

      alert(
        "Bukti pembayaran harus berupa PDF, JPG, JPEG, atau PNG."
      );

      e.target.value = "";

      return;

    }


    // ==========================================
    // BACA FILE
    // ==========================================

    const reader =
      new FileReader();


    reader.onload = async () => {

      try {

        // ======================================
        // DATA PEMBAYARAN
        // ======================================

        const dataBaru = {

          gudep_id:
            profil.id,

          bank:
            pembayaran.bank,

          rekening:
            pembayaran.rekening,

          atas_nama:
            pembayaran.atasNama,

          nominal:
            totalBayar,

          bukti:
            reader.result,

          status:
            "Menunggu Verifikasi",

          // ------------------------------------
          // TANGGAL UPLOAD SISTEM
          // ------------------------------------

          tanggal:
            new Date(),

          // ------------------------------------
          // TANGGAL PEMBAYARAN SESUAI KWITANSI
          // ------------------------------------

          tanggal_pembayaran:
            pembayaran.tanggalPembayaran,

        };


        console.log(
          "DATA PEMBAYARAN AKAN DISIMPAN:",
          dataBaru
        );


        // ======================================
        // CEK DATA PEMBAYARAN LAMA
        // ======================================

        const lama =
          await getPembayaran();


        if (lama) {

          await updatePembayaran(
            lama.id,
            dataBaru
          );

        } else {

          await savePembayaran(
            dataBaru
          );

        }


        // ======================================
        // UPDATE STATE
        // ======================================

        setPembayaran(
          prev => ({

            ...prev,

            nominal:
              totalBayar,

           bukti: {

  nama:
    file.name,

  tipe:
    file.type,

  file:
    null,

  tanggal:
    new Date()
      .toLocaleString(
        "id-ID"
      ),

},

            status:
              "Menunggu Verifikasi",

            tanggal:
              new Date(),

            tanggalPembayaran:
              pembayaran.tanggalPembayaran,

          })
        );


        // ======================================
        // LOAD ULANG DATA
        // ======================================

        await loadDataPembayaran();


        alert(
          "✅ Bukti pembayaran berhasil disimpan."
        );


      } catch (err) {

        console.error(
          "ERROR SIMPAN PEMBAYARAN:",
          err
        );


        alert(
          "❌ Gagal menyimpan pembayaran.\n\n" +
          (
            err?.message ||
            "Terjadi kesalahan."
          )
        );

      }

    };


    reader.onerror = () => {

      alert(
        "❌ Gagal membaca file bukti pembayaran."
      );

    };


    reader.readAsDataURL(file);


  } catch (err) {

    console.error(
      "ERROR UPLOAD BUKTI:",
      err
    );


    alert(
      "❌ Gagal membaca file."
    );

  }

}

  // ==========================================
  // HAPUS BUKTI
  // ==========================================

  function hapusBukti() {

    if (
      !window.confirm(
        "Hapus bukti transfer?"
      )
    ) {

      return;

    }


    setPembayaran(
      prev => ({

        ...prev,

        bukti: null,

        status:
          "Belum Bayar",

      })
    );


    setPreview(null);

  }


  // ==========================================
  // LIHAT BUKTI
  // ==========================================

  async function lihatBukti() {

  try {

    console.log(
      "MENGAMBIL BUKTI PEMBAYARAN..."
    );

    const data =
      await getBuktiPembayaran();

    if (!data?.bukti) {

      alert(
        "File bukti pembayaran tidak ditemukan."
      );

      return;

    }

    setPreview(
      data.bukti
    );

  } catch (err) {

    console.error(
      "ERROR AMBIL BUKTI PEMBAYARAN:",
      err
    );

    alert(
      err?.message ||
      "Gagal mengambil bukti pembayaran."
    );

  }

}


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="space-y-6">


      {/* ================================== */}
      {/* HEADER */}
      {/* ================================== */}

      <div>

        <h1 className="text-2xl sm:text-3xl font-bold text-green-700">

          Pembayaran

        </h1>

        <p className="text-gray-500">

          Upload bukti pembayaran Jambore.

        </p>

      </div>


      {/* ================================== */}
      {/* INFORMASI PEMBAYARAN */}
      {/* ================================== */}

      <div className="bg-white rounded-xl shadow p-4 sm:p-6">

        <h2 className="text-xl font-bold mb-6">

          Informasi Pembayaran

        </h2>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">


          <Info
            title="Bank"
            value={
              pembayaran.bank
            }
          />


          <Info
            title="Nomor Rekening"
            value={
              pembayaran.rekening
            }
          />


          <Info
            title="Atas Nama"
            value={
              pembayaran.atasNama
            }
          />


          <Info
            title="Jumlah Regu"
            value={`${jumlahRegu} Regu`}
          />


          <Info
            title="Jumlah Peserta"
            value={`${jumlahPeserta} Orang`}
          />


          <Info
            title="Kuota Dasar"
            value={`${kuotaDasar} Orang`}
          />


          <Info
            title="Peserta Tambahan"
            value={`${jumlahPesertaTambahan} Orang`}
          />


          <Info
            title="Biaya Dasar"
            value={`Rp ${biayaDasar.toLocaleString(
              "id-ID"
            )}`}
          />


          <Info
            title="Biaya Tambahan"
            value={`Rp ${biayaTambahan.toLocaleString(
              "id-ID"
            )}`}
          />


          <Info
            title="Total Pembayaran"
            value={`Rp ${totalBayar.toLocaleString(
              "id-ID"
            )}`}
          />

        </div>


        {/* ================================= */}
        {/* RINCIAN PER REGU */}
        {/* ================================= */}

        <div className="mt-5 sm:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-5">

          <h3 className="font-bold text-blue-800 text-base sm:text-lg mb-4">

            📋 Rincian Peserta Per Regu

          </h3>


          <div className="space-y-3">

            {dataRegu.length === 0 ? (

              <p className="text-gray-500">

                Belum ada data regu.

              </p>

            ) : (

              dataRegu.map(
                (regu, index) => {

                  const jumlah =
                    Number(
                      regu.jumlah
                    ) || 0;


                  const tambahan =
                    Math.max(
                      0,
                      jumlah -
                      PESERTA_DASAR_PER_REGU
                    );


                  return (

                    <div
  key={regu.id || index}
  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b pb-2"
>

                      <span>

                        Regu {index + 1}
                        {" - "}
                        {regu.nama}

                      </span>


                      <span className="font-semibold">

                        {jumlah} orang


                        {tambahan > 0 && (

                          <span className="text-orange-600 ml-2">

                            (+{tambahan})

                          </span>

                        )}

                      </span>

                    </div>

                  );

                }
              )

            )}

          </div>

        </div>


        {/* ================================= */}
        {/* RINCIAN PEMBAYARAN */}
        {/* ================================= */}

        <div className="mt-5 sm:mt-6 bg-green-50 border border-green-200 rounded-xl p-3 sm:p-5">

          <h3 className="font-bold text-green-800 text-lg mb-3">

            📋 Rincian Pembayaran

          </h3>


          <div className="space-y-2 text-gray-700">


            <div className="flex justify-between items-start gap-3">

              <span>
                Biaya {jumlahRegu} regu
              </span>

              <span className="font-semibold">

                Rp{" "}
                {biayaDasar.toLocaleString(
                  "id-ID"
                )}

              </span>

            </div>


            <div className="flex justify-between items-start gap-3">

              <span>
                Kuota dasar
              </span>

              <span className="font-semibold">

                {kuotaDasar} peserta

              </span>

            </div>


            <div className="flex justify-between items-start gap-3">

              <span>
                Peserta terdaftar
              </span>

              <span className="font-semibold">

                {jumlahPeserta} peserta

              </span>

            </div>


            <div className="flex justify-between items-start gap-3">

              <span>
                Peserta tambahan
              </span>

              <span className="font-semibold">

                {jumlahPesertaTambahan}
                {" × Rp65.000"}

              </span>

            </div>


            <div className="border-t border-green-200 pt-3 mt-3 flex justify-between items-center gap-3">

              <span className="font-bold text-green-800">

                TOTAL PEMBAYARAN

              </span>

              <span className="font-bold text-lg sm:text-xl text-green-800 text-right break-words">

                Rp{" "}
                {totalBayar.toLocaleString(
                  "id-ID"
                )}

              </span>

            </div>

          </div>

        </div>

      </div>


      {/* ================================== */}
      {/* UPLOAD BUKTI */}
      {/* ================================== */}

      <div className="bg-white rounded-xl shadow p-4 sm:p-6">

  <h2 className="text-lg sm:text-xl font-bold mb-5">

    Upload Bukti Transfer

  </h2>


  {/* ================================== */}
  {/* TANGGAL PEMBAYARAN */}
  {/* ================================== */}

  <div className="mb-5">

    <label className="block font-semibold text-gray-700 mb-2">

      📅 Tanggal Pembayaran Sesuai Kwitansi

    </label>


    <input
      type="date"
      value={
        pembayaran.tanggalPembayaran || ""
      }
      onChange={(e) =>
        setPembayaran(prev => ({
          ...prev,
          tanggalPembayaran:
            e.target.value,
        }))
      }
      className="border border-gray-300 rounded-lg px-4 py-2.5 w-full sm:w-auto"
    />


    <p className="text-sm text-gray-500 mt-2">

      Masukkan tanggal pembayaran yang tercantum
      pada kwitansi/bukti pembayaran,
      bukan tanggal upload berkas.

    </p>

  </div>


  {/* ================================== */}
  {/* TOMBOL UPLOAD */}
  {/* ================================== */}

  <label className="inline-block">

    <input
      type="file"
      accept=".jpg,.jpeg,.png,.pdf"
      onChange={uploadBukti}
      className="hidden"
    />


    <span className="cursor-pointer bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg inline-block text-sm sm:text-base">

      ⬆ Upload Bukti Transfer

    </span>

  </label>


        {pembayaran.bukti && (

          <div className="mt-5 space-y-3">


            <p>

              <b>Nama File :</b>{" "}

              {pembayaran.bukti.nama}

            </p>

<p>

  <b>Tanggal Pembayaran :</b>{" "}

  {pembayaran.tanggalPembayaran
    ? new Date(
        pembayaran.tanggalPembayaran +
        "T00:00:00"
      ).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      )
    : "-"
  }

</p>
            <p>

              <b>Tanggal Upload :</b>{" "}

              {pembayaran.bukti.tanggal}

            </p>


            <p>

              <b>Status :</b>{" "}

              <span className="text-orange-600 font-bold">

                {pembayaran.status}

              </span>

            </p>


            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">


              <button
                onClick={lihatBukti}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
              >

                👁 Lihat

              </button>


              <button
                onClick={hapusBukti}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm sm:text-base"
              >

                🗑 Hapus

              </button>

            </div>


            {/* ============================ */}
            {/* PREVIEW */}
            {/* ============================ */}

            {preview && (

              <div className="mt-6">


                <h3 className="font-bold mb-3">

                  Preview Bukti Transfer

                </h3>


                {pembayaran.bukti?.tipe ===
                "application/pdf" ? (

                  <button
                    onClick={() => {

                      if (!preview) {

                        alert(
                          "File PDF tidak ditemukan."
                        );

                        return;

                      }


                      const win =
                        window.open(
                          "",
                          "_blank"
                        );


                      if (win) {

                        win.document.write(`

                          <html>

                            <head>

                              <title>
                                Preview Bukti Pembayaran
                              </title>

                            </head>

                            <body
                              style="margin:0"
                            >

                              <iframe
                                src="${preview}"
                                width="100%"
                                height="100%"
                                style="border:none;height:100vh;"
                              ></iframe>

                            </body>

                          </html>

                        `);

                        win.document.close();

                      }

                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >

                    📄 Lihat PDF

                  </button>

                ) : (

                  <img
                    src={preview}
                    alt="Preview Bukti Pembayaran"
                    className="w-full max-w-lg rounded-lg border shadow"
                  />

                )}


                <br />


                <button
                  onClick={() =>
                    setPreview(null)
                  }
                  className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
                >

                  Tutup Preview

                </button>


              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

}


// ==========================================
// KOMPONEN INFO
// ==========================================

function Info({
  title,
  value,
}) {

  return (

    <div className="border rounded-lg p-3 sm:p-4">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h3 className="text-lg sm:text-xl font-bold text-green-700 break-words">
        {value}
      </h3>

    </div>

  );

}

  