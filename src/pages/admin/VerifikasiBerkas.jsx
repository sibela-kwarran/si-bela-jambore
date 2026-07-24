import { useState } from "react";

export default function VerifikasiBerkas() {

  const berkas = JSON.parse(
    localStorage.getItem("uploadBerkas") || "{}"
  );

  const profil = JSON.parse(
    localStorage.getItem("profilGudep") || "{}"
  );

  const pembina = JSON.parse(
    localStorage.getItem("dataPembina") || "[]"
  );

  const [selected, setSelected] = useState(null);

  const data = [];

  if (Object.keys(profil).length > 0) {

    data.push({

      id:1,

      gudep:
        profil.pangkalan ||
        profil.namaGudep ||
        "-",

      ketua:
        pembina.length>0
          ? pembina[0].nama
          : "-",

      suratTugas:
        berkas.suratTugas,

      suratIzin:
        berkas.suratIzin,

      status:
        berkas.status || "Menunggu"

    });

  }
function Info({ title, value }) {

  return (

    <div className="border rounded-lg p-4">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-xl font-bold">
        {value}
      </h2>

    </div>

  );

}
console.log("BERKAS =", berkas);
console.log("DATA =", data);

function ubahStatus(status) {

  const dataBaru = {

    ...berkas,

    status,

  };

  localStorage.setItem(
    "uploadBerkas",
    JSON.stringify(dataBaru)
  );

  setSelected((prev) => ({
    ...prev,
    status,
  }));

  window.location.reload();

}

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-amber-700">

        Verifikasi Berkas

      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-amber-700 text-white">

            <tr>

              <th className="p-3">No</th>
              <th>Gudep</th>
              <th>Surat Tugas</th>
              <th>Surat Izin</th>
              <th>Status</th>
              <th>Aksi</th>

            </tr>

          </thead>

          <tbody>

            {data.map((item,index)=>(

              <tr key={item.id} className="border-b">

                <td className="p-3 text-center">
                  {index+1}
                </td>

                <td>{item.gudep}</td>

                <td className="text-center">
  {item.suratTugas?.nama || "-"}
</td>

<td className="text-center">
  {item.suratIzin?.nama || "-"}
</td>

                <td>

  {item.status === "Terverifikasi" && (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
      ✔ Terverifikasi
    </span>
  )}

  {item.status === "Ditolak" && (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
      ✖ Ditolak
    </span>
  )}

  {item.status === "Menunggu" && (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
      ⏳ Menunggu
    </span>
  )}

</td>

                <td>

                  <button
                    onClick={()=>setSelected(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Lihat
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
{selected && (

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-2xl font-bold text-amber-700 mb-6">
    Detail Berkas
  </h2>

  <div className="grid grid-cols-2 gap-5">

    <Info
      title="Gudep"
      value={selected.gudep}
    />

    <Info
      title="Ketua Kontingen"
      value={selected.ketua}
    />

  </div>

  {/* SURAT TUGAS */}

  <div className="mt-8 border rounded-lg p-5">

    <h3 className="text-xl font-bold mb-3">
      📄 Surat Tugas Mabigus
    </h3>

    {selected.suratTugas ? (

  <div>

    <p className="mb-3">
      <b>Nama File :</b> {selected.suratTugas.nama}
    </p>

    <iframe
      src={selected.suratTugas.file}
      className="w-full h-[700px] border rounded-lg"
      title="Surat Tugas"
    />

  </div>

) : (

  <p className="text-red-600">
    Belum diupload.
  </p>

)}

  </div>

  {/* SURAT IZIN */}

  <div className="mt-6 border rounded-lg p-5">

    <h3 className="text-xl font-bold mb-3">
      📄 Surat Izin Orang Tua
    </h3>

    {selected.suratIzin ? (

  <div>

    <p className="mb-3">
      <b>Nama File :</b> {selected.suratIzin.nama}
    </p>

    <iframe
      src={selected.suratIzin.file}
      className="w-full h-[700px] border rounded-lg"
      title="Surat Izin"
    />

  </div>

) : (

  <p className="text-red-600">
    Belum diupload.
  </p>

)}

  </div>

  <div className="flex gap-3 mt-8">

    <button
  onClick={() => ubahStatus("Terverifikasi")}
  className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-lg"
>
  ✔ Verifikasi Berkas
</button>

    <button
  onClick={() => ubahStatus("Ditolak")}
  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
>
  ✖ Tolak Berkas
</button>

  </div>

</div>

)}
    </div>

  );

}