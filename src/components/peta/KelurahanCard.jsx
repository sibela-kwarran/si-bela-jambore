import KaplingCard from "./KaplingCard";


// ======================================================
// HITUNG NOMOR GLOBAL KAPLING
//
// Kelurahan 1:
// 01 - 15
//
// Kelurahan 2:
// 16 - 30
//
// Kelurahan 3:
// 31 - 45
//
// Kelurahan 4:
// 46 - 60
//
// Kelurahan 5:
// 61 - 75
//
// Kelurahan 6:
// 76 - 90
// ======================================================

function getNomorGlobal(
  indexKelurahan,
  nomorLokal
) {

  const nomor =
    Number(nomorLokal);

  return (
    indexKelurahan * 15
  ) + nomor;

}


// ======================================================
// FORMAT NOMOR TAMPILAN
//
// PUTRA:
// PA001
//
// PUTRI:
// PI001
// ======================================================

function formatNomorKapling(
  nomor,
  jenis
) {

  const nomorFormat =
    String(nomor).padStart(
      3,
      "0"
    );

  return jenis === "putra"
    ? `PA${nomorFormat}`
    : `PI${nomorFormat}`;

}


// ======================================================
// KELURAHAN CARD
// ======================================================

export default function KelurahanCard({

  nama,

  jenis,

  data,

  cariKapling,

  onSelectGudep,

  indexKelurahan = 0,

}) {

  return (

    <div
      className="
        border
        rounded-lg
        p-4
      "
    >


      {/* ==============================================
          NAMA KELURAHAN
      =============================================== */}

      <h3
        className={`
          font-bold
          mb-3
          ${
            jenis === "putra"
              ? "text-green-700"
              : "text-pink-700"
          }
        `}
      >

        {nama}

      </h3>


      {/* ==============================================
          GRID 15 KAPLING
      =============================================== */}

      <div
        className="
          grid
          grid-cols-5
          gap-2
        "
      >

        {Array.from(
          { length: 15 }
        ).map(
          (_, index) => {


            // ========================================
            // NOMOR LOKAL
            // 01 - 15
            // ========================================

            const nomorLokal =
              index + 1;


            // ========================================
            // NOMOR GLOBAL
            //
            // KELURAHAN 1
            // 01 - 15
            //
            // KELURAHAN 2
            // 16 - 30
            //
            // dst.
            // ========================================

            const nomorGlobal =
              getNomorGlobal(
                indexKelurahan,
                nomorLokal
              );


            // ========================================
            // NOMOR UNTUK DATABASE
            //
            // 01
            // 02
            // ...
            // 90
            // ========================================

            const nomorDatabase =
              String(
                nomorGlobal
              ).padStart(
                2,
                "0"
              );


            // ========================================
            // NOMOR UNTUK TAMPILAN
            //
            // PA001
            // PI001
            // ========================================

            const nomorTampilan =
              formatNomorKapling(
                nomorGlobal,
                jenis
              );


            // ========================================
            // CARI GUDEP
            //
            // Gunakan nomor GLOBAL
            // bukan nomor lokal.
            // ========================================

            const gudep =
              cariKapling(
                nama,
                nomorDatabase,
                jenis
              );


            // ========================================
            // RENDER KAPLING
            // ========================================

            return (

              <KaplingCard

                key={
                  `${jenis}-${nomorGlobal}`
                }

                nomor={
                  nomorTampilan
                }

                nomorAsli={
                  nomorDatabase
                }

                jenis={
                  jenis
                }

                gudep={
                  gudep
                }

                onClick={() => {

                  if (gudep) {

                    onSelectGudep(
                      gudep
                    );

                  }

                }}

              />

            );

          }
        )}

      </div>

    </div>

  );

}