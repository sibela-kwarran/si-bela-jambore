import { useState } from "react";

export default function VerifikasiPembayaran() {

  // sementara masih 1 Gudep (LocalStorage)
  const pembayaran = JSON.parse(
    localStorage.getItem("pembayaran") || "{}"
  );

  const profil = JSON.parse(
    localStorage.getItem("profilGudep") || "{}"
  );

  const peserta = JSON.parse(
    localStorage.getItem("dataPeserta") || "[]"
  );

  const pembina = JSON.parse(
    localStorage.getItem("dataPembina") || "[]"
  );

  const [cari, setCari] = useState("");
const [selected, setSelected] = useState(null);
function ubahStatus(statusBaru) {

  const dataBaru = {
    ...pembayaran,
    status: statusBaru,
  };

  localStorage.setItem(
    "pembayaran",
    JSON.stringify(dataBaru)
  );

  setSelected((prev) => ({
    ...prev,
    status: statusBaru,
  }));

}


  const data = [];

  if (Object.keys(profil).length > 0) {

    data.push({

      id: 1,

      gudep:
  profil.pangkalan ||
  profil.namaSekolah ||
  profil.namaGudep ||
  "-",

      ketua:
        pembina.length > 0
          ? pembina[0].nama
          : "-",

      peserta: peserta.length,

      total:
        peserta.length *
        (pembayaran.biayaPerPeserta || 75000),

      status:
        pembayaran.status ||
        "Belum Bayar",

    });

  }

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

              <th>Ketua</th>

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

  {pembayaran.bukti && (

    <div className="mt-6">

      {pembayaran.bukti.tipe === "application/pdf" ? (

        <a
          href={pembayaran.bukti.file}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          Lihat PDF
        </a>

      ) : (

        <img
          src={pembayaran.bukti.file}
          className="w-80 rounded-lg border"
          alt="Bukti Transfer"
        />

      )}

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