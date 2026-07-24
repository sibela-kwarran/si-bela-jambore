import { useState } from "react";
import DetailKapling from "../../components/peta/DetailKapling";

import { wilayahPerkemahan } from "../../data/wilayahPerkemahan";
import KaplingCard from "../../components/peta/KaplingCard";
import KelurahanCard from "../../components/peta/KelurahanCard";
import KecamatanCard from "../../components/peta/KecamatanCard";

export default function PetaPerkemahan() {
const data =
  JSON.parse(localStorage.getItem("dataPendaftaran")) || [];
const [selectedGudep, setSelectedGudep] = useState(null);

const cariKapling = (
  kelurahan,
  nomor,
  jenis
) => {

  return data.find((item) => {

    if (jenis === "putra") {

      return (
        item.blokPutra?.kelurahan === kelurahan &&
        item.blokPutra?.kapling === nomor
      );

    }

    return (

      item.blokPutri?.kelurahan === kelurahan &&
      item.blokPutri?.kapling === nomor

    );

  });

};



  return (

    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-green-700">
        Peta Bumi Perkemahan
      </h1>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-2">
          Layout Perkemahan Jambore Ranting
        </h2>

        <p className="text-gray-500 mb-6">
          Penempatan Gudep Putra dan Putri
        </p>

        <div className="grid grid-cols-2 gap-8">

  <KecamatanCard
  jenis="putra"
  data={data}
  cariKapling={cariKapling}
  onSelectGudep={setSelectedGudep}
/>

  <KecamatanCard
  jenis="putri"
  data={data}
  cariKapling={cariKapling}
  onSelectGudep={setSelectedGudep}
/>

</div>

          
          </div>
<DetailKapling

  gudep={selectedGudep}

  onClose={() => setSelectedGudep(null)}

/>
        </div>

  );

}