import { useEffect, useState } from "react";

import { getProfilGudep } from "../../services/profilGudepService";
import { getPembina } from "../../services/pembinaService";
import { getRegu } from "../../services/reguService";
import { getPeserta } from "../../services/pesertaService";
import { getBerkas } from "../../services/berkasService";
import { getPembayaran } from "../../services/pembayaranService";

import {
  savePendaftaran,
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

      setSudahKirim(
        JSON.parse(
          localStorage.getItem("statusPendaftaran")
        ) || {
          sudahKirim: false,
          status: "",
          tanggalKirim: "",
        }
      );

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

  async function kirimPendaftaran() {
console.log("=== KLIK KIRIM ===");
console.log("PROFIL :", profil);
    const gudepBaru = {

      id: Date.now(),

      namaGudep:
        profil?.nama_pangkalan || "-",

      pembina: pembina.length,

      regu: regu.length,

      peserta: peserta.length,

      berkas:
        berkas.suratTugas &&
        berkas.suratIzin
          ? "Lengkap"
          : "Belum Lengkap",

      pembayaran:
        pembayaran.status ||
        "Belum Bayar",

      status: "Menunggu Verifikasi",

      detail: {

        profil,

        pembina,

        regu,

        peserta,

        upload: berkas,

        pembayaran,

      },

    };

    try {

console.log(
  "DATA DIKIRIM KE SUPABASE:",
  {
    gudep_id: profil.id,
    nama_gudep: profil.nama_pangkalan,
    jumlah_pembina: pembina.length,
    jumlah_regu: regu.length,
    jumlah_peserta: peserta.length
  }
);
if(!profil?.id){

  alert(
    "ID Gudep tidak ditemukan. Silakan simpan Profil Gudep terlebih dahulu."
  );

  return;

}


await savePendaftaran({

  gudep_id: Number(profil.id),

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
    ""

});


const status = {

  sudahKirim: true,

  status: "Menunggu Verifikasi",

  tanggalKirim:
    new Date().toLocaleDateString("id-ID"),

};


localStorage.setItem(
  "statusPendaftaran",
  JSON.stringify(status)
);


setSudahKirim(status);


alert(
  "Pendaftaran berhasil dikirim."
);


}catch(error){

console.error(
  "Gagal simpan pendaftaran:",
  error
);


alert(
  "Pendaftaran gagal dikirim"
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

        onClick={kirimPendaftaran}

        disabled={!setuju || sudahKirim.sudahKirim}

        className={`w-full py-4 rounded-xl font-bold text-white ${
          sudahKirim.sudahKirim
            ? "bg-green-600"
            : "bg-blue-600 hover:bg-blue-700"
        }`}

      >

        {sudahKirim.sudahKirim
          ? "✓ PENDAFTARAN SUDAH DIKIRIM"
          : "🚀 KIRIM PENDAFTARAN"}

      </button>

    </div>

  );

}