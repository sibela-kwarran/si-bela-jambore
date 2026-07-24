import { blokPerkemahan } from "../data/blokPerkemahan";

export function generateKapling(dataPendaftaran) {

  // Ambil hanya Gudep yang sudah terverifikasi
  const gudepValid = dataPendaftaran.filter(
    item => item.status === "Terverifikasi"
  );

  return gudepValid.map((gudep, index) => {

    // ===== PUTRA =====
    const kelurahanPutra =
      blokPerkemahan.putra.kelurahan[
        Math.floor(index / 15)
      ];

    const kaplingPutra =
      String((index % 15) + 1).padStart(2, "0");

    // ===== PUTRI =====
    const kelurahanPutri =
      blokPerkemahan.putri.kelurahan[
        Math.floor(index / 15)
      ];

    const kaplingPutri =
      String((index % 15) + 1).padStart(2, "0");

    return {

      ...gudep,

      blokPutra: {

        kecamatan:
          blokPerkemahan.putra.kecamatan,

        kelurahan:
          kelurahanPutra,

        kapling:
          kaplingPutra,

      },

      blokPutri: {

        kecamatan:
          blokPerkemahan.putri.kecamatan,

        kelurahan:
          kelurahanPutri,

        kapling:
          kaplingPutri,

      },

    };

  });

}