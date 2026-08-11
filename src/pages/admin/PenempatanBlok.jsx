
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

function formatNomorKapling(nomor, jenis) {
  const nomorFormat = String(nomor).padStart(3, "0");

  return jenis === "putra"
    ? `PA${nomorFormat}`
    : `PI${nomorFormat}`;
}

// ======================================================
// CARI INDEX KELURAHAN
// ======================================================

function getIndexKelurahan(jenis, namaKelurahan) {
  const daftarKelurahan =
    wilayahCikarangUtara?.[jenis]?.kelurahan || [];

  return daftarKelurahan.findIndex(
    (kel) =>
      String(kel).trim().toLowerCase() ===
      String(namaKelurahan).trim().toLowerCase()
  );
}

// ======================================================
// NOMOR GLOBAL
//
// Kelurahan 1 = 001 - 015
// Kelurahan 2 = 016 - 030
// Kelurahan 3 = 031 - 045
// dst.
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

  if (indexKelurahan < 0) {
    return Number(nomorLokal);
  }

  return (
    indexKelurahan * 15 +
    Number(nomorLokal)
  );
}

// ======================================================
// KOMPONEN
// ======================================================

export default function PenempatanBlok() {

  // =====================================================
  // STATE
  // =====================================================

  const [data, setData] = useState([]);

  const [semuaBlok, setSemuaBlok] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedGudep, setSelectedGudep] = useState(null);

  // true = sedang edit
  // false = penempatan baru
  const [modeEdit, setModeEdit] = useState(false);

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

      // -----------------------------------------------
      // SEMUA PENEMPATAN
      // -----------------------------------------------

      const blok =
        await getBlok();

      setSemuaBlok(
        blok || []
      );

      // -----------------------------------------------
      // PENDAFTARAN
      // -----------------------------------------------

      const pendaftaran =
        await getSemuaPendaftaran();

      // -----------------------------------------------
      // PEMBAYARAN
      // -----------------------------------------------

      const pembayaran =
        await getSemuaPembayaran();

      // -----------------------------------------------
      // HANYA GUDEP TERVERIFIKASI
      // -----------------------------------------------

      const terverifikasi =
        (pendaftaran || []).filter(
          (item) =>
            String(
              item.status || ""
            )
              .trim()
              .toLowerCase() ===
            "terverifikasi"
        );

      const hasil = [];

      // =================================================
      // PROSES SETIAP GUDEP
      // =================================================

      for (
        const item of terverifikasi
      ) {

        const gudepId =
          item.gudep_id;

        // ---------------------------------------------
        // DATA PEMBAYARAN
        // ---------------------------------------------

        const pembayaranGudep =
          (pembayaran || []).find(
            (p) =>
              Number(
                p.gudep_id
              ) ===
              Number(gudepId)
          );

        const nomorKapling =
          pembayaranGudep?.nomor_kapling ||
          null;

        // ---------------------------------------------
        // JUMLAH REGU
        // ---------------------------------------------

        const regu =
          await getJenisRegu(
            gudepId
          );

        // ---------------------------------------------
        // CEK SUDAH DITEMPATKAN
        // ---------------------------------------------

        const sudahDitempatkan =
          (blok || []).find(
            (p) =>
              Number(
                p.gudep_id
              ) ===
              Number(gudepId)
          );

        hasil.push({

          id: item.id,

          gudep_id:
            gudepId,

          namaGudep:
            item.nama_gudep ||
            item.profil_gudep
              ?.nama_pangkalan ||
            "-",

          nomorKapling,

          adaPutra:
            Boolean(
              regu?.adaPutra
            ),

          adaPutri:
            Boolean(
              regu?.adaPutri
            ),

          jumlahPutra:
            Number(
              regu?.jumlahPutra || 0
            ),

          jumlahPutri:
            Number(
              regu?.jumlahPutri || 0
            ),

          status:
            sudahDitempatkan
              ? "Sudah Ditempatkan"
              : "Belum Ditempatkan",

          penempatan:
            sudahDitempatkan ||
            null,
        });
      }

      setData(hasil);

    } catch (error) {

      console.error(
        "PENEMPATAN BLOK ERROR:",
        error
      );

      alert(
        "Gagal mengambil data penempatan."
      );

    } finally {

      setLoading(false);

    }
  }

  // =====================================================
  // BUAT ARRAY SESUAI JUMLAH REGU
  // =====================================================

  function buatArrayRegu(jumlah) {
    return Array.from(
      {
        length:
          Number(jumlah || 0),
      },
      () => ""
    );
  }

  // =====================================================
  // BUKA PENEMPATAN BARU
  // =====================================================

  function handleTempatkan(item) {

    setSelectedGudep(
      item
    );

    setModeEdit(
      false
    );

    setFormPenempatan({

      kecamatanPutra:
        wilayahCikarangUtara
          ?.putra
          ?.kecamatan ||
        "",

      kelurahanPutra:
        "",

      kaplingPutra:
        buatArrayRegu(
          item.jumlahPutra
        ),

      kecamatanPutri:
        wilayahCikarangUtara
          ?.putri
          ?.kecamatan ||
        "",

      kelurahanPutri:
        "",

      kaplingPutri:
        buatArrayRegu(
          item.jumlahPutri
        ),
    });

    setModalOpen(
      true
    );
  }

  // =====================================================
  // BUKA EDIT PENEMPATAN
  //
  // DATA LAMA DIMASUKKAN KEMBALI KE FORM
  // =====================================================

  function handleEditPenempatan(item) {

    const penempatan =
      item.penempatan;

    if (!penempatan) {

      handleTempatkan(
        item
      );

      return;
    }

    // -----------------------------------------------
    // AMBIL KAPLING PUTRA
    // -----------------------------------------------

    const kaplingPutraLama =
      ambilNomorKapling(
        penempatan.kapling_putra
      ).map(
        (nomor) =>
          Number(nomor)
      );

    // -----------------------------------------------
    // AMBIL KAPLING PUTRI
    // -----------------------------------------------

    const kaplingPutriLama =
      ambilNomorKapling(
        penempatan.kapling_putri
      ).map(
        (nomor) =>
          Number(nomor)
      );

    // -----------------------------------------------
    // PASTIKAN JUMLAH ARRAY SESUAI REGU
    // -----------------------------------------------

    const kaplingPutra =
      Array.from(
        {
          length:
            Number(
              item.jumlahPutra || 0
            ),
        },
        (_, index) =>
          kaplingPutraLama[
            index
          ] || ""
      );

    const kaplingPutri =
      Array.from(
        {
          length:
            Number(
              item.jumlahPutri || 0
            ),
        },
        (_, index) =>
          kaplingPutriLama[
            index
          ] || ""
      );

    setSelectedGudep(
      item
    );

    setModeEdit(
      true
    );

    setFormPenempatan({

      kecamatanPutra:
        penempatan.kecamatan_putra ||
        wilayahCikarangUtara
          ?.putra
          ?.kecamatan ||
        "",

      kelurahanPutra:
        penempatan.kelurahan_putra ||
        "",

      kaplingPutra,

      kecamatanPutri:
        penempatan.kecamatan_putri ||
        wilayahCikarangUtara
          ?.putri
          ?.kecamatan ||
        "",

      kelurahanPutri:
        penempatan.kelurahan_putri ||
        "",

      kaplingPutri,
    });

    setModalOpen(
      true
    );
  }

  // =====================================================
  // NORMALISASI NOMOR
  // =====================================================

  function normalisasiNomor(nomor) {

    return (
      String(nomor || "")
        .trim()
        .replace(/^0+/, "") ||
      "0"
    );

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

    if (!value) {
      return [];
    }

    return String(value)
      .split(",")
      .map(
        (x) =>
          normalisasiNomor(
            x
          )
      )
      .filter(Boolean);
  }

  // =====================================================
  // CEK KAPLING TERPAKAI
  //
  // currentGudepId = Gudep yang sedang diedit
  //
  // Jika sedang edit, data Gudep sendiri DIABAIKAN
  // sehingga nomor lamanya tetap bisa dipilih.
  // =====================================================

  function cekKaplingTerpakai(
    kelurahan,
    nomor,
    jenis,
    currentGudepId = null
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
      normalisasiNomor(
        nomor
      );

    return (
      semuaBlok || []
    ).some(
      (item) => {

        // ---------------------------------------------
        // JIKA SEDANG EDIT
        // JANGAN HITUNG DATA GUEDEP SENDIRI
        // ---------------------------------------------

        if (
          currentGudepId !== null &&
          Number(
            item.gudep_id
          ) ===
          Number(
            currentGudepId
          )
        ) {
          return false;
        }

        const kel =
          String(
            item[
              kolomKelurahan
            ] || ""
          )
            .trim()
            .toLowerCase();

        if (
          kel !==
          kelurahanTarget
        ) {
          return false;
        }

        const nomorTersimpan =
          ambilNomorKapling(
            item[
              kolomKapling
            ]
          );

        return nomorTersimpan.includes(
          nomorTarget
        );
      }
    );
  }

  // =====================================================
  // CEK NOMOR DIPAKAI REGU LAIN
  // DALAM GUDEP YANG SAMA
  // =====================================================

  function nomorDipakaiReguLain(
    nomor,
    daftarKapling,
    indexSaatIni
  ) {

    const nomorNormal =
      normalisasiNomor(
        nomor
      );

    return (
      daftarKapling || []
    ).some(
      (
        nilai,
        index
      ) =>
        index !==
          indexSaatIni &&
        nilai &&
        normalisasiNomor(
          nilai
        ) ===
          nomorNormal
    );
  }

  // =====================================================
  // PILIHAN NOMOR KAPLING
  // =====================================================

  function getPilihanKapling(
    jenis,
    kelurahan,
    daftarKapling,
    indexRegu
  ) {

    return Array.from(
      {
        length: 15,
      },
      (_, index) => {

        const nomorLokal =
          index + 1;

        const nomorGlobal =
          getNomorGlobalKapling(
            jenis,
            kelurahan,
            nomorLokal
          );

        const sudahTerpakai =
          kelurahan
            ? cekKaplingTerpakai(
                kelurahan,
                nomorGlobal,
                jenis,
                selectedGudep
                  ?.gudep_id
              )
            : false;

        const dipakaiReguLain =
          nomorDipakaiReguLain(
            nomorGlobal,
            daftarKapling,
            indexRegu
          );

        return {

          nomorGlobal,

          sudahTerpakai,

          dipakaiReguLain,
        };
      }
    );
  }

  // =====================================================
  // PILIH KAPLING REGU PUTRA
  // =====================================================

  function handleKaplingPutraChange(
    indexRegu,
    value
  ) {

    const nomor =
      value === ""
        ? ""
        : Number(value);

    setFormPenempatan(
      (prev) => {

        const baru = [
          ...prev.kaplingPutra,
        ];

        baru[indexRegu] =
          nomor;

        return {
          ...prev,

          kaplingPutra:
            baru,
        };
      }
    );
  }

  // =====================================================
  // PILIH KAPLING REGU PUTRI
  // =====================================================

  function handleKaplingPutriChange(
    indexRegu,
    value
  ) {

    const nomor =
      value === ""
        ? ""
        : Number(value);

    setFormPenempatan(
      (prev) => {

        const baru = [
          ...prev.kaplingPutri,
        ];

        baru[indexRegu] =
          nomor;

        return {
          ...prev,

          kaplingPutri:
            baru,
        };
      }
    );
  }

  // =====================================================
  // CEK BENTROK DATA TERBARU
  //
  // Gudep sendiri dikecualikan ketika EDIT.
  // =====================================================

  function cekBentrokTerbaru(
    blokTerbaru,
    kelurahan,
    daftarKapling,
    jenis,
    currentGudepId
  ) {

    if (!kelurahan) {
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

    const targetKelurahan =
      String(kelurahan)
        .trim()
        .toLowerCase();

    return (
      blokTerbaru || []
    ).some(
      (item) => {

        // ---------------------------------------------
        // DATA GUDEP SENDIRI DIABAIKAN
        // ---------------------------------------------

        if (
          currentGudepId !== null &&
          Number(
            item.gudep_id
          ) ===
          Number(
            currentGudepId
          )
        ) {
          return false;
        }

        const kelurahanData =
          String(
            item[
              kolomKelurahan
            ] || ""
          )
            .trim()
            .toLowerCase();

        if (
          kelurahanData !==
          targetKelurahan
        ) {
          return false;
        }

        const nomorTersimpan =
          ambilNomorKapling(
            item[
              kolomKapling
            ]
          );

        return (
          daftarKapling || []
        ).some(
          (nomor) =>
            nomor &&
            nomorTersimpan.includes(
              normalisasiNomor(
                nomor
              )
            )
        );
      }
    );
  }

  // =====================================================
  // CEK DUPLIKAT NOMOR DALAM SATU GUDEP
  // =====================================================

  function adaNomorDuplikat(
    daftarKapling
  ) {

    const nomorValid =
      (daftarKapling || [])
        .filter(Boolean)
        .map(
          normalisasiNomor
        );

    return (
      new Set(
        nomorValid
      ).size !==
      nomorValid.length
    );
  }

  // =====================================================
  // CEK SEMUA REGU SUDAH MENDAPAT NOMOR
  // =====================================================

  function semuaReguSudahDipilih(
    daftarKapling,
    jumlahRegu
  ) {

    return (
      daftarKapling.length ===
        Number(jumlahRegu) &&
      daftarKapling.every(
        Boolean
      )
    );
  }

  // =====================================================
  // SIMPAN PENEMPATAN
  // =====================================================

  async function handleSimpanPenempatan() {

    if (
      !selectedGudep
    ) {
      return;
    }

    // =================================================
    // VALIDASI PUTRA
    // =================================================

    if (
      selectedGudep.adaPutra
    ) {

      const lengkapPutra =
        semuaReguSudahDipilih(
          formPenempatan.kaplingPutra,
          selectedGudep.jumlahPutra
        );

      if (
        !formPenempatan.kelurahanPutra ||
        !lengkapPutra
      ) {

        alert(
          `Silakan pilih 1 nomor kapling untuk setiap ${selectedGudep.jumlahPutra} Regu Putra.`
        );

        return;
      }

      if (
        adaNomorDuplikat(
          formPenempatan.kaplingPutra
        )
      ) {

        alert(
          "❌ Nomor kapling Putra tidak boleh sama untuk dua regu."
        );

        return;
      }
    }

    // =================================================
    // VALIDASI PUTRI
    // =================================================

    if (
      selectedGudep.adaPutri
    ) {

      const lengkapPutri =
        semuaReguSudahDipilih(
          formPenempatan.kaplingPutri,
          selectedGudep.jumlahPutri
        );

      if (
        !formPenempatan.kelurahanPutri ||
        !lengkapPutri
      ) {

        alert(
          `Silakan pilih 1 nomor kapling untuk setiap ${selectedGudep.jumlahPutri} Regu Putri.`
        );

        return;
      }

      if (
        adaNomorDuplikat(
          formPenempatan.kaplingPutri
        )
      ) {

        alert(
          "❌ Nomor kapling Putri tidak boleh sama untuk dua regu."
        );

        return;
      }
    }

    try {

      setLoading(
        true
      );

      // =================================================
      // AMBIL DATA TERBARU
      // =================================================

      const blokTerbaru =
        await getBlok();

      // =================================================
      // CEK PUTRA
      // =================================================

      if (
        selectedGudep.adaPutra
      ) {

        const bentrokPutra =
          cekBentrokTerbaru(
            blokTerbaru,

            formPenempatan
              .kelurahanPutra,

            formPenempatan
              .kaplingPutra,

            "putra",

            selectedGudep
              .gudep_id
          );

        if (
          bentrokPutra
        ) {

          alert(
            "❌ Salah satu nomor kapling Putra sudah digunakan Gudep lain.\n\nSilakan pilih nomor yang lain."
          );

          setSemuaBlok(
            blokTerbaru || []
          );

          setLoading(
            false
          );

          return;
        }
      }

      // =================================================
      // CEK PUTRI
      // =================================================

      if (
        selectedGudep.adaPutri
      ) {

        const bentrokPutri =
          cekBentrokTerbaru(
            blokTerbaru,

            formPenempatan
              .kelurahanPutri,

            formPenempatan
              .kaplingPutri,

            "putri",

            selectedGudep
              .gudep_id
          );

        if (
          bentrokPutri
        ) {

          alert(
            "❌ Salah satu nomor kapling Putri sudah digunakan Gudep lain.\n\nSilakan pilih nomor yang lain."
          );

          setSemuaBlok(
            blokTerbaru || []
          );

          setLoading(
            false
          );

          return;
        }
      }

      // =================================================
      // FORMAT NOMOR PUTRA
      //
      // Contoh:
      // Regu 1 = 026
      // Regu 2 = 027
      //
      // Disimpan:
      // "026,027"
      // =================================================

      const kaplingPutra =
        selectedGudep.adaPutra
          ? formPenempatan
              .kaplingPutra
              .map(
                (nomor) =>
                  String(
                    nomor
                  ).padStart(
                    3,
                    "0"
                  )
              )
              .join(",")
          : null;

      // =================================================
      // FORMAT NOMOR PUTRI
      // =================================================

      const kaplingPutri =
        selectedGudep.adaPutri
          ? formPenempatan
              .kaplingPutri
              .map(
                (nomor) =>
                  String(
                    nomor
                  ).padStart(
                    3,
                    "0"
                  )
              )
              .join(",")
          : null;

      // =================================================
      // DATA YANG DISIMPAN
      //
      // STRUKTUR LAMA DIPERTAHANKAN
      // =================================================

      const dataSimpan = {

        gudep_id:
          selectedGudep.gudep_id,

        // ---------------------------------------------
        // PUTRA
        // ---------------------------------------------

        kecamatan_putra:
          selectedGudep.adaPutra
            ? formPenempatan
                .kecamatanPutra
            : null,

        kelurahan_putra:
          selectedGudep.adaPutra
            ? formPenempatan
                .kelurahanPutra
            : null,

        kapling_putra:
          kaplingPutra,

        // ---------------------------------------------
        // PUTRI
        // ---------------------------------------------

        kecamatan_putri:
          selectedGudep.adaPutri
            ? formPenempatan
                .kecamatanPutri
            : null,

        kelurahan_putri:
          selectedGudep.adaPutri
            ? formPenempatan
                .kelurahanPutri
            : null,

        kapling_putri:
          kaplingPutri,

        status:
          "Sudah Ditempatkan",
      };

      console.log(
        modeEdit
          ? "DATA PERUBAHAN PENEMPATAN:"
          : "DATA PENEMPATAN BARU:",
        dataSimpan
      );

      // =================================================
      // SIMPAN / UPDATE
      //
      // savePenempatanBlok dipakai tetap sama
      // supaya tidak mengubah service yang sekarang.
      // =================================================

      await savePenempatanBlok(
        dataSimpan
      );

      alert(
        modeEdit
          ? "✅ Perubahan penempatan berhasil disimpan."
          : "✅ Gudep berhasil ditempatkan."
      );

      // =================================================
      // TUTUP MODAL
      // =================================================

      setModalOpen(
        false
      );

      setSelectedGudep(
        null
      );

      setModeEdit(
        false
      );

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

      setLoading(
        false
      );

    }
  }

  // =====================================================
  // TUTUP MODAL
  // =====================================================

  function handleTutupModal() {

    setModalOpen(
      false
    );

    setSelectedGudep(
      null
    );

    setModeEdit(
      false
    );
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
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={
                        item.gudep_id
                      }
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

                      {/* =================================
                          KAPLING
                      ================================= */}

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
                                  item
                                    .penempatan
                                    .kapling_putra
                                )
                                  .map(
                                    (n) =>
                                      `PA${String(
                                        n
                                      ).padStart(
                                        3,
                                        "0"
                                      )}`
                                  )
                                  .join(
                                    ", "
                                  )}

                              </div>
                            )}

                            {item.penempatan.kapling_putri && (

                              <div className="
                                text-pink-700
                                font-bold
                              ">

                                👩{" "}

                                {ambilNomorKapling(
                                  item
                                    .penempatan
                                    .kapling_putri
                                )
                                  .map(
                                    (n) =>
                                      `PI${String(
                                        n
                                      ).padStart(
                                        3,
                                        "0"
                                      )}`
                                  )
                                  .join(
                                    ", "
                                  )}

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

                      {/* =================================
                          PUTRA
                      ================================= */}

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
                            {item.jumlahPutra}
                            {" "}
                            Regu
                          </span>

                        ) : (

                          <span className="
                            text-gray-400
                          ">
                            —
                          </span>

                        )}

                      </td>

                      {/* =================================
                          PUTRI
                      ================================= */}

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
                            {item.jumlahPutri}
                            {" "}
                            Regu
                          </span>

                        ) : (

                          <span className="
                            text-gray-400
                          ">
                            —
                          </span>

                        )}

                      </td>

                      {/* =================================
                          STATUS
                      ================================= */}

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

                      {/* =================================
                          AKSI
                      ================================= */}

                      <td className="
                        border
                        p-3
                        text-center
                      ">

                        {item.status ===
                        "Sudah Ditempatkan" ? (

                          <button
                            onClick={() =>
                              handleEditPenempatan(
                                item
                              )
                            }
                            className="
                              bg-orange-500
                              hover:bg-orange-600
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              font-semibold
                            "
                          >
                            ✏️ Ubah Penempatan
                          </button>

                        ) : (

                          <button
                            onClick={() =>
                              handleTempatkan(
                                item
                              )
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
                max-w-2xl
                max-h-[90vh]
                overflow-y-auto
                p-6
              ">

                {/* =========================================
                    HEADER MODAL
                ========================================= */}

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

                      {modeEdit
                        ? "✏️ Ubah Penempatan Gudep"
                        : "📍 Tempatkan Gudep"}

                    </h2>

                    <p className="
                      text-gray-500
                      mt-1
                    ">
                      {selectedGudep.namaGudep}
                    </p>

                  </div>

                  <button
                    onClick={
                      handleTutupModal
                    }
                    className="
                      text-gray-500
                      hover:text-red-600
                      text-2xl
                    "
                  >
                    ✕
                  </button>

                </div>

                {/* =========================================
                    INFO EDIT
                ========================================= */}

                {modeEdit && (

                  <div className="
                    bg-orange-50
                    border
                    border-orange-200
                    rounded-xl
                    p-4
                    mb-5
                    text-sm
                    text-orange-800
                  ">

                    <strong>
                      ✏️ Mode Ubah Penempatan
                    </strong>

                    <p className="
                      mt-1
                    ">
                      Nomor kapling lama Gudep ini
                      tetap dapat dipilih. Nomor yang
                      digunakan Gudep lain tetap tidak
                      dapat dipilih.
                    </p>

                  </div>

                )}

                {/* =========================================
                    INFO KETENTUAN
                ========================================= */}

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
                      Setiap regu hanya mendapat
                      <strong>
                        {" "}1 nomor kapling.
                      </strong>
                    </li>

                    <li>
                      Regu Putra dan Putri
                      ditampilkan terpisah.
                    </li>

                    <li>
                      Nomor lokal tersedia
                      <strong>
                        {" "}001–015
                      </strong>
                      pada setiap kelurahan.
                    </li>

                    <li>
                      Nomor otomatis menjadi nomor
                      global berdasarkan kelurahan.
                    </li>

                    <li>
                      Putra menggunakan kode
                      <strong>
                        {" "}PA
                      </strong>.
                    </li>

                    <li>
                      Putri menggunakan kode
                      <strong>
                        {" "}PI
                      </strong>.
                    </li>

                    <li>
                      PA026 dan PI026
                      <strong>
                        {" "}boleh sama.
                      </strong>
                    </li>

                  </ul>

                </div>

                {/* =================================================
                    BLOK PUTRA
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

                    {/* KECAMATAN */}

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
                        wilayahCikarangUtara
                          ?.putra
                          ?.kecamatan ||
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

                    {/* KELURAHAN */}

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
                        formPenempatan
                          .kelurahanPutra
                      }
                      onChange={(e) => {

                        setFormPenempatan(
                          (prev) => ({
                            ...prev,

                            kelurahanPutra:
                              e.target.value,

                            kaplingPutra:
                              buatArrayRegu(
                                selectedGudep
                                  .jumlahPutra
                              ),
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
                        mb-5
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
                        (
                          kelurahan
                        ) => (

                          <option
                            key={
                              kelurahan
                            }
                            value={
                              kelurahan
                            }
                          >
                            {kelurahan}
                          </option>

                        )
                      )}

                    </select>

                    {/* ==========================================
                        REGU PUTRA
                    ========================================== */}

                    <div className="
                      space-y-3
                    ">

                      {Array.from(
                        {
                          length:
                            selectedGudep
                              .jumlahPutra,
                        },
                        (
                          _,
                          index
                        ) => {

                          const nomorTerpilih =
                            formPenempatan
                              .kaplingPutra?.[
                              index
                            ] ||
                            "";

                          const pilihan =
                            getPilihanKapling(
                              "putra",

                              formPenempatan
                                .kelurahanPutra,

                              formPenempatan
                                .kaplingPutra,

                              index
                            );

                          return (

                            <div
                              key={
                                `putra-regu-${index}`
                              }
                              className="
                                bg-white
                                border
                                border-blue-200
                                rounded-xl
                                p-4
                              "
                            >

                              <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                                mb-2
                              ">

                                <div>

                                  <div className="
                                    font-bold
                                    text-blue-700
                                  ">
                                    🧑 Regu Putra{" "}
                                    {index + 1}
                                  </div>

                                  <div className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                  ">
                                    Pilih 1 nomor kapling
                                  </div>

                                </div>

                                {nomorTerpilih && (

                                  <span className="
                                    bg-blue-100
                                    text-blue-700
                                    px-3
                                    py-1
                                    rounded-full
                                    text-sm
                                    font-bold
                                  ">

                                    {formatNomorKapling(
                                      nomorTerpilih,
                                      "putra"
                                    )}

                                  </span>

                                )}

                              </div>

                              <select
                                value={
                                  nomorTerpilih
                                }
                                onChange={(e) =>
                                  handleKaplingPutraChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                disabled={
                                  !formPenempatan
                                    .kelurahanPutra
                                }
                                className="
                                  w-full
                                  border
                                  border-blue-300
                                  rounded-lg
                                  p-3
                                  bg-white
                                  text-blue-700
                                  font-bold
                                  cursor-pointer
                                  disabled:bg-gray-100
                                  disabled:cursor-not-allowed
                                "
                              >

                                <option value="">
                                  Pilih Kapling Regu Putra{" "}
                                  {index + 1}
                                </option>

                                {pilihan.map(
                                  ({
                                    nomorGlobal,
                                    sudahTerpakai,
                                    dipakaiReguLain,
                                  }) => {

                                    const disabled =
                                      sudahTerpakai ||
                                      dipakaiReguLain;

                                    return (

                                      <option
                                        key={
                                          nomorGlobal
                                        }
                                        value={
                                          nomorGlobal
                                        }
                                        disabled={
                                          disabled
                                        }
                                      >

                                        {formatNomorKapling(
                                          nomorGlobal,
                                          "putra"
                                        )}

                                        {sudahTerpakai
                                          ? " — Sudah Digunakan"
                                          : dipakaiReguLain
                                          ? " — Dipakai Regu Lain"
                                          : ""}

                                      </option>

                                    );
                                  }
                                )}

                              </select>

                            </div>

                          );
                        }
                      )}

                    </div>

                  </div>

                )}

                {/* =================================================
                    BLOK PUTRI
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

                    {/* KECAMATAN */}

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
                        wilayahCikarangUtara
                          ?.putri
                          ?.kecamatan ||
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

                    {/* KELURAHAN */}

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
                        formPenempatan
                          .kelurahanPutri
                      }
                      onChange={(e) => {

                        setFormPenempatan(
                          (prev) => ({
                            ...prev,

                            kelurahanPutri:
                              e.target.value,

                            kaplingPutri:
                              buatArrayRegu(
                                selectedGudep
                                  .jumlahPutri
                              ),
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
                        mb-5
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
                        (
                          kelurahan
                        ) => (

                          <option
                            key={
                              kelurahan
                            }
                            value={
                              kelurahan
                            }
                          >
                            {kelurahan}
                          </option>

                        )
                      )}

                    </select>

                    {/* ==========================================
                        REGU PUTRI
                    ========================================== */}

                    <div className="
                      space-y-3
                    ">

                      {Array.from(
                        {
                          length:
                            selectedGudep
                              .jumlahPutri,
                        },
                        (
                          _,
                          index
                        ) => {

                          const nomorTerpilih =
                            formPenempatan
                              .kaplingPutri?.[
                              index
                            ] ||
                            "";

                          const pilihan =
                            getPilihanKapling(
                              "putri",

                              formPenempatan
                                .kelurahanPutri,

                              formPenempatan
                                .kaplingPutri,

                              index
                            );

                          return (

                            <div
                              key={
                                `putri-regu-${index}`
                              }
                              className="
                                bg-white
                                border
                                border-pink-200
                                rounded-xl
                                p-4
                              "
                            >

                              <div className="
                                flex
                                items-center
                                justify-between
                                gap-3
                                mb-2
                              ">

                                <div>

                                  <div className="
                                    font-bold
                                    text-pink-700
                                  ">
                                    👩 Regu Putri{" "}
                                    {index + 1}
                                  </div>

                                  <div className="
                                    text-xs
                                    text-gray-500
                                    mt-1
                                  ">
                                    Pilih 1 nomor kapling
                                  </div>

                                </div>

                                {nomorTerpilih && (

                                  <span className="
                                    bg-pink-100
                                    text-pink-700
                                    px-3
                                    py-1
                                    rounded-full
                                    text-sm
                                    font-bold
                                  ">

                                    {formatNomorKapling(
                                      nomorTerpilih,
                                      "putri"
                                    )}

                                  </span>

                                )}

                              </div>

                              <select
                                value={
                                  nomorTerpilih
                                }
                                onChange={(e) =>
                                  handleKaplingPutriChange(
                                    index,
                                    e.target.value
                                  )
                                }
                                disabled={
                                  !formPenempatan
                                    .kelurahanPutri
                                }
                                className="
                                  w-full
                                  border
                                  border-pink-300
                                  rounded-lg
                                  p-3
                                  bg-white
                                  text-pink-700
                                  font-bold
                                  cursor-pointer
                                  disabled:bg-gray-100
                                  disabled:cursor-not-allowed
                                "
                              >

                                <option value="">
                                  Pilih Kapling Regu Putri{" "}
                                  {index + 1}
                                </option>

                                {pilihan.map(
                                  ({
                                    nomorGlobal,
                                    sudahTerpakai,
                                    dipakaiReguLain,
                                  }) => {

                                    const disabled =
                                      sudahTerpakai ||
                                      dipakaiReguLain;

                                    return (

                                      <option
                                        key={
                                          nomorGlobal
                                        }
                                        value={
                                          nomorGlobal
                                        }
                                        disabled={
                                          disabled
                                        }
                                      >

                                        {formatNomorKapling(
                                          nomorGlobal,
                                          "putri"
                                        )}

                                        {sudahTerpakai
                                          ? " — Sudah Digunakan"
                                          : dipakaiReguLain
                                          ? " — Dipakai Regu Lain"
                                          : ""}

                                      </option>

                                    );
                                  }
                                )}

                              </select>

                            </div>

                          );
                        }
                      )}

                    </div>

                  </div>

                )}

                {/* =================================================
                    RINGKASAN
                ================================================= */}

                <div className="
                  border
                  border-gray-200
                  rounded-xl
                  p-4
                  mb-5
                  bg-gray-50
                ">

                  <h3 className="
                    font-bold
                    text-gray-700
                    mb-3
                  ">
                    📋 Ringkasan Penempatan
                  </h3>

                  {/* PUTRA */}

                  {selectedGudep.adaPutra && (

                    <div className="
                      mb-4
                    ">

                      <div className="
                        text-sm
                        font-bold
                        text-blue-700
                        mb-1
                      ">
                        🧑 Regu Putra
                      </div>

                      <div className="
                        space-y-1
                        text-sm
                      ">

                        {formPenempatan
                          .kaplingPutra
                          .map(
                            (
                              nomor,
                              index
                            ) => (

                              <div
                                key={
                                  `ringkas-putra-${index}`
                                }
                                className="
                                  flex
                                  justify-between
                                  border-b
                                  border-gray-200
                                  py-1
                                "
                              >

                                <span>
                                  Regu Putra{" "}
                                  {index + 1}
                                </span>

                                <strong className="
                                  text-blue-700
                                ">

                                  {nomor
                                    ? formatNomorKapling(
                                        nomor,
                                        "putra"
                                      )
                                    : "Belum dipilih"}

                                </strong>

                              </div>

                            )
                          )}

                      </div>

                    </div>

                  )}

                  {/* PUTRI */}

                  {selectedGudep.adaPutri && (

                    <div>

                      <div className="
                        text-sm
                        font-bold
                        text-pink-700
                        mb-1
                      ">
                        👩 Regu Putri
                      </div>

                      <div className="
                        space-y-1
                        text-sm
                      ">

                        {formPenempatan
                          .kaplingPutri
                          .map(
                            (
                              nomor,
                              index
                            ) => (

                              <div
                                key={
                                  `ringkas-putri-${index}`
                                }
                                className="
                                  flex
                                  justify-between
                                  border-b
                                  border-gray-200
                                  py-1
                                "
                              >

                                <span>
                                  Regu Putri{" "}
                                  {index + 1}
                                </span>

                                <strong className="
                                  text-pink-700
                                ">

                                  {nomor
                                    ? formatNomorKapling(
                                        nomor,
                                        "putri"
                                      )
                                    : "Belum dipilih"}

                                </strong>

                              </div>

                            )
                          )}

                      </div>

                    </div>

                  )}

                </div>

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
                    onClick={
                      handleTutupModal
                    }
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
                          !formPenempatan
                            .kelurahanPutra ||
                          !semuaReguSudahDipilih(
                            formPenempatan
                              .kaplingPutra,
                            selectedGudep
                              .jumlahPutra
                          )
                        )
                      )

                      ||

                      (
                        selectedGudep.adaPutri &&
                        (
                          !formPenempatan
                            .kelurahanPutri ||
                          !semuaReguSudahDipilih(
                            formPenempatan
                              .kaplingPutri,
                            selectedGudep
                              .jumlahPutri
                          )
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

                    {modeEdit
                      ? "💾 Simpan Perubahan"
                      : "💾 Simpan Penempatan"}

                  </button>

                </div>

              </div>

            </div>

          )}

      </div>

    </div>
  );
}

