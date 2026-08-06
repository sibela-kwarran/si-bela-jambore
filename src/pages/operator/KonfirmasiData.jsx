import { useEffect, useState } from "react";

import { getProfilGudep } from "../../services/profilGudepService";
import { getPembina } from "../../services/pembinaService";
import { getRegu } from "../../services/reguService";
import { getPeserta } from "../../services/pesertaService";
import { getBerkas } from "../../services/berkasService";
import { getPembayaran } from "../../services/pembayaranService";


import {
  savePendaftaran,
  getPendaftaranByGudep,
  kirimUlangPendaftaran,
  tandaiPerluPerbaikan,
} from "../../services/pendaftaranService";



export default function KonfirmasiData() {

  const [loading, setLoading] = useState(true);

  const [profil, setProfil] = useState(null);

  const [pembina, setPembina] = useState([]);

  const [regu, setRegu] = useState([]);

  const [peserta, setPeserta] = useState([]);

  const [berkas, setBerkas] = useState({});

  const [pembayaran, setPembayaran] = useState({});

  const [setuju, setSetuju] = useState(false);

  const [sudahKirim, setSudahKirim] = useState({
    sudahKirim: false,
    status: "",
    tanggalKirim: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {

      setLoading(true);

      const [
  dataProfil,
  dataPembina,
  dataRegu,
  dataPeserta,
  dataBerkas,
  dataPembayaran,
] = await Promise.all([
  getProfilGudep(),
  getPembina(),
  getRegu(),
  getPeserta(),
  getBerkas(),
  getPembayaran(),
]);

      console.log(
  "HASIL PROFIL DARI SUPABASE:",
  dataProfil
);

setProfil(dataProfil || {});

      setPembina(dataPembina || []);

      setRegu(dataRegu || []);

      setPeserta(dataPeserta || []);

      // sementara masih localStorage
      if (dataBerkas.length > 0) {

  setBerkas({
    suratTugas: dataBerkas[0].surat_tugas,
    suratIzin: dataBerkas[0].surat_izin,
  });

} else {

  setBerkas({});

}

// Pembayaran dari Supabase
setPembayaran(dataPembayaran ?? {});

      // ===============================
// CEK STATUS PENDAFTARAN DARI SUPABASE
// ===============================

if (dataProfil?.id) {

  const dataPendaftaran =
    await getPendaftaranByGudep(dataProfil.id);

  console.log(
    "STATUS PENDAFTARAN DARI SUPABASE:",
    dataPendaftaran
  );

  if (dataPendaftaran) {

  console.log(
    "PENDAFTARAN SUDAH ADA:",
    dataPendaftaran
  );

  setSudahKirim({

    sudahKirim: true,

    status:
      dataPendaftaran.status || "Menunggu",

    tanggalKirim:
      dataPendaftaran.tanggal_kirim || "",

  });

} else {

  setSudahKirim({

    sudahKirim: false,

    status: "",

    tanggalKirim: "",

  });

}

}

      console.log("=== DATA KONFIRMASI ===");
      console.log("Profil :", dataProfil);
      console.log("Pembina :", dataPembina.length);
      console.log("Regu :", dataRegu.length);
      console.log("Peserta :", dataPeserta.length);
console.log("Berkas :", dataBerkas);
console.log("Pembayaran :", dataPembayaran);
    } catch (err) {

      console.error(err);

      alert(err.message);

    } finally {

      setLoading(false);

    }
  }


// ======================================================
// OPERATOR INGIN MENGEDIT DATA SETELAH PENDAFTARAN DIKIRIM
// ======================================================
async function editPendaftaran() {

  if (!profil?.id) {

    alert(
      "ID Gudep tidak ditemukan."
    );

    return;
  }

  try {

    const konfirmasi = window.confirm(
      "Data pendaftaran sudah pernah dikirim.\n\n" +
      "Jika Anda ingin mengubah data Pembina, Regu, Peserta, " +
      "atau data lainnya, status pendaftaran akan diubah menjadi " +
      "\"Perlu Perbaikan\" dan harus dikirim ulang setelah selesai diedit.\n\n" +
      "Lanjutkan?"
    );

    if (!konfirmasi) return;


    // ==========================================
    // UPDATE STATUS DI SUPABASE
    // ==========================================

    await tandaiPerluPerbaikan(
      profil.id
    );


    // ==========================================
    // UPDATE STATE
    // ==========================================

    setSudahKirim({

      sudahKirim: true,

      status: "Perlu Perbaikan",

      tanggalKirim:
        sudahKirim.tanggalKirim || ""

    });


    // ==========================================
    // RESET PERSETUJUAN
    // ==========================================

    setSetuju(false);


    alert(
      "✏️ Mode edit diaktifkan.\n\n" +
      "Silakan lakukan perubahan data. " +
      "Setelah selesai, kembali ke menu Konfirmasi Data " +
      "dan kirim ulang pendaftaran."
    );

  } catch (error) {

    console.error(
      "GAGAL MENGAKTIFKAN EDIT:",
      error
    );

    alert(
      "Gagal mengaktifkan mode edit: " +
      (
        error?.message ||
        "Terjadi kesalahan."
      )
    );

  }

}




  async function kirimPendaftaran() {

  console.log("=== KLIK KIRIM PENDAFTARAN ===");
  console.log("PROFIL :", profil);


  // ==========================================
  // 1. CEK ID GUDEP
  // ==========================================

  if (!profil?.id) {

    alert(
      "ID Gudep tidak ditemukan. Silakan simpan Profil Gudep terlebih dahulu."
    );

    return;

  }


  // ==========================================
  // 2. CEK PERSETUJUAN
  // ==========================================

  if (!setuju) {

    alert(
      "Silakan centang pernyataan bahwa seluruh data sudah benar."
    );

    return;

  }


  try {

    // ========================================
    // 3. CEK PENDAFTARAN YANG SUDAH ADA
    // ========================================

    const existing =
      await getPendaftaranByGudep(
        profil.id
      );


    console.log(
      "PENDAFTARAN EXISTING:",
      existing
    );


    // ========================================
    // 4. SIAPKAN DATA
    // ========================================

    const dataPendaftaran = {

      gudep_id:
        Number(profil.id),

      nama_gudep:
        profil.nama_pangkalan,

      jumlah_pembina:
        pembina.length,

      jumlah_regu:
        regu.length,

      jumlah_peserta:
        peserta.length,

      status:
        "Menunggu Verifikasi",

      tanggal_kirim:
        new Date().toISOString(),

      catatan_admin:
        existing?.status === "Perlu Perbaikan"
          ? existing.catatan_admin || ""
          : ""

    };


    console.log(
      "DATA PENDAFTARAN:",
      dataPendaftaran
    );


    // ========================================
    // 5. BELUM PERNAH MENDAFTAR
    // ========================================

    if (!existing) {

      console.log(
        "BELUM ADA PENDAFTARAN → INSERT"
      );


      const hasil =
        await savePendaftaran(
          dataPendaftaran
        );


      console.log(
        "HASIL INSERT:",
        hasil
      );


      const statusBaru = {

        sudahKirim: true,

        status:
          "Menunggu Verifikasi",

        tanggalKirim:
          new Date().toLocaleDateString(
            "id-ID"
          )

      };


      setSudahKirim(
        statusBaru
      );


      localStorage.setItem(
        "statusPendaftaran",
        JSON.stringify(
          statusBaru
        )
      );


      alert(
        "✅ Pendaftaran berhasil dikirim dan menunggu verifikasi panitia."
      );


      return;

    }


    // ========================================
    // 6. JIKA PERLU PERBAIKAN
    // ========================================

    if (
      existing.status ===
      "Perlu Perbaikan"
    ) {

      console.log(
        "STATUS PERLU PERBAIKAN → UPDATE"
      );


      const hasil =
        await kirimUlangPendaftaran(
          existing.id,
          dataPendaftaran
        );


      console.log(
        "HASIL KIRIM ULANG:",
        hasil
      );


      const statusBaru = {

        sudahKirim: true,

        status:
          "Menunggu Verifikasi",

        tanggalKirim:
          new Date().toLocaleDateString(
            "id-ID"
          )

      };


      setSudahKirim(
        statusBaru
      );


      localStorage.setItem(
        "statusPendaftaran",
        JSON.stringify(
          statusBaru
        )
      );


      alert(
        "✅ Data berhasil diperbaiki dan dikirim kembali untuk verifikasi."
      );


      return;

    }


    // ========================================
    // 7. MASIH MENUNGGU VERIFIKASI
    // ========================================

    if (
      existing.status ===
      "Menunggu Verifikasi"
    ) {

      setSudahKirim({

        sudahKirim: true,

        status:
          existing.status,

        tanggalKirim:
          existing.tanggal_kirim || ""

      });


      alert(
        "⚠️ Pendaftaran masih menunggu verifikasi panitia."
      );


      return;

    }


    // ========================================
    // 8. SUDAH TERVERIFIKASI
    // ========================================

    if (
      existing.status ===
      "Terverifikasi"
    ) {

      setSudahKirim({

        sudahKirim: true,

        status:
          existing.status,

        tanggalKirim:
          existing.tanggal_kirim || ""

      });


      alert(
        "✅ Pendaftaran Gudep sudah terverifikasi."
      );


      return;

    }


    // ========================================
    // 9. DITOLAK
    // ========================================

    if (
      existing.status ===
      "Ditolak"
    ) {

      setSudahKirim({

        sudahKirim: true,

        status:
          existing.status,

        tanggalKirim:
          existing.tanggal_kirim || ""

      });


      alert(
        "❌ Pendaftaran Gudep telah ditolak oleh panitia."
      );


      return;

    }


    // ========================================
    // 10. STATUS LAIN
    // ========================================

    setSudahKirim({

      sudahKirim: true,

      status:
        existing.status || "Menunggu",

      tanggalKirim:
        existing.tanggal_kirim || ""

    });


    alert(
      `Pendaftaran sudah memiliki status: ${
        existing.status || "Menunggu"
      }`
    );


  } catch (error) {

    console.error(
      "GAGAL PROSES PENDAFTARAN:",
      error
    );


    alert(
      "Pendaftaran gagal dikirim: " +
      (
        error?.message ||
        "Terjadi kesalahan."
      )
    );

  }

}









  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-8">
        Memuat data...
      </div>
    );
  }

    return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-green-700">
        Konfirmasi Data
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <table className="w-full">

          <tbody>

            <tr className="border-b">

              <td className="py-3 font-semibold">
                Pangkalan
              </td>

              <td>
                {profil?.nama_pangkalan || "-"}
              </td>

            </tr>

            <tr className="border-b">

              <td className="py-3 font-semibold">
                Pembina
              </td>

              <td>
                {pembina.length} Orang
              </td>

            </tr>

            <tr className="border-b">

              <td className="py-3 font-semibold">
                Regu
              </td>

              <td>
                {regu.length} Regu
              </td>

            </tr>

            <tr className="border-b">

              <td className="py-3 font-semibold">
                Peserta
              </td>

              <td>
                {peserta.length} Orang
              </td>

            </tr>

            <tr className="border-b">

              <td className="py-3 font-semibold">
                Berkas
              </td>

              <td>

                {berkas.suratTugas &&
                berkas.suratIzin
                  ? "✅ Lengkap"
                  : "❌ Belum Lengkap"}

              </td>

            </tr>

            <tr>

              <td className="py-3 font-semibold">
                Pembayaran
              </td>

              <td>
  {pembayaran?.bukti ? (
    <span className="text-green-600 font-semibold">
      ✅ Sudah Upload ({pembayaran.status})
    </span>
  ) : (
    <span className="text-red-600 font-semibold">
      ❌ Belum Upload
    </span>
  )}
