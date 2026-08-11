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

      {/* ==========================================
          HEADER KECAMATAN
      =========================================== */}

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


      {/* ==========================================
          DAFTAR KELURAHAN
      =========================================== */}

      <div className="mt-4 space-y-4">

        {info.kelurahan.map(
          (namaKelurahan, indexKelurahan) => (

            <KelurahanCard

              key={namaKelurahan}

              nama={namaKelurahan}

              jenis={jenis}

              data={data}

              cariKapling={cariKapling}

              onSelectGudep={onSelectGudep}

              /*
               * INI PENTING
               *
               * Kelurahan ke-0:
               * 001 - 015
               *
               * Kelurahan ke-1:
               * 016 - 030
               *
               * Kelurahan ke-2:
               * 031 - 045
               *
               * dst.
               */

              indexKelurahan={
                indexKelurahan
              }

            />

          )
        )}

      </div>

    </div>

  );

}