import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifikasiGudep() {
const navigate = useNavigate();

  const dataPendaftaran =
  JSON.parse(localStorage.getItem("dataPendaftaran")) || [];
console.log("DATA PENDAFTARAN ADMIN =", dataPendaftaran);
  

  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-amber-700">
        Verifikasi Gudep
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-amber-700 text-white">

            <tr>

              <th className="p-3">No</th>
              <th>Gudep</th>
              <th>Pembina</th>
              <th>Regu</th>
              <th>Peserta</th>
              <th>Berkas</th>
              <th>Pembayaran</th>
              <th>Status</th>
              <th>Aksi</th>

            </tr>

          </thead>

          <tbody>

  {dataPendaftaran.length === 0 ? (

    <tr>

      <td
        colSpan="9"
        className="text-center p-5"
      >
        Belum ada pendaftaran
      </td>

    </tr>

  ) : (

    dataPendaftaran.map((item,index)=>(

      <tr key={item.id}>

        <td className="p-3">
          {index+1}
        </td>

        <td>{item.namaGudep}</td>

        <td>{item.pembina}</td>

        <td>{item.regu}</td>

        <td>{item.peserta}</td>

        <td>{item.berkas}</td>

        <td>{item.pembayaran}</td>

        <td>{item.status}</td>

        <td>

          <button
  onClick={() =>
    navigate(`/admin/detail-gudep/${item.id}`)
  }
  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
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

    </div>

  );

}