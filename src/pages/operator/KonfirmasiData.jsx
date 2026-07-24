import { useState } from "react";
import {
  simpanPendaftaran
} from "../../services/pendaftaranService";



export default function KonfirmasiData() {

  const profil = JSON.parse(
    localStorage.getItem("profilGudep") || "{}"
  );

  const pembina = JSON.parse(
    localStorage.getItem("dataPembina") || "[]"
  );

  const regu = JSON.parse(
    localStorage.getItem("dataRegu") || "[]"
  );

  const peserta = JSON.parse(
    localStorage.getItem("dataPeserta") || "[]"
  );

  const berkas = JSON.parse(
    localStorage.getItem("uploadBerkas") || "{}"
  );

  const pembayaran = JSON.parse(
    localStorage.getItem("pembayaran") || "{}"
  );

  const [setuju, setSetuju] = useState(false);

const [sudahKirim, setSudahKirim] = useState(() => {
  return JSON.parse(localStorage.getItem("statusPendaftaran")) || {
    sudahKirim: false,
    status: "",
    tanggalKirim: "",
  };
});
function kirimPendaftaran() {

  console.log("TOMBOL KIRIM DIKLIK");

  const profil =
    JSON.parse(localStorage.getItem("profilGudep")) || {};

  const pembina =
    JSON.parse(localStorage.getItem("dataPembina")) || [];

  const regu =
    JSON.parse(localStorage.getItem("dataRegu")) || [];

  const peserta =
    JSON.parse(localStorage.getItem("dataPeserta")) || [];

  const upload =
    JSON.parse(localStorage.getItem("uploadBerkas")) || {};

  const pembayaran =
    JSON.parse(localStorage.getItem("pembayaran")) || {};

  // Status pengiriman
  const status = {
    sudahKirim: true,
    status: "Menunggu Verifikasi",
    tanggalKirim: new Date().toLocaleDateString("id-ID"),
  };

  // Buat objek gudep
  const gudepBaru = {
    id: Date.now(),

    namaGudep: profil.pangkalan || "-",

    pembina: pembina.length,

    regu: regu.length,

    peserta: peserta.length,

    berkas:
      upload.suratTugas &&
      upload.suratIzin
        ? "Lengkap"
        : "Belum Lengkap",

    pembayaran:
      pembayaran.status || "Belum Bayar",

    status: "Menunggu Verifikasi",

    detail: {
      profil,
      pembina,
      regu,
      peserta,
      upload,
      pembayaran,
    },
  };
console.log("PROFIL =", profil);

console.log("PANGKALAN =", profil.pangkalan);

console.log("GUDEP BARU =", gudepBaru);
console.log("=== DATA YANG AKAN DISIMPAN ===");
console.log(gudepBaru);
console.log(gudepBaru.detail);
console.log(gudepBaru.detail.pembina);
console.log(gudepBaru.detail.regu);
console.log(gudepBaru.detail.peserta);


console.log("GUDEP BARU =", gudepBaru);

  // Baru simpan ke service
  simpanPendaftaran(gudepBaru);

  // Simpan status operator
  localStorage.setItem(
    "statusPendaftaran",
    JSON.stringify(status)
  );

  setSudahKirim(status);

  alert("Pendaftaran berhasil dikirim.");
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
                {profil.pangkalan || "-"}
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

                {pembayaran.bukti
                  ? "✅ Sudah Upload"
                  : "❌ Belum Upload"}

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
            onChange={(e)=>
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