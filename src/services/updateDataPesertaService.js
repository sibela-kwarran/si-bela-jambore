import supabase from "../lib/supabase";


// ========================================
// KLASIFIKASI STATUS SEKOLAH
// BERDASARKAN NAMA PANGKALAN
// ========================================

function klasifikasiSekolah(namaPangkalan, jenjang) {

  const nama = (namaPangkalan || "")
    .trim()
    .toUpperCase();


  // ========================================
  // SD
  // ========================================

  if (jenjang === "SD") {

    // SD NEGERI
    if (
      nama.startsWith("SDN ") ||
      nama.startsWith("SDN")
    ) {

      return "SD Negeri";

    }


    // SD SWASTA
    return "SD Swasta";

  }


  // ========================================
  // SMP
  // ========================================

  if (jenjang === "SMP") {

    // SMP NEGERI
    if (
      nama.startsWith("SMPN ") ||
      nama.startsWith("SMPN") ||
      nama.startsWith("SMP NEGERI ")
    ) {

      return "SMP Negeri";

    }


    // SMP SWASTA / MTs
    return "SMP Swasta / MTs";

  }


  return "Lainnya";

}



// ========================================
// AMBIL DATA UPDATE PESERTA
// ========================================

export async function getUpdateDataPeserta() {

  // ========================================
  // AMBIL GUDEP
  // ========================================

  const {
    data: gudep,
    error: errorGudep,
  } = await supabase
    .from("profil_gudep")
    .select(`
      id,
      nama_pangkalan,
      jenjang
    `)
    .order("nama_pangkalan");


  if (errorGudep) {
    throw errorGudep;
  }


  // ========================================
  // AMBIL PESERTA
  // ========================================

  const {
    data: peserta,
    error: errorPeserta,
  } = await supabase
    .from("peserta")
    .select(`
      id,
      jk,
      gudep_id
    `);


  if (errorPeserta) {
    throw errorPeserta;
  }


  // ========================================
  // AMBIL REGU
  // ========================================

  const {
    data: regu,
    error: errorRegu,
  } = await supabase
    .from("data_regu")
    .select(`
      id,
      jenis,
      jumlah,
      gudep_id
    `);


  if (errorRegu) {
    throw errorRegu;
  }


  // ========================================
  // KELOMPOK LAPORAN
  // ========================================

  const kelompok = {

    "SD Negeri": {
      jenjang: "SD",
      status: "Negeri",
      gudep: 0,
      putra: 0,
      putri: 0,
      reguPutra: 0,
      reguPutri: 0,
    },

    "SD Swasta": {
      jenjang: "SD",
      status: "Swasta",
      gudep: 0,
      putra: 0,
      putri: 0,
      reguPutra: 0,
      reguPutri: 0,
    },

    "SMP Negeri": {
      jenjang: "SMP",
      status: "Negeri",
      gudep: 0,
      putra: 0,
      putri: 0,
      reguPutra: 0,
      reguPutri: 0,
    },

    "SMP Swasta / MTs": {
      jenjang: "SMP",
      status: "Swasta / MTs",
      gudep: 0,
      putra: 0,
      putri: 0,
      reguPutra: 0,
      reguPutri: 0,
    },

  };


  // ========================================
  // PEMETAAN GUDEP
  // ========================================

  const kelompokGudep = {};


  gudep.forEach((item) => {

    const kelompokNama =
      klasifikasiSekolah(
        item.nama_pangkalan,
        item.jenjang
      );


    if (!kelompok[kelompokNama]) {
      return;
    }


    kelompok[kelompokNama].gudep += 1;

    kelompokGudep[item.id] =
      kelompokNama;

  });


  // ========================================
  // HITUNG PESERTA
  // ========================================

  peserta.forEach((item) => {

    const kelompokNama =
      kelompokGudep[item.gudep_id];


    if (!kelompokNama) {
      return;
    }


    const jk =
      (item.jk || "")
        .trim()
        .toUpperCase();


    if (jk === "PUTRA") {

      kelompok[kelompokNama].putra += 1;

    }


    if (jk === "PUTRI") {

      kelompok[kelompokNama].putri += 1;

    }

  });


  // ========================================
  // HITUNG REGU
  // ========================================

  regu.forEach((item) => {

    const kelompokNama =
      kelompokGudep[item.gudep_id];


    if (!kelompokNama) {
      return;
    }


    const jenis =
      (item.jenis || "")
        .trim()
        .toUpperCase();


    const jumlah =
      Number(item.jumlah) || 0;


    if (jenis === "PUTRA") {

      kelompok[kelompokNama].reguPutra += jumlah;

    }


    if (jenis === "PUTRI") {

      kelompok[kelompokNama].reguPutri += jumlah;

    }

  });


  // ========================================
  // TOTAL
  // ========================================

  const total = {

    gudep: 0,
    putra: 0,
    putri: 0,
    reguPutra: 0,
    reguPutri: 0,

  };


  Object.values(kelompok).forEach((item) => {

    total.gudep += item.gudep;

    total.putra += item.putra;

    total.putri += item.putri;

    total.reguPutra += item.reguPutra;

    total.reguPutri += item.reguPutri;

  });


  return {

    kelompok,

    total,

    diperbarui: new Date(),

  };

}