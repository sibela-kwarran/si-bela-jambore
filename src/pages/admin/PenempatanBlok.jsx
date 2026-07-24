import { useState } from "react";

export default function PenempatanBlok() {

  const [data, setData] = useState(
  JSON.parse(localStorage.getItem("dataPendaftaran")) || []
);

const kelurahanPutra = [
  "Diponegoro",
  "Pattimura",
  "Jenderal Sudirman",
  "Gatot Subroto",
  "Sultan Hasanuddin",
  "Imam Bonjol",
];

const kelurahanPutri = [
  "Dewi Sartika",
  "Cut Nyak Dhien",
  "Martha Christina Tiahahu",
  "Maria Walanda Maramis",
  "Rasuna Said",
  "Fatmawati",
];

const handleGenerate = () => {

  let nomor = 0;

  const hasil = data.map((item) => {

    // Hanya Gudep yang sudah diverifikasi
    if (item.status !== "Terverifikasi") {
      return item;
    }

    const indexKelurahan = Math.floor(nomor / 15);

    const nomorKapling = String(
      (nomor % 15) + 1
    ).padStart(2, "0");

    const dataBaru = {

      ...item,

      blokPutra: {

        kecamatan: "Soekarno",

        kelurahan:
          kelurahanPutra[indexKelurahan],

        kapling: nomorKapling,

      },

      blokPutri: {

        kecamatan: "R.A. Kartini",

        kelurahan:
          kelurahanPutri[indexKelurahan],

        kapling: nomorKapling,

      },

    };

    nomor++;

    return dataBaru;

  });

  localStorage.setItem(
    "dataPendaftaran",
    JSON.stringify(hasil)
  );

  setData(hasil);

  console.log("Generate Kapling berhasil");

};



  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-green-700">
        Penempatan Blok Perkemahan
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-center mb-5">

          <div>
            <h2 className="text-xl font-bold">
              Daftar Penempatan Gudep
            </h2>

            <p className="text-gray-500">
              Jumlah Gudep :
              <b> {data.length}</b>
            </p>
          </div>

          <button
  onClick={handleGenerate}
  className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg"
>
  ⚙ Generate Kapling
</button>

        </div>

        <table className="w-full border">

          <thead className="bg-green-700 text-white">

            <tr>

              <th className="border p-3 w-16">
                No
              </th>

              <th className="border p-3">
                Gugus Depan
              </th>

              <th className="border p-3">
                Kecamatan Putra
              </th>

              <th className="border p-3">
                Kelurahan Putra
              </th>

              <th className="border p-3">
                Kapling
              </th>

              <th className="border p-3">
                Kecamatan Putri
              </th>

              <th className="border p-3">
                Kelurahan Putri
              </th>

              <th className="border p-3">
                Kapling
              </th>

              <th className="border p-3">
                Status
              </th>

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan={9}
                  className="text-center p-5"
                >
                  Belum ada data.
                </td>

              </tr>

            ) : (

              data.map((item, index) => (

                <tr key={index}>

                  <td className="border p-3 text-center">
                    {index + 1}
                  </td>

                  <td className="border p-3">
                    {item.namaGudep}
                  </td>

                  <td className="border p-3 text-center">
  {item.blokPutra?.kecamatan || "-"}
</td>

                  <td className="border p-3 text-center">
  {item.blokPutra?.kelurahan || "-"}
</td>

                  <td className="border p-3 text-center">
  {item.blokPutra?.kapling || "-"}
</td>

                  <td className="border p-3 text-center">
  {item.blokPutri?.kecamatan || "-"}
</td>

                  <td className="border p-3 text-center">
  {item.blokPutri?.kelurahan || "-"}
</td>

                  <td className="border p-3 text-center">
  {item.blokPutri?.kapling || "-"}
</td>

                  <td className="border p-3 text-center">

  {item.blokPutra ? (

    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
      Sudah Dibuat
    </span>

  ) : (

    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
      Belum Dibuat
    </span>

  )}

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