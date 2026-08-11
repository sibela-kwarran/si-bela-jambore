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

  // ==========================================
  // STATE
  // ==========================================

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


  // ==========================================
  // KONSTANTA
  // ==========================================

  const MAKSIMAL_PEMBINA = 12;


  // ==========================================
  // LOAD DATA SAAT HALAMAN DIBUKA
  // ==========================================

  useEffect(() => {

    loadData();

  }, []);


  // ==========================================
  // LOAD DATA
  // ==========================================

  async function loadData() {

    try {

      const profilGudep =
        await getProfilGudep();

      setProfil(
        profilGudep || {}
      );


      const pembina =
        await getPembina();


      // Pastikan selalu array
      const semuaPembina =
        Array.isArray(pembina)
          ? pembina
          : [];


      /*
        getPembina() dari service sudah
        mengambil pembina berdasarkan
        gudep_id operator.
      */

      setDataPembina(
        semuaPembina
      );


      console.log(
        "DATA PEMBINA:",
        semuaPembina
      );


    } catch (err) {

      console.error(
        "ERROR LOAD DATA PEMBINA:",
        err
      );

      alert(
        err?.message ||
        "Gagal mengambil data pembina."
      );

    }

  }


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  function handleChange(e) {

    const {
      name,
      value,
    } = e.target;


    setForm(prev => ({

      ...prev,

      [name]: value,

    }));

  }


  // ==========================================
  // BUKA FORM TAMBAH
  // ==========================================

  function bukaFormTambah() {

    // Jangan boleh tambah jika sudah 12
    if (
      dataPembina.length >=
      MAKSIMAL_PEMBINA
    ) {

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

  }


  // ==========================================
  // SIMPAN / UPDATE PEMBINA
  // ==========================================

  async function simpanPembina(e) {

    e.preventDefault();


    try {

      // ========================================
      // VALIDASI NAMA
      // ========================================

      if (
        !form.nama.trim()
      ) {

        alert(
          "Nama pembina wajib diisi."
        );

        return;

      }


      // ========================================
      // MAKSIMAL 12 PEMBINA
      //
      // Hanya berlaku saat TAMBAH.
      // Edit tidak terpengaruh batas ini.
      // ========================================

      if (
        editId === null &&
        dataPembina.length >=
        MAKSIMAL_PEMBINA
      ) {

        alert(
          "Maksimal 12 pembina untuk setiap Gudep."
        );

        return;

      }


      // ========================================
      // DATA YANG DISIMPAN
      // ========================================

      const dataBaru = {

        nama_gudep:
          profil.nama_pangkalan || "",

        nama:
          form.nama.trim(),

        jk:
          form.jk,

        jabatan:
          form.jabatan,

        hp:
          form.hp.trim(),

      };


      console.log(
        "DATA PEMBINA AKAN DISIMPAN:",
        dataBaru
      );


      // ========================================
      // UPDATE
      // ========================================

      if (editId !== null) {

        await updatePembina(
          editId,
          dataBaru
        );


        alert(
          "Data pembina berhasil diperbarui."
        );

      }


      // ========================================
      // TAMBAH
      // ========================================

      else {

        await savePembina(
          dataBaru
        );


        alert(
          "Data pembina berhasil disimpan."
        );

      }


      // ========================================
      // REFRESH DATA
      // ========================================

      await loadData();


      // ========================================
      // RESET FORM
      // ========================================

      setForm({

        nama: "",

        jk: "Putra",

        jabatan: "Pembina",

        hp: "",

      });


      setEditId(null);

      setShowForm(false);


    } catch (err) {

      console.error(
        "ERROR SIMPAN PEMBINA:",
        err
      );


      alert(
        "Gagal menyimpan data pembina:\n" +
        (
          err?.message ||
          "Error tidak diketahui."
        )
      );

    }

  }


  // ==========================================
  // EDIT PEMBINA
  // ==========================================

  function editPembina(item) {

    setEditId(
      item.id
    );


    setForm({

      nama:
        item.nama || "",

      jk:
        item.jk || "Putra",

      jabatan:
        item.jabatan || "Pembina",

      hp:
        item.hp || "",

    });


    setShowForm(true);

  }


  // ==========================================
  // HAPUS PEMBINA
  // ==========================================

  async function hapusPembina(item) {

    const yakin =
      window.confirm(
        `Hapus data pembina "${item.nama}"?`
      );


    if (!yakin) {

      return;

    }


    try {

      await deletePembina(
        item.id
      );


      await loadData();


      alert(
        "Data pembina berhasil dihapus."
      );


    } catch (err) {

      console.error(
        "ERROR HAPUS PEMBINA:",
        err
      );


      alert(
        "Gagal menghapus data pembina:\n" +
        (
          err?.message ||
          "Error tidak diketahui."
        )
      );

    }

  }


  // ==========================================
  // BATAL FORM
  // ==========================================

  function batalForm() {

    setShowForm(false);

    setEditId(null);

    setForm({

      nama: "",

      jk: "Putra",

      jabatan: "Pembina",

      hp: "",

    });

  }


  // ==========================================
  // PERSENTASE
  // ==========================================

  const persenPembina =
    Math.min(
      (
        dataPembina.length /
        MAKSIMAL_PEMBINA
      ) * 100,
      100
    );


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="space-y-6">


      {/* ===================================== */}
      {/* HEADER */}
      {/* ===================================== */}

      <div>

        <h1 className="text-3xl font-bold text-green-700">

          Data Pembina

        </h1>

        <p className="text-gray-500">

          Kelola data pembina Gugus Depan.

        </p>

      </div>


      {/* ===================================== */}
      {/* CARD UTAMA */}
      {/* ===================================== */}

      <div className="bg-white rounded-xl shadow p-4 sm:p-6">


        {/* =================================== */}
        {/* TOMBOL TAMBAH */}
        {/* =================================== */}

        <button

          type="button"

          onClick={
            bukaFormTambah
          }

          disabled={
            dataPembina.length >=
            MAKSIMAL_PEMBINA
          }

          className={`px-5 py-3 rounded-lg text-white font-semibold ${
            dataPembina.length >=
            MAKSIMAL_PEMBINA

              ? "bg-gray-400 cursor-not-allowed"

              : "bg-green-700 hover:bg-green-800"
          }`}
        >

          {dataPembina.length >=
          MAKSIMAL_PEMBINA

            ? "✓ Maksimal 12 Pembina"

            : "+ Tambah Pembina"

          }

        </button>


        {/* =================================== */}
        {/* INDIKATOR JUMLAH */}
        {/* =================================== */}

        <div className="mt-5">


          <div className="flex justify-between items-center mb-2">

            <span className="font-semibold text-gray-700">

              Jumlah Pembina

            </span>


            <span
              className={`font-bold ${
                dataPembina.length >=
                MAKSIMAL_PEMBINA

                  ? "text-red-600"

                  : "text-green-700"
              }`}
            >

              {dataPembina.length}
              {" / "}
              {MAKSIMAL_PEMBINA}

            </span>

          </div>


          {/* PROGRESS BAR */}

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

            <div

              className="bg-green-600 h-3 rounded-full transition-all duration-300"

              style={{
                width:
                  `${persenPembina}%`
              }}

            />

          </div>


          <p className="text-sm text-gray-500 mt-2">

            Maksimal {MAKSIMAL_PEMBINA}
            {" "}
            pembina per Gudep.

          </p>

        </div>


        {/* =================================== */}
        {/* FORM */}
        {/* =================================== */}

        {showForm && (

          <form

            onSubmit={
              simpanPembina
            }

            className="mt-6 border rounded-xl p-4 sm:p-6 bg-gray-50"

          >


            <h2 className="text-lg sm:text-xl font-bold text-green-700 mb-5">

              {editId !== null
                ? "Edit Data Pembina"
                : "Tambah Pembina"
              }

            </h2>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">


              {/* NAMA */}

              <div>

                <label className="block mb-2 font-semibold">

                  Nama Pembina

                </label>


                <input

                  name="nama"

                  value={
                    form.nama
                  }

                  onChange={
                    handleChange
                  }

                  className="w-full border rounded-lg p-3"

                  placeholder="Masukkan nama pembina"

                  required

                />

              </div>


              {/* JENIS KELAMIN */}

              <div>

                <label className="block mb-2 font-semibold">

                  Jenis Kelamin

                </label>


                <select

                  name="jk"

                  value={
                    form.jk
                  }

                  onChange={
                    handleChange
                  }

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


              {/* JABATAN */}

              <div>

                <label className="block mb-2 font-semibold">

                  Jabatan

                </label>


                <select

                  name="jabatan"

                  value={
                    form.jabatan
                  }

                  onChange={
                    handleChange
                  }

                  className="w-full border rounded-lg p-3"

                >

                  <option value="Pembina">

                    Pembina

                  </option>


                  <option value="Pembantu Pembina">

                    Pembantu Pembina

                  </option>


                  <option value="Ketua Gugus Depan">

                    Ketua Gugus Depan

                  </option>

                </select>

              </div>


              {/* NOMOR HP */}

              <div>

                <label className="block mb-2 font-semibold">

                  Nomor HP

                </label>


                <input

                  name="hp"

                  value={
                    form.hp
                  }

                  onChange={
                    handleChange
                  }

                  className="w-full border rounded-lg p-3"

                  placeholder="Masukkan nomor HP"

                />

              </div>

            </div>


            {/* ================================= */}
            {/* TOMBOL FORM */}
            {/* ================================= */}

            <div className="mt-6 flex flex-col sm:flex-row gap-3">


              <button

                type="submit"

                className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg font-semibold"

              >

                💾{" "}

                {editId !== null
                  ? "Simpan Perubahan"
                  : "Simpan"
                }

              </button>


              <button

                type="button"

                onClick={
                  batalForm
                }

                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold"

              >

                Batal

              </button>

            </div>

          </form>

        )}


        {/* =================================== */}
        {/* TABEL PEMBINA */}
        {/* =================================== */}

        <div className="mt-8 w-full overflow-x-auto">

          <table className="w-full border-collapse min-w-[700px]">

            <thead className="bg-green-700 text-white">

              <tr>

                <th className="p-3 border">

                  No

                </th>


                <th className="p-3 border text-left">

                  Nama Pembina

                </th>


                <th className="p-3 border">

                  Jenis

                </th>


                <th className="p-3 border">

                  Jabatan

                </th>


                <th className="p-3 border">

                  No HP

                </th>


                <th className="p-3 border">

                  Aksi

                </th>

              </tr>

            </thead>


            <tbody>

              {dataPembina.length === 0 ? (

                <tr>

                  <td

                    colSpan={6}

                    className="text-center p-6 border text-gray-500"

                  >

                    Belum ada data pembina.

                  </td>

                </tr>

              ) : (

                dataPembina.map(
                  (item, index) => (

                    <tr
                      key={item.id}
                      className="hover:bg-gray-50"
                    >


                      {/* NO */}

                      <td className="border p-3 text-center">

                        {index + 1}

                      </td>


                      {/* NAMA */}

                      <td className="border p-3">

                        {item.nama || "-"}

                      </td>


                      {/* JENIS */}

                      <td className="border p-3 text-center">

                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            item.jk === "Putri"

                              ? "bg-pink-100 text-pink-700"

                              : "bg-blue-100 text-blue-700"
                          }`}
                        >

                          {item.jk === "Putri"
                            ? "Pembina Putri"
                            : "Pembina Putra"
                          }

                        </span>

                      </td>


                      {/* JABATAN */}

                      <td className="border p-3">

                        {item.jabatan || "-"}

                      </td>


                      {/* HP */}

                      <td className="border p-3">

                        {item.hp || "-"}

                      </td>


                      {/* AKSI */}

                      <td className="border p-3">

                        <div className="flex flex-wrap justify-center gap-2">


                          <button

                            type="button"

                            onClick={() =>
                              editPembina(item)
                            }

                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded"

                          >

                            Edit

                          </button>


                          <button

                            type="button"

                            onClick={() =>
                              hapusPembina(item)
                            }

                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded"

                          >

                            Hapus

                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>


        {/* =================================== */}
        {/* INFORMASI */}
        {/* =================================== */}

        <div className="mt-5 bg-green-50 border border-green-200 rounded-lg p-4">

          <p className="text-sm text-green-800">

            <b>Informasi:</b>{" "}

            Setiap Gudep dapat mengisi maksimal{" "}

            <b>12 pembina</b>. Komposisi Pembina Putra
            dan Pembina Putri bebas sesuai kebutuhan.

          </p>

        </div>

      </div>

    </div>

  );

}