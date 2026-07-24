import KelurahanCard from "./KelurahanCard";
import { wilayahPerkemahan } from "../../data/wilayahPerkemahan";

export default function KecamatanCard({

  jenis,

  data,

  cariKapling,

  onSelectGudep,

}) {

  const info = wilayahPerkemahan[jenis];

  return (

    <div>

      <div
        className={`
          text-white
          rounded-lg
          p-3
          text-center
          font-bold
          ${
            jenis === "putra"
              ? "bg-green-700"
              : "bg-pink-600"
          }
        `}
      >

        KECAMATAN {info.kecamatan.toUpperCase()}

      </div>

      <div className="mt-4 space-y-4">

        {info.kelurahan.map((namaKelurahan) => (

          <KelurahanCard

  key={namaKelurahan}

  nama={namaKelurahan}

  jenis={jenis}

  data={data}

  cariKapling={cariKapling}

  onSelectGudep={onSelectGudep}

/>

        ))}

      </div>

    </div>

  );

}