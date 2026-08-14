import supabase from "../lib/supabase";


export async function getLaporanAdmin() {

  try {

    // =====================================================
    // AMBIL SEMUA GUDEP
    // =====================================================

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
      .order("nama_pangkalan", {
        ascending: true
      });


    if (gudepError) {

      throw gudepError;

    }


    // =====================================================
    // HITUNG DATA MASING-MASING GUDEP
    // =====================================================

    const laporan = await Promise.all(

      (gudep || []).map(
        async (item) => {


          // ===============================================
          // PEMBINA
          // ===============================================

          const {
            data: pembina,
            error: pembinaError
          } = await supabase
            .from("data_pembina")
            .select("jk")
            .eq("gudep_id", item.id);


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
                  .toLowerCase() === "putra"
            ).length;


          const pembinaPutri =
            pembinaData.filter(
              (x) =>
                String(x.jk || "")
                  .trim()
                  .toLowerCase() === "putri"
            ).length;



          // ===============================================
          // PESERTA
          // ===============================================

          const {
            data: peserta,
            error: pesertaError
          } = await supabase
            .from("peserta")
            .select("jk")
            .eq("gudep_id", item.id);


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
                  .toLowerCase() === "putra"
            ).length;


          const pesertaPutri =
            pesertaData.filter(
              (x) =>
                String(x.jk || "")
                  .trim()
                  .toLowerCase() === "putri"
            ).length;



          // ===============================================
          // REGU
          // ===============================================

          const {
            data: regu,
            error: reguError
          } = await supabase
            .from("data_regu")
            .select("jenis")
            .eq("gudep_id", item.id);


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
                  .toLowerCase() === "putra"
            ).length;


          const reguPutri =
            reguData.filter(
              (x) =>
                String(x.jenis || "")
                  .trim()
                  .toLowerCase() === "putri"
            ).length;



          // ===============================================
          // RETURN
          // ===============================================

          return {

            id: item.id,

            nama_gudep:
              item.nama_pangkalan,

            gudep_putra:
              item.gudep_putra,

            gudep_putri:
              item.gudep_putri,

            jenjang:
              item.jenjang,

            pembinaPutra,

            pembinaPutri,

            pesertaPutra,

            pesertaPutri,

            reguPutra,

            reguPutri,

            jumlahRegu:
              reguPutra +
              reguPutri,

          };

        }
      )

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