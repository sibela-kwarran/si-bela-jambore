import { useState } from "react";

export default function DataPesertaAdmin() {

  const profil = JSON.parse(
    localStorage.getItem("profilGudep") || "{}"
  );

  const peserta = JSON.parse(
    localStorage.getItem("dataPeserta") || "[]"
  );

  const [cari, setCari] = useState("");

  const hasil = peserta.filter((item) =>
    item.nama
      ?.toLowerCase()
      .includes(cari.toLowerCase())
  );

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-amber-700">
            Data Peserta
          </h1>

          <p className="text-gray-500">
            {profil.pangkalan || profil.namaGudep || "-"}
          </p>

        </div>

        <input
          type="text"
          placeholder="Cari peserta..."
          value={cari}
          onChange={(e)=>setCari(e.target.value)}
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      <div className="bg-white rounded-xl shadow p-5">

        <div className="flex justify-between mb-5">

          <h2 className="font-bold text-xl">
            Total Peserta
          </h2>

          <span className="text-3xl font-bold text-green-700">
            {hasil.length}
          </span>

        </div>

        <table className="w-full">

          <thead className="bg-amber-700 text-white">

            <tr>
  <th className="p-3">No</th>
  <th>Nama</th>
  <th>JK</th>
  <th>Kelas</th>
  <th>Regu</th>
  <th>Status</th>
</tr>

          </thead>

          <tbody>

            {hasil.length===0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center p-6"
                >
                  Belum ada peserta
                </td>

              </tr>

            ) : (

              hasil.map((item,index)=>(

                <tr
  key={index}
  className="border-b hover:bg-gray-50"
>
  <td className="p-3 text-center">
    {index + 1}
  </td>

  <td>{item.nama}</td>

  <td className="text-center">
    {item.jk}
  </td>

  <td className="text-center">
    {item.kelas}
  </td>

  <td className="text-center">
    {item.regu}
  </td>

  <td className="text-center">
    <span
      className={`px-3 py-1 rounded-full text-sm ${
        item.status === "Aktif"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {item.status}
    </span>
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