import { useState, useEffect } from "react";

export default function DataRegu() {

  const [showForm, setShowForm] = useState(false);
const [dataRegu, setDataRegu] = useState(() => {

  const data = localStorage.getItem("dataRegu");

  return data ? JSON.parse(data) : [];

});

const [editIndex, setEditIndex] = useState(null);
  const profilGudep =
  JSON.parse(localStorage.getItem("profilGudep")) || {};
  
const [form, setForm] = useState({
  nama: "",
  golongan: "Penggalang",
  jenis: "Putra",
  jumlah: "",
});

  function handleChange(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function simpanRegu(e) {

  e.preventDefault();


  if(editIndex !== null){

    const update = [...dataRegu];

    update[editIndex] = {
  ...form,
  namaGudep: profilGudep.pangkalan,
};

    setDataRegu(update);

    setEditIndex(null);

  }
  else {


    setDataRegu([
  ...dataRegu,
  {
    ...form,
    namaGudep: profilGudep.pangkalan,
  },
]);

  }


  setForm({
 nama:"",
 golongan:"Penggalang",
 jenis:"Putra",
 jumlah:""
});


  setShowForm(false);


  }
function editRegu(index){

  setForm(dataRegu[index]);

  setEditIndex(index);

  setShowForm(true);

}

function hapusRegu(index){

  const yakin = window.confirm(
    "Hapus data regu ini?"
  );


  if(yakin){

    const data = [...dataRegu];

    data.splice(index,1);

    setDataRegu(data);

  }

}

useEffect(() => {

  console.log("MENYIMPAN REGU:", dataRegu);

  localStorage.setItem(
    "dataRegu",
    JSON.stringify(dataRegu)
  );

}, [dataRegu]);

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-green-700">
          Data Regu
        </h1>

        <p className="text-gray-500">
          Kelola data regu peserta Jambore.
        </p>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg"
        >
          + Tambah Regu
        </button>

        {showForm && (

          <form
            onSubmit={simpanRegu}
            className="mt-6 border rounded-xl p-6 bg-gray-50"
          >

            <div className="grid grid-cols-2 gap-5">

              <div>

                <label className="block mb-2 font-semibold">
                  Nama Regu
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
                  Golongan
                </label>

                <select
                  name="golongan"
                  value={form.golongan}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option>Siaga</option>
                  <option>Penggalang</option>
                  <option>Penegak</option>
                  <option>Pandega</option>
                </select>

              </div>

              <div>

                <label className="block mb-2 font-semibold">
                  Jenis Regu
                </label>

                <select
                  name="jenis"
                  value={form.jenis}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3"
                >
                  <option>Putra</option>
                  <option>Putri</option>
                </select>
<div>

<label className="block mb-2 font-semibold">
Jumlah Anggota Regu
</label>

<input

type="number"

name="jumlah"

value={form.jumlah}

onChange={handleChange}

className="w-full border rounded-lg p-3"

placeholder="Contoh: 8"

/>

</div>
              </div>

            </div>

            <div className="mt-6 flex gap-3">

              <button
                type="submit"
                className="bg-green-700 text-white px-6 py-3 rounded-lg"
              >
                Simpan
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-3 rounded-lg"
              >
                Batal
              </button>

            </div>

          </form>

        )}

      </div>
<table className="w-full mt-8 border">

<thead className="bg-green-700 text-white">

<tr>

<th className="p-3">No</th>
<th className="p-3">Nama Regu</th>
<th className="p-3">Golongan</th>
<th className="p-3">Jenis</th>
<th className="p-3">Jumlah Anggota</th>
<th className="p-3">Aksi</th>

</tr>

</thead>


<tbody>

{
dataRegu.length === 0 ? (

<tr>

<td colSpan="5" className="text-center p-5">

Belum ada data regu

</td>

</tr>

)

:

dataRegu.map((item,index)=>(

<tr key={index}>

<td className="border p-3">
{index+1}
</td>

<td className="border p-3">
{item.nama}
</td>

<td className="border p-3">
{item.golongan}
</td>

<td className="border p-3">
{item.jenis}
</td>
<td className="border p-3 text-center">
{item.jumlah} Orang
</td>

<td className="border p-3 space-x-2">


<button

onClick={()=>editRegu(index)}

className="bg-blue-600 text-white px-3 py-1 rounded"

>

Edit

</button>


<button

onClick={()=>hapusRegu(index)}

className="bg-red-600 text-white px-3 py-1 rounded"

>

Hapus

</button>


</td>

</tr>

))

}

</tbody>

</table>
    </div>
  );
}