import supabase from "../lib/supabase";


// ======================================================
// LAPORAN ADMIN
//
// ATURAN:
// - Hanya Gudep yang SUDAH KIRIM PENDAFTARAN yang masuk
// - Data operator saja TIDAK masuk laporan
// - Data pembayaran saja TIDAK masuk laporan
// - Jenjang tetap mengambil dari profil_gudep
// - Data pembina, regu, peserta berdasarkan gudep_id
// ======================================================

export async function getLaporanAdmin() {

  try {

    // ==================================================
    // 1. AMBIL PENDAFTARAN YANG SUDAH DIKIRIM
    // ==================================================
    //
    // Tabel pendaftaran menjadi sumber utama.
    // Jika gudep belum punya pendaftaran,
    // maka gudep tersebut TIDAK masuk laporan.
    //

    const {
      data: pendaftaran,
      error: pendaftaranError
    } = await supabase
      .from("pendaftaran")
      .select(`
        id,
        gudep_id,
        nama_gudep,
        status,
        tanggal_kirim
      `)
      .not("gudep_id", "is", null)
      .order("id", {
        ascending: false
      });


    if (pendaftaranError) {

      console.error(
        "ERROR PENDAFTARAN LAPORAN:",
        pendaftaranError
      );

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
        "BELUM ADA GUDEP YANG MENGIRIM PENDAFTARAN."
      );

      return [];

    }


    // ==================================================
    // 2. HINDARI DUPLIKAT PENDAFTARAN
    // ==================================================
    //
    // Satu Gudep hanya boleh dihitung satu kali.
    //
    // Karena kita mengambil order id DESC,
    // maka data pendaftaran terbaru yang dipakai.
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


    // ==================================================
    // DAFTAR GUDEP RESMI
    // ==================================================

    const gudepIds =
      Array.from(
        pendaftaranMap.keys()
      );


    console.log(
      "GUDEP RESMI UNTUK LAPORAN:",
      gudepIds
    );


    // ==================================================
    // 3. AMBIL PROFIL GUDEP
    // ==================================================

    const {
      data: gudep,
      error: gudepError
    } = await supabase
      .from("profil_gudep")
      .select(`
        id,
        nama_pangkalan,
        gudep_putra,
        gudep_putri,
        jenjang
      `)
      .in("id", gudepIds)
      .order("nama_pangkalan", {
        ascending: true
      });


    if (gudepError) {

      console.error(
        "ERROR PROFIL GUDEP LAPORAN:",
        gudepError
      );

      throw gudepError;

    }


    // ==================================================
    // 4. HITUNG DATA MASING-MASING GUDEP
    // ==================================================

    const laporan =
      await Promise.all(

        (gudep || []).map(
          async (item) => {

            // ==========================================
            // PEMBINA
            // ==========================================

            const {
              data: pembina,
              error: pembinaError
            } = await supabase
              .from("data_pembina")
              .select("jk")
              .eq(
                "gudep_id",
                item.id
              );


            if (pembinaError) {

              console.error(
                "ERROR PEMBINA:",
                item.id,
                pembinaError
              );

            }


            const pembinaData =
              pembina || [];


            const pembinaPutra =
              pembinaData.filter(
                (x) =>
                  String(x.jk || "")
                    .trim()
                    .toLowerCase() ===
                  "putra"
              ).length;


            const pembinaPutri =
              pembinaData.filter(
                (x) =>
                  String(x.jk || "")
                    .trim()
                    .toLowerCase() ===
                  "putri"
              ).length;



            // ==========================================
            // PESERTA
            // ==========================================

            const {
              data: peserta,
              error: pesertaError
            } = await supabase
              .from("peserta")
              .select("jk")
              .eq(
                "gudep_id",
                item.id
              );


            if (pesertaError) {

              console.error(
                "ERROR PESERTA:",
                item.id,
                pesertaError
              );

            }


            const pesertaData =
              peserta || [];


            const pesertaPutra =
              pesertaData.filter(
                (x) =>
                  String(x.jk || "")
                    .trim()
                    .toLowerCase() ===
                  "putra"
              ).length;


            const pesertaPutri =
              pesertaData.filter(
                (x) =>
                  String(x.jk || "")
                    .trim()
                    .toLowerCase() ===
                  "putri"
              ).length;



            // ==========================================
            // REGU
            // ==========================================

            const {
              data: regu,
              error: reguError
            } = await supabase
              .from("data_regu")
              .select("jenis")
              .eq(
                "gudep_id",
                item.id
              );


            if (reguError) {

              console.error(
                "ERROR REGU:",
                item.id,
                reguError
              );

            }


            const reguData =
              regu || [];


            const reguPutra =
              reguData.filter(
                (x) =>
                  String(x.jenis || "")
                    .trim()
                    .toLowerCase() ===
                  "putra"
              ).length;


            const reguPutri =
              reguData.filter(
                (x) =>
                  String(x.jenis || "")
                    .trim()
                    .toLowerCase() ===
                  "putri"
              ).length;



            // ==========================================
            // DATA PENDAFTARAN
            // ==========================================

            const dataPendaftaran =
              pendaftaranMap.get(
                item.id
              );


            // ==========================================
            // RETURN DATA
            // ==========================================

            return {

              // ID PROFIL GUDEP
              id:
                item.id,

              // ID PENDAFTARAN
              pendaftaran_id:
                dataPendaftaran?.id ||
                null,

              // NAMA GUDEP
              nama_gudep:
                item.nama_pangkalan ||
                dataPendaftaran?.nama_gudep ||
                "-",

              // NOMOR GUDEP
              gudep_putra:
                item.gudep_putra ||
                null,

              gudep_putri:
                item.gudep_putri ||
                null,

              // JENJANG DITENTUKAN ADMIN
              jenjang:
                item.jenjang ||
                null,

              // STATUS PENDAFTARAN
              status:
                dataPendaftaran?.status ||
                null,

              // TANGGAL KIRIM
              tanggal_kirim:
                dataPendaftaran?.tanggal_kirim ||
                null,

              // PEMBINA
              pembinaPutra,

              pembinaPutri,

              // PESERTA
              pesertaPutra,

              pesertaPutri,

              // REGU
              reguPutra,

              reguPutri,

              jumlahRegu:
                reguPutra +
                reguPutri,

            };

          }
        )

      );


    // ==================================================
    // 5. SORTING NAMA GUDEP
    // ==================================================

    laporan.sort(
      (a, b) =>
        String(
          a.nama_gudep || ""
        ).localeCompare(
          String(
            b.nama_gudep || ""
          ),
          "id"
        )
    );


    // ==================================================
    // DEBUG
    // ==================================================

    console.log(
      "JUMLAH GUDEP RESMI LAPORAN:",
      laporan.length
    );

    console.log(
      "DATA LAPORAN ADMIN:",
      laporan
    );


    // ==================================================
    // SELESAI
    // ==================================================

    return laporan;


  } catch (error) {

    console.error(
      "LAPORAN ERROR:",
      error
    );

    throw error;

  }

}