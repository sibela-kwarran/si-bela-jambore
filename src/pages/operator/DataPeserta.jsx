import { useState, useEffect } from "react";

import {
  getPeserta,
  savePeserta,
  updatePeserta,
  deletePeserta,
} from "../../services/pesertaService";

import {
  getProfilGudep,
} from "../../services/profilGudepService";

import {
  getRegu,
} from "../../services/reguService";



export default function DataPeserta() {

  // ==========================
  // STATE
  // ==========================

  const [showForm, setShowForm] = useState(false);

const [dataPeserta, setDataPeserta] = useState([]);

const [dataRegu, setDataRegu] = useState([]);
const [profilGudep, setProfilGudep] = useState({});
const [kuotaPutra, setKuotaPutra] = useState(0);
const [kuotaPutri, setKuotaPutri] = useState(0);


const [editIndex, setEditIndex] = useState(null);

const [cari, setCari] = useState("");



  const [form, setForm] = useState({
    nama: "",
    noKta: "",
    tempatLahir: "",
    tanggalLahir: "",
    jk: "Putra",
    agama: "Islam",
    kelas: "1",
    regu: "",
    status: "Anggota",
  });

  // ==========================
  // SIMPAN KE LOCAL STORAGE
  // ==========================

  useEffect(() => {
  loadData();
}, []);

async function loadData() {
  try {

    const profil = await getProfilGudep();

    setProfilGudep(profil || {});

    const regu = await getRegu();

    setDataRegu(regu || []);

    const peserta = await getPeserta();

    console.log("PESERTA DARI SERVICE:", peserta);

    setDataPeserta(peserta || []);

    // ==========================
// HITUNG KUOTA PESERTA
// ==========================

const totalPutra = (regu || [])
  .filter(item => item.jenis === "Putra")
  .reduce(
    (total, item) =>
      total + Number(item.jumlah || 0),
    0
  );

const totalPutri = (regu || [])
  .filter(item => item.jenis === "Putri")
  .reduce(
    (total, item) =>
      total + Number(item.jumlah || 0),
    0
  );

setKuotaPutra(totalPutra);
setKuotaPutri(totalPutri);

console.log(
  "KUOTA PUTRA:",
  totalPutra
);

console.log(
  "KUOTA PUTRI:",
  totalPutri
);

    
    

  } catch (err) {

    console.error(err);

  }
}
// ==========================
// JUMLAH PESERTA TERISI
// ==========================

const jumlahPesertaPutra =
  dataPeserta.filter(
    item => item.jk === "Putra"
  ).length;

const jumlahPesertaPutri =
  dataPeserta.filter(
    item => item.jk === "Putri"
  ).length;
  // ==========================
  // HANDLE INPUT
  // ==========================

  function handleChange(e) {
  const { name, value } = e.target;

  console.log("CHANGE :", name, value);

  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
}

  // ==========================
  // RESET FORM
  // ==========================

  function resetForm() {

    setForm({
      nama: "",
      noKta: "",
      tempatLahir: "",
      tanggalLahir: "",
      jk: "Putra",
      agama: "Islam",
      kelas: "1",
      regu: "",
      status: "Anggota",
    });

    setEditIndex(null);

  }

  // ==========================
  // SIMPAN
  // ==========================

  async function simpanPeserta(e) {

  e.preventDefault();

// ==========================
// CEK KUOTA PESERTA
// ==========================

const jumlahSekarang =
  dataPeserta.filter(
    item => item.jk === form.jk
  ).length;


// Kalau sedang EDIT, jangan hitung
// peserta yang sedang diedit
const jumlahSelainEdit =
  editIndex !== null
    ? dataPeserta.filter(
        item =>
          item.jk === form.jk &&
          item.id !== editIndex
      ).length
    : jumlahSekarang;


const kuota =
  form.jk === "Putra"
    ? kuotaPutra
    : kuotaPutri;


if (
  jumlahSelainEdit >= kuota
) {

  alert(
    `⚠️ Kuota peserta ${form.jk} sudah penuh (${kuota} orang).`
  );

  return;

}




  try {

    const dataBaru = {

      nama_gudep: profilGudep.nama_pangkalan,

      nama: form.nama,

      no_kta: form.noKta,

      tempat_lahir: form.tempatLahir,

      tanggal_lahir: form.tanggalLahir,

      jk: form.jk,

      agama: form.agama,

      kelas: form.kelas,

      regu: form.regu,

      status: form.status,

    };

    if (editIndex !== null) {

      await updatePeserta(editIndex, dataBaru);

    } else {

      await savePeserta(dataBaru);

    }

    await loadData();

    resetForm();

    setShowForm(false);

  } catch (err) {

    console.error(err);

    alert("Gagal menyimpan data peserta.");

  }

}

  // ==========================
  // HAPUS
  // ==========================

  async function hapusPeserta(item) {

  const yakin = window.confirm(
    "Hapus data peserta ini?"
  );

  if (!yakin) return;

  try {

    console.log("=== HAPUS PESERTA ===");
    console.log("ITEM:", item);
    console.log("ID:", item.id);

    if (!item.id) {
      alert("ID peserta tidak ditemukan.");
      return;
    }

    await deletePeserta(item.id);

    console.log(
      "DELETE SUPABASE BERHASIL:",
      item.id
    );

    await loadData();

    alert("✅ Data peserta berhasil dihapus.");

  } catch (err) {

    console.error(
      "DELETE PESERTA ERROR:",
      err
    );

    alert(
      "❌ Gagal menghapus data peserta: " +
      err.message
    );

  }

}


function editPeserta(item) {

  setForm({

    nama: item.nama || "",
    noKta: item.no_kta || "",
    tempatLahir: item.tempat_lahir || "",
    tanggalLahir: item.tanggal_lahir || "",
    jk: item.jk || "Putra",
    agama: item.agama || "Islam",
    kelas: item.kelas || "1",
    regu: item.regu || "",
    status: item.status || "Anggota",

  });


  setEditIndex(item.id);

  setShowForm(true);

}
  // ==========================
  // FILTER PENCARIAN
  // ==========================

  const hasilCari = dataPeserta.filter((item) =>
    item.nama.toLowerCase().includes(cari.toLowerCase())
  );

  // ==========================
  // JSX
  // ==========================

  return (

   <div className="space-y-6">

  <div>

    <h1 className="text-3xl font-bold text-green-700">
      Data Peserta
    </h1>

    <p className="text-gray-500">
      Kelola data peserta Jambore.
    </p>

  </div>

  <div className="bg-white rounded-xl shadow p-6">

    <div className="flex justify-between items-center mb-6">

      <button
  onClick={() => {

    if (
      jumlahPesertaPutra >= kuotaPutra &&
      jumlahPesertaPutri >= kuotaPutri
    ) {

      alert(
        "⚠️ Kuota peserta Putra dan Putri sudah penuh."
      );

      return;
    }

    resetForm();
    setShowForm(true);

  }}
  className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg"
>
  + Tambah Peserta
</button>

      <input
        type="text"
        placeholder="Cari peserta..."
        value={cari}
        onChange={(e) => setCari(e.target.value)}
        className="border rounded-lg px-4 py-3 w-72"
      />

    </div>

{/* ==========================
    INFORMASI KUOTA PESERTA
========================== */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

  {/* PUTRA */}

  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">

    <div className="font-semibold text-blue-700">
      👦 Peserta Putra
    </div>

    <div className="text-2xl font-bold mt-1">
      {jumlahPesertaPutra} / {kuotaPutra}
    </div>

    <div className="text-sm text-gray-500">
      Sisa kuota:{" "}
      {Math.max(
        kuotaPutra - jumlahPesertaPutra,
        0
      )} orang
    </div>

  </div>


  {/* PUTRI */}

  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">

    <div className="font-semibold text-pink-700">
      👧 Peserta Putri
    </div>

    <div className="text-2xl font-bold mt-1">
      {jumlahPesertaPutri} / {kuotaPutri}
    </div>

    <div className="text-sm text-gray-500">
      Sisa kuota:{" "}
      {Math.max(
        kuotaPutri - jumlahPesertaPutri,
        0
      )} orang
    </div>

  </div>

</div>



    {showForm && (

      <form
        onSubmit={simpanPeserta}
        className="border rounded-xl bg-gray-50 p-6 mb-8"
      >

        <h2 className="text-xl font-bold mb-5">

          {editIndex !== null
            ? "Edit Peserta"
            : "Tambah Peserta"}

        </h2>

        <div className="grid grid-cols-2 gap-5">

          <Input
            label="Nama Lengkap"
            name="nama"
            value={form.nama}
            onChange={handleChange}
          />

          <Input
            label="No. KTA (Opsional)"
            name="noKta"
            value={form.noKta}
            onChange={handleChange}
          />

          <Input
            label="Tempat Lahir"
            name="tempatLahir"
            value={form.tempatLahir}
            onChange={handleChange}
          />

          <Input
            label="Tanggal Lahir"
            type="date"
            name="tanggalLahir"
            value={form.tanggalLahir}
            onChange={handleChange}
          />

          <Select
            label="Jenis Kelamin"
            name="jk"
            value={form.jk}
            onChange={handleChange}
            options={["Putra", "Putri"]}
          />

          <Select
            label="Agama"
            name="agama"
            value={form.agama}
            onChange={handleChange}
            options={[
              "Islam",
              "Kristen",
              "Katolik",
              "Hindu",
              "Buddha",
              "Konghucu",
            ]}
          />

          <Select
            label="Kelas"
            name="kelas"
            value={form.kelas}
            onChange={handleChange}
            options={[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
            ]}
          />

          <div>
  <label className="block mb-2 font-semibold">
    Regu
  </label>

  <select
    name="regu"
    value={form.regu}
    onChange={handleChange}
    className="w-full border rounded-lg p-3"
  >
    <option value="">-- Pilih Regu --</option>

    {dataRegu
      .filter(item => item.jenis === form.jk)
      .map((item) => (
        <option key={item.nama} value={item.nama}>
          {item.nama}
        </option>
      ))}
  </select>
</div>

<Select
  label="Status"
  name="status"
  value={form.status}
  onChange={handleChange}
  options={[
    "Pinru",
    "Wapinru",
    "Anggota",
  ]}
/>

          

        </div>

        <div className="mt-6 flex gap-3">

          <button
  type="submit"
  className="px-6 py-3 rounded-lg text-white bg-green-700 hover:bg-green-800"
>
  Simpan
</button>

          <button
            type="button"
            onClick={() => {
              resetForm();
              setShowForm(false);
            }}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Batal
          </button>

        </div>

      </form>

    )}

    <table className="w-full border">

      <thead className="bg-green-700 text-white">

        <tr>

          <th className="p-3">No</th>
          <th className="p-3">Nama Lengkap</th>
          <th className="p-3">JK</th>
          <th className="p-3">Kelas</th>
          <th className="p-3">Regu</th>
          <th className="p-3">Status</th>
          <th className="p-3">Aksi</th>

        </tr>

      </thead>

      <tbody>

        {hasilCari.length === 0 ? (

          <tr>

            <td
              colSpan="7"
              className="text-center p-5"
            >
              Belum ada data peserta
            </td>

          </tr>

        ) : (

          hasilCari.map((item, index) => (

            <tr key={index}>

              <td className="border p-3">
                {index + 1}
              </td>

              <td className="border p-3">
                {item.nama}
              </td>

              <td className="border p-3">
                {item.jk}
              </td>

              <td className="border p-3">
                {item.kelas}
              </td>

              <td className="border p-3">
                {item.regu}
              </td>

              <td className="border p-3">
                {item.status}
              </td>

              <td className="border p-3 space-x-2">

                <button
  onClick={() => editPeserta(item)}
  className="bg-blue-600 text-white px-3 py-1 rounded"
>
  Edit
</button>

                <button
  onClick={() => hapusPeserta(item)}
  className="bg-red-600 text-white px-3 py-1 rounded"
>
  Hapus
</button>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</div>
  );

}

// ==========================
// KOMPONEN INPUT
// ==========================

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {

  return (

    <div>

      <label className="block mb-2 font-semibold">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-3"
      />

    </div>

  );

}

// ==========================
// KOMPONEN SELECT
// ==========================

function Select({
  label,
  name,
  value,
  onChange,
  options,
}) {

  return (

    <div>

      <label className="block mb-2 font-semibold">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg p-3"
      >

        {options.map((item, index) => (

          <option
            key={index}
            value={item}
          >
            {item}
          </option>

        ))}

      </select>

    </div>

  );

}