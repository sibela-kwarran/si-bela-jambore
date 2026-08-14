import supabase from "../lib/supabase.js";

console.log("SERVICE PENDAFTARAN AKTIF");


// ======================================================
// SIMPAN PENDAFTARAN
// ======================================================
export async function savePendaftaran(data) {

  console.log("INSERT DATA PENDAFTARAN:", data);

  const { data: hasil, error } = await supabase
    .from("pendaftaran")
    .insert(data)
    .select()
    .single();

  if (error) {

    console.error(
      "ERROR SAVE PENDAFTARAN:",
      error
    );

    throw error;
  }

  return hasil;
}

// ======================================================
// KIRIM ULANG PENDAFTARAN
// Digunakan jika status sebelumnya "Perlu Perbaikan"
// ======================================================
export async function kirimUlangPendaftaran(
  id,
  data
) {

  console.log(
    "UPDATE KIRIM ULANG PENDAFTARAN:",
    id,
    data
  );

  const {
    data: hasil,
    error
  } = await supabase
    .from("pendaftaran")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) {

    console.error(
      "ERROR KIRIM ULANG PENDAFTARAN:",
      error
    );

    throw error;
  }

  return hasil;
}







// ======================================================
// PENDAFTARAN BERDASARKAN GUDEP
// ======================================================
export async function getPendaftaranByGudep(gudepId) {

  const { data, error } = await supabase
    .from("pendaftaran")
    .select("*")
    .eq("gudep_id", gudepId)
    .order("id", {
      ascending: false
    })
    .limit(1);

  if (error) {

    console.error(
      "ERROR GET PENDAFTARAN BY GUDEP:",
      error
    );

    throw error;
  }

  return data?.length > 0
    ? data[0]
    : null;
}


// ======================================================
// TANDAI PENDAFTARAN SEBAGAI PERLU PERBAIKAN
// Digunakan ketika operator ingin mengedit data
// setelah pendaftaran pernah dikirim.
// ======================================================
export async function tandaiPerluPerbaikan(gudepId) {

  console.log(
    "MENANDAI PENDAFTARAN PERLU PERBAIKAN:",
    gudepId
  );

  const { data, error } = await supabase
    .from("pendaftaran")
    .update({
      status: "Perlu Perbaikan",
    })
    .eq("gudep_id", gudepId)
    .select()
    .maybeSingle();

  if (error) {

    console.error(
      "ERROR TANDAI PERLU PERBAIKAN:",
      error
    );

    throw error;
  }

  return data;
}














