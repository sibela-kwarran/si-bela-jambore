import supabase from "../lib/supabase";


// =====================================================
// AMBIL SEMUA DATA DARI SUPABASE
// Supabase biasanya membatasi hasil query sampai 1000 baris.
// Fungsi ini mengambil data bertahap sampai semuanya selesai.
// =====================================================

async function ambilSemuaData(table, columns) {

  const semuaData = [];

  const ukuranBatch = 1000;

  let mulai = 0;

  while (true) {

    const {
      data,
      error,
    } = await supabase
      .from(table)
      .select(columns)
      .range(
        mulai,
        mulai + ukuranBatch - 1
      );

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      break;
    }

    semuaData.push(...data);

    // Jika kurang dari 1000,
    // berarti sudah sampai data terakhir.
    if (data.length < ukuranBatch) {
      break;
    }

    mulai += ukuranBatch;

  }

  console.log(
    `DATA ${table.toUpperCase()} TERAMBIL:`,
    semuaData.length
  );

  return semuaData;

}


// =====================================================
// MENENTUKAN KATEGORI SEKOLAH
// =====================================================

function klasifikasiSekolah(
  namaPangkalan,
  jenjang
) {

  const nama =
    (namaPangkalan || "")
      .toUpperCase()
      .trim();

  const tingkat =
    (jenjang || "")
      .toUpperCase()
      .trim();


  // ==========================================
  // MTS
  // ==========================================

  if (nama.startsWith("MTS")) {

    return {
      jenjang: "SMP",
      status: "Swasta",
    };

  }


  // ==========================================
  // SD
  // ==========================================

  if (tingkat === "SD") {

    if (
      nama.startsWith("SDN ") ||
      nama.startsWith("SD NEGERI") ||
      nama.startsWith("SDN")
    ) {

      return {
        jenjang: "SD",
        status: "Negeri",
      };

    }

    return {
      jenjang: "SD",
      status: "Swasta",
    };

  }


  // ==========================================
  // SMP
  // ==========================================

  if (tingkat === "SMP") {

    if (
      nama.startsWith("SMPN ") ||
      nama.startsWith("SMP NEGERI") ||
      nama.startsWith("SMPN")
    ) {

      return {
        jenjang: "SMP",
        status: "Negeri",
      };

    }

    return {
      jenjang: "SMP",
      status: "Swasta",
    };

  }


  return {
    jenjang: tingkat || "LAINNYA",
    status: "Swasta",
  };

}


// =====================================================
// AMBIL SELURUH DATA LAPORAN FINAL
// =====================================================

