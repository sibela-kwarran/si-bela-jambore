import { useEffect, useState } from "react";

import {
  getPengaturanPendaftaran,
  updatePengaturanPendaftaran,
  bukaPendaftaran,
  tutupPendaftaran,
} from "../../services/pengaturanPendaftaranService";

export default function PengaturanPendaftaran() {

  const [data, setData] = useState(null);

  const [status, setStatus] = useState("dibuka");
  const [tanggalTutup, setTanggalTutup] = useState("");
  const [jamTutup, setJamTutup] = useState("00:00");
  const [pesanPenutupan, setPesanPenutupan] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  // ========================================
  // LOAD DATA
  // ========================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      setLoading(true);

      const hasil =
        await getPengaturanPendaftaran();

      if (!hasil) {

        alert(
          "Pengaturan pendaftaran belum tersedia."
        );

        return;
      }

      setData(hasil);

      setStatus(
        hasil.status || "dibuka"
      );

      setTanggalTutup(
        hasil.tanggal_tutup || ""
      );

      setJamTutup(
        hasil.jam_tutup
          ? String(hasil.jam_tutup).slice(0, 5)
          : "00:00"
      );

      setPesanPenutupan(
        hasil.pesan_penutupan ||
        "Pendaftaran Jambore Ranting Kwarran Cikarang Utara telah ditutup."
      );

    } catch (error) {

      console.error(
        "GAGAL LOAD PENGATURAN:",
        error
      );

      alert(
        "Gagal mengambil pengaturan pendaftaran.\n\n" +
        error.message
      );

    } finally {

      setLoading(false);

    }

  }


  // ========================================
  // SIMPAN PENGATURAN
  // ========================================

  async function handleSimpan() {

    if (!data?.id) {

      alert(
        "ID pengaturan tidak ditemukan."
      );

      return;
    }


    if (!tanggalTutup) {

      alert(
        "Tanggal penutupan wajib diisi."
      );

      return;
    }


    if (!jamTutup) {

      alert(
        "Jam penutupan wajib diisi."
      );

      return;
    }


    try {

      setSaving(true);

      const hasil =
        await updatePengaturanPendaftaran(
          data.id,
          {
            status,
            tanggal_tutup: tanggalTutup,
            jam_tutup: jamTutup,
            pesan_penutupan:
              pesanPenutupan,
          }
        );

      setData(hasil);

      alert(
        "✅ Pengaturan pendaftaran berhasil disimpan."
      );

    } catch (error) {

      console.error(
        "GAGAL SIMPAN:",
        error
      );

      alert(
        "❌ Gagal menyimpan pengaturan.\n\n" +
        error.message
      );

    } finally {

      setSaving(false);

    }

  }


  // ========================================
  // TUTUP SEKARANG
  // ========================================

  async function handleTutup() {

    if (!data?.id) return;


    const yakin = window.confirm(
      "Apakah Anda yakin ingin MENUTUP pendaftaran sekarang?\n\n" +
      "Seluruh Operator Gudep tidak akan dapat mengakses dashboard dan menu pendaftaran."
    );


    if (!yakin) return;


    try {

      setSaving(true);

      const hasil =
        await tutupPendaftaran(data.id);

      setData(hasil);
      setStatus("ditutup");

      alert(
        "🔴 PENDAFTARAN BERHASIL DITUTUP."
      );

    } catch (error) {

      console.error(
        "GAGAL MENUTUP:",
        error
      );

      alert(
        "❌ Gagal menutup pendaftaran.\n\n" +
        error.message
      );

    } finally {

      setSaving(false);

    }

  }


  // ========================================
  // BUKA KEMBALI
  // ========================================

  async function handleBuka() {

    if (!data?.id) return;


    const yakin = window.confirm(
      "Buka kembali pendaftaran untuk seluruh Operator Gudep?"
    );


    if (!yakin) return;


    try {

      setSaving(true);

      const hasil =
        await bukaPendaftaran(data.id);

      setData(hasil);
      setStatus("dibuka");

      alert(
        "🟢 PENDAFTARAN BERHASIL DIBUKA KEMBALI."
      );

    } catch (error) {

      console.error(
        "GAGAL MEMBUKA:",
        error
      );

      alert(
        "❌ Gagal membuka pendaftaran.\n\n" +
        error.message
      );

    } finally {

      setSaving(false);

    }

  }


  // ========================================
  // LOADING
  // ========================================

  if (loading) {

    return (

      <div className="flex items-center justify-center min-h-[400px]">

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
            Memuat pengaturan pendaftaran...
          </p>

        </div>

      </div>

    );

  }


  // ========================================
  // HALAMAN
  // ========================================

  return (

    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="mb-6">

        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            text-gray-800
          "
        >
          ⚙️ Pengaturan Pendaftaran
        </h1>

        <p className="text-gray-500 mt-1">
          Atur status dan batas waktu pendaftaran
          Jambore Ranting.
        </p>

      </div>


      {/* STATUS */}

      <div
        className={`
          rounded-2xl
          p-5
          sm:p-6
          mb-6
          border
          ${
            status === "dibuka"
              ? "bg-green-50 border-green-200"
              : "bg-red-50 border-red-200"
          }
        `}
      >

        <p className="text-sm text-gray-500 mb-2">
          Status Pendaftaran Saat Ini
        </p>

        <div
          className={`
            text-2xl
            sm:text-3xl
            font-bold
            ${
              status === "dibuka"
                ? "text-green-700"
                : "text-red-700"
            }
          `}
        >

          {status === "dibuka"
            ? "🟢 PENDAFTARAN DIBUKA"
            : "🔴 PENDAFTARAN DITUTUP"}

        </div>

        <p className="text-sm text-gray-500 mt-2">

          {status === "dibuka"
            ? "Operator Gudep dapat mengakses aplikasi."
            : "Operator Gudep tidak dapat mengakses dashboard dan menu pendaftaran."}

        </p>

      </div>


      {/* FORM */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          border
          p-5
          sm:p-7
        "
      >

        <h2
          className="
            text-xl
            font-bold
            text-gray-800
            mb-6
          "
        >
          Pengaturan Batas Waktu
        </h2>


        {/* TANGGAL */}

        <div className="mb-5">

          <label className="block font-semibold mb-2">

            Tanggal Penutupan

          </label>

          <input
            type="date"
            value={tanggalTutup}
            onChange={(e) =>
              setTanggalTutup(e.target.value)
            }
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-amber-500
            "
          />

        </div>


        {/* JAM */}

        <div className="mb-5">

          <label className="block font-semibold mb-2">

            Jam Penutupan
            <span className="font-normal text-gray-500 ml-2">
              (WIB)
            </span>

          </label>

          <input
            type="time"
            value={jamTutup}
            onChange={(e) =>
              setJamTutup(e.target.value)
            }
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              outline-none
              focus:ring-2
              focus:ring-amber-500
            "
          />

        </div>


        {/* PESAN */}

        <div className="mb-6">

          <label className="block font-semibold mb-2">

            Pesan Saat Pendaftaran Ditutup

          </label>

          <textarea
            value={pesanPenutupan}
            onChange={(e) =>
              setPesanPenutupan(e.target.value)
            }
            rows={4}
            className="
              w-full
              border
              rounded-lg
              px-4
              py-3
              outline-none
              resize-none
              focus:ring-2
              focus:ring-amber-500
            "
          />

        </div>


        {/* SIMPAN */}

        <button
          onClick={handleSimpan}
          disabled={saving}
          className="
            w-full
            bg-amber-700
            hover:bg-amber-800
            disabled:bg-gray-400
            text-white
            font-semibold
            py-3
            rounded-lg
            transition
            shadow
          "
        >

          {saving
            ? "Menyimpan..."
            : "💾 Simpan Pengaturan"}

        </button>

      </div>


      {/* KONTROL STATUS */}

      <div
        className="
          bg-white
          rounded-2xl
          shadow
          border
          p-5
          sm:p-7
          mt-6
        "
      >

        <h2
          className="
            text-xl
            font-bold
            text-gray-800
            mb-2
          "
        >
          Kontrol Pendaftaran
        </h2>

        <p className="text-gray-500 mb-6">
          Gunakan tombol berikut untuk membuka atau
          menutup pendaftaran secara manual.
        </p>


        {status === "dibuka" ? (

          <button
            onClick={handleTutup}
            disabled={saving}
            className="
              w-full
              bg-red-600
              hover:bg-red-700
              disabled:bg-gray-400
              text-white
              font-bold
              py-4
              rounded-xl
              transition
              shadow
            "
          >

            {saving
              ? "Memproses..."
              : "🔴 Tutup Pendaftaran Sekarang"}

          </button>

        ) : (

          <button
            onClick={handleBuka}
            disabled={saving}
            className="
              w-full
              bg-green-600
              hover:bg-green-700
              disabled:bg-gray-400
              text-white
              font-bold
              py-4
              rounded-xl
              transition
              shadow
            "
          >

            {saving
              ? "Memproses..."
              : "🟢 Buka Kembali Pendaftaran"}

          </button>

        )}

      </div>


      {/* INFORMASI */}

      <div
        className="
          mt-6
          bg-blue-50
          border
          border-blue-200
          rounded-xl
          p-5
        "
      >

        <p className="font-bold text-blue-800 mb-2">
          ℹ️ Informasi
        </p>

        <ul className="text-sm text-blue-700 space-y-1">

          <li>
            • Penutupan berdasarkan tanggal dan jam
              menggunakan waktu WIB.
          </li>

          <li>
            • Jika status ditutup secara manual,
              Operator langsung terkunci.
          </li>

          <li>
            • Membuka kembali pendaftaran dapat
              dilakukan kapan saja oleh Admin.
          </li>

          <li>
            • Perubahan ini tidak memerlukan
              deploy ulang ke Vercel.
          </li>

        </ul>

      </div>

    </div>

  );

}