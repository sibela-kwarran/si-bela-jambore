import supabase from "../lib/supabase";

const TABLE = "pengaturan_pendaftaran";


// ========================================
// AMBIL PENGATURAN PENDAFTARAN
// ========================================
export async function getPengaturanPendaftaran() {

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "GAGAL MENGAMBIL PENGATURAN PENDAFTARAN:",
      error
    );

    throw error;
  }

  return data;
}



// ========================================
// CEK STATUS PENDAFTARAN
// ========================================
//
// ATURAN UTAMA:
//
// status = "dibuka"
// → Operator BOLEH masuk
//
// status = "ditutup"
// → Operator TERKUNCI
//
// manual_override hanya sebagai informasi
// dan tidak lagi menentukan akses Operator.
//
// ========================================
export async function cekPendaftaranDibuka() {

  const pengaturan =
    await getPengaturanPendaftaran();


  // ========================================
  // JIKA PENGATURAN BELUM ADA
  // ========================================

  if (!pengaturan) {

    return {
      dibuka: false,
      otomatisDitutup: false,
      pengaturan: null,
    };

  }


  // ========================================
  // PENDAFTARAN DITUTUP
  // ========================================

  if (pengaturan.status === "ditutup") {

    return {
      dibuka: false,
      otomatisDitutup: false,
      pengaturan,
    };

  }


  // ========================================
  // PENDAFTARAN DIBUKA
  // ========================================
  //
  // Kalau Admin sudah membuka kembali,
  // Operator langsung boleh masuk.
  //
  // Tanggal/jam penutupan lama TIDAK
  // digunakan untuk mengunci Operator.
  //
  // ========================================

  if (pengaturan.status === "dibuka") {

    return {
      dibuka: true,
      otomatisDitutup: false,
      manualOverride:
        pengaturan.manual_override === true,
      pengaturan,
    };

  }


  // ========================================
  // STATUS TIDAK DIKENAL
  // DEFAULT AMAN = TUTUP
  // ========================================

  return {
    dibuka: false,
    otomatisDitutup: false,
    pengaturan,
  };

}



// ========================================
// SIMPAN PENGATURAN PENDAFTARAN
// ========================================
export async function updatePengaturanPendaftaran(
  id,
  data
) {

  const status =
    data.status === "dibuka"
      ? "dibuka"
      : "ditutup";


  const { data: hasil, error } =
    await supabase
      .from(TABLE)
      .update({

        status: status,

        tanggal_tutup:
          data.tanggal_tutup || null,

        jam_tutup:
          data.jam_tutup || null,

        pesan_penutupan:
          data.pesan_penutupan || null,

        // Kalau status dibuka,
        // aktifkan override manual.
        //
        // Kalau status ditutup,
        // matikan override manual.
        manual_override:
          status === "dibuka",

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", id)
      .select()
      .single();


  if (error) {

    console.error(
      "GAGAL MENYIMPAN PENGATURAN:",
      error
    );

    throw error;
  }


  return hasil;

}



// ========================================
// BUKA PENDAFTARAN
// ========================================
export async function bukaPendaftaran(id) {

  const { data, error } =
    await supabase
      .from(TABLE)
      .update({

        status: "dibuka",

        manual_override: true,

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", id)
      .select()
      .single();


  if (error) {

    console.error(
      "GAGAL MEMBUKA PENDAFTARAN:",
      error
    );

    throw error;
  }


  return data;

}



// ========================================
// TUTUP PENDAFTARAN
// ========================================
export async function tutupPendaftaran(id) {

  const { data, error } =
    await supabase
      .from(TABLE)
      .update({

        status: "ditutup",

        manual_override: false,

        updated_at:
          new Date().toISOString(),

      })
      .eq("id", id)
      .select()
      .single();


  if (error) {

    console.error(
      "GAGAL MENUTUP PENDAFTARAN:",
      error
    );

    throw error;
  }


  return data;

}