import KaplingCard from "./KaplingCard";

export default function KelurahanCard({

  nama,

  jenis,

  data,

  cariKapling,

  onSelectGudep,

}) {

  return (

    <div className="border rounded-lg p-4">

      <h3 className="font-bold text-green-700 mb-3">

        {nama}

      </h3>

      <div className="grid grid-cols-5 gap-2">

        {Array.from({ length: 15 }).map((_, index) => {

          const nomor = String(index + 1).padStart(2, "0");

          const gudep = cariKapling(
            nama,
            nomor,
            jenis
          );

          return (

           <KaplingCard

  key={nomor}

  nomor={nomor}

  gudep={gudep}

  onClick={() => {

    if (gudep) {

      onSelectGudep(gudep);

    }

  }}
/>

          );

        })}

      </div>

    </div>

  );

}