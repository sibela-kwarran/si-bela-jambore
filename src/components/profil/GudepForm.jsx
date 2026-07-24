import { useState, useEffect } from "react";

export default function GudepForm() {

  
    const [form, setForm] = useState(() => {

  const data = localStorage.getItem("profilGudep");

  return data
    ? JSON.parse(data)
    : {
        gudepPutra: "",
        gudepPutri: "",
        pangkalan: "",
        kwarran: "",
        kwarcab: "",
        alamat: "",
        kabupaten: "",
        provinsi: "",
        email: "",
        namaMabigus: "",
        hpMabigus: "",
      };

});

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
useEffect(() => {

  localStorage.setItem(
    "profilGudep",
    JSON.stringify(form)
  );

}, [form]);


  function handleSubmit(e) {

  e.preventDefault();

  localStorage.setItem(
    "profilGudep",
    JSON.stringify(form)
  );

  alert("Profil Gugus Depan berhasil disimpan.");

}

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-8"
    >

      <div className="grid grid-cols-2 gap-6">

        <Input
          label="Nomor Gudep Putra"
          name="gudepPutra"
          value={form.gudepPutra}
          onChange={handleChange}
        />

        <Input
          label="Nomor Gudep Putri"
          name="gudepPutri"
          value={form.gudepPutri}
          onChange={handleChange}
        />

        <Input
          label="Nama Pangkalan"
          name="pangkalan"
          value={form.pangkalan}
          onChange={handleChange}
        />

        <Input
          label="Kwarran"
          name="kwarran"
          value={form.kwarran}
          onChange={handleChange}
        />

        <Input
          label="Kwarcab"
          name="kwarcab"
          value={form.kwarcab}
          onChange={handleChange}
        />

        <Input
          label="Kabupaten / Kota"
          name="kabupaten"
          value={form.kabupaten}
          onChange={handleChange}
        />

        <Input
          label="Provinsi"
          name="provinsi"
          value={form.provinsi}
          onChange={handleChange}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        <Input
          label="Nama Mabigus"
          name="namaMabigus"
          value={form.namaMabigus}
          onChange={handleChange}
        />

        <Input
          label="No. HP Mabigus"
          name="hpMabigus"
          value={form.hpMabigus}
          onChange={handleChange}
        />

      </div>

      <div className="mt-6">

        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Alamat
        </label>

        <textarea
          rows="4"
          name="alamat"
          value={form.alamat}
          onChange={handleChange}
          className="w-full rounded-xl border border-gray-300 p-3 focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none"
        />

      </div>

      <div className="mt-8 flex justify-end">

        <button
          type="submit"
          className="px-8 py-3 bg-green-700 hover:bg-green-800 rounded-xl text-white font-semibold transition-all duration-300"
        >
          💾 Simpan Profil
        </button>

      </div>

    </form>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 rounded-xl border border-gray-300 px-4 focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none"
      />

    </div>
  );
}