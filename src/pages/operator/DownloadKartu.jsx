import { useState } from "react";
import PreviewKartu from "../../components/PreviewKartu";

export default function DownloadKartu() {

  const [previewPeserta, setPreviewPeserta] = useState(null);



const profil =
  JSON.parse(localStorage.getItem("profilGudep")) || {};

const peserta =
  JSON.parse(localStorage.getItem("dataPeserta")) || [];

const dataPendaftaran =
  JSON.parse(localStorage.getItem("dataPendaftaran")) || [];

const data = dataPendaftaran.find(
  item => item.namaGudep === profil.pangkalan
);




  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-green-700">

        Download Kartu Peserta

      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <p>

          <b>Pangkalan :</b>

          {profil.pangkalan}

        </p>

        <p>

          <b>Status :</b>

          {data?.status || "-"}

        </p>

        <p>

          <b>Jumlah Peserta :</b>

          {peserta.length}

        </p>

      </div>
<div className="bg-white rounded-xl shadow p-6">

  <div className="flex justify-between items-center mb-4">

    <h2 className="text-xl font-bold">
      Daftar Peserta
    </h2>

    
  </div>

  <table className="w-full border">

    <thead className="bg-green-700 text-white">

      <tr>

        <th className="border p-3">No</th>

        <th className="border p-3">
          Nama Peserta
        </th>

        <th className="border p-3">
          Regu
        </th>

        <th className="border p-3">
          Preview
        </th>

      </tr>

    </thead>

    <tbody>

      {peserta.length === 0 ? (

        <tr>

          <td
            colSpan={4}
            className="text-center p-5"
          >

            Belum ada peserta

          </td>

        </tr>

      ) : (

        peserta.map((item, index) => (

          <tr key={index}>

            <td className="border p-3 text-center">
              {index + 1}
            </td>

            <td className="border p-3">
              {item.nama}
            </td>

            <td className="border p-3 text-center">
              {item.regu}
            </td>

            <td className="border p-3 text-center">

              <button
  onClick={() => setPreviewPeserta(item)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
>
  👁 Preview
</button>

            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>
{previewPeserta && (

  

  <PreviewKartu
    peserta={previewPeserta}
    onClose={() => setPreviewPeserta(null)}
  />

)}

 

    </div>

  );

}