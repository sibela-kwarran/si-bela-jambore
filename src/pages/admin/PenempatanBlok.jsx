import { useEffect, useState } from "react";

import {
  getSemuaPembayaran,
} from "../../services/pembayaranService";

import {
  getBlok,
  savePenempatanBlok,
} from "../../services/kaplingService";

import {
  getJenisRegu,
} from "../../services/reguService";

import {
  wilayahCikarangUtara,
} from "../../data/wilayahCikarangUtara";

import {
  getSemuaPendaftaran,
} from "../../services/pendaftaranService";

// ======================================================
// FORMAT NOMOR KAPLING
// ======================================================

function formatNomorKapling(
  nomor,
  jenis
) {

  const nomorFormat =
    String(nomor).padStart(
      3,
      "0"
    );

  return jenis === "putra"
    ? `PA${nomorFormat}`
    : `PI${nomorFormat}`;

}


// ======================================================
// CARI INDEX KELURAHAN
// ======================================================

function getIndexKelurahan(
  jenis,
  namaKelurahan
) {

  const daftarKelurahan =
    wilayahCikarangUtara?.[
      jenis
    ]?.kelurahan || [];

  return daftarKelurahan.findIndex(
    kel =>
      String(kel)
        .trim()
        .toLowerCase() ===
      String(namaKelurahan)
        .trim()
        .toLowerCase()
  );

}


// ======================================================
// NOMOR GLOBAL
// ======================================================

