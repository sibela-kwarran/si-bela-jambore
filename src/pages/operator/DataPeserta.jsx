import { useState, useEffect } from "react";

export default function DataPeserta() {

  // ==========================
  // STATE
  // ==========================

  const [showForm, setShowForm] = useState(false);

const [dataPeserta, setDataPeserta] = useState(() => {

  const data = localStorage.getItem("dataPeserta");

  return data ? JSON.parse(data) : [];

});

const [dataRegu, setDataRegu] = useState(() => {

  const data = localStorage.getItem("dataRegu");

  return data ? JSON.parse(data) : [];

});




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
    localStorage.setItem(
      "dataPeserta",
      JSON.stringify(dataPeserta)
    );
  }, [dataPeserta]);

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

  function simpanPeserta(e) {

    e.preventDefault();

   if (editIndex !== null) {

  const update = [...dataPeserta];

  update[editIndex] = form;

  console.log("FORM DISIMPAN =", form);
  console.log("UPDATE =", update);

  setDataPeserta(update);

} else {

  setDataPeserta([
    ...dataPeserta,
    form
  ]);

}

    resetForm();

    setShowForm(false);

  }

  // ==========================
  // EDIT
  // ==========================

  function editPeserta(index) {
  const data = dataPeserta[index];

  setForm({
    nama: data.nama || "",
    noKta: data.noKta || "",
    tempatLahir: data.tempatLahir || "",
    tanggalLahir: data.tanggalLahir || "",
    jk: data.jk || "Putra",
    agama: data.agama || "Islam",
    kelas: data.kelas || "1",
    regu: data.regu || "",
    status: data.status || "Anggota",
  });

  setEditIndex(index);
  setShowForm(true);
}

  // ==========================
  // HAPUS
  // ==========================

  function hapusPeserta(index) {

    if (window.confirm("Hapus data peserta ini?")) {

      const data = [...dataPeserta];

      data.splice(index, 1);

      setDataPeserta(data);

    }

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
                  onClick={() => editPeserta(index)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => hapusPeserta(index)}
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