export async function getLaporanRekapFinal() {

  // ==========================================
  // PROFIL GUDEP
  // ==========================================

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
    .order("id", {
      ascending: true,
    });


  if (errorGudep) {
    throw errorGudep;
  }


  // ==========================================
  // PESERTA
  // ==========================================
  // PENTING:
  // Jangan menggunakan select biasa saja karena
  // data peserta sudah lebih dari 1000.
  //
  // Gunakan pagination.
  // ==========================================

  const peserta =
    await ambilSemuaData(
      "peserta",
      `
        id,
        jk,
        gudep_id
      `
    );


  // ==========================================
  // REGU
  // ==========================================

  const regu =
    await ambilSemuaData(
      "data_regu",
      `
        id,
        jenis,
        jumlah,
        gudep_id
      `
    );


  // =====================================================
  // STRUKTUR HASIL
  // =====================================================

  const hasil = {

    gudep: {

      SD: {
        Negeri: 0,
        Swasta: 0,
      },

      SMP: {
        Negeri: 0,
        Swasta: 0,
      },

    },


    peserta: {

      SD: {

        Negeri: {
          putra: 0,
          putri: 0,
        },

        Swasta: {
          putra: 0,
          putri: 0,
        },

      },

      SMP: {

        Negeri: {
          putra: 0,
          putri: 0,
        },

        Swasta: {
          putra: 0,
          putri: 0,
        },

      },

    },


    regu: {

      SD: {

        Negeri: {
          putra: 0,
          putri: 0,
        },

        Swasta: {
          putra: 0,
          putri: 0,
        },

      },

      SMP: {

        Negeri: {
          putra: 0,
          putri: 0,
        },

        Swasta: {
          putra: 0,
          putri: 0,
        },

      },

    },


    daftarGudep: [],

  };


  // =====================================================
  // MAP GUDEP
  // =====================================================

  const mapGudep = new Map();


  for (const item of gudep || []) {

    const kategori =
      klasifikasiSekolah(
        item.nama_pangkalan,
        item.jenjang
      );


    mapGudep.set(
      Number(item.id),
      kategori
    );


    // ==========================================
    // HANYA SD / SMP
    // ==========================================

    if (
      (
        kategori.jenjang === "SD" ||
        kategori.jenjang === "SMP"
      ) &&
      (
        kategori.status === "Negeri" ||
        kategori.status === "Swasta"
      )
    ) {

      hasil.gudep
        [kategori.jenjang]
        [kategori.status] += 1;


      hasil.daftarGudep.push({

        id: item.id,

        nama_pangkalan:
          item.nama_pangkalan,

        jenjang:
          kategori.jenjang,

        status:
          kategori.status,

      });

    }

  }


  // =====================================================
  // HITUNG PESERTA
  // =====================================================

  for (const item of peserta || []) {

    const kategori =
      mapGudep.get(
        Number(item.gudep_id)
      );


    if (!kategori) {
      continue;
    }


    if (
      !hasil.peserta[kategori.jenjang] ||
      !hasil.peserta[kategori.jenjang]
        [kategori.status]
    ) {
      continue;
    }


    const jk =
      (item.jk || "")
        .toString()
        .toLowerCase()
        .trim();


    // ==========================================
    // PUTRA
    // ==========================================

    if (
      jk === "putra" ||
      jk === "l" ||
      jk === "laki-laki" ||
      jk === "laki laki"
    ) {

      hasil.peserta
        [kategori.jenjang]
        [kategori.status]
        .putra += 1;

    }


    // ==========================================
    // PUTRI
    // ==========================================

    if (
      jk === "putri" ||
      jk === "p" ||
      jk === "perempuan"
    ) {

      hasil.peserta
        [kategori.jenjang]
        [kategori.status]
        .putri += 1;

    }

  }


  // =====================================================
// HITUNG JUMLAH REGU
// =====================================================
//
// ATURAN:
// 1 BARIS data_regu = 1 REGU
//
// Kolom "jumlah" TIDAK dijumlahkan di sini,
// karena "jumlah" adalah jumlah anggota dalam regu.
//
// Contoh:
//
// id | gudep_id | jenis  | jumlah
// 25 | 18       | Putra  | 17
// 26 | 18       | Putri  | 15
//
// Artinya:
// Gudep 18 = 1 Regu Putra + 1 Regu Putri
// =====================================================

for (const item of regu || []) {

  // -----------------------------------------------
  // Cari kategori Gudep
  // -----------------------------------------------

  const kategori =
    mapGudep.get(
      Number(item.gudep_id)
    );


  // -----------------------------------------------
  // Abaikan regu yang tidak punya Gudep valid
  // -----------------------------------------------

  if (!kategori) {
    continue;
  }


  // -----------------------------------------------
  // Pastikan kategori tersedia
  // -----------------------------------------------

  if (
    !hasil.regu[kategori.jenjang] ||
    !hasil.regu[kategori.jenjang]
      [kategori.status]
  ) {
    continue;
  }


  // -----------------------------------------------
  // Jenis regu
  // -----------------------------------------------

  const jenis =
    (item.jenis || "")
      .toString()
      .toLowerCase()
      .trim();


  // -----------------------------------------------
  // 1 BARIS = 1 REGU PUTRA
  // -----------------------------------------------

  if (jenis === "putra") {

    hasil.regu
      [kategori.jenjang]
      [kategori.status]
      .putra += 1;

  }


  // -----------------------------------------------
  // 1 BARIS = 1 REGU PUTRI
  // -----------------------------------------------

  if (jenis === "putri") {

    hasil.regu
      [kategori.jenjang]
      [kategori.status]
      .putri += 1;

  }

}


  // =====================================================
  // DEBUG FINAL
  // =====================================================

  let totalPutra = 0;
  let totalPutri = 0;


  for (const jenjang of ["SD", "SMP"]) {

    for (const status of ["Negeri", "Swasta"]) {

      totalPutra +=
        hasil.peserta[jenjang][status].putra;

      totalPutri +=
        hasil.peserta[jenjang][status].putri;

    }

  }


  console.log(
    "======================================"
  );

  console.log(
    "LAPORAN REKAP FINAL"
  );

  console.log(
    "Total Gudep:",
    hasil.daftarGudep.length
  );

  console.log(
    "Total Putra:",
    totalPutra
  );

  console.log(
    "Total Putri:",
    totalPutri
  );

  console.log(
    "TOTAL PESERTA:",
    totalPutra + totalPutri
  );

  console.log(
    "======================================"
  );


  return hasil;

}