function getNomorGlobalKapling(
  jenis,
  namaKelurahan,
  nomorLokal
) {

  const indexKelurahan =
    getIndexKelurahan(
      jenis,
      namaKelurahan
    );

  if (
    indexKelurahan < 0
  ) {

    return Number(
      nomorLokal
    );

  }

  return (
    indexKelurahan * 15
  ) +
  Number(nomorLokal);

}
export default function PenempatanBlok() {

  // =====================================================
  // STATE
  // =====================================================

  const [data, setData] = useState([]);

  const [semuaBlok, setSemuaBlok] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedGudep, setSelectedGudep] = useState(null);

  const [formPenempatan, setFormPenempatan] = useState({
    kecamatanPutra:
      wilayahCikarangUtara?.putra?.kecamatan || "",

    kelurahanPutra: "",

    kaplingPutra: [],

    kecamatanPutri:
      wilayahCikarangUtara?.putri?.kecamatan || "",

    kelurahanPutri: "",

    kaplingPutri: [],
  });


  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);


  async function loadData() {
  try {
    setLoading(true);

    console.log("=================================");
    console.log("MULAI LOAD PENEMPATAN BLOK");
    console.log("=================================");

    console.log("1️⃣ GET BLOK");
    const blok = await getBlok();
    console.log("✅ HASIL GET BLOK:", blok);

    setSemuaBlok(blok || []);

    console.log("2️⃣ GET PENDAFTARAN");
    const pendaftaran = await getSemuaPendaftaran();
    console.log("✅ HASIL PENDAFTARAN:", pendaftaran);

    console.log("3️⃣ GET PEMBAYARAN");
    const pembayaran = await getSemuaPembayaran();
    console.log("✅ HASIL PEMBAYARAN:", pembayaran);

    const terverifikasi = (pendaftaran || []).filter(
      item =>
        String(item.status || "")
          .trim()
          .toLowerCase() === "terverifikasi"
    );

    console.log(
      "4️⃣ GUDEP TERVERIFIKASI:",
      terverifikasi
    );

    const hasil = [];

    for (const item of terverifikasi) {
      const gudepId = item.gudep_id;

      console.log(
        "5️⃣ CEK REGU GUDEP:",
        gudepId
      );

      const regu = await getJenisRegu(gudepId);

      console.log(
        "6️⃣ HASIL REGU:",
        gudepId,
        regu
      );

      const sudahDitempatkan =
        (blok || []).find(
          p =>
            Number(p.gudep_id) ===
            Number(gudepId)
        );

      hasil.push({
        id: item.id,

        gudep_id: gudepId,

        namaGudep:
          item.nama_gudep ||
          item.profil_gudep?.nama_pangkalan ||
          "-",

        adaPutra:
          Boolean(regu?.adaPutra),

        adaPutri:
          Boolean(regu?.adaPutri),

        jumlahPutra:
          Number(regu?.jumlahPutra || 0),

        jumlahPutri:
          Number(regu?.jumlahPutri || 0),

        status:
          sudahDitempatkan
            ? "Sudah Ditempatkan"
            : "Belum Ditempatkan",

        penempatan:
          sudahDitempatkan || null,
      });
    }

    console.log(
      "================================="
    );

    console.log(
      "DATA PENEMPATAN FINAL:",
      hasil
    );

    console.log(
      "================================="
    );

    setData(hasil);

  } catch (error) {

    console.error(
      "❌ PENEMPATAN BLOK ERROR:",
      error
    );

    console.error(
      "MESSAGE:",
      error?.message
    );

    alert(
      "Gagal mengambil data penempatan.\n\n" +
      (error?.message || "Failed to fetch")
    );

  } finally {

    setLoading(false);

  }
}


  // =====================================================
  // BUKA MODAL
  // =====================================================

  function handleTempatkan(item) {

    if (
      item.status ===
      "Sudah Ditempatkan"
    ) {

      alert(
        "Gudep ini sudah ditempatkan."
      );

      return;

    }


    setSelectedGudep(item);


    setFormPenempatan({

      kecamatanPutra:
        wilayahCikarangUtara?.putra?.kecamatan ||
        "",

      kelurahanPutra: "",

      kaplingPutra: [],

      kecamatanPutri:
        wilayahCikarangUtara?.putri?.kecamatan ||
        "",

      kelurahanPutri: "",

      kaplingPutri: [],

    });


    setModalOpen(true);

  }


  // =====================================================
  // NORMALISASI NOMOR
  // =====================================================

  function normalisasiNomor(nomor) {

    return String(nomor || "")
      .trim()
      .replace(/^0+/, "") || "0";

  }


  // =====================================================
  // AMBIL NOMOR DARI DATA
  //
  // Bisa membaca:
  // "003"
  // "003,004"
  // "003, 004"
  // =====================================================

  function ambilNomorKapling(value) {

    if (!value) return [];

    return String(value)
      .split(",")
      .map(x =>
        normalisasiNomor(x)
      )
      .filter(Boolean);

  }


  // =====================================================
  // CEK KAPLING TERPAKAI
  //
  // PUTRA hanya dibandingkan PUTRA
  // PUTRI hanya dibandingkan PUTRI
  //
  // PA003 dan PI003 BOLEH BERSAMAAN
  // =====================================================

  function cekKaplingTerpakai(
  kelurahan,
  nomor,
  jenis
) {

  if (
    !kelurahan ||
    !nomor
  ) {

    return false;

  }


  const kolomKelurahan =
    jenis === "putra"
      ? "kelurahan_putra"
      : "kelurahan_putri";


  const kolomKapling =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";


  const kelurahanTarget =
    String(kelurahan)
      .trim()
      .toLowerCase();


  const nomorTarget =
    Number(nomor);


  return (
    semuaBlok || []
  ).some(item => {

    const kel =
      String(
        item[kolomKelurahan] || ""
      )
        .trim()
        .toLowerCase();


    const kap =
      Number(
        item[kolomKapling]
      );


    return (
      kel === kelurahanTarget &&
      kap === nomorTarget
    );

  });

}

  // =====================================================
  // CEK BEBERAPA NOMOR SEKALIGUS
  // =====================================================

  function adaNomorBentrok(
    kelurahan,
    nomorArray,
    jenis
  ) {

    return (nomorArray || []).some(
      nomor =>
        cekKaplingTerpakai(
          kelurahan,
          nomor,
          jenis
        )
    );

  }


  // =====================================================
  // PILIH KAPLING PUTRA
  // =====================================================

  function handleKaplingPutraChange(e) {

    const values =
      Array.from(
        e.target.selectedOptions,
        option => option.value
      );


    const jumlah =
      Number(
        selectedGudep?.jumlahPutra || 0
      );


    if (values.length > jumlah) {

      alert(
        `Gudep ini memiliki ${jumlah} regu Putra.\n\n` +
        `Maksimal ${jumlah} nomor kapling Putra yang dapat dipilih.`
      );

      return;

    }


    const kelurahan =
      formPenempatan.kelurahanPutra;


    const bentrok =
      values.find(
        nomor =>
          cekKaplingTerpakai(
            kelurahan,
            nomor,
            "putra"
          )
      );


    if (bentrok) {

      alert(
        `❌ PA${String(bentrok).padStart(3, "0")} sudah digunakan di Kelurahan ${kelurahan}.`
      );

      return;

    }


    setFormPenempatan(
      prev => ({
        ...prev,
        kaplingPutra: values,
      })
    );

  }


  // =====================================================
  // PILIH KAPLING PUTRI
  // =====================================================

  function handleKaplingPutriChange(e) {

    const values =
      Array.from(
        e.target.selectedOptions,
        option => option.value
      );


    const jumlah =
      Number(
        selectedGudep?.jumlahPutri || 0
      );


    if (values.length > jumlah) {

      alert(
        `Gudep ini memiliki ${jumlah} regu Putri.\n\n` +
        `Maksimal ${jumlah} nomor kapling Putri yang dapat dipilih.`
      );

      return;

    }


    const kelurahan =
      formPenempatan.kelurahanPutri;


    const bentrok =
      values.find(
        nomor =>
          cekKaplingTerpakai(
            kelurahan,
            nomor,
            "putri"
          )
      );


    if (bentrok) {

      alert(
        `❌ PI${String(bentrok).padStart(3, "0")} sudah digunakan di Kelurahan ${kelurahan}.`
      );

      return;

    }


    setFormPenempatan(
      prev => ({
        ...prev,
        kaplingPutri: values,
      })
    );

  }


  // =====================================================
  // SIMPAN PENEMPATAN
  // =====================================================

  async function handleSimpanPenempatan() {

    if (!selectedGudep) {
      return;
    }


    // =================================================
    // VALIDASI PUTRA
    // =================================================

    if (
      selectedGudep.adaPutra &&
      (
        !formPenempatan.kelurahanPutra ||
        formPenempatan.kaplingPutra.length !==
        selectedGudep.jumlahPutra
      )
    ) {

      alert(
        `Silakan pilih ${selectedGudep.jumlahPutra} nomor kapling Putra sesuai jumlah regu.`
      );

      return;

    }


    // =================================================
    // VALIDASI PUTRI
    // =================================================

    if (
      selectedGudep.adaPutri &&
      (
        !formPenempatan.kelurahanPutri ||
        formPenempatan.kaplingPutri.length !==
        selectedGudep.jumlahPutri
      )
    ) {

      alert(
        `Silakan pilih ${selectedGudep.jumlahPutri} nomor kapling Putri sesuai jumlah regu.`
      );

      return;

    }


    try {

      setLoading(true);


      // =================================================
      // AMBIL DATA TERBARU
      // =================================================

      const blokTerbaru =
        await getBlok();


      // =================================================
      // CEK ULANG PUTRA
      // =================================================

      if (
        selectedGudep.adaPutra
      ) {

        const bentrokPutra =
          adaNomorBentrok(
            formPenempatan.kelurahanPutra,
            formPenempatan.kaplingPutra,
            "putra"
          );


        if (bentrokPutra) {

          alert(
            "❌ Salah satu nomor kapling Putra sudah digunakan.\n\nSilakan pilih nomor lain."
          );

          setLoading(false);

          return;

        }

      }


      // =================================================
      // CEK ULANG PUTRI
      // =================================================

      if (
        selectedGudep.adaPutri
      ) {

        const bentrokPutri =
          adaNomorBentrok(
            formPenempatan.kelurahanPutri,
            formPenempatan.kaplingPutri,
            "putri"
          );


        if (bentrokPutri) {

          alert(
            "❌ Salah satu nomor kapling Putri sudah digunakan.\n\nSilakan pilih nomor lain."
          );

          setLoading(false);

          return;

        }

      }


      // =================================================
      // CEK DATA TERBARU
      //
      // Dipakai supaya aman jika ada perubahan
      // setelah modal dibuka.
      // =================================================

      const cekTerbaru =
        (blokTerbaru || []).some(
          item => {

            // -------------------------------
            // PUTRA
            // -------------------------------

            if (
              selectedGudep.adaPutra
            ) {

              const kelPutra =
                String(
                  item.kelurahan_putra || ""
                )
                  .trim()
                  .toLowerCase();


              const targetKelPutra =
                String(
                  formPenempatan.kelurahanPutra
                )
                  .trim()
                  .toLowerCase();


              if (
                kelPutra ===
                targetKelPutra
              ) {

                const nomorPutra =
                  ambilNomorKapling(
                    item.kapling_putra
                  );


                const bentrok =
                  formPenempatan.kaplingPutra
                    .some(
                      nomor =>
                        nomorPutra.includes(
                          normalisasiNomor(
                            nomor
                          )
                        )
                    );


                if (bentrok) {
                  return true;
                }

              }

            }


            // -------------------------------
            // PUTRI
            // -------------------------------

            if (
              selectedGudep.adaPutri
            ) {

              const kelPutri =
                String(
                  item.kelurahan_putri || ""
                )
                  .trim()
                  .toLowerCase();


              const targetKelPutri =
                String(
                  formPenempatan.kelurahanPutri
                )
                  .trim()
                  .toLowerCase();


              if (
                kelPutri ===
                targetKelPutri
              ) {

                const nomorPutri =
                  ambilNomorKapling(
                    item.kapling_putri
                  );


                const bentrok =
                  formPenempatan.kaplingPutri
                    .some(
                      nomor =>
                        nomorPutri.includes(
                          normalisasiNomor(
                            nomor
                          )
                        )
                    );


                if (bentrok) {
                  return true;
                }

              }

            }


            return false;

          }
        );


      if (cekTerbaru) {

        alert(
          "❌ Nomor kapling baru saja digunakan oleh Gudep lain.\n\nSilakan pilih nomor kapling yang lain."
        );

        await loadData();

        setLoading(false);

        return;

      }


      // =================================================
      // FORMAT NOMOR
      //
      // ["003","004"]
      // menjadi
      // "003,004"
      // =================================================

      const kaplingPutra =
        selectedGudep.adaPutra
          ? formPenempatan.kaplingPutra
              .map(
                nomor =>
                  String(nomor)
                    .padStart(3, "0")
              )
              .join(",")
          : null;


      const kaplingPutri =
        selectedGudep.adaPutri
          ? formPenempatan.kaplingPutri
              .map(
                nomor =>
                  String(nomor)
                    .padStart(3, "0")
              )
              .join(",")
          : null;


      // =================================================
      // DATA YANG DISIMPAN
      // =================================================

      const dataSimpan = {

        gudep_id:
          selectedGudep.gudep_id,


        // -------------------------------
        // PUTRA
        // -------------------------------

        kecamatan_putra:
          selectedGudep.adaPutra
            ? formPenempatan.kecamatanPutra
            : null,

        kelurahan_putra:
          selectedGudep.adaPutra
            ? formPenempatan.kelurahanPutra
            : null,

        kapling_putra:
          kaplingPutra,


        // -------------------------------
        // PUTRI
        // -------------------------------

        kecamatan_putri:
          selectedGudep.adaPutri
            ? formPenempatan.kecamatanPutri
            : null,

        kelurahan_putri:
          selectedGudep.adaPutri
            ? formPenempatan.kelurahanPutri
            : null,

        kapling_putri:
          kaplingPutri,


        status:
          "Sudah Ditempatkan",

      };


      console.log(
        "DATA PENEMPATAN FINAL:",
        dataSimpan
      );


      // =================================================
      // SIMPAN
      // =================================================

      await savePenempatanBlok(
        dataSimpan
      );


      alert(
        "✅ Gudep berhasil ditempatkan."
      );


      // =================================================
      // TUTUP MODAL
      // =================================================

      setModalOpen(false);

      setSelectedGudep(null);


      // =================================================
      // REFRESH
      // =================================================

      await loadData();


    } catch (error) {

      console.error(
        "GAGAL MENYIMPAN PENEMPATAN:",
        error
      );

      alert(
        "❌ Gagal menyimpan penempatan: " +
        (
          error?.message ||
          "Terjadi kesalahan."
        )
      );

    } finally {

      setLoading(false);

    }

  }


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <div className="
        bg-white
        rounded-xl
        shadow
        p-8
      ">
        Memuat data penempatan...
      </div>
    );

  }


  // =====================================================
  // TAMPILAN
  // =====================================================

  return (

    <div className="space-y-6">


      {/* =================================================
          HEADER
      ================================================= */}

      <div>

        <h1 className="
          text-3xl
          font-bold
          text-green-700
        ">
          📍 Penempatan Blok Perkemahan
        </h1>

        <p className="
          text-gray-500
          mt-1
        ">
          Kelola penempatan Gudep yang telah
          terverifikasi.
        </p>

      </div>


      {/* =================================================
          CARD JUMLAH
      ================================================= */}

      <div className="
        bg-white
        rounded-xl
        shadow
        p-6
      ">

        <div className="
          flex
          justify-between
          items-center
        ">

          <div>

            <h2 className="
              text-xl
              font-bold
            ">
              Daftar Gudep Terverifikasi
            </h2>

            <p className="
              text-gray-500
            ">
              Gudep siap ditempatkan ke blok
              perkemahan.
            </p>

          </div>


          <div className="text-right">

            <div className="
              text-3xl
              font-bold
              text-green-700
            ">
              {data.length}
            </div>

            <div className="
              text-sm
              text-gray-500
            ">
              Gudep
            </div>

          </div>

        </div>

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

        <div className="
          overflow-x-auto
        ">

          <table className="
            w-full
            border-collapse
          ">

            <thead className="
              bg-green-700
              text-white
            ">

              <tr>

                <th className="border p-3">
                  No
                </th>

                <th className="border p-3">
                  Gudep
                </th>

                <th className="border p-3">
                  Kapling
                </th>

                <th className="border p-3">
                  Regu Putra
                </th>

                <th className="border p-3">
                  Regu Putri
                </th>

                <th className="border p-3">
                  Status
                </th>

                <th className="border p-3">
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
                      p-8
                      text-center
                      text-gray-500
                    "
                  >
                    Belum ada Gudep yang
                    terverifikasi.
                  </td>

                </tr>

              ) : (

                data.map(
                  (item, index) => (

                    <tr
                      key={item.gudep_id}
                      className="
                        hover:bg-gray-50
                      "
                    >

                      <td className="
                        border
                        p-3
                        text-center
                      ">
                        {index + 1}
                      </td>


                      <td className="
                        border
                        p-3
                        font-semibold
                      ">
                        {item.namaGudep}
                      </td>


                      {/* KAPLING */}

                      <td className="
                        border
                        p-3
                        text-center
                      ">

                        {item.penempatan ? (

                          <div className="space-y-1">

                            {item.penempatan.kapling_putra && (
                              <div className="
                                text-blue-700
                                font-bold
                              ">
                                🧑{" "}
                                {ambilNomorKapling(
                                  item.penempatan.kapling_putra
                                )
                                  .map(
                                    n =>
                                      `PA${String(n).padStart(3, "0")}`
                                  )
                                  .join(", ")
                                }
                              </div>
                            )}


                            {item.penempatan.kapling_putri && (
                              <div className="
                                text-pink-700
                                font-bold
                              ">
                                👩{" "}
                                {ambilNomorKapling(
                                  item.penempatan.kapling_putri
                                )
                                  .map(
                                    n =>
                                      `PI${String(n).padStart(3, "0")}`
                                  )
                                  .join(", ")
                                }
                              </div>
                            )}

                          </div>

                        ) : (

                          <span className="
                            text-gray-400
                          ">
                            —
                          </span>

                        )}

                      </td>


                      {/* PUTRA */}

                      <td className="
                        border
                        p-3
                        text-center
                      ">

                        {item.adaPutra ? (

                          <span className="
                            text-blue-600
                            font-bold
                          ">
                            {item.jumlahPutra} Regu
                          </span>

                        ) : (

                          <span className="
                            text-gray-400
                          ">
                            —
                          </span>

                        )}

                      </td>


                      {/* PUTRI */}

                      <td className="
                        border
                        p-3
                        text-center
                      ">

                        {item.adaPutri ? (

                          <span className="
                            text-pink-600
                            font-bold
                          ">
                            {item.jumlahPutri} Regu
                          </span>

                        ) : (

                          <span className="
                            text-gray-400
                          ">
                            —
                          </span>

                        )}

                      </td>


                      {/* STATUS */}

                      <td className="
                        border
                        p-3
                        text-center
                      ">

                        {item.status ===
                        "Sudah Ditempatkan" ? (

                          <span className="
                            bg-green-100
                            text-green-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                          ">
                            ✓ Sudah Ditempatkan
                          </span>

                        ) : (

                          <span className="
                            bg-yellow-100
                            text-yellow-700
                            px-3
                            py-1
                            rounded-full
                            font-semibold
                          ">
                            ⏳ Belum Ditempatkan
                          </span>

                        )}

                      </td>


                      {/* AKSI */}

                      <td className="
                        border
                        p-3
                        text-center
                      ">

                        {item.status ===
                        "Sudah Ditempatkan" ? (

                          <button
                            disabled
                            className="
                              bg-gray-300
                              text-gray-500
                              px-4
                              py-2
                              rounded-lg
                              font-semibold
                              cursor-not-allowed
                            "
                          >
                            ✓ Sudah Ditempatkan
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              handleTempatkan(item)
                            }
                            className="
                              bg-blue-600
                              hover:bg-blue-700
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              font-semibold
                            "
                          >
                            📍 Tempatkan
                          </button>

                        )}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================================
            MODAL
        ================================================= */}

        {modalOpen &&
        selectedGudep && (

          <div className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
            p-4
          ">

            <div className="
              bg-white
              rounded-2xl
              shadow-2xl
              w-full
              max-w-xl
              max-h-[90vh]
              overflow-y-auto
              p-6
            ">


              {/* HEADER */}

              <div className="
                flex
                justify-between
                items-center
                mb-6
              ">

                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                    text-green-700
                  ">
                    📍 Tempatkan Gudep
                  </h2>

                  <p className="
                    text-gray-500
                    mt-1
                  ">
                    {selectedGudep.namaGudep}
                  </p>

                </div>


                <button
                  onClick={() => {

                    setModalOpen(false);

                    setSelectedGudep(null);

                  }}
                  className="
                    text-gray-500
                    hover:text-red-600
                    text-2xl
                  "
                >
                  ✕
                </button>

              </div>


              {/* INFO */}

              <div className="
                bg-yellow-50
                border
                border-yellow-200
                rounded-xl
                p-4
                mb-5
                text-sm
                text-yellow-800
              ">

                <strong>
                  ℹ️ Ketentuan Kapling:
                </strong>

                <ul className="
                  mt-2
                  list-disc
                  ml-5
                  space-y-1
                ">

                  <li>
                    Nomor kapling tersedia
                    <strong> 001–015</strong>
                    pada setiap kelurahan.
                  </li>

                  <li>
                    Putra menggunakan kode
                    <strong> PA</strong>.
                  </li>

                  <li>
                    Putri menggunakan kode
                    <strong> PI</strong>.
                  </li>

                  <li>
                    PA003 dan PI003
                    <strong> boleh sama</strong>.
                  </li>

                  <li>
                    Jumlah nomor yang dipilih
                    harus sesuai jumlah regu.
                  </li>

                  <li>
                    Contoh 2 regu Putra:
                    <strong> PA003, PA004</strong>.
                  </li>

                </ul>

              </div>


              {/* =================================================
                  PUTRA
              ================================================= */}

              {selectedGudep.adaPutra && (

                <div className="
                  border
                  border-blue-200
                  rounded-xl
                  p-5
                  mb-5
                  bg-blue-50
                ">

                  <h3 className="
                    text-lg
                    font-bold
                    text-blue-700
                    mb-4
                  ">
                    🧑 Blok Putra
                  </h3>


                  <div className="
                    bg-blue-100
                    text-blue-800
                    rounded-lg
                    p-3
                    mb-4
                    text-sm
                    font-semibold
                  ">
                    Jumlah regu Putra:
                    {" "}
                    {selectedGudep.jumlahPutra}
                    {" "}
                    regu
                  </div>


                  <label className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    Kecamatan
                  </label>

                  <input
                    type="text"
                    value={
                      wilayahCikarangUtara?.putra?.kecamatan ||
                      ""
                    }
                    readOnly
                    className="
                      w-full
                      border
                      rounded-lg
                      p-3
                      bg-gray-100
                      mb-4
                    "
                  />


                  <label className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    Kelurahan
                  </label>

                  <select
                    value={
                      formPenempatan.kelurahanPutra
                    }
                    onChange={(e) => {

                      setFormPenempatan(
                        prev => ({
                          ...prev,

                          kelurahanPutra:
                            e.target.value,

                          kaplingPutra: [],

                        })
                      );

                    }}
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      p-3
                      bg-white
                      mb-4
                      cursor-pointer
                    "
                  >

                    <option value="">
                      Pilih Kelurahan
                    </option>

                    {(
                      wilayahCikarangUtara
                        ?.putra
                        ?.kelurahan || []
                    ).map(
                      kelurahan => (

                        <option
                          key={kelurahan}
                          value={kelurahan}
                        >
                          {kelurahan}
                        </option>

                      )
                    )}

                  </select>


                  <label className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    Nomor Kapling Putra
                  </label>

                  <select
                    multiple
                    value={
                      formPenempatan.kaplingPutra
                    }
                    onChange={
                      handleKaplingPutraChange
                    }
                    disabled={
                      !formPenempatan.kelurahanPutra
                    }
                    className="
                      w-full
                      border
                      rounded-lg
                      p-3
                      font-bold
                      min-h-[180px]
                      bg-white
                      text-blue-700
                      border-blue-300
                    "
                  >

                    {Array.from(
  { length: 15 },
  (_, index) =>
    index + 1
).map(
  nomorLokal => {

    const nomorGlobal =
      getNomorGlobalKapling(
        "putra",
        formPenempatan.kelurahanPutra,
        nomorLokal
      );


    const sudahTerpakai =
      formPenempatan.kelurahanPutra
        ? cekKaplingTerpakai(
            formPenempatan.kelurahanPutra,
            nomorGlobal,
            "putra"
          )
        : false;


    return (

      <option
        key={nomorGlobal}
        value={nomorGlobal}
        disabled={sudahTerpakai}
      >

        {formatNomorKapling(
          nomorGlobal,
          "putra"
        )}

        {sudahTerpakai
          ? " — Sudah Digunakan"
          : ""}

      </option>

    );

  }
)}

                  </select>


                  <p className="
                    text-xs
                    text-blue-600
                    mt-2
                  ">
                    💡 Pilih tepat{" "}
                    <strong>
                      {selectedGudep.jumlahPutra}
                    </strong>{" "}
                    nomor untuk{" "}
                    <strong>
                      {selectedGudep.jumlahPutra}
                    </strong>{" "}
                    regu Putra.
                  </p>


                  {formPenempatan.kaplingPutra.length > 0 && (

                    <div className="
                      mt-3
                      bg-white
                      border
                      border-blue-200
                      rounded-lg
                      p-3
                      text-sm
                      text-blue-700
                      font-bold
                    ">

                      Kapling terpilih:{" "}

                      {formPenempatan.kaplingPutra
                        .map(
                          n =>
                            `PA${String(n).padStart(3, "0")}`
                        )
                        .join(", ")}

                    </div>

                  )}

                </div>

              )}


              {/* =================================================
                  PUTRI
              ================================================= */}

              {selectedGudep.adaPutri && (

                <div className="
                  border
                  border-pink-200
                  rounded-xl
                  p-5
                  mb-5
                  bg-pink-50
                ">

                  <h3 className="
                    text-lg
                    font-bold
                    text-pink-700
                    mb-4
                  ">
                    👩 Blok Putri
                  </h3>


                  <div className="
                    bg-pink-100
                    text-pink-800
                    rounded-lg
                    p-3
                    mb-4
                    text-sm
                    font-semibold
                  ">
                    Jumlah regu Putri:
                    {" "}
                    {selectedGudep.jumlahPutri}
                    {" "}
                    regu
                  </div>


                  <label className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    Kecamatan
                  </label>

                  <input
                    type="text"
                    value={
                      wilayahCikarangUtara?.putri?.kecamatan ||
                      ""
                    }
                    readOnly
                    className="
                      w-full
                      border
                      rounded-lg
                      p-3
                      bg-gray-100
                      mb-4
                    "
                  />


                  <label className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    Kelurahan
                  </label>

                  <select
                    value={
                      formPenempatan.kelurahanPutri
                    }
                    onChange={(e) => {

                      setFormPenempatan(
                        prev => ({
                          ...prev,

                          kelurahanPutri:
                            e.target.value,

                          kaplingPutri: [],

                        })
                      );

                    }}
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      p-3
                      bg-white
                      mb-4
                      cursor-pointer
                    "
                  >

                    <option value="">
                      Pilih Kelurahan
                    </option>

                    {(
                      wilayahCikarangUtara
                        ?.putri
                        ?.kelurahan || []
                    ).map(
                      kelurahan => (

                        <option
                          key={kelurahan}
                          value={kelurahan}
                        >
                          {kelurahan}
                        </option>

                      )
                    )}

                  </select>


                  <label className="
                    block
                    text-sm
                    font-semibold
                    mb-2
                  ">
                    Nomor Kapling Putri
                  </label>

                  <select
                    multiple
                    value={
                      formPenempatan.kaplingPutri
                    }
                    onChange={
                      handleKaplingPutriChange
                    }
                    disabled={
                      !formPenempatan.kelurahanPutri
                    }
                    className="
                      w-full
                      border
                      rounded-lg
                      p-3
                      font-bold
                      min-h-[180px]
                      bg-white
                      text-pink-700
                      border-pink-300
                    "
                  >

                   {Array.from(
  { length: 15 },
  (_, index) =>
    index + 1
).map(
  nomorLokal => {

    const nomorGlobal =
      getNomorGlobalKapling(
        "putri",
        formPenempatan.kelurahanPutri,
        nomorLokal
      );


    const sudahTerpakai =
      formPenempatan.kelurahanPutri
        ? cekKaplingTerpakai(
            formPenempatan.kelurahanPutri,
            nomorGlobal,
            "putri"
          )
        : false;


    return (

      <option
        key={nomorGlobal}
        value={nomorGlobal}
        disabled={sudahTerpakai}
      >

        {formatNomorKapling(
          nomorGlobal,
          "putri"
        )}

        {sudahTerpakai
          ? " — Sudah Digunakan"
          : ""}

      </option>

    );

  }
)}

                  </select>


                  <p className="
                    text-xs
                    text-pink-600
                    mt-2
                  ">
                    💡 Pilih tepat{" "}
                    <strong>
                      {selectedGudep.jumlahPutri}
                    </strong>{" "}
                    nomor untuk{" "}
                    <strong>
                      {selectedGudep.jumlahPutri}
                    </strong>{" "}
                    regu Putri.
                  </p>


                  {formPenempatan.kaplingPutri.length > 0 && (

                    <div className="
                      mt-3
                      bg-white
                      border
                      border-pink-200
                      rounded-lg
                      p-3
                      text-sm
                      text-pink-700
                      font-bold
                    ">

                      Kapling terpilih:{" "}

                      {formPenempatan.kaplingPutri
                        .map(
                          n =>
                            `PI${String(n).padStart(3, "0")}`
                        )
                        .join(", ")}

                    </div>

                  )}

                </div>

              )}


              {/* =================================================
                  TOMBOL
              ================================================= */}

              <div className="
                flex
                justify-end
                gap-3
                mt-6
              ">

                <button
                  onClick={() => {

                    setModalOpen(false);

                    setSelectedGudep(null);

                  }}
                  className="
                    px-5
                    py-3
                    rounded-lg
                    bg-gray-200
                    hover:bg-gray-300
                    font-semibold
                  "
                >
                  Batal
                </button>


                <button
                  onClick={
                    handleSimpanPenempatan
                  }
                  disabled={

                    (
                      selectedGudep.adaPutra &&
                      (
                        !formPenempatan.kelurahanPutra ||
                        formPenempatan.kaplingPutra.length !==
                        selectedGudep.jumlahPutra
                      )
                    )

                    ||

                    (
                      selectedGudep.adaPutri &&
                      (
                        !formPenempatan.kelurahanPutri ||
                        formPenempatan.kaplingPutri.length !==
                        selectedGudep.jumlahPutri
                      )
                    )

                  }
                  className="
                    px-5
                    py-3
                    rounded-lg
                    bg-green-600
                    hover:bg-green-700
                    disabled:bg-gray-400
                    text-white
                    font-bold
                  "
                >
                  💾 Simpan Penempatan
                </button>

              </div>


            </div>

          </div>

        )}

      </div>

    </div>

  );

}