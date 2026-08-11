import { useState, useEffect } from "react";

import DetailKapling from "../../components/peta/DetailKapling";
import KecamatanCard from "../../components/peta/KecamatanCard";

import {
  getPeta,
  getDetailKapling,
} from "../../services/petaService";


// ======================================================
// FORMAT NOMOR KAPLING
// PUTRA  -> PA001
// PUTRI  -> PI001
// ======================================================

function formatNomorKapling(nomor, jenis) {
  if (!nomor) return "-";

  const angka = String(nomor)
    .replace(/^PA/i, "")
    .replace(/^PI/i, "")
    .replace(/^0+/, "");

  const nomorFormat = String(angka || "0").padStart(3, "0");

  return jenis === "putra"
    ? `PA${nomorFormat}`
    : `PI${nomorFormat}`;
}


// ======================================================
// NORMALISASI NOMOR
// Supaya pencarian tetap cocok dengan data Supabase
// ======================================================

function normalisasiNomor(nomor) {
  if (nomor === null || nomor === undefined) {
    return "";
  }

  return String(nomor)
    .replace(/^PA/i, "")
    .replace(/^PI/i, "")
    .replace(/^0+/, "") || "0";
}


export default function PetaPerkemahan() {

  const [data, setData] = useState([]);

  const [selectedGudep, setSelectedGudep] =
    useState(null);

  const [jenisKapling, setJenisKapling] =
    useState("");


  // ======================================================
  // LOAD PETA
  // ======================================================

  useEffect(() => {

    loadPeta();

  }, []);


  async function loadPeta() {

    try {

      const hasil = await getPeta();

      console.log(
        "DATA PETA PERKEMAHAN:",
        hasil
      );

      setData(hasil || []);

    } catch (error) {

      console.error(
        "GAGAL LOAD PETA:",
        error
      );

    }

  }


  // ======================================================
  // CARI KAPLING
  // ======================================================

  // ======================================================
// CARI KAPLING
// ======================================================

const cariKapling = (
  kelurahan,
  nomor,
  jenis
) => {

  // ==========================================
  // NORMALISASI NOMOR TARGET
  // ==========================================

  const nomorTarget = Number(
    String(nomor)
      .trim()
      .replace(/^PA/i, "")
      .replace(/^PI/i, "")
      .replace(/^0+/, "") || "0"
  );

  console.log("🔎 CARI KAPLING:", {
    jenis,
    kelurahan,
    nomor,
    nomorTarget,
  });

  // ==========================================
  // CARI BERDASARKAN NOMOR KAPLING
  // ==========================================

  const hasil = data.find((item) => {

    // =================================================
    // PUTRA
    // =================================================

    if (jenis === "putra") {

      const daftarNomor = String(
        item.kapling_putra || ""
      )
        .split(",")
        .map((nomor) =>
          Number(
            String(nomor)
              .trim()
              .replace(/^PA/i, "")
              .replace(/^PI/i, "")
              .replace(/^0+/, "") || "0"
          )
        )
        .filter(
          (nomor) => !isNaN(nomor)
        );

      return daftarNomor.includes(
        nomorTarget
      );
    }

    // =================================================
    // PUTRI
    // =================================================

    if (jenis === "putri") {

      const daftarNomor = String(
        item.kapling_putri || ""
      )
        .split(",")
        .map((nomor) =>
          Number(
            String(nomor)
              .trim()
              .replace(/^PA/i, "")
              .replace(/^PI/i, "")
              .replace(/^0+/, "") || "0"
          )
        )
        .filter(
          (nomor) => !isNaN(nomor)
        );

      return daftarNomor.includes(
        nomorTarget
      );
    }

    return false;
  });

  // ==========================================
  // DEBUG
  // ==========================================

  console.log(
    "✅ HASIL CARI:",
    hasil
      ? {
          gudep:
            hasil.profil_gudep?.nama_pangkalan,

          kaplingPutra:
            hasil.kapling_putra,

          kaplingPutri:
            hasil.kapling_putri,

          kelurahanPutra:
            hasil.kelurahan_putra,

          kelurahanPutri:
            hasil.kelurahan_putri,
        }
      : null
  );

  return hasil;
};


  // ======================================================
  // DATA UNTUK TAMPILAN PETA
  //
  // Data asli:
  // kapling_putra = 003
  // kapling_putri = 003
  //
  // Tampilan:
  // PA003
  // PI003
  // ======================================================

  const dataPeta = (data || []).map((item) => ({

    ...item,

    // PUTRA
    nomor_kapling_putra:
      item.kapling_putra
        ? formatNomorKapling(
            item.kapling_putra,
            "putra"
          )
        : null,

    kapling_putra_label:
      item.kapling_putra
        ? formatNomorKapling(
            item.kapling_putra,
            "putra"
          )
        : null,


    // PUTRI
    nomor_kapling_putri:
      item.kapling_putri
        ? formatNomorKapling(
            item.kapling_putri,
            "putri"
          )
        : null,

    kapling_putri_label:
      item.kapling_putri
        ? formatNomorKapling(
            item.kapling_putri,
            "putri"
          )
        : null,

  }));


  // ======================================================
  // TAMPILAN
  // ======================================================

  return (

    <div className="space-y-6">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div>

        <h1 className="
          text-3xl
          font-bold
          text-green-700
        ">

          🏕️ Peta Bumi Perkemahan

        </h1>

        <p className="
          text-gray-500
          mt-1
        ">

          Layout penempatan Gudep Putra dan Putri

        </p>

      </div>


      {/* ==================================================
          KETERANGAN KODE KAPLING
      ================================================== */}

      <div className="
        bg-white
        rounded-xl
        shadow
        p-5
      ">

        <div className="
          flex
          flex-wrap
          gap-4
          text-sm
        ">

          <div className="
            bg-blue-50
            border
            border-blue-200
            rounded-lg
            px-4
            py-2
            text-blue-700
            font-semibold
          ">

            🧑 PA001 – PA015 = Kapling Putra

          </div>


          <div className="
            bg-pink-50
            border
            border-pink-200
            rounded-lg
            px-4
            py-2
            text-pink-700
            font-semibold
          ">

            👩 PI001 – PI015 = Kapling Putri

          </div>

        </div>

      </div>


      {/* ==================================================
          PETA
      ================================================== */}

      <div className="
        bg-white
        rounded-xl
        shadow
        p-6
      ">

        <h2 className="
          text-xl
          font-bold
          mb-2
        ">

          Layout Perkemahan Jambore Ranting

        </h2>

        <p className="
          text-gray-500
          mb-6
        ">

          Nomor kapling Putra dan Putri menggunakan
          kode berbeda untuk menghindari nomor ganda.

        </p>


        <div className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-8
        ">


          {/* ==================================================
              BLOK PUTRA
          ================================================== */}

          <KecamatanCard
            jenis="putra"
            data={dataPeta}
            cariKapling={cariKapling}

            onSelectGudep={async (item) => {

              try {

                const detail =
                  await getDetailKapling(
                    item.gudep_id
                  );


                console.log(
                  "KLIK KAPLING PUTRA:",
                  detail
                );


                setSelectedGudep(detail);

                setJenisKapling("Putra");

              } catch (error) {

                console.error(
                  "GAGAL DETAIL PUTRA:",
                  error
                );

              }

            }}

          />


          {/* ==================================================
              BLOK PUTRI
          ================================================== */}

          <KecamatanCard
            jenis="putri"
            data={dataPeta}
            cariKapling={cariKapling}

            onSelectGudep={async (item) => {

              try {

                const detail =
                  await getDetailKapling(
                    item.gudep_id
                  );


                console.log(
                  "KLIK KAPLING PUTRI:",
                  detail
                );


                setSelectedGudep(detail);

                setJenisKapling("Putri");

              } catch (error) {

                console.error(
                  "GAGAL DETAIL PUTRI:",
                  error
                );

              }

            }}

          />

        </div>

      </div>


      {/* ==================================================
          DETAIL KAPLING
      ================================================== */}

      <DetailKapling

        gudep={selectedGudep}

        jenis={jenisKapling}

        onClose={() =>
          setSelectedGudep(null)
        }

      />

    </div>

  );

}