import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getSemuaPendaftaran,
} from "../../services/pendaftaranService";

export default function VerifikasiGudep() {

  const navigate = useNavigate();

  const [dataPendaftaran, setDataPendaftaran] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {

    try {

      const data = await getSemuaPendaftaran();

      setDataPendaftaran(data || []);

    } catch (err) {

      console.error(err);

    }

  }

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

              <th>Status</th>

              <th>Aksi</th>

            </tr>

          </thead>

          <tbody>

            {dataPendaftaran.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="text-center p-6"
                >
                  Belum ada data pendaftaran
                </td>

              </tr>

            ) : (

              dataPendaftaran.map((item, index) => (

                <tr key={item.id}>

                  <td className="p-3">

                    {index + 1}

                  </td>

                  <td>

                    {item.profil_gudep?.nama_pangkalan}

                  </td>

                  <td className="text-center">

                    {item.jumlah_pembina}

                  </td>

                  <td className="text-center">

                    {item.jumlah_regu}

                  </td>

                  <td className="text-center">

                    {item.jumlah_peserta}

                  </td>

                  <td>

                    {item.status}

                  </td>

                  <td>

                    <button

                      onClick={() => {
  console.log("DATA ITEM DI KLIK:", item);
  navigate(`/admin/detail-gudep/${item.id}`);
}}

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

    </div>

  );

}