// ======================================================
// SEMUA PENDAFTARAN UNTUK ADMIN
// ======================================================
export async function getSemuaPendaftaran() {

  try {

    // ==================================================
    // 1. AMBIL SEMUA PENDAFTARAN
    // ==================================================

    const {
      data: pendaftaran,
      error: errorPendaftaran
    } = await supabase
      .from("pendaftaran")
      .select(`
        id,
        gudep_id,
        nama_gudep,
        jumlah_pembina,
        jumlah_regu,
        jumlah_peserta,
        status,
        tanggal_kirim,
        tanggal_verifikasi,
        catatan_admin
      `)
      .order("id", {
        ascending: false
      });

    if (errorPendaftaran) {

      console.error(
        "ERROR PENDAFTARAN:",
        errorPendaftaran
      );

      throw errorPendaftaran;

    }


    // ==================================================
    // 2. AMBIL DATA PROFIL GUDEP
    // ==================================================

    const gudepIds =
      (pendaftaran || [])
        .map(item => item.gudep_id)
        .filter(Boolean);


    let gudepMap = {};


    if (gudepIds.length > 0) {

      const {
        data: gudep,
        error: errorGudep
      } = await supabase
        .from("profil_gudep")
        .select(`
          id,
          nama_pangkalan,
          nama_mabigus,
          jenjang
        `)
        .in("id", gudepIds);


      if (errorGudep) {

        console.error(
          "ERROR PROFIL GUDEP:",
          errorGudep
        );

        throw errorGudep;

      }


      // Buat map berdasarkan ID Gudep
      (gudep || []).forEach(item => {

        gudepMap[item.id] = item;

      });

    }


    // ==================================================
    // 3. BENTUK DATA UNTUK ADMIN
    // ==================================================

    const hasil = await Promise.all(

      (pendaftaran || []).map(async (item) => {

        const gudepId =
          item.gudep_id;


        // ==============================
        // PEMBINA
        // ==============================

        const {
          data: pembina,
          error: errorPembina
        } = await supabase
          .from("data_pembina")
          .select("id")
          .eq("gudep_id", gudepId);


        if (errorPembina) {

          console.error(
            "ERROR PEMBINA:",
            errorPembina
          );

        }


        // ==============================
        // REGU
        // ==============================

        const {
          data: regu,
          error: errorRegu
        } = await supabase
          .from("data_regu")
          .select("id")
          .eq("gudep_id", gudepId);


        if (errorRegu) {

          console.error(
            "ERROR REGU:",
            errorRegu
          );

        }


        // ==============================
        // PESERTA
        // ==============================

        const {
          data: peserta,
          error: errorPeserta
        } = await supabase
          .from("peserta")
          .select("id")
          .eq("gudep_id", gudepId);


        if (errorPeserta) {

          console.error(
            "ERROR PESERTA:",
            errorPeserta
          );

        }


        const profil =
          gudepMap[gudepId] || {};


        // ==================================================
        // DATA UNTUK ADMIN
        // ==================================================

        return {

          // PENTING:
          // ID INI ADALAH ID PENDAFTARAN
          id:
            item.id,

          // ID PROFIL GUDEP
          gudep_id:
            gudepId,

          profil_gudep: {

            nama_pangkalan:
              profil.nama_pangkalan ||
              item.nama_gudep ||
              "-",

            nama_mabigus:
              profil.nama_mabigus ||
              "-",
            jenjang:
             profil.jenjang ||
             ""
          },

          jumlah_pembina:
            pembina?.length || 0,

          jumlah_regu:
            regu?.length || 0,

          jumlah_peserta:
            peserta?.length || 0,

          // STATUS ASLI DARI PENDAFTARAN
          status:
            item.status ||
            "Menunggu Verifikasi",

          tanggal_kirim:
            item.tanggal_kirim ||
            null,

          tanggal_verifikasi:
            item.tanggal_verifikasi ||
            null,

          catatan_admin:
            item.catatan_admin ||
            ""

        };

      })

    );


    console.log(
      "DATA VERIFIKASI GUDEP:",
      hasil
    );


    return hasil;


  } catch (error) {

    console.error(
      "GET SEMUA PENDAFTARAN ERROR:",
      error
    );

    throw error;

  }

}


// ======================================================
// UPDATE STATUS PENDAFTARAN
// ======================================================
export async function updatePendaftaran(
  id,
  data
) {

  const { data: hasil, error } =
    await supabase
      .from("pendaftaran")
      .update(data)
      .eq("id", id)
      .select();

  if (error) {

    console.error(
      "UPDATE PENDAFTARAN ERROR:",
      error
    );

    throw error;
  }

  return hasil;
}


// ======================================================
// AMBIL PENDAFTARAN BERDASARKAN ID
//
// Fungsi lama tetap dipertahankan karena masih
// digunakan oleh beberapa bagian aplikasi.
// ======================================================
export async function getPendaftaranById(id) {

  console.log("GET PENDAFTARAN BY ID:", id);

  if (!id) {
    throw new Error("ID pendaftaran tidak ditemukan.");
  }

  const { data, error } = await supabase
    .from("pendaftaran")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  console.log("HASIL PENDAFTARAN:", data);
  console.log("ERROR PENDAFTARAN:", error);

  if (error) {
    console.error(
      "GET PENDAFTARAN BY ID ERROR:",
      error
    );

    throw error;
  }

  if (!data) {
    throw new Error(
      `Data pendaftaran dengan ID ${id} tidak ditemukan di tabel pendaftaran.`
    );
  }

  return data;
}

  