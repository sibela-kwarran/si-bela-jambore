import { useState, useEffect } from "react";

import {
  getPembina,
  savePembina,
  updatePembina,
  deletePembina,
} from "../../services/pembinaService";

import {
  getProfilGudep,
} from "../../services/profilGudepService";

export default function DataPembina() {

  const [showForm, setShowForm] = useState(false);

  const [profil, setProfil] = useState({});

  const [dataPembina, setDataPembina] = useState([]);

  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({

    nama: "",

    jk: "Putra",

    jabatan: "Pembina",

    hp: "",

  });

  // ===========================
  // LOAD DATA
  // ===========================

  useEffect(() => {

    loadData();

  }, []);

  async function loadData() {

    try {

      const profilGudep = await getProfilGudep();

      setProfil(profilGudep || {});

      const pembina = await getPembina();

      if (profilGudep) {

        const hasil = pembina.filter(
  item => item.nama_gudep === profilGudep.nama_pangkalan
);

setDataPembina(hasil);

        setDataPembina(hasil);

      }

    } catch (err) {
  console.error(err);
  alert(err.message);
}

  }

  // ===========================
  // INPUT
  // ===========================

  function handleChange(e) {

    const { name, value } = e.target;

    setForm(prev => ({

      ...prev,

      [name]: value,

    }));

  }

  // ===========================
  // SIMPAN
  // ===========================

  async function simpanPembina(e) {

    e.preventDefault();

    try {

      // ==========================================
// MAKSIMAL 12 PEMBINA PER GUDEP
// ==========================================

if (
  editId === null &&
  dataPembina.length >= 12
) {
  alert(
    "Maksimal 12 pembina untuk setiap Gudep."
  );

  return;
}

      if (

        editId === null &&

        form.jk === "Putri" &&

        jumlahPutri >= 3

      ) {

        alert("Maksimal 3 Pembina Putri");

        return;

      }

     const dataBaru = {
  nama_gudep: profil.nama_pangkalan,
  nama: form.nama,
  jk: form.jk,
  jabatan: form.jabatan,
  hp: form.hp,
};

      if (editId) {

        await updatePembina(editId, dataBaru);

      } else {

        await savePembina(dataBaru);

      }

      await loadData();

      setForm({

        nama: "",

        jk: "Putra",

        jabatan: "Pembina",

        hp: "",

      });

      setEditId(null);

      setShowForm(false);

    } catch (err) {

      console.error(err);

      alert("Gagal menyimpan data.");

    }

  }

  // ===========================
  // EDIT
  // ===========================

  function editPembina(item) {

    setEditId(item.id);

    setForm({

      nama: item.nama,

      jk: item.jk,

      jabatan: item.jabatan,

      hp: item.hp,

    });

    setShowForm(true);

  }

  // ===========================
  // HAPUS
  // ===========================

  async function hapusPembina(item) {

    const yakin = window.confirm(

      "Hapus data pembina?"

    );

    if (!yakin) return;

    try {

      await deletePembina(item.id);

      await loadData();

    } catch (err) {

      console.error(err);

    }

  }



  return (

  <div className="space-y-6">

    <div>

      <h1 className="text-3xl font-bold text-green-700">
        Data Pembina
      </h1>

      <p className="text-gray-500">
        Kelola data pembina Gugus Depan.
      </p>

    </div>

    <div className="bg-white rounded-xl shadow p-6">

      <button
  disabled={dataPembina.length >= 12}
  onClick={() => {

    if (dataPembina.length >= 12) {
      alert(
        "Maksimal 12 pembina untuk setiap Gudep."
      );
      return;
    }

    setEditId(null);

    setForm({
      nama: "",
      jk: "Putra",
      jabatan: "Pembina",
      hp: "",
    });

    setShowForm(true);

  }}
  className={`px-5 py-3 rounded-lg text-white ${
    dataPembina.length >= 12
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-700 hover:bg-green-800"
  }`}
>
  {dataPembina.length >= 12
    ? "✓ Maksimal 12 Pembina"
    : "+ Tambah Pembina"}
</button>
{/* ==========================================
    JUMLAH PEMBINA
========================================== */}

<div className="mt-4">

  <div className="flex justify-between items-center mb-2">

    <span className="font-semibold text-gray-700">
      Jumlah Pembina
    </span>

    <span
      className={`font-bold ${
        dataPembina.length >= 12
          ? "text-red-600"
          : "text-green-700"
      }`}
    >
      {dataPembina.length} / 12
    </span>

  </div>

  <div className="w-full bg-gray-200 rounded-full h-3">

    <div
      className="bg-green-600 h-3 rounded-full transition-all"
      style={{
        width: `${Math.min(
          (dataPembina.length / 12) * 100,
          100
        )}%`
      }}
    />

  </div>

</div>
      {showForm && (

        <form
          onSubmit={simpanPembina}
          className="mt-6 border rounded-xl p-6 bg-gray-50"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

            <div>

              <label className="block mb-2 font-semibold">
                Nama Pembina
              </label>

              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Jenis Kelamin
              </label>

              <select
                name="jk"
                value={form.jk}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >
                <option value="Putra">
                  Pembina Putra
                </option>

                <option value="Putri">
                  Pembina Putri
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Jabatan
              </label>

              <select
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >

                <option>
                  Pembina
                </option>

                <option>
                  Pembantu Pembina
                </option>

                <option>
                  Ketua Gugus Depan
                </option>

              </select>

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Nomor HP
              </label>

              <input
                name="hp"
                value={form.hp}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

          </div>

          <div className="mt-6 flex gap-3">

            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg"
            >
              💾 Simpan
            </button>

            <button
              type="button"
              onClick={() => {

                setShowForm(false);

                setEditId(null);

              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg"
            >
              Batal
            </button>

          </div>

        </form>

      )}

      <div className="mt-8 w-full overflow-x-auto">
  <table className="w-full min-w-[650px] border text-xs sm:text-sm">

        <thead className="bg-green-700 text-white">

          <tr>

            <th className="p-3 w-16">
              No
            </th>

            <th className="p-3">
              Nama Pembina
            </th>

            <th className="p-3 w-36">
              Jenis
            </th>

            <th className="p-3">
              Jabatan
            </th>

            <th className="p-3">
              No HP
            </th>

            <th className="p-3 w-44">
              Aksi
            </th>

          </tr>

        </thead>

        <tbody>

          {dataPembina.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="text-center p-6"
              >
                Belum ada data pembina
              </td>

            </tr>

          ) : (

            dataPembina.map((item, index) => (

              <tr key={item.id}>

               <td className="border p-2 sm:p-3 text-center">
  {index + 1}
</td>

<td className="border p-2 sm:p-3">
  {item.nama}
</td>

<td className="border p-2 sm:p-3 text-center">
  {item.jk}
</td>

<td className="border p-2 sm:p-3">
  {item.jabatan}
</td>

<td className="border p-2 sm:p-3">
  {item.hp}
</td>

<td className="border p-2 sm:p-3">
  <div className="flex gap-1 sm:gap-2 justify-center">

                    <button
                      onClick={() => editPembina(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => hapusPembina(item)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Hapus
                    </button>

                  </div>

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>
</div>
    </div>

  </div>

);

}