import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function DataGudep() {

  const navigate = useNavigate();

  const profil = JSON.parse(
    localStorage.getItem("profilGudep") || "{}"
  );

  const peserta = JSON.parse(
    localStorage.getItem("dataPeserta") || "[]"
  );

  const daftarGudep = useMemo(() => {

    const namaGudep =
      profil.pangkalan ||
      profil.namaGudep ||
      "Belum Ada Gudep";

    const putra = peserta.filter(
      (p) => p.jk === "Putra"
    ).length;

    const putri = peserta.filter(
      (p) => p.jk === "Putri"
    ).length;

    return [
      {
        namaGudep,
        putra,
        putri,
        total: peserta.length,
        status:
          peserta.length > 0
            ? "Lengkap"
            : "Belum Ada Peserta",
      },
    ];

  }, [profil, peserta]);

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-amber-700">
          Data Gudep
        </h1>

        <p className="text-gray-500">
          Daftar Gugus Depan Peserta Jambore
        </p>

      </div>

      <div className="bg-white rounded-xl shadow p-5">

        <table className="w-full">

          <thead className="bg-amber-700 text-white">

            <tr>

              <th className="p-3">No</th>

              <th>Nama Gudep</th>

              <th>Putra</th>

              <th>Putri</th>

              <th>Total</th>

              <th>Status</th>

              <th>Aksi</th>

            </tr>

          </thead>

          <tbody>

            {daftarGudep.map((item, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-50"
              >

                <td className="text-center p-3">
                  {index + 1}
                </td>

                <td>{item.namaGudep}</td>

                <td className="text-center">
                  {item.putra}
                </td>

                <td className="text-center">
                  {item.putri}
                </td>

                <td className="text-center font-bold">
                  {item.total}
                </td>

                <td className="text-center">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Lengkap"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="text-center">

                  <button
  onClick={() => navigate("/admin/detail-gudep")}
  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
>
  Lihat
</button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}