</td>

            </tr>

          </tbody>

        </table>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <label className="flex items-center gap-3">

          <input
            type="checkbox"
            checked={setuju}
            onChange={(e) =>
              setSetuju(e.target.checked)
            }
          />

          Saya menyatakan seluruh data sudah benar.

        </label>

      </div>

      
<button

  onClick={

    sudahKirim.sudahKirim &&
    sudahKirim.status !== "Perlu Perbaikan"

      ? async () => {

          try {

            if (!profil?.id) {

              alert(
                "ID Gudep tidak ditemukan."
              );

              return;
            }

            const konfirmasi =
              window.confirm(
                "Pendaftaran sudah dikirim.\n\n" +
                "Jika Anda ingin mengedit data, " +
                "status pendaftaran akan diubah menjadi " +
                "\"Perlu Perbaikan\" dan harus dikirim ulang " +
                "setelah selesai diperbaiki.\n\n" +
                "Lanjutkan?"
              );

            if (!konfirmasi) return;


            // ==============================
            // UBAH STATUS DI SUPABASE
            // ==============================

            await tandaiPerluPerbaikan(
              profil.id
            );


            // ==============================
            // UPDATE STATUS DI TAMPILAN
            // ==============================

            setSudahKirim({

              sudahKirim: true,

              status:
                "Perlu Perbaikan",

              tanggalKirim:
                sudahKirim.tanggalKirim || ""

            });


            // Reset checkbox
            setSetuju(false);


            alert(
              "✏️ Data siap diedit.\n\n" +
              "Silakan lakukan perubahan data. " +
              "Setelah selesai, kembali ke menu Konfirmasi Data " +
              "untuk mengirim ulang."
            );

          } catch (error) {

            console.error(
              "GAGAL MENGAKTIFKAN EDIT:",
              error
            );

            alert(
              "Gagal mengaktifkan edit: " +
              (
                error?.message ||
                "Terjadi kesalahan."
              )
            );

          }

        }

      : kirimPendaftaran

  }

  disabled={
    sudahKirim.status === "Perlu Perbaikan"
      ? !setuju
      : false
  }

  className={`w-full py-4 rounded-xl font-bold text-white ${
    
    sudahKirim.status === "Perlu Perbaikan"

      ? !setuju
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"

      : sudahKirim.sudahKirim

        ? "bg-orange-500 hover:bg-orange-600"

        : "bg-blue-600 hover:bg-blue-700"

  }`}

>

  {sudahKirim.status === "Perlu Perbaikan"

    ? "🔄 KIRIM ULANG PENDAFTARAN"

    : sudahKirim.sudahKirim

      ? "✏️ EDIT DATA PENDAFTARAN"

      : "🚀 KIRIM PENDAFTARAN"

  }

</button>



    </div>

  );

}