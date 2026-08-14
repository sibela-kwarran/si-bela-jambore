import supabase from "../lib/supabase";

export async function getLaporanAdmin() {
  try {
    // ======================================================
    // AMBIL DATA GUDEP
    // ======================================================

    const {
      data: gudep,
      error: gudepError,
    } = await supabase
      .from("profil_gudep")
      .select(`
        id,
        nama_pangkalan
      `);

    if (gudepError) throw gudepError;

    // ======================================================
    // PROSES SETIAP GUDEP
    // ======================================================

    const laporan = await Promise.all(
      gudep.map(async (item) => {

        // ==================================================
        // PEMBINA
        // ==================================================

        const {
          data: pembina,
          error: pembinaError,
        } = await supabase
          .from("data_pembina")
          .select("jk")
          .eq("gudep_id", item.id);

        if (pembinaError) throw pembinaError;

        const pembinaPutra =
          pembina?.filter(
            (x) =>
              String(x.jk || "")
                .trim()
                .toLowerCase() === "putra"
          ).length || 0;

        const pembinaPutri =
          pembina?.filter(
            (x) =>
              String(x.jk || "")
                .trim()
                .toLowerCase() === "putri"
          ).length || 0;


        // ==================================================
        // PESERTA
        // ==================================================

        const {
          data: peserta,
          error: pesertaError,
        } = await supabase
          .from("peserta")
          .select("jk")
          .eq("gudep_id", item.id);

        if (pesertaError) throw pesertaError;

        const pesertaPutra =
          peserta?.filter(
            (x) =>
              String(x.jk || "")
                .trim()
                .toLowerCase() === "putra"
          ).length || 0;

        const pesertaPutri =
          peserta?.filter(
            (x) =>
              String(x.jk || "")
                .trim()
                .toLowerCase() === "putri"
          ).length || 0;


        // ==================================================
        // REGU
        // ==================================================

        const {
          data: regu,
          error: reguError,
        } = await supabase
          .from("data_regu")
          .select("jenis")
          .eq("gudep_id", item.id);

        if (reguError) throw reguError;


        // ==================================================
        // JUMLAH REGU PUTRA
        // ==================================================

        const jumlahReguPutra =
          regu?.filter(
            (x) =>
              String(x.jenis || "")
                .trim()
                .toLowerCase() === "putra"
          ).length || 0;


        // ==================================================
        // JUMLAH REGU PUTRI
        // ==================================================

        const jumlahReguPutri =
          regu?.filter(
            (x) =>
              String(x.jenis || "")
                .trim()
                .toLowerCase() === "putri"
          ).length || 0;


        // ==================================================
        // TOTAL REGU
        // ==================================================

        const jumlahRegu =
          jumlahReguPutra + jumlahReguPutri;


        // ==================================================
        // HASIL
        // ==================================================

        return {
          id: item.id,

          nama_gudep: item.nama_pangkalan,

          pembinaPutra,
          pembinaPutri,

          pesertaPutra,
          pesertaPutri,

          jumlahReguPutra,
          jumlahReguPutri,

          jumlahRegu,
        };
      })
    );

    return laporan;

  } catch (error) {

    console.error(
      "LAPORAN ERROR:",
      error
    );

    throw error;
  }
}