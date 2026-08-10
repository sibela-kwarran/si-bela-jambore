import { useState, useEffect } from "react";

import {
  uploadFile,
  getBerkas,
  saveBerkas,
  updateBerkas,
  deleteBerkas,
  deleteFile,
  MAX_FILE_SIZE,
} from "../../services/berkasService";

import {
  getProfilGudep,
} from "../../services/profilGudepService";


// ======================================================
// DOWNLOAD TEMPLATE
// ======================================================

function downloadTemplate(file) {

  const link = document.createElement("a");

  link.href = file;

  link.download = file
    .split("/")
    .pop();

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}


// ======================================================
// FORMAT UKURAN FILE
// ======================================================

function formatMB(bytes) {

  return (
    bytes /
    (1024 * 1024)
  ).toFixed(2);
}


// ======================================================
// KOMPONEN
// ======================================================

export default function UploadBerkas() {

  const [berkas, setBerkas] = useState({
    suratTugas: null,
    suratIzin: null,
  });

  const [profil, setProfil] =
    useState({});

  const [loading, setLoading] =
    useState(false);


  // ====================================================
  // LOAD DATA
  // ====================================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      const profilGudep =
        await getProfilGudep();

      setProfil(
        profilGudep || {}
      );


      const data =
        await getBerkas();

      console.log(
        "DATA BERKAS SUPABASE:",
        data
      );


      if (
        data &&
        data.length > 0
      ) {

        const item = data[0];

        console.log(
          "ITEM BERKAS:",
          item
        );


        setBerkas({

          suratTugas:
            item.surat_tugas
              ? {
                  id: item.id,
                  nama:
                    "Surat_Tugas_Mabigus.pdf",
                  url:
                    item.surat_tugas,
                }
              : null,

          suratIzin:
            item.surat_izin
              ? {
                  id: item.id,
                  nama:
                    "Surat_Izin_Orang_Tua.pdf",
                  url:
                    item.surat_izin,
                }
              : null,

        });

      }

    } catch (err) {

      console.error(
        "LOAD BERKAS ERROR:",
        err
      );

    }

  }


  // ====================================================
  // UPLOAD BERKAS
  // ====================================================

  async function uploadBerkas(
    e,
    jenis
  ) {

    const file =
      e.target.files?.[0];


    // reset input agar file yang sama
    // bisa dipilih kembali
    e.target.value = "";


    if (!file) return;


    // ==================================================
    // CEK PDF
    // ==================================================

    if (
      file.type !==
      "application/pdf"
    ) {

      alert(
        "❌ Berkas harus dalam format PDF."
      );

      return;
    }


    // ==================================================
    // CEK UKURAN
    // ==================================================

    if (
      file.size >
      MAX_FILE_SIZE
    ) {

      alert(
        `❌ Ukuran file terlalu besar.\n\n` +
        `Ukuran file: ${formatMB(file.size)} MB\n` +
        `Maksimal: 5 MB`
      );

      return;
    }


    // ==================================================
    // CEK PROFIL GUDEP
    // ==================================================

    if (!profil?.id) {

      alert(
        "Data Gudep belum ditemukan. Silakan login kembali."
      );

      return;
    }


    try {

      setLoading(true);


      // =================================================
      // BERKAS LAMA
      // =================================================

      const dataLama =
        await getBerkas();

      const itemLama =
        dataLama?.length > 0
          ? dataLama[0]
          : null;


      const urlLama =
        jenis === "suratTugas"
          ? itemLama?.surat_tugas
          : itemLama?.surat_izin;


      // =================================================
      // UPLOAD FILE BARU
      // =================================================

      console.log(
        "UPLOAD BERKAS:",
        file.name
      );

      const url =
        await uploadFile(
          file,
          jenis
        );


      console.log(
        "URL FILE BARU:",
        url
      );


      // =================================================
      // DATA DATABASE
      // =================================================

      const data = {

        gudep_id:
          profil.id,

        surat_tugas:
          jenis === "suratTugas"
            ? url
            : itemLama?.surat_tugas ||
              null,

        surat_izin:
          jenis === "suratIzin"
            ? url
            : itemLama?.surat_izin ||
              null,

        status:
          "Lengkap",

      };


      console.log(
        "DATA BERKAS DIKIRIM:",
        JSON.stringify(
          data,
          null,
          2
        )
      );


      // =================================================
      // SIMPAN / UPDATE DATABASE
      // =================================================

      if (itemLama) {

        await updateBerkas(
          itemLama.id,
          data
        );

      } else {

        await saveBerkas(
          data
        );

      }


      // =================================================
      // HAPUS FILE LAMA
      // =================================================

      if (
        urlLama &&
        urlLama !== url
      ) {

        try {

          await deleteFile(
            urlLama
          );

          console.log(
            "FILE LAMA BERHASIL DIHAPUS"
          );

        } catch (
          deleteError
        ) {

          // File baru sudah tersimpan,
          // jadi jangan gagalkan upload.
          console.warn(
            "FILE LAMA GAGAL DIHAPUS:",
            deleteError
          );

        }

      }


      // =================================================
      // UPDATE UI
      // =================================================

      setBerkas(
        (prev) => ({

          ...prev,

          [jenis]: {

            id:
              itemLama?.id,

            nama:
              file.name,

            url:
              url,

          },

        })
      );


      alert(
        "✅ Berkas berhasil diupload."
      );


    } catch (err) {

      console.error(
        "UPLOAD ERROR:",
        err
      );


      alert(
        "❌ Gagal upload berkas.\n\n" +
        (
          err?.message ||
          "Terjadi kesalahan."
        )
      );

    } finally {

      setLoading(false);

    }

  }


  // ====================================================
  // HAPUS BERKAS
  // ====================================================

  async function hapusBerkas(
    jenis
  ) {

    const file =
      berkas[jenis];


    if (!file) {

      alert(
        "Berkas tidak ditemukan."
      );

      return;
    }


    const konfirmasi =
      window.confirm(
        `Apakah Anda yakin ingin menghapus ${
          jenis === "suratTugas"
            ? "Surat Tugas Mabigus"
            : "Surat Izin Orang Tua"
        }?`
      );


    if (!konfirmasi) {
      return;
    }


    try {

      setLoading(true);


      // =================================================
      // AMBIL DATA DATABASE TERBARU
      // =================================================

      const dataLama =
        await getBerkas();

      const item =
        dataLama?.length > 0
          ? dataLama[0]
          : null;


      if (!item) {

        setBerkas(
          (prev) => ({
            ...prev,
            [jenis]: null,
          })
        );

        return;
      }


      // =================================================
      // TENTUKAN FIELD YANG DIHAPUS
      // =================================================

      const field =
        jenis === "suratTugas"
          ? "surat_tugas"
          : "surat_izin";


      const urlYangDihapus =
        item[field];


      // =================================================
      // DATA BARU DATABASE
      // =================================================

      const dataUpdate = {

        gudep_id:
          item.gudep_id,

        surat_tugas:
          jenis === "suratTugas"
            ? null
            : item.surat_tugas ||
              null,

        surat_izin:
          jenis === "suratIzin"
            ? null
            : item.surat_izin ||
              null,

        status:
          (
            jenis === "suratTugas"
              ? !item.surat_izin
              : !item.surat_tugas
          )
            ? "Belum Lengkap"
            : "Lengkap",

      };


      // =================================================
      // UPDATE DATABASE
      // =================================================

      const masihAdaBerkas =
        dataUpdate.surat_tugas ||
        dataUpdate.surat_izin;


      if (masihAdaBerkas) {

        await updateBerkas(
          item.id,
          dataUpdate
        );

      } else {

        // Kalau keduanya sudah kosong,
        // hapus row database.
        await deleteBerkas(
          item.id
        );

      }


      // =================================================
      // HAPUS FILE STORAGE
      // =================================================

      if (urlYangDihapus) {

        try {

          await deleteFile(
            urlYangDihapus
          );

        } catch (
          storageError
        ) {

          console.warn(
            "FILE STORAGE GAGAL DIHAPUS:",
            storageError
          );

        }

      }


      // =================================================
      // UPDATE UI
      // =================================================

      setBerkas(
        (prev) => ({

          ...prev,

          [jenis]: null,

        })
      );


      alert(
        "✅ Berkas berhasil dihapus."
      );


    } catch (err) {

      console.error(
        "GAGAL HAPUS:",
        err
      );


      alert(
        "❌ Gagal menghapus berkas.\n\n" +
        (
          err?.message ||
          "Terjadi kesalahan."
        )
      );

    } finally {

      setLoading(false);

    }

  }


  // ====================================================
  // PROGRESS
  // ====================================================

  const jumlahUpload =
    (berkas.suratTugas
      ? 1
      : 0) +
    (berkas.suratIzin
      ? 1
      : 0);


  const persen =
    (jumlahUpload / 2) *
    100;


  // ====================================================
  // RENDER
  // ====================================================

  return (

    <div className="space-y-6">


      {/* ================================================
          SURAT TUGAS
      ================================================= */}

      <div className="space-y-3">

        <h3 className="text-lg font-bold">
          1. Surat Tugas Mabigus
        </h3>


        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={() =>
              downloadTemplate(
                "/template/Surat_Tugas_Mabigus.docx"
              )
            }
            className="bg-blue-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg hover:bg-blue-700"
          >
            ⬇ Download Template
          </button>


          <label
            className={`bg-green-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg cursor-pointer text-center ${
              loading
                ? "opacity-50 pointer-events-none"
                : "hover:bg-green-800"
            }`}
          >

            ⬆ Upload Berkas PDF

            <input
              type="file"
              accept="application/pdf,.pdf"
              hidden
              disabled={loading}
              onChange={(e) =>
                uploadBerkas(
                  e,
                  "suratTugas"
                )
              }
            />

          </label>


          <button
            type="button"
            disabled={
              loading ||
              !berkas.suratTugas
            }
            onClick={() =>
              hapusBerkas(
                "suratTugas"
              )
            }
            className="bg-red-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg disabled:opacity-50 hover:bg-red-700"
          >
            🗑 Hapus
          </button>

        </div>


        <p className="text-sm text-gray-500">
          Format: PDF • Maksimal 5 MB
        </p>


        {berkas.suratTugas && (

          <div className="text-sm text-green-700 font-medium">

            ✅ {berkas.suratTugas.nama}

          </div>

        )}

      </div>


      {/* ================================================
          SURAT IZIN
      ================================================= */}

      <div className="space-y-3">

        <h3 className="text-lg font-bold">
          2. Surat Izin Orang Tua
        </h3>


        <p className="text-sm text-gray-600">
          Template akan mengikuti jumlah
          peserta yang telah didaftarkan.
        </p>


        <div className="flex flex-wrap gap-3">

          <button
            type="button"
            onClick={() =>
              downloadTemplate(
                "/template/Surat_Izin_Orang_Tua.docx"
              )
            }
            className="bg-blue-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg hover:bg-blue-700"
          >
            ⬇ Download Template
          </button>


          <label
            className={`bg-green-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg cursor-pointer ${
              loading
                ? "opacity-50 pointer-events-none"
                : "hover:bg-green-800"
            }`}
          >

            ⬆ Upload Berkas PDF

            <input
              type="file"
              accept="application/pdf,.pdf"
              hidden
              disabled={loading}
              onChange={(e) =>
                uploadBerkas(
                  e,
                  "suratIzin"
                )
              }
            />

          </label>


          <button
            type="button"
            disabled={
              loading ||
              !berkas.suratIzin
            }
            onClick={() =>
              hapusBerkas(
                "suratIzin"
              )
            }
            className="bg-red-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg disabled:opacity-50 hover:bg-red-700"
          >
            🗑 Hapus
          </button>

        </div>


        <p className="text-sm text-gray-500">
          Format: PDF • Maksimal 5 MB
        </p>


        {berkas.suratIzin && (

          <div className="text-sm text-green-700 font-medium">

            ✅ {berkas.suratIzin.nama}

          </div>

        )}

      </div>


      {/* ================================================
          PROGRESS
      ================================================= */}

      <div className="pt-4">

        <div className="flex justify-between items-center mb-2">

          <span className="font-semibold">
            Progress Kelengkapan Berkas
          </span>

          <span className="font-bold">
            {persen}%
          </span>

        </div>


        <p className="text-sm text-gray-600 mb-2">

          {jumlahUpload} dari 2 berkas
          telah tersedia

        </p>


        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-300"
            style={{
              width: `${persen}%`,
            }}
          />

        </div>

      </div>


      {/* ================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="text-sm text-blue-600 font-medium">

          ⏳ Sedang memproses berkas...

        </div>

      )}

    </div>

  );
}