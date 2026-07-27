import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  getPembinaByGudep,
} from "../../services/pembinaService";

import {
  getReguByGudep,
} from "../../services/reguService";

import {
  getPesertaByGudep,
} from "../../services/pesertaService";

import {
  getProfilGudepById,
} from "../../services/profilGudepService";

import {
  updatePendaftaran,
} from "../../services/pendaftaranService";
import {
  getPendaftaranById
} from "../../services/pendaftaranService";

export default function DetailGudep() {
const { id } = useParams();

const [profil, setProfil] = useState({});
const [pembina, setPembina] = useState([]);
const [regu, setRegu] = useState([]);
const [peserta, setPeserta] = useState([]);

const [catatanAdmin, setCatatanAdmin] = useState("");
const [status, setStatus] = useState("Menunggu Verifikasi");
const [pendaftaran, setPendaftaran] = useState(null);

useEffect(() => {
  loadData();
}, []);
 

  async function loadData(){

try{

// ambil data pendaftaran
const pendaftaranData = await getPendaftaranById(id);

setPendaftaran(pendaftaranData);


// ambil gudep berdasarkan gudep_id
const gudepId = pendaftaranData.gudep_id;


const profilData = await getProfilGudepById(gudepId);

setProfil(profilData);


const pembinaData = await getPembinaByGudep(gudepId);

setPembina(pembinaData);


const reguData = await getReguByGudep(gudepId);

setRegu(reguData);


const pesertaData = await getPesertaByGudep(gudepId);

setPeserta(pesertaData);


}catch(error){

console.error(
"Gagal mengambil detail gudep:",
error
);

}

}

 

// Data terbaru dari Operator


async function updateStatus(statusBaru){

  try {
console.log("ID YANG DIUPDATE:", id);
    await updatePendaftaran(id, {

      status: statusBaru,

      tanggal_verifikasi: new Date()
        .toISOString(),

      catatan_admin: catatanAdmin || ""

    });


    alert("Status berhasil diperbarui");


  } catch(error){

    console.error(
      "Gagal update status:",
      error
    );


    alert(
      "Gagal mengubah status"
    );

  



    

    // Pesan sesuai status
    if (statusBaru === "Disetujui") {

  alert("✅ Pendaftaran berhasil disetujui.");

} else if (statusBaru === "Perlu Perbaikan") {

  alert("🟡 Pendaftaran dikembalikan untuk diperbaiki.");

} else if (statusBaru === "Ditolak") {

  alert("❌ Pendaftaran telah ditolak.");
    }

    window.location.reload();

  }

}


  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-amber-700">
        Detail Pendaftaran Gugus Depan
      </h1>

      {/* ====================== */}
      {/* PROFIL GUGUS DEPAN */}
      {/* ====================== */}

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold text-green-700 mb-4">
          🏫 Profil Gugus Depan
        </h2>

        <table className="w-full">

          <tbody>

            <tr>
              <td className="font-semibold py-2 w-56">
                Nama Pangkalan
              </td>
              <td>{profil.nama_pangkalan}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Gudep Putra
              </td>
              <td>{profil.gudep_putra || "-"}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Gudep Putri
              </td>
              <td>{profil.gudep_putri || "-"}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Kwarran
              </td>
              <td>{profil.kwarran}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Kwarcab
              </td>
              <td>{profil.kwarcab}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Kabupaten
              </td>
              <td>{profil.kabupaten}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Provinsi
              </td>
              <td>{profil.provinsi}</td>
            </tr>

            <tr>
              <td className="font-semibold py-2">
                Alamat
              </td>
              <td>{profil.alamat}</td>
            </tr>

          </tbody>

        </table>

      </div>
{/* ====================== */}
{/* DATA PEMBINA */}
{/* ====================== */}

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold text-blue-700 mb-4">
    👨‍🏫 Data Pembina
  </h2>

  <table className="w-full border">

    <thead className="bg-blue-600 text-white">

      <tr>

        <th className="border p-3 w-16">
          No
        </th>

        <th className="border p-3">
          Nama Pembina
        </th>

        <th className="border p-3 w-32">
          JK
        </th>

        <th className="border p-3 w-48">
          Jabatan
        </th>

        <th className="border p-3 w-48">
          No. HP
        </th>

      </tr>

    </thead>

    <tbody>

      {pembina.length === 0 ? (

        <tr>

          <td
            colSpan="5"
            className="text-center p-5"
          >
            Belum ada data pembina
          </td>

        </tr>

      ) : (

        pembina.map((item, index) => (

          <tr key={index}>

            <td className="border p-3 text-center">
              {index + 1}
            </td>

            <td className="border p-3">
              {item.nama}
            </td>

            <td className="border p-3 text-center">
              {item.jk}
            </td>

            <td className="border p-3">
              {item.jabatan}
            </td>

            <td className="border p-3">
              {item.hp}
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>
{/* ====================== */}
{/* DATA REGU */}
{/* ====================== */}

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold text-orange-700 mb-4">
    🏕 Data Regu
  </h2>

  <table className="w-full border">

    <thead className="bg-orange-600 text-white">

  <tr>

    <th className="border p-3 w-16">
      No
    </th>

    <th className="border p-3">
      Nama Regu
    </th>

    <th className="border p-3 w-40">
      Jenis
    </th>

    <th className="border p-3 w-48">
      Jumlah Anggota
    </th>

  </tr>

</thead>
    <tbody>

      {regu.length === 0 ? (

        <tr>

          <td
            colSpan="4"
            className="text-center p-5"
          >
            Belum ada data regu
          </td>

        </tr>

      ) : (

        regu.map((item, index) => (

          <tr key={index}>

  <td className="border p-3 text-center">
    {index + 1}
  </td>

  <td className="border p-3">
    {item.nama}
  </td>

  <td className="border p-3 text-center">
    {item.jenis}
  </td>

  <td className="border p-3 text-center">
    {
      peserta.filter(
        p => p.regu === item.nama
      ).length
    }
  </td>

</tr>

        ))

      )}

    </tbody>

  </table>

</div>
{/* ====================== */}
{/* DATA PESERTA PUTRA */}
{/* ====================== */}

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold text-blue-700 mb-4">
    👦 Data Peserta Putra
  </h2>

  <table className="w-full border">

    <thead className="bg-blue-600 text-white">

      <tr>

        <th className="border p-3 w-16">
          No
        </th>

        <th className="border p-3">
          Nama Peserta
        </th>

        <th className="border p-3 w-24">
          Kelas
        </th>

        <th className="border p-3 w-40">
          Regu
        </th>

        <th className="border p-3 w-32">
          Status
        </th>

      </tr>

    </thead>

    <tbody>

      {peserta.filter(p => p.jk === "Putra").length === 0 ? (

        <tr>

          <td
            colSpan="5"
            className="text-center p-5"
          >
            Belum ada peserta putra
          </td>

        </tr>

      ) : (

        peserta
          .filter(p => p.jk === "Putra")
          .map((item, index) => (

            <tr key={index}>

              <td className="border p-3 text-center">
                {index + 1}
              </td>

              <td className="border p-3">
                {item.nama}
              </td>

              <td className="border p-3 text-center">
                {item.kelas}
              </td>

              <td className="border p-3 text-center">
                {item.regu}
              </td>

              <td className="border p-3 text-center">
                {item.status}
              </td>

            </tr>

        ))

      )}

    </tbody>

  </table>

</div>



{/* ====================== */}
{/* DATA PESERTA PUTRI */}
{/* ====================== */}

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold text-pink-700 mb-4">
    👧 Data Peserta Putri
  </h2>

  <table className="w-full border">

    <thead className="bg-pink-600 text-white">

      <tr>

        <th className="border p-3 w-16">
          No
        </th>

        <th className="border p-3">
          Nama Peserta
        </th>

        <th className="border p-3 w-24">
          Kelas
        </th>

        <th className="border p-3 w-40">
          Regu
        </th>

        <th className="border p-3 w-32">
          Status
        </th>

      </tr>

    </thead>

    <tbody>

      {peserta.filter(item => item.jk === "Putri").length === 0 ? (

        <tr>

          <td
            colSpan="5"
            className="text-center p-5"
          >
            Belum ada peserta putri
          </td>

        </tr>

      ) : (

        peserta
          .filter(item => item.jk === "Putri")
          .map((item, index) => (

            <tr key={index}>

              <td className="border p-3 text-center">
                {index + 1}
              </td>

              <td className="border p-3">
                {item.nama}
              </td>

              <td className="border p-3 text-center">
                {item.kelas}
              </td>

              <td className="border p-3 text-center">
                {item.regu}
              </td>

              <td className="border p-3 text-center">
                {item.status}
              </td>

            </tr>

          ))

      )}

    </tbody>

  </table>

</div>
<div className="mb-5">

  <label className="font-semibold block mb-2">
    Catatan Admin
  </label>

  <textarea
    rows={4}
    value={catatanAdmin}
    onChange={(e) =>
      setCatatanAdmin(e.target.value)
    }
    placeholder="Tuliskan catatan untuk operator..."
    className="w-full border rounded-lg p-3"
  />

</div>

{/* ====================== */}
{/* STATUS VERIFIKASI */}
{/* ====================== */}

<div className="bg-white rounded-xl shadow p-6 mb-6">

<h2 className="text-xl font-bold text-green-700 mb-5">
STATUS VERIFIKASI PENDAFTARAN
</h2>


<p className="mb-3">
Nama Gudep :

<span className="font-semibold ml-2">
{pendaftaran?.nama_gudep || "-"}
</span>

</p>


<p className="mb-3">
Tanggal Verifikasi :

<span className="font-semibold ml-2">

{
pendaftaran?.tanggal_verifikasi
?
new Date(
pendaftaran.tanggal_verifikasi
)
.toLocaleDateString("id-ID")
:
"-"
}

</span>

</p>


<p className="mb-3">
Status :

<span className="font-semibold ml-2">

{
pendaftaran?.status 
||
"Menunggu Verifikasi"
}

</span>

</p>


<p>
Catatan Panitia :

<span className="font-semibold ml-2">

{
pendaftaran?.catatan_admin
||
"Belum ada catatan."
}

</span>

</p>


</div>


{/* ====================== */}
{/* VERIFIKASI ADMIN */}
{/* ====================== */}

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold text-red-700 mb-5">
    ✅ Verifikasi Pendaftaran
  </h2>

  <div className="flex gap-4 flex-wrap">

    <button
  onClick={() => updateStatus("Terverifikasi")}
  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
>
  ✅ Setujui
</button>

   <button
  onClick={() => updateStatus("Perlu Perbaikan")}
  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold"
>
  🔄 Minta Perbaikan
</button>

    <button
  onClick={() => updateStatus("Ditolak")}
  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
>
  ❌ Tolak
</button>

  </div>

</div>
    </div>

  );

}