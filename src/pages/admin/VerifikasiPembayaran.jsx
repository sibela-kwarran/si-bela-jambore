import { useState, useEffect } from "react";

import {
  getPeserta
} from "../../services/pesertaService";

import {
  getSemuaPembayaran,
 updatePembayaran
} from "../../services/pembayaranService";

export default function VerifikasiPembayaran() {
const [dataPembayaran,setDataPembayaran] = useState([]);

const [peserta,setPeserta] = useState([]);


  // sementara masih 1 Gudep (LocalStorage)
  

  const profil = JSON.parse(
    localStorage.getItem("profilGudep") || "{}"
  );

  

  const pembina = JSON.parse(
    localStorage.getItem("dataPembina") || "[]"
  );

  const [cari, setCari] = useState("");
const [selected, setSelected] = useState(null);

async function ubahStatus(statusBaru) {

  try {

    await updatePembayaran(
      selected.id,
      {
        status: statusBaru
      }
    );


    


    setSelected(prev => ({

      ...prev,

      status: statusBaru

    }));


    alert("Status pembayaran berhasil diperbarui");


  } catch(err) {

    console.error(
      "Gagal update pembayaran:",
      err
    );

    alert(
      "Gagal mengubah status pembayaran"
    );

  }

}
useEffect(()=>{

loadData();

},[]);



async function loadData() {

  try {

    const data = await getSemuaPembayaran();

    setDataPembayaran(data);

  } catch(err) {

    console.error(err);

  }

}

  const data = dataPembayaran.map((item) => ({

  id: item.id,

  gudep:
    item.profil_gudep?.nama_pangkalan || "-",

  ketua:
    item.profil_gudep?.nama_mabigus || "-",

  peserta:
    item.jumlah_peserta || 0,

  total:
    item.nominal || 0,

  status:
    item.status || "Belum Bayar",

  bukti:
    item.bukti || null,

}));

const hasil = data.filter((item) =>
  item.gudep
    .toLowerCase()
    .includes(cari.toLowerCase())
);

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-amber-700">
          Verifikasi Pembayaran
        </h1>

        <input
          type="text"
          placeholder="Cari Gudep..."
          value={cari}
          onChange={(e) =>
            setCari(e.target.value)
          }
          className="border rounded-lg px-4 py-2 w-72"
        />

      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-amber-700 text-white">

            <tr>

              <th className="p-3">No</th>

              <th>Gudep</th>

              <th>Mabigus</th>

              <th>Peserta</th>

              <th>Total</th>

              <th>Status</th>

              <th>Aksi</th>

            </tr>

          </thead>

          <tbody>

            {hasil.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-6"
                >
                  Belum ada data pembayaran
                </td>

              </tr>

            ) : (

              hasil.map((item, index) => (

                <tr
                  key={item.id}
                  className="border-b"
                >

                  <td className="p-3 text-center">
                    {index + 1}
                  </td>

                  <td>{item.gudep}</td>

                  <td>{item.ketua}</td>

                  <td className="text-center">
                    {item.peserta}
                  </td>

                  <td>

                    Rp{" "}

                    {item.total.toLocaleString(
                      "id-ID"
                    )}

                  </td>

                  <td>

                    <StatusBadge
  status={
    selected &&
    selected.id === item.id
      ? selected.status
      : item.status
  }
/>

                  </td>

                  <td>

                    <button
  onClick={() => setSelected(item)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
  Lihat
</button>

                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>
{selected && (

<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-2xl font-bold text-amber-700 mb-5">
    Detail Pembayaran
  </h2>

  <div className="grid grid-cols-2 gap-5">

    <Info title="Gudep" value={selected.gudep} />

    <Info title="Ketua" value={selected.ketua} />

    <Info title="Jumlah Peserta" value={selected.peserta} />

    <Info
      title="Total Bayar"
      value={`Rp ${selected.total.toLocaleString("id-ID")}`}
    />

    <Info title="Status" value={selected.status} />

  </div>

  {selected?.bukti && (

<div className="mt-6">

<h3 className="font-bold mb-3">
Bukti Transfer
</h3>


{
selected.bukti.toLowerCase()
.includes(".pdf")
?

(
<a
href={selected.bukti}
target="_blank"
rel="noreferrer"
className="bg-blue-600 text-white px-5 py-2 rounded-lg inline-block"
>
📄 Lihat PDF
</a>
)

:

(
<img
src={selected.bukti}
alt="Bukti Transfer"
className="w-96 rounded-lg border shadow"
/>
)

}


</div>

)}

  <div className="flex gap-3 mt-6">

    <button
  onClick={() => ubahStatus("Lunas")}
  className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg"
>
  ✔ Verifikasi
</button>

    <button
  onClick={() => ubahStatus("Ditolak")}
  className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg"
>
  ✖ Tolak
</button>

  </div>

</div>

)}
    </div>

  );

}

function StatusBadge({ status }) {

  if (status === "Lunas") {
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
        Lunas
      </span>
    );
  }

  if (status === "Ditolak") {
    return (
      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
        Ditolak
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
      Menunggu
    </span>
  );

}

function Info({ title, value }) {

  return (

    <div className="border rounded-lg p-4">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="font-bold text-xl">
        {value}
      </h2>

    </div>

  );

}