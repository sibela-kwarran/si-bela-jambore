import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../lib/supabase";

export default function TabelGudepTerbaru() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
  try {
    setLoading(true);

    // ==========================================
    // 1. AMBIL DATA GUDEP
    // ==========================================

    const { data: gudep, error: errGudep } = await supabase
      .from("profil_gudep")
      .select("*")
      .order("created_at", { ascending: false });

    if (errGudep) throw errGudep;


    // ==========================================
    // 2. AMBIL DATA OPERATOR
    // ==========================================

    const { data: operator, error: errOperator } = await supabase
      .from("operator_gudep")
      .select("id,nama_operator,email,status");

    if (errOperator) throw errOperator;


    // ==========================================
    // 3. AMBIL DATA PENDAFTARAN
    // ==========================================

    const { data: pendaftaran, error: errPendaftaran } =
      await supabase
        .from("pendaftaran")
        .select("id,gudep_id,status");

    if (errPendaftaran) throw errPendaftaran;


    console.log("DATA GUDEP :", gudep);
    console.log("DATA PENDAFTARAN :", pendaftaran);


    // ==========================================
    // 4. JOIN GUDEP + OPERATOR + PENDAFTARAN
    // ==========================================

    const hasil = gudep.map((g) => {

      const operatorGudep =
        operator.find(
          (o) => o.id === g.operator_id
        ) || null;


      const dataPendaftaran =
        pendaftaran.find(
          (p) => p.gudep_id === g.id
        ) || null;


      return {

        ...g,

        operator: operatorGudep,

        pendaftaran_id:
          dataPendaftaran?.id || null,

        pendaftaran_status:
          dataPendaftaran?.status || null,

      };

    });


    console.log(
      "HASIL JOIN GUDEP + PENDAFTARAN :",
      hasil
    );


    setData(hasil);

  } catch (err) {

    console.error(
      "ERROR LOAD GUDEP :",
      err
    );

  } finally {

    setLoading(false);

  }
}

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-green-700 mb-4">
        📋 Gudep Terbaru
      </h2>

      {loading ? (
        <div className="text-center py-10">
          Memuat data...
        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="w-full border-collapse">

            <thead>

              <tr className="bg-green-700 text-white">

                <th className="p-3">No</th>
                <th>Gudep</th>
                <th>Pangkalan</th>
                <th>Operator</th>
                <th>Status</th>
                <th>Aksi</th>

              </tr>

            </thead>

            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-6 text-gray-500"
                  >
                    Belum ada data Gudep
                  </td>

                </tr>

              ) : (

                data.map((item, index) => (

                  <tr
                    key={item.id}
                    className="border-b hover:bg-green-50 transition"
                  >

                    <td className="text-center p-3">
                      {index + 1}
                    </td>

                    <td>

  {item.pendaftaran_id ? (

    <>
      <div className="font-semibold">
        {item.gudep_putra}
      </div>

      <div className="text-gray-600">
        {item.gudep_putri}
      </div>
    </>

  ) : (

    <div className="bg-red-100 border border-red-300 rounded-lg px-3 py-2">

      <div className="font-bold text-red-700">
        {item.gudep_putra}
      </div>

      <div className="text-red-600">
        {item.gudep_putri}
      </div>

      <div className="text-xs font-bold text-red-700 mt-1">
        ⚠️ BELUM MENDAFTAR
      </div>

    </div>

  )}

</td>
                    <td>

                      <div className="font-semibold">
                        {item.nama_pangkalan}
                      </div>

                    </td>

                    <td>

                      <div className="font-semibold">
                        {item.operator?.nama_operator || "-"}
                      </div>

                      <div className="text-xs text-gray-500">
                        {item.operator?.email || "-"}
                      </div>

                    </td>

                    <td className="text-center">

                      {item.operator?.status === "aktif" ? (

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Aktif
                        </span>

                      ) : (

                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                          Non Aktif
                        </span>

                      )}

                    </td>

                    <td className="text-center">

                      <button
  onClick={() =>
  navigate(`/admin/detail-gudep/${item.id}`, {
    state: {
      from: "dashboard",
    },
  })
}
className="
  bg-blue-600
  hover:bg-blue-700
  text-white
  px-4
  py-2
  rounded-lg
  font-semibold
"
>
  Detail
</button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}