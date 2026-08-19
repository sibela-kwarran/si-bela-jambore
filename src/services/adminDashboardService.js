import supabase from "../lib/supabase";


// ======================================================
// DASHBOARD ADMIN
//
// ATURAN UTAMA:
// Hanya Gudep yang SUDAH MENGIRIM PENDAFTARAN
// yang dihitung sebagai Gudep resmi.
//
// Jadi:
// profil_gudep saja       → TIDAK dihitung
// pembayaran saja         → TIDAK dihitung
// peserta saja            → TIDAK dihitung
// pendaftaran             → DIHITUNG
// ======================================================

export async function getAdminDashboard() {

  try {

    // ==================================================
    // 1. AMBIL GUDEP YANG SUDAH KIRIM PENDAFTARAN
    // ==================================================

    const {
      data: pendaftaran,
      error: pendaftaranError
    } = await supabase
      .from("pendaftaran")
      .select(`
        id,
        gudep_id,
        status,
        tanggal_kirim
      `)
      .not("gudep_id", "is", null)
      .order("id", {
        ascending: false
      });


    if (pendaftaranError) {

      throw pendaftaranError;

    }


    // ==================================================
    // JIKA BELUM ADA PENDAFTARAN
    // ==================================================

    if (
      !pendaftaran ||
      pendaftaran.length === 0
    ) {

      console.log(
        "DASHBOARD: BELUM ADA PENDAFTARAN"
      );

      return {

        gudep: 0,

        peserta: 0,

        pembina: 0,

        regu: 0,

        pembayaran: 0,

        kapling: 0,

        verifikasi: 0,

        menunggu: 0,

      };

    }


    // ==================================================
    // 2. HINDARI GUDEP GANDA
    // ==================================================
    //
    // Satu gudep hanya dihitung satu kali.
    //
    // Karena data diurutkan id DESC,
    // pendaftaran terbaru yang dipakai.
    //

    const pendaftaranMap =
      new Map();


    pendaftaran.forEach(
      (item) => {

        if (
          item.gudep_id &&
          !pendaftaranMap.has(
            item.gudep_id
          )
        ) {

          pendaftaranMap.set(
            item.gudep_id,
            item
          );

        }

      }
    );


    const pendaftaranResmi =
      Array.from(
        pendaftaranMap.values()
      );


    const gudepIds =
      pendaftaranResmi.map(
        item => item.gudep_id
      );


    console.log(
      "GUDEP RESMI DASHBOARD:",
      gudepIds
    );


    // ==================================================
    // 3. HITUNG TOTAL PESERTA
    // ==================================================
    //
    // Hanya peserta yang gudep_id-nya termasuk
    // Gudep yang sudah kirim pendaftaran.
    //
// ==================================================
// 3. HITUNG TOTAL PESERTA
// ==================================================
// Supabase membatasi hasil query.
// Gunakan pagination supaya tidak berhenti di 1000.

let jumlahPeserta = 0;

if (gudepIds.length > 0) {

  const ukuranBatch = 1000;

  let mulai = 0;

  while (true) {

    const {
      data: pesertaData,
      error: pesertaError
    } = await supabase
      .from("peserta")
      .select("id")
      .in("gudep_id", gudepIds)
      .range(
        mulai,
        mulai + ukuranBatch - 1
      );

    if (pesertaError) {
      throw pesertaError;
    }

    if (!pesertaData || pesertaData.length === 0) {
      break;
    }

    jumlahPeserta += pesertaData.length;

    console.log(
      `PESERTA DASHBOARD BATCH ${mulai}-${mulai + pesertaData.length - 1}:`,
      pesertaData.length
    );

    if (pesertaData.length < ukuranBatch) {
      break;
    }

    mulai += ukuranBatch;

  }

  console.log(
    "TOTAL PESERTA DASHBOARD:",
    jumlahPeserta
  );

}


    // ==================================================
    // 4. HITUNG PEMBINA
    // ==================================================

    let jumlahPembina = 0;


    if (
      gudepIds.length > 0
    ) {

      const {
        count,
        error: pembinaError
      } = await supabase
        .from("data_pembina")
        .select(
          "id",
          {
            count: "exact",
            head: true
          }
        )
        .in(
          "gudep_id",
          gudepIds
        );


      if (pembinaError) {

        throw pembinaError;

      }


      jumlahPembina =
        count || 0;

    }


    // ==================================================
    // 5. HITUNG REGU
    // ==================================================

    let jumlahRegu = 0;


    if (
      gudepIds.length > 0
    ) {

      const {
        count,
        error: reguError
      } = await supabase
        .from("data_regu")
        .select(
          "id",
          {
            count: "exact",
            head: true
          }
        )
        .in(
          "gudep_id",
          gudepIds
        );


      if (reguError) {

        throw reguError;

      }


      jumlahRegu =
        count || 0;

    }


    // ==================================================
    // 6. PEMBAYARAN LUNAS
    // ==================================================
    //
    // Pembayaran hanya dihitung untuk Gudep resmi.
    //

    let jumlahPembayaran = 0;


    if (
      gudepIds.length > 0
    ) {

      const {
        count,
        error: pembayaranError
      } = await supabase
        .from("pembayaran")
        .select(
          "id",
          {
            count: "exact",
            head: true
          }
        )
        .in(
          "gudep_id",
          gudepIds
        )
        .eq(
          "status",
          "Lunas"
        );


      if (pembayaranError) {

        throw pembayaranError;

      }


      jumlahPembayaran =
        count || 0;

    }


    // ==================================================
    // 7. KAPLING
    // ==================================================
    //
    // Hanya penempatan blok dari Gudep resmi.
    //

    let jumlahKapling = 0;


    if (
      gudepIds.length > 0
    ) {

      const {
        count,
        error: kaplingError
      } = await supabase
        .from("penempatan_blok")
        .select(
          "id",
          {
            count: "exact",
            head: true
          }
        )
        .in(
          "gudep_id",
          gudepIds
        );


      if (kaplingError) {

        throw kaplingError;

      }


      jumlahKapling =
        count || 0;

    }


    // ==================================================
    // 8. VERIFIKASI
    // ==================================================

    const jumlahVerifikasi =
      pendaftaranResmi.filter(
        item =>
          String(
            item.status || ""
          )
            .trim()
            .toLowerCase() ===
          "terverifikasi"
      ).length;


    // ==================================================
    // 9. MENUNGGU VERIFIKASI
    // ==================================================
    //
    // Sistem menggunakan:
    // "Menunggu Verifikasi"
    //
    // Kita juga toleransi "Menunggu"
    // jika masih ada data lama.
    //

    const jumlahMenunggu =
      pendaftaranResmi.filter(
        item => {

          const status =
            String(
              item.status || ""
            )
              .trim()
              .toLowerCase();


          return (
            status ===
              "menunggu verifikasi" ||
            status ===
              "menunggu"
          );

        }
      ).length;


    // ==================================================
    // 10. HASIL DASHBOARD
    // ==================================================

    const hasil = {

      // Jumlah Gudep resmi
      gudep:
        gudepIds.length,

      // Total peserta dari Gudep resmi
      peserta:
        jumlahPeserta,

      // Total pembina dari Gudep resmi
      pembina:
        jumlahPembina,

      // Total regu dari Gudep resmi
      regu:
        jumlahRegu,

      // Total pembayaran lunas
      pembayaran:
        jumlahPembayaran,

      // Total kapling
      kapling:
        jumlahKapling,

      // Sudah diverifikasi
      verifikasi:
        jumlahVerifikasi,

      // Belum diverifikasi
      menunggu:
        jumlahMenunggu,

    };


    // ==================================================
    // DEBUG
    // ==================================================

    console.log(
      "======================================"
    );

    console.log(
      "DASHBOARD ADMIN FINAL:"
    );

    console.log(
      "Gudep:",
      hasil.gudep
    );

    console.log(
      "Peserta:",
      hasil.peserta
    );

    console.log(
      "Pembina:",
      hasil.pembina
    );

    console.log(
      "Regu:",
      hasil.regu
    );

    console.log(
      "Pembayaran Lunas:",
      hasil.pembayaran
    );

    console.log(
      "Kapling:",
      hasil.kapling
    );

    console.log(
      "Terverifikasi:",
      hasil.verifikasi
    );

    console.log(
      "Menunggu:",
      hasil.menunggu
    );

    console.log(
      "======================================"
    );


    return hasil;


  } catch (error) {

    console.error(
      "ADMIN DASHBOARD ERROR DETAIL:",
      error
    );


    return {

      gudep: 0,

      peserta: 0,

      pembina: 0,

      regu: 0,

      pembayaran: 0,

      kapling: 0,

      verifikasi: 0,

      menunggu: 0,

    };

